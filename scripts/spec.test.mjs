// Testes de scripts/spec.mjs. Rode com: node --test scripts/spec.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  LOCALES, buildMaps, check, checkDecision, checkProduct, classifyProductDiff,
  isCode, openChanges, parseFrontmatter, renderMap,
} from './spec.mjs';

const locale = LOCALES['pt-BR'];
const fixture = fileURLToPath(new URL('./spec-fixtures/basic', import.meta.url));
const product = readFileSync(join(fixture, 'spec', 'product.md'), 'utf8');
const decision = readFileSync(join(fixture, 'spec', 'decisions', 'product', 'desfazer.md'), 'utf8');
const opts = { locale, taskPattern: 'TASK-\\d+' };

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
    .replace('- 2026-01-02 TASK-1: decisão criada', '- ontem: criada');
  const errors = checkDecision('d.md', bad, opts);
  assert.ok(errors.includes('d.md: frontmatter sem `tema`'));
  assert.ok(errors.includes('d.md: falta `- Contexto:`'));
  assert.ok(errors.some((e) => e.includes('entrada de histórico fora do padrão')));
});

test('histórico aceita entrada de organização e #N do GitHub', () => {
  const ok = decision.replace('## Histórico\n', '## Histórico\n- 2026-02-02 #42: limite ajustado\n- 2026-02-01 organização: fundida com outra\n');
  assert.deepEqual(checkDecision('d.md', ok, opts), []);
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
  writeFileSync(p, readFileSync(p, 'utf8').replace('## Histórico\n', '## Histórico\n- 2026-01-03 TASK-2: limite de desfazer passa a 5\n'));
}

test('check: ⇢ novo exige decisão alterada no mesmo PR', () => {
  const r = repo();
  try {
    r.edit(OLD, PROPOSED);
    r.commit('proposta sem decisão');
    assert.ok(check(r.dir, { base: 'HEAD~1' }).errors.some((e) => e.includes('sem decisão alterada')));
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
    const errors = check(r.dir, { base: 'proposta', labels: ['spec-only'] }).errors;
    assert.ok(errors.some((e) => e.includes('resolvido sem alteração de código')));

    writeFileSync(join(r.dir, 'app.js'), 'export const undo = 5;\n');
    r.commit('código');
    assert.deepEqual(check(r.dir, { base: 'proposta' }).errors, []);
  } finally {
    r.cleanup();
  }
});

test('check: PR com código não cria ⇢ nem altera decisão, salvo com spec-mismatch', () => {
  const r = repo();
  try {
    r.edit(OLD, PROPOSED);
    touchDecision(r);
    writeFileSync(join(r.dir, 'app.js'), 'export const x = 1;\n');
    r.commit('proposta e código juntos');
    const errors = check(r.dir, { base: 'HEAD~1' }).errors;
    assert.ok(errors.some((e) => e.includes('não pode criar ou alterar ⇢')));
    assert.ok(errors.some((e) => e.includes('não pode alterar decisões')));
    assert.deepEqual(check(r.dir, { base: 'HEAD~1', labels: ['spec-mismatch'] }).errors, []);
  } finally {
    r.cleanup();
  }
});

test('check: acréscimo pequeno com código no mesmo PR passa', () => {
  const r = repo();
  try {
    r.edit('- ✓ Falha nunca trava o produto', '- ✓ Falha nunca trava o produto\n- ✓ Falha é sempre informada');
    writeFileSync(join(r.dir, 'app.js'), 'export const x = 1;\n');
    r.commit('acréscimo com código');
    assert.deepEqual(check(r.dir, { base: 'HEAD~1' }).errors, []);
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

test('check: redação de item ✓ exige código ou label spec-only', () => {
  const r = repo();
  try {
    r.edit('- ✓ Contar itens', '- ✓ Contar os itens');
    r.commit('redação');
    assert.ok(check(r.dir, { base: 'HEAD~1' }).errors.some((e) => e.includes('alterado ou removido sem código')));
    assert.deepEqual(check(r.dir, { base: 'HEAD~1', labels: ['spec-only'] }).errors, []);
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
