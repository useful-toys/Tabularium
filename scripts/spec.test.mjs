// Testes de scripts/spec.mjs. Rode com: node --test scripts/spec.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  LOCALES, buildMaps, changeType, check, checkDecision, checkItems, checkModel, checkProduct, classifyDocDiff,
  classifyPR, classifyProductDiff, definedTerms, isCode, maxType, openChanges, parseFrontmatter, renderMap,
} from './spec.mjs';

const locale = LOCALES['pt-BR'];
const fixture = fileURLToPath(new URL('./spec-fixtures/basic', import.meta.url));
const product = readFileSync(join(fixture, 'spec', 'product.md'), 'utf8');
const model = readFileSync(join(fixture, 'spec', 'model.md'), 'utf8');
const glossary = definedTerms(product, locale.glossarySection);
const decision = readFileSync(join(fixture, 'spec', 'decisions', 'product', 'desfazer.md'), 'utf8');
const opts = { locale };

// ---------- frontmatter e mapa ----------

test('parseFrontmatter lê chaves e corpo', () => {
  const { data, body } = parseFrontmatter(decision);
  assert.equal(data.tema, 'Correção de contagens');
  assert.equal(data['carregar-quando'], 'mudança em desfazer ou confirmação');
  assert.match(body, /^- Decisão:/);
});

