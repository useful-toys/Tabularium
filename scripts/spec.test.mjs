// Testes de scripts/spec.mjs. Rode com: node --test scripts/spec.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  LOCALES, buildMaps, check, checkConfig, checkDecision, checkItems, checkModel, checkProduct, definedTerms,
  loadConfig, loadLocale, openChanges, parseFrontmatter, parseLocale, renderMap,
} from './spec.mjs';

const locale = LOCALES['pt-BR'];
const fixture = fileURLToPath(new URL('./spec-fixtures/basic', import.meta.url));
const product = readFileSync(join(fixture, 'spec', 'product.md'), 'utf8');
const model = readFileSync(join(fixture, 'spec', 'model.md'), 'utf8');
const glossary = definedTerms(product, locale.glossarySection);
const decision = readFileSync(join(fixture, 'spec', 'decisions', 'product', 'desfazer.md'), 'utf8');
const opts = { locale };

// ---------- idioma ----------

test('idioma embutido vem de LOCALES', () => {
  assert.equal(loadLocale(fixture, 'spec', 'pt-BR'), locale);
});

test('outro idioma vem de spec/locales/<idioma>.json', () => {
  const dir = mkdtempSync(join(tmpdir(), 'spec-locale-'));
  try {
    mkdirSync(join(dir, 'spec', 'locales'), { recursive: true });
    const en = { ...locale, historyHeading: '## History', mapTitle: '# Decisions: {layer}' };
    writeFileSync(join(dir, 'spec', 'locales', 'en.json'), JSON.stringify(en));
    const loaded = loadLocale(dir, 'spec', 'en');
    assert.equal(loaded.historyHeading, '## History');
    assert.equal(loaded.mapTitle('product'), '# Decisions: product');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('idioma sem arquivo ou com chave faltando é recusado', () => {
  assert.throws(() => loadLocale(fixture, 'spec', 'xx'), /spec\/locales\/xx\.json/);
  assert.throws(() => parseLocale(JSON.stringify({ historyHeading: '## H' }), 'en.json'), /faltam as chaves/);
});

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

test('config.json sem codePaths é recusado', () => {
  const r = repo();
  try {
    const cfg = join(r.dir, 'spec', 'config.json');
    const c = JSON.parse(readFileSync(cfg, 'utf8'));
    delete c.codePaths;
    writeFileSync(cfg, JSON.stringify(c));
    assert.throws(() => check(r.dir), /sem `codePaths`/);
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

// Grava campos em spec/config.json do repositório temporário.
function setConfig(r, patch) {
  const cfg = join(r.dir, 'spec', 'config.json');
  writeFileSync(cfg, JSON.stringify({ ...JSON.parse(readFileSync(cfg, 'utf8')), ...patch }, null, 2));
}

test('check: documento técnico fundamental de camada é validado', () => {
  const r = repo();
  try {
    setConfig(r, { layers: ['product', 'architecture'] });
    mkdirSync(join(r.dir, 'spec', 'decisions', 'architecture'));
    buildMaps(r.dir);
    writeFileSync(join(r.dir, 'spec', 'architecture.md'), '# Exemplo — Architecture\n\n## Módulos\n- Módulo único\n');
    assert.deepEqual(check(r.dir).errors, []);
    assert.ok(check(r.dir).info.some((i) => i.includes('architecture.md:4: - Módulo único')));
    writeFileSync(join(r.dir, 'spec', 'architecture.md'), '# Exemplo — Architecture\n\n## Módulos\n- ✓ Módulo único\n- ver decisions/x.md\n');
    assert.ok(check(r.dir).errors.some((e) => e.includes('architecture.md:5') && e.includes('referência a decisão')));
  } finally {
    r.cleanup();
  }
});

test('check: documento técnico auxiliar declarado é validado, sem camada nem pasta de decisões', () => {
  const r = repo();
  try {
    setConfig(r, { auxiliaryDocuments: ['interface'] });
    writeFileSync(join(r.dir, 'spec', 'interface.md'), '# Exemplo — Interface\n\n## Telas\n- Tela única\n');
    assert.deepEqual(check(r.dir).errors, []);
    assert.ok(check(r.dir).info.some((i) => i.includes('interface.md:4: - Tela única')));
    assert.ok(!existsSync(join(r.dir, 'spec', 'decisions', 'interface')));
    writeFileSync(join(r.dir, 'spec', 'interface.md'), '# Exemplo — Interface\n\n## Telas\n- ✓ Tela única\n- ver decisions/x.md\n- ✓ Botão ⇢ A ⇢ B\n');
    const errors = check(r.dir).errors;
    assert.ok(errors.some((e) => e.includes('interface.md:5') && e.includes('referência a decisão')));
    assert.ok(errors.some((e) => e.includes('interface.md:6') && e.includes('mais de um')));
  } finally {
    r.cleanup();
  }
});

test('check: documento técnico auxiliar declarado precisa existir', () => {
  const r = repo();
  try {
    setConfig(r, { auxiliaryDocuments: ['interface'] });
    assert.ok(check(r.dir).errors.some((e) => e.includes('interface.md ausente') && e.includes('auxiliaryDocuments')));
    writeFileSync(join(r.dir, 'spec', 'interface.md'), '# Exemplo — Interface\n');
    assert.deepEqual(check(r.dir).errors, []);
  } finally {
    r.cleanup();
  }
});

test('check: arquivo .md da spec que a configuração não declara é erro', () => {
  const r = repo();
  try {
    writeFileSync(join(r.dir, 'spec', 'flows.md'), '# Exemplo — Flows\n\n## Fluxos\n- ver [x](http://x.com)\n');
    const errors = check(r.dir).errors;
    assert.ok(errors.some((e) => e.includes('spec/flows.md não está declarado') && e.includes('auxiliaryDocuments') && e.includes('layers')));
    setConfig(r, { auxiliaryDocuments: ['flows'] });
    assert.ok(!check(r.dir).errors.some((e) => e.includes('não está declarado')));
    assert.ok(check(r.dir).errors.some((e) => e.includes('flows.md:4') && e.includes('link não é permitido')));
    // Pastas, o config e os arquivos conhecidos nunca contam como não declarados.
    assert.ok(!check(r.dir).errors.some((e) => e.includes('AGENTS.md') || e.includes('product.md') || e.includes('model.md')));
  } finally {
    r.cleanup();
  }
});

test('config.json: auxiliaryDocuments é opcional, mas tem de ser uma lista', () => {
  const r = repo();
  try {
    assert.deepEqual(loadConfig(r.dir).auxiliaryDocuments, []);
    setConfig(r, { auxiliaryDocuments: 'interface' });
    assert.throws(() => check(r.dir), /`auxiliaryDocuments` deve ser uma lista/);
    setConfig(r, { auxiliaryDocuments: [], layers: 'product' });
    assert.throws(() => check(r.dir), /sem `layers`/);
  } finally {
    r.cleanup();
  }
});

test('checkConfig recusa camada e documento auxiliar mal declarados', () => {
  const ok = { layers: ['product', 'architecture'], auxiliaryDocuments: ['interface', 'style-guide'] };
  assert.deepEqual(checkConfig(ok), []);
  const has = (config, texto) => checkConfig({ layers: ['product'], auxiliaryDocuments: [], ...config }).some((e) => e.includes(texto));
  assert.ok(has({ layers: ['architecture'] }, '`layers` deve incluir product'));
  assert.ok(has({ layers: ['product', 'model'] }, 'nome reservado model'));
  assert.ok(has({ layers: ['product', 'architecture', 'architecture'] }, 'repete architecture'));
  assert.ok(has({ layers: ['product', 'Architecture'] }, 'minúsculas, dígitos e hífens'));
  assert.ok(has({ auxiliaryDocuments: ['interface', 'interface'] }, 'repete interface'));
  for (const reservado of ['product', 'model', 'config', 'decisions', 'locales']) {
    assert.ok(has({ auxiliaryDocuments: [reservado] }, `\`auxiliaryDocuments\` não aceita o nome reservado ${reservado}`), reservado);
  }
  assert.ok(has({ auxiliaryDocuments: ['Telas'] }, 'minúsculas, dígitos e hífens'));
  assert.ok(has({ auxiliaryDocuments: ['AGENTS'] }, 'minúsculas, dígitos e hífens'));
  assert.ok(has({ auxiliaryDocuments: [''] }, 'minúsculas, dígitos e hífens'));
  assert.ok(has({ layers: ['product', 'interface'], auxiliaryDocuments: ['interface'] }, 'é camada ou documento auxiliar, não os dois'));
});

test('check: camada declarada exige o documento técnico e a pasta de decisões', () => {
  const r = repo();
  try {
    const cfg = join(r.dir, 'spec', 'config.json');
    writeFileSync(cfg, readFileSync(cfg, 'utf8').replace('"product"', '"product",\n    "architecture"'));
    const errors = check(r.dir).errors;
    assert.ok(errors.some((e) => e.includes('architecture.md ausente')));
    assert.ok(errors.some((e) => e.includes('decisions/architecture/ ausente')));
    mkdirSync(join(r.dir, 'spec', 'decisions', 'architecture'));
    buildMaps(r.dir);
    const after = check(r.dir).errors;
    assert.ok(after.some((e) => e.includes('architecture.md ausente')));
    assert.ok(!after.some((e) => e.includes('decisions/architecture/ ausente')));
    writeFileSync(join(r.dir, 'spec', 'architecture.md'), '# Exemplo — Architecture\n');
    assert.deepEqual(check(r.dir).errors, []);
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
});

// ---------- tabularium.manifest ----------

test('tabularium.manifest lista arquivos existentes, sem spec de produto nem arquivos do próprio tabularium', () => {
  const root = fileURLToPath(new URL('..', import.meta.url));
  const files = readFileSync(join(root, 'tabularium.manifest'), 'utf8').replace(/\r/g, '').split('\n')
    .filter((l) => l.trim() && !l.startsWith('#'));
  assert.equal(new Set(files).size, files.length, 'caminho repetido');
  for (const f of files) assert.ok(existsSync(join(root, f)), `ausente: ${f}`);
  const excluded = /^(tabularium-(spec|docs)\/|README\.md$|AGENTS\.md$|INSTALL\.|tabularium\.manifest$|\.github\/workflows\/tabularium\.yml$|scripts\/spec(\.test\.mjs|-fixtures\/))/;
  for (const f of files) {
    assert.ok(!excluded.test(f), `não distribuível: ${f}`);
    assert.ok(!f.startsWith('spec/') || f === 'spec/AGENTS.md', `spec de produto no manifesto: ${f}`);
  }
  const skills = execFileSync('git', ['ls-files', '.claude/skills'], { cwd: root, encoding: 'utf8' }).split('\n').filter(Boolean);
  for (const s of skills) assert.ok(files.includes(s), `skill fora do manifesto: ${s}`);
  const agents = readFileSync(join(root, 'AGENTS.md'), 'utf8').replace(/\r/g, '').split('\n');
  assert.ok(agents.indexOf('<!-- tabularium:begin -->') >= 0 && agents.indexOf('<!-- tabularium:end -->') > agents.indexOf('<!-- tabularium:begin -->'),
    'AGENTS.md sem o bloco do tabularium');
});