test('renderMap gera uma linha por decisão', () => {
  const map = renderMap('product', [{ file: 'a.md', data: { tema: 'T', decisao: 'D', 'carregar-quando': 'C' } }], locale);
  assert.match(map, /^# Decisões: product\n/);
  assert.match(map, /^- a\.md — T: D\. Carregar quando: C$/m);
});

// ---------- decisões ----------

test('decisão válida não tem erros', () => {
  assert.deepEqual(checkDecision('d.md', decision, opts), []);
});

test('decisão sem frontmatter', () => {
  assert.deepEqual(checkDecision('d.md', '- Decisão: x', opts), ['d.md: sem frontmatter']);
});

test('decisão sem campo, sem seção e com histórico fora do padrão', () => {
  const bad = decision
    .replace('tema: Correção de contagens\n', '')
    .replace('- Contexto: contar é o fluxo mais frequente\n', '')
    .replace('- 2026-01-02 #1: decisão criada', '- ontem: criada');
  const errors = checkDecision('d.md', bad, opts);
  assert.ok(errors.includes('d.md: frontmatter sem `tema`'));
  assert.ok(errors.includes('d.md: falta `- Contexto:`'));
  assert.ok(errors.some((e) => e.includes('entrada de histórico fora do padrão')));
});

test('histórico aceita #N do GitHub, organização e plano inicial', () => {
  const ok = decision.replace('## Histórico\n', '## Histórico\n- 2026-02-02 #42: limite ajustado\n- 2026-02-01 organização: fundida com outra\n- 2026-01-01 plano-inicial: decisão criada\n');
  assert.deepEqual(checkDecision('d.md', ok, opts), []);
});

test('histórico recusa ID de task de outro tracker', () => {
  const bad = decision.replace('## Histórico\n', '## Histórico\n- 2026-02-02 PROJ-7: limite ajustado\n');
  assert.ok(checkDecision('d.md', bad, opts).some((e) => e.includes('entrada de histórico fora do padrão')));
});

test('histórico precisa ser a última seção', () => {
  const bad = decision + '\n## Extra\n- x\n';
  assert.ok(checkDecision('d.md', bad, opts).some((e) => e.includes('última seção')));
});

// ---------- product.md ----------

test('product.md do fixture é válido', () => {
  assert.deepEqual(checkProduct(product, locale), { errors: [], warnings: [] });
});

test('product.md rejeita link e referência a decisão', () => {
  const bad = product.replace('- ✓ Vai de 0 a 9', '- ✓ Vai de 0 a 9 [ver](x.md), ver IDR 0021');
  const { errors } = checkProduct(bad, locale);
  assert.ok(errors.some((e) => e.includes('link')));
  assert.ok(errors.some((e) => e.includes('referência a decisão')));
});

test('product.md rejeita ✓ no glossário e ⇢ fora de item ✓', () => {
  const bad = product
    .replace('- **Item**', '- ✓ **Item**')
    .replace('  - Aceita lote de itens', '  - Aceita lote ⇢ Aceita lote grande');
  const { errors } = checkProduct(bad, locale);
  assert.ok(errors.some((e) => e.includes('"Glossário" não levam ✓')));
  assert.ok(errors.some((e) => e.includes('só em item ✓')));
});

test('product.md exige as seções na ordem', () => {
  const bad = product.replace('## Diferenciais', '## Vantagens');
  assert.ok(checkProduct(bad, locale).errors.some((e) => e.includes('seções devem ser')));
});

test('product.md avisa sobre referência temporal, mas não no lado desejado do ⇢', () => {
  const warn = checkProduct(product.replace('Vai de 0 a 9', 'Vai de 0 a 9, antigo limite'), locale);
  assert.equal(warn.warnings.length, 1);
  const ok = checkProduct(product.replace('- ✓ Vai de 0 a 9', '- ✓ Vai de 0 a 9 ⇢ (removido)'), locale);
  assert.deepEqual(ok.warnings, []);
});

test('openChanges lista os ⇢ em aberto', () => {
  const changed = product.replace('- ✓ Vai de 0 a 9', '- ✓ Vai de 0 a 9 ⇢ Vai de 0 a 99');
  assert.equal(openChanges(changed).length, 1);
});

// ---------- diff do product.md ----------

const base = '- ✓ A\n  - ✓ B\n- C\n';

const onlyCode = ({ resolutions, rewrites, marks }) => ({ resolutions, rewrites, marks });
const none = { resolutions: [], rewrites: [], marks: [] };

test('criar, editar e desistir de ⇢ não exige código, mas conta como edição de ⇢', () => {
  const created = '- ✓ A\n  - ✓ B ⇢ B2\n- C\n';
  const edited = '- ✓ A\n  - ✓ B ⇢ B3\n- C\n';
  assert.deepEqual(onlyCode(classifyProductDiff(base, created)), none);
  assert.deepEqual(classifyProductDiff(base, created).changeEdits, ['- ✓ B ⇢ B2']);
  assert.deepEqual(onlyCode(classifyProductDiff(created, edited)), none);
  assert.equal(classifyProductDiff(created, edited).changeEdits.length, 2);
  assert.deepEqual(onlyCode(classifyProductDiff(created, base)), none);
  assert.deepEqual(classifyProductDiff(created, base).changeEdits, ['- ✓ B ⇢ B2']);
});

test('mover linhas ✓ não conta como mudança', () => {
  assert.deepEqual(classifyProductDiff(base, '- C\n- ✓ A\n  - ✓ B\n'), { ...none, changeEdits: [] });
});

test('resolver ⇢ é entrega, não edição de ⇢', () => {
  const r = classifyProductDiff('- ✓ A ⇢ A2\n', '- ✓ A2\n');
  assert.deepEqual(r.resolutions, ['- ✓ A ⇢ A2']);
  assert.deepEqual(r.marks, ['- ✓ A2']);
  assert.deepEqual(r.changeEdits, []);
});

test('reescrever ou remover item ✓ e marcar ✓ são detectados', () => {
  assert.deepEqual(classifyProductDiff(base, '- ✓ A\n  - ✓ B mudado\n- C\n').rewrites, ['- ✓ B']);
  assert.deepEqual(classifyProductDiff(base, '- ✓ A\n- C\n').rewrites, ['- ✓ B']);
  assert.deepEqual(classifyProductDiff(base, '- ✓ A\n  - ✓ B\n- ✓ C\n').marks, ['- ✓ C']);
});

const UNMARKED = ['Glossário'];
const doc = (body) => `## Glossário\n- **Item**: coisa\n\n## Requisitos\n${body}`;

test('classifyDocDiff separa entrega, ✓ novo, compromissos e texto fora dos itens', () => {
  const before = doc('- ✓ A ⇢ A2\n- B\n- C\n');
  const after = doc('- ✓ A2\n- ✓ B\n- ✓ D\n- C mudado\n- E\n');
  const d = classifyDocDiff(before, after, UNMARKED);
  assert.deepEqual(d.delivered, ['- ✓ A2', '- ✓ B']);
  assert.deepEqual(d.newDone, ['- ✓ D']);
  assert.deepEqual(d.addedCommitments, ['- C mudado', '- E']);
  assert.deepEqual(d.removedCommitments, ['- C']);
  assert.deepEqual(d.otherText, []);
  assert.equal(classifyDocDiff(before, before.replace('coisa', 'coisa contada'), UNMARKED).otherText.length, 2);
});

test('maxType escolhe o maior tipo', () => {
  assert.equal(maxType('editorial', 'compatible', 'neutral'), 'compatible');
  assert.equal(maxType('neutral', undefined), 'neutral');
});

test('changeType deduz o tipo mínimo e os pontos ambíguos', () => {
  const d = (before, after) => [{ file: 'product.md', d: classifyDocDiff(doc(before), doc(after), UNMARKED) }];
  const spec = { touchesSpec: true };
  assert.deepEqual(changeType({ docs: [], touchesCode: true, touchesSpec: false }), { min: 'neutral', ambiguous: [] });
  assert.deepEqual(changeType({ docs: d('- ✓ A\n', '- ✓ A ⇢ A2\n'), ...spec }), { min: 'incompatible', ambiguous: [] });
  assert.deepEqual(changeType({ docs: d('- ✓ A\n', '- ✓ A\n- B\n'), ...spec }), { min: 'compatible', ambiguous: [] });
  assert.deepEqual(changeType({ docs: d('- B\n', '- ✓ B\n'), touchesCode: true, ...spec }), { min: 'neutral', ambiguous: [] });
  assert.deepEqual(changeType({ docs: d('- ✓ A\n', '- ✓ A\n- ✓ B\n'), touchesCode: true, ...spec }), { min: 'compatible', ambiguous: [] });
  assert.deepEqual(changeType({ docs: [], ...spec, decisionsAdded: ['x.md'] }), { min: 'compatible', ambiguous: [] });
  const reworded = changeType({ docs: d('- ✓ A\n', '- ✓ A mudado\n'), ...spec });
  assert.equal(reworded.min, 'editorial');
  assert.ok(reworded.ambiguous.some((a) => a.includes('alterado ou removido sem ⇢')));
  assert.ok(changeType({ docs: [], ...spec, decisionsChanged: ['x.md'] }).ambiguous.length);
});

test('changeType: ajustar o lado desejado de ⇢ é compatível; criar ou desfazer é incompatível', () => {
  const d = (before, after) => [{ file: 'product.md', d: classifyDocDiff(doc(before), doc(after), UNMARKED) }];
  const spec = { touchesSpec: true };
  assert.equal(changeType({ docs: d('- ✓ A ⇢ A2\n', '- ✓ A ⇢ A3\n'), ...spec }).min, 'compatible');
  assert.equal(changeType({ docs: d('- ✓ A ⇢ A2\n', '- ✓ A\n'), ...spec }).min, 'incompatible');
  assert.equal(changeType({ docs: d('- ✓ A\n', '- ✓ A ⇢ A2\n'), ...spec }).min, 'incompatible');
  const adj = classifyDocDiff(doc('- ✓ A ⇢ A2\n'), doc('- ✓ A ⇢ A3\n'), UNMARKED);
  assert.deepEqual(adj.changeAdjusts, ['- ✓ A ⇢ A3']);
  assert.deepEqual(adj.redefinitions, []);
});

// ---------- modelo conceitual e documentos técnicos ----------

test('definedTerms lê o glossário e os tipos', () => {
  assert.deepEqual(glossary, ['Item']);
  assert.deepEqual(definedTerms(model, 'Tipos'), ['Contagem']);
});

test('model.md do fixture é válido', () => {
  assert.deepEqual(checkModel(model, glossary, locale), { errors: [], warnings: [] });
});

test('model.md exige Tipos e Entidades, nesta ordem', () => {
  const bad = model.replace('## Tipos', '## Entidades2');
  assert.ok(checkModel(bad, glossary, locale).errors.some((e) => e.includes('seções devem ser')));
});

test('model.md barra nome em destaque fora do glossário e dos tipos', () => {
  const bad = model.replace('  - ✓ quantidade: **Contagem**', '  - ✓ quantidade: **Contagem**\n  - ✓ pertence a 1 **Caixa**');
  const { errors } = checkModel(bad, glossary, locale);
  assert.deepEqual(errors, ['model.md:9: **Caixa** não é termo do glossário nem tipo declarado']);
});

test('model.md avisa sobre termos de implementação', () => {
  const bad = model.replace('  - ✓ quantidade: **Contagem**', '  - ✓ quantidade: **Contagem**\n  - ✓ id da tabela de itens');
  const { warnings } = checkModel(bad, glossary, locale);
  assert.ok(warnings.some((w) => w.includes('("id")')));
  assert.ok(warnings.some((w) => w.includes('("tabela")')));
});

test('model.md segue as regras de marca e de link do product.md', () => {
  const bad = model.replace('- ✓ **Item**', '- **Item** ⇢ outra coisa\n- ver [x](http://x)');
  const { errors } = checkModel(bad, glossary, locale);
  assert.ok(errors.some((e) => e.includes('só em item ✓')));
  assert.ok(errors.some((e) => e.includes('link não é permitido (model.md é autocontido)')));
});

test('documento técnico tem seções livres e as regras comuns', () => {
  const doc = '# Exemplo — Interface\n\n## Telas\n- ✓ Tela única\n- ✓ Botão ⇢ Botão maior\n';
  assert.deepEqual(checkItems(doc, locale, { name: 'interface.md' }).errors, []);
  assert.ok(checkItems(`${doc}- ver decisions/x.md\n`, locale, { name: 'interface.md' }).errors
    .some((e) => e.includes('referência a decisão')));
});

test('isCode respeita nonCodePaths', () => {
  const nonCode = ['spec/', 'README.md', 'scripts/spec'];
  assert.equal(isCode('src/app.js', nonCode), true);
  assert.equal(isCode('spec/product.md', nonCode), false);
  assert.equal(isCode('scripts/spec.mjs', nonCode), false);
  assert.equal(isCode('scripts/build.mjs', nonCode), true);
});

// ---------- check integrado (repositório git temporário) ----------

function repo() {
  const dir = mkdtempSync(join(tmpdir(), 'spec-'));
  cpSync(fixture, dir, { recursive: true });
  const git = (...args) => execFileSync('git', args, { cwd: dir, encoding: 'utf8' });
  git('init', '-q', '-b', 'main');
  git('config', 'core.autocrlf', 'false');
  git('-c', 'user.email=t@t', '-c', 'user.name=t', 'add', '.');
  git('-c', 'user.email=t@t', '-c', 'user.name=t', 'commit', '-q', '-m', 'base');
  const commit = (msg) => {
    git('add', '.');
    git('-c', 'user.email=t@t', '-c', 'user.name=t', 'commit', '-q', '-m', msg);
  };
  const edit = (from, to) => {
    const p = join(dir, 'spec', 'product.md');
    writeFileSync(p, readFileSync(p, 'utf8').replace(from, to));
  };
  return { dir, git, commit, edit, cleanup: () => rmSync(dir, { recursive: true, force: true }) };
}

test('check passa no fixture e acusa mapa desatualizado', () => {
  const r = repo();
  try {
    assert.deepEqual(check(r.dir).errors, []);
    writeFileSync(join(r.dir, 'spec', 'decisions', 'product', 'README.md'), 'x\n');
    assert.ok(check(r.dir).errors.some((e) => e.includes('desatualizado')));
    buildMaps(r.dir);
    assert.deepEqual(check(r.dir).errors, []);
  } finally {
    r.cleanup();
  }
});

const OLD = '- ✓ Desfazer contagens: até as 3 últimas';
const PROPOSED = `${OLD} ⇢ Desfazer contagens: até as 5 últimas`;
const DELIVERED = '- ✓ Desfazer contagens: até as 5 últimas';

function touchDecision(r) {
  const p = join(r.dir, 'spec', 'decisions', 'product', 'desfazer.md');
  writeFileSync(p, readFileSync(p, 'utf8').replace('## Histórico\n', '## Histórico\n- 2026-01-03 #2: limite de desfazer passa a 5\n'));
}

test('check: ⇢ novo exige decisão alterada no mesmo PR', () => {
  const r = repo();
  try {
    r.edit(OLD, PROPOSED);
    r.commit('proposta sem decisão');
    assert.ok(check(r.dir, { base: 'HEAD~1' }).errors.some((e) => e.includes('sem decisão criada ou alterada')));
    touchDecision(r);
    r.commit('decisão');
    assert.deepEqual(check(r.dir, { base: 'HEAD~2' }).errors, []);
  } finally {
    r.cleanup();
  }
});

test('check: entrega de ⇢ sem código falha, com código passa', () => {
  const r = repo();
  try {
    r.edit(OLD, PROPOSED);
    touchDecision(r);
    r.commit('proposta');
    r.git('tag', 'proposta');

    r.edit(PROPOSED, DELIVERED);
    r.commit('entrega sem código');
    const errors = check(r.dir, { base: 'proposta', labels: ['spec-editorial'] }).errors;
    assert.ok(errors.some((e) => e.includes('resolvido sem alteração de código')));

    writeFileSync(join(r.dir, 'app.js'), 'export const undo = 5;\n');
    r.commit('código');
    const res = check(r.dir, { base: 'proposta', requireType: true });
    assert.deepEqual(res.errors, []);
    assert.ok(res.info.includes('Tipo da mudança: spec-neutral (deduzido do diff)'));
  } finally {
    r.cleanup();
  }
});

test('check: PR com código que cria ⇢ é incompatível e passa com decisão alterada', () => {
  const r = repo();
  try {
    r.edit(OLD, PROPOSED);
    touchDecision(r);
    writeFileSync(join(r.dir, 'app.js'), 'export const x = 1;\n');
    r.commit('ajuste de divergência na entrega');
    const res = check(r.dir, { base: 'HEAD~1', requireType: true });
    assert.deepEqual(res.errors, []);
    assert.ok(res.info.includes('Tipo da mudança: spec-incompatible (deduzido do diff)'));
    const low = check(r.dir, { base: 'HEAD~1', labels: ['spec-compatible'] }).errors;
    assert.ok(low.some((e) => e.includes('abaixo do tipo mínimo')));
  } finally {
    r.cleanup();
  }
});

test('check: mudança compatível com código e decisão nova no mesmo PR passa', () => {
  const r = repo();
  try {
    r.edit('- ✓ Falha nunca trava o produto', '- ✓ Falha nunca trava o produto\n- ✓ Falha é sempre informada');
    const src = join(r.dir, 'spec', 'decisions', 'product', 'desfazer.md');
    writeFileSync(join(r.dir, 'spec', 'decisions', 'product', 'falhas.md'), readFileSync(src, 'utf8').replace('Correção de contagens', 'Falhas'));
    buildMaps(r.dir);
    writeFileSync(join(r.dir, 'app.js'), 'export const x = 1;\n');
    r.commit('acréscimo com código');
    const res = check(r.dir, { base: 'HEAD~1', requireType: true });
    assert.deepEqual(res.errors, []);
    assert.ok(res.info.includes('Tipo da mudança: spec-compatible (deduzido do diff)'));
  } finally {
    r.cleanup();
  }
});

test('check: decisão existente alterada em PR de código é ambígua', () => {
  const r = repo();
  try {
    touchDecision(r);
    writeFileSync(join(r.dir, 'app.js'), 'export const x = 1;\n');
    r.commit('código e decisão');
    assert.ok(check(r.dir, { base: 'HEAD~1', requireType: true }).errors.some((e) => e.includes('tipo ambíguo')));
    assert.deepEqual(check(r.dir, { base: 'HEAD~1', labels: ['spec-incompatible'] }).errors, []);
  } finally {
    r.cleanup();
  }
});

test('check: mais de uma label de tipo é erro; incompatível exige decisão', () => {
  const r = repo();
  try {
    r.edit('- ✓ Contar itens', '- ✓ Contar os itens');
    r.commit('redação');
    const two = check(r.dir, { base: 'HEAD~1', labels: ['spec-editorial', 'spec-compatible'] }).errors;
    assert.ok(two.some((e) => e.includes('mais de uma label de tipo')));
    const inc = check(r.dir, { base: 'HEAD~1', labels: ['spec-incompatible'] }).errors;
    assert.ok(inc.some((e) => e.includes('incompatível sem decisão')));
  } finally {
    r.cleanup();
  }
});

test('check: ajustar o lado desejado de ⇢ é compatível e exige decisão', () => {
  const r = repo();
  try {
    r.edit(OLD, PROPOSED);
    touchDecision(r);
    r.commit('proposta');
    r.git('tag', 'proposta');
    r.edit(PROPOSED, `${OLD} ⇢ Desfazer contagens: até as 7 últimas`);
    r.commit('ajuste sem decisão');
    const res = check(r.dir, { base: 'proposta', requireType: true });
    assert.ok(res.errors.some((e) => e.includes('sem decisão criada ou alterada')));
    assert.ok(res.info.includes('Tipo da mudança: spec-compatible (deduzido do diff)'));
  } finally {
    r.cleanup();
  }
});

test('check: outro arquivo da spec alterado não é ambíguo', () => {
  const r = repo();
  try {
    const cfg = join(r.dir, 'spec', 'config.json');
    writeFileSync(cfg, readFileSync(cfg, 'utf8').replace('"README.md",', '"README.md",\n    "docs/",'));
    r.commit('config');
    const res = check(r.dir, { base: 'HEAD~1', requireType: true });
    assert.deepEqual(res.errors, []);
    assert.ok(res.info.includes('Tipo da mudança: spec-editorial (deduzido do diff)'));
  } finally {
    r.cleanup();
  }
});

test('check lista itens comprometidos', () => {
  const r = repo();
  try {
    assert.ok(check(r.dir).info.some((i) => i.includes('Aceita lote de itens')));
  } finally {
    r.cleanup();
  }
});

test('check: redação de item ✓ sem código é ambígua e só passa como spec-editorial', () => {
  const r = repo();
  try {
    r.edit('- ✓ Contar itens', '- ✓ Contar os itens');
    r.commit('redação');
    assert.ok(check(r.dir, { base: 'HEAD~1', requireType: true }).errors.some((e) => e.includes('tipo ambíguo')));
    assert.ok(check(r.dir, { base: 'HEAD~1' }).warnings.some((w) => w.includes('tipo ambíguo')));
    const compat = check(r.dir, { base: 'HEAD~1', labels: ['spec-compatible'] }).errors;
    assert.ok(compat.some((e) => e.includes('só em PR spec-editorial')));
    assert.deepEqual(check(r.dir, { base: 'HEAD~1', labels: ['spec-editorial'] }).errors, []);
  } finally {
    r.cleanup();
  }
});

test('check: PR com código sem alteração na spec é neutro', () => {
  const r = repo();
  try {
    writeFileSync(join(r.dir, 'app.js'), 'export const x = 1;\n');
    r.commit('refatoração');
    const res = check(r.dir, { base: 'HEAD~1', requireType: true });
    assert.deepEqual(res.errors, []);
    assert.ok(res.info.includes('Tipo da mudança: spec-neutral (deduzido do diff)'));
    assert.equal(classifyPR(r.dir, { base: 'HEAD~1' }).min, 'neutral');
  } finally {
    r.cleanup();
  }
});

test('check: regras de PR valem para model.md', () => {
  const r = repo();
  try {
    const p = join(r.dir, 'spec', 'model.md');
    writeFileSync(p, readFileSync(p, 'utf8').replace('- ✓ **Item**', '- ✓ **Item**\n  - ✓ nasce zerado'));
    r.commit('marca sem código');
    const errors = check(r.dir, { base: 'HEAD~1', labels: ['spec-compatible'] }).errors;
    assert.ok(errors.some((e) => e.includes('model.md: - ✓ nasce zerado')));
    assert.deepEqual(check(r.dir, { base: 'HEAD~1', labels: ['spec-editorial'] }).errors, []);
  } finally {
    r.cleanup();
  }
});

test('check: documento técnico de camada é validado e segue as regras de PR', () => {
  const r = repo();
  try {
    const cfg = join(r.dir, 'spec', 'config.json');
    writeFileSync(cfg, readFileSync(cfg, 'utf8').replace('"product"', '"product",\n    "interface"'));
    mkdirSync(join(r.dir, 'spec', 'decisions', 'interface'));
    buildMaps(r.dir);
    writeFileSync(join(r.dir, 'spec', 'interface.md'), '# Exemplo — Interface\n\n## Telas\n- Tela única\n');
    r.commit('camada interface');
    assert.deepEqual(check(r.dir).errors, []);
    assert.ok(check(r.dir).info.some((i) => i.includes('interface.md:4: - Tela única')));
    r.git('tag', 'antes');
    writeFileSync(join(r.dir, 'spec', 'interface.md'), '# Exemplo — Interface\n\n## Telas\n- ✓ Tela única\n');
    r.commit('marca sem código');
    assert.ok(check(r.dir, { base: 'antes', labels: ['spec-compatible'] }).errors.some((e) => e.includes('interface.md: - ✓ Tela única')));
  } finally {
    r.cleanup();
  }
});

test('check avisa quando existe CLAUDE.md', () => {
  const r = repo();
  try {
    writeFileSync(join(r.dir, 'CLAUDE.md'), '# x\n');
    assert.ok(check(r.dir).warnings.some((w) => w.includes('CLAUDE.md')));
  } finally {
    r.cleanup();
  }
});

test('trechos em código não contam como marcador, link ou ⇢', () => {
  const ok = product.replace('- ✓ Vai de 0 a 9', '- ✓ Vai de 0 a 9; marca `- ✓` e `⇢` em `spec/decisions/`');
  assert.deepEqual(checkProduct(ok, locale).errors, []);
  assert.deepEqual(openChanges(ok), []);
  assert.deepEqual(classifyProductDiff('- ✓ A `⇢` B\n', '- ✓ A `⇢` B\n  - novo\n'), { ...none, changeEdits: [] });
});
