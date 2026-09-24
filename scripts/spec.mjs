#!/usr/bin/env node
// Ferramentas da spec viva. Sem dependências: só módulos nativos do Node.
//
//   node scripts/spec.mjs build-map                  regera os mapas de decisões
//   node scripts/spec.mjs check [--base <ref>] [--labels a,b]
//   --spec <pasta>  pasta da spec (padrão: spec)
//
// Regras de formato: spec/AGENTS.md.

import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Textos que dependem do idioma do conteúdo (spec/config.json → language).
export const LOCALES = {
  'pt-BR': {
    productSections: [
      'O que é',
      'Diferenciais',
      'Glossário',
      'Requisitos',
      'Regras transversais',
      'Não funcionais',
      'Fora de escopo',
    ],
    // Seções em que os itens não levam ✓.
    unmarkedSections: ['O que é', 'Diferenciais', 'Glossário', 'Fora de escopo'],
    temporalWords: [
      'antigo', 'antiga', 'antigos', 'antigas', 'anteriormente', 'legado',
      'migração', 'migrado', 'migrada', 'corrige', 'corrigido',
      'passa a', 'passou a', 'não mais', 'a partir de agora', 'removido', 'removida',
    ],
    decisionItems: ['- Decisão:', '- Contexto:', '- Alternativas descartadas', '- Consequências'],
    historyHeading: '## Histórico',
    reorgLabel: 'organização',
    initialLabel: 'plano-inicial',
    mapTitle: (layer) => `# Decisões: ${layer}`,
    mapNotice: '<!-- Gerado por `node scripts/spec.mjs build-map`. Não edite à mão. -->',
    loadWhen: 'Carregar quando',
  },
};

export const DONE = '✓';
export const LABEL_SPEC_ONLY = 'spec-only';
export const LABEL_MISMATCH = 'spec-mismatch';
export const LABEL_REQUIREMENT = 'requirement';
export const CHANGE = '⇢';

// Posição do ⇢ fora de trechos em `código` (-1 se não houver).
export function changeIndex(line) {
  let inCode = false;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '`') inCode = !inCode;
    else if (!inCode && line.startsWith(CHANGE, i)) return i;
  }
  return -1;
}
const hasChange = (line) => changeIndex(line) >= 0;
const FRONTMATTER_KEYS = ['tema', 'decisao', 'carregar-quando'];

// ---------- leitura ----------

export function loadConfig(root, spec = 'spec') {
  const config = JSON.parse(readFileSync(join(root, spec, 'config.json'), 'utf8'));
  const locale = LOCALES[config.language];
  if (!locale) throw new Error(`Idioma sem textos definidos em scripts/spec.mjs (LOCALES): ${config.language}`);
  return { ...config, locale };
}

export function parseFrontmatter(text) {
  const m = text.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { data: null, body: text };
  const data = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([\w-]+):\s*(.*)$/);
    if (kv) data[kv[1]] = kv[2].trim();
  }
  return { data, body: m[2] };
}

function decisionFiles(root, layer, spec) {
  const dir = join(root, spec, 'decisions', layer);
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => f.endsWith('.md') && f !== 'README.md').sort();
}

// ---------- mapa ----------

export function renderMap(layer, decisions, locale) {
  const lines = [locale.mapTitle(layer), locale.mapNotice, ''];
  for (const { file, data } of decisions) {
    lines.push(`- ${file} — ${data.tema}: ${data.decisao}. ${locale.loadWhen}: ${data['carregar-quando']}`);
  }
  return lines.join('\n') + '\n';
}

function mapFor(root, layer, locale, spec) {
  const decisions = decisionFiles(root, layer, spec).map((file) => ({
    file,
    data: parseFrontmatter(readFileSync(join(root, spec, 'decisions', layer, file), 'utf8')).data ?? {},
  }));
  return renderMap(layer, decisions, locale);
}

export function buildMaps(root, spec = 'spec') {
  const { layers, locale } = loadConfig(root, spec);
  for (const layer of layers) {
    writeFileSync(join(root, spec, 'decisions', layer, 'README.md'), mapFor(root, layer, locale, spec));
  }
  return layers;
}

// ---------- decisões ----------

export function checkDecision(file, text, { locale }) {
  const errors = [];
  const { data, body } = parseFrontmatter(text);
  if (!data) return [`${file}: sem frontmatter`];
  for (const key of FRONTMATTER_KEYS) {
    if (!data[key]) errors.push(`${file}: frontmatter sem \`${key}\``);
  }
  const lines = body.split('\n');
  let last = -1;
  for (const item of locale.decisionItems) {
    const idx = lines.findIndex((l) => l.startsWith(item));
    if (idx < 0) errors.push(`${file}: falta \`${item}\``);
    else if (idx < last) errors.push(`${file}: \`${item}\` fora de ordem`);
    else last = idx;
  }
  const h = lines.indexOf(locale.historyHeading);
  if (h < 0) {
    errors.push(`${file}: falta \`${locale.historyHeading}\``);
    return errors;
  }
  if (lines.slice(h + 1).some((l) => l.startsWith('## '))) {
    errors.push(`${file}: \`${locale.historyHeading}\` deve ser a última seção`);
  }
  // Origem da entrada: #N (issue ou PR do GitHub), organização ou plano inicial.
  const entry = new RegExp(`^- \\d{4}-\\d{2}-\\d{2} (#\\d+|${locale.reorgLabel}|${locale.initialLabel}): \\S`);
  const entries = lines.slice(h + 1).filter((l) => l.startsWith('- '));
  if (entries.length === 0) errors.push(`${file}: histórico vazio`);
  for (const e of entries) {
    if (!entry.test(e)) errors.push(`${file}: entrada de histórico fora do padrão: ${e}`);
  }
  return errors;
}

// ---------- product.md ----------

function sectionsOf(text) {
  const out = [];
  let current = null;
  text.replace(/\r\n/g, '\n').split('\n').forEach((line, i) => {
    const h = line.match(/^## (.+)$/);
    if (h) current = h[1].trim();
    out.push({ n: i + 1, line, section: current });
  });
  return out;
}

const itemRe = /^\s*- /;
const doneRe = new RegExp(`^\\s*- ${DONE} `);

export function checkProduct(text, locale) {
  const errors = [];
  const warnings = [];
  const lines = sectionsOf(text);

  const found = lines.filter((l) => /^## /.test(l.line)).map((l) => l.section);
  const expected = locale.productSections;
  if (found.join('|') !== expected.join('|')) {
    errors.push(`product.md: seções devem ser, nesta ordem: ${expected.join(', ')} (encontradas: ${found.join(', ')})`);
  }

  for (const { n, line: raw, section } of lines) {
    const at = `product.md:${n}`;
    // Trechos em `código` são texto literal: não contam como link, marcador ou referência.
    const line = raw.replace(/`[^`]*`/g, '');
    if (/\]\([^)]*\)|https?:\/\//.test(line)) errors.push(`${at}: link não é permitido (product.md é autocontido)`);
    if (/\b(ADR|IDR|TDR|MDR|DDR|PDR)[\s-]?\d+|decisions\//.test(line)) {
      errors.push(`${at}: referência a decisão não é permitida`);
    }
    if (line.includes(CHANGE) && !doneRe.test(line)) errors.push(`${at}: \`${CHANGE}\` só em item ${DONE}`);
    if (line.split(CHANGE).length > 2) errors.push(`${at}: mais de um \`${CHANGE}\` na linha`);
    if (doneRe.test(line) && locale.unmarkedSections.includes(section)) {
      errors.push(`${at}: itens de "${section}" não levam ${DONE}`);
    }
    if (itemRe.test(line) && line.includes(DONE) && !doneRe.test(line)) {
      errors.push(`${at}: ${DONE} deve vir logo após o marcador de lista`);
    }
    const plain = line.split(CHANGE)[0].toLowerCase();
    for (const w of locale.temporalWords) {
      if (new RegExp(`(^|[^\\p{L}])${w}([^\\p{L}]|$)`, 'u').test(plain)) {
        warnings.push(`${at}: possível referência temporal ("${w}")`);
      }
    }
  }
  return { errors, warnings };
}

export function openChanges(text) {
  return sectionsOf(text)
    .filter(({ line }) => doneRe.test(line) && hasChange(line))
    .map(({ n, line }) => `product.md:${n}: ${line.trim()}`);
}

// Itens comprometidos (sem ✓) nas seções que levam estado.
export function commitments(text, locale) {
  return sectionsOf(text)
    .filter(({ line, section }) =>
      section && !locale.unmarkedSections.includes(section) &&
      itemRe.test(line) && !doneRe.test(line) && !/^s*- Nota:/.test(line))
    .map(({ n, line }) => `product.md:${n}: ${line.trim()}`);
}

// Parte "o que vale hoje" de uma linha ✓ (sem o ⇢ e o desejado), normalizada.
const leftOf = (line) => {
  const i = changeIndex(line);
  return (i < 0 ? line : line.slice(0, i)).trim();
};

// Compara duas versões do product.md e aponta o que exige código no mesmo PR.
// - resolutions: ⇢ removido e item reescrito (entrega) → sempre exige código.
// - rewrites: lado esquerdo de linha ✓ alterado ou removido → exige código ou label spec-only.
// - marks: linha ✓ nova (item entregue) → exige código ou label spec-only.
// - changeEdits: ⇢ criado, editado ou desfeito (não entregue) → exige decisão alterada no PR.
export function classifyProductDiff(before, after) {
  const doneLines = (t) => t.replace(/\r\n/g, '\n').split('\n').filter((l) => doneRe.test(l));
  const oldDone = doneLines(before);
  const newDone = doneLines(after);

  // Linhas idênticas nas duas versões (inclusive movidas) não contam.
  const pending = [...newDone];
  const removed = [];
  for (const line of oldDone) {
    const i = pending.indexOf(line);
    if (i >= 0) pending.splice(i, 1);
    else removed.push(line);
  }

  const added = pending.map((line) => ({ line, left: leftOf(line) }));
  const resolutions = [];
  const rewrites = [];
  for (const line of removed) {
    const j = added.findIndex((a) => a.left === leftOf(line));
    if (j >= 0) {
      // Lado esquerdo preservado: criou/editou/desistiu de um ⇢ → spec-only.
      added.splice(j, 1);
      continue;
    }
    if (hasChange(line)) resolutions.push(line.trim());
    else rewrites.push(line.trim());
  }
  const marks = added.map((a) => a.line.trim());

  const changeLines = (lines) => lines.filter(hasChange).map((l) => l.trim());
  const oldChanges = changeLines(oldDone);
  const newChanges = changeLines(newDone);
  const changeEdits = [
    ...newChanges.filter((l) => !oldChanges.includes(l)),
    ...oldChanges.filter((l) => !newChanges.includes(l) && !resolutions.includes(l)),
  ];
  return { resolutions, rewrites, marks, changeEdits };
}

export function isCode(path, nonCodePaths) {
  return !nonCodePaths.some((p) => path === p || path.startsWith(p));
}

// ---------- check ----------

function git(root, args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8' });
}

export function check(root, { base, labels = [], spec = 'spec' } = {}) {
  const config = loadConfig(root, spec);
  const { locale } = config;
  const errors = [];
  const warnings = [];
  const info = [];

  for (const layer of config.layers) {
    const mapPath = join(root, spec, 'decisions', layer, 'README.md');
    const current = existsSync(mapPath) ? readFileSync(mapPath, 'utf8').replace(/\r\n/g, '\n') : '';
    if (current !== mapFor(root, layer, locale, spec)) {
      errors.push(`${spec}/decisions/${layer}/README.md desatualizado: rode \`node scripts/spec.mjs build-map\``);
    }
    for (const file of decisionFiles(root, layer, spec)) {
      const text = readFileSync(join(root, spec, 'decisions', layer, file), 'utf8');
      errors.push(...checkDecision(`decisions/${layer}/${file}`, text, { locale }));
    }
  }

  const productPath = join(root, spec, 'product.md');
  const product = readFileSync(productPath, 'utf8');
  const p = checkProduct(product, locale);
  errors.push(...p.errors);
  warnings.push(...p.warnings);

  const changes = openChanges(product);
  if (changes.length) info.push(`Mudanças comprometidas (${CHANGE}) em aberto:`, ...changes.map((c) => `  ${c}`));
  const pending = commitments(product, locale);
  if (pending.length) info.push('Itens comprometidos, ainda não implementados:', ...pending.map((c) => `  ${c}`));

  for (const f of ['CLAUDE.md', join(spec, 'CLAUDE.md')]) {
    if (existsSync(join(root, f))) warnings.push(`${f} existe: o Claude Code ignora os AGENTS.md quando há CLAUDE.md`);
  }

  if (base) {
    let before = '';
    try {
      before = git(root, ['show', `${base}:${spec}/product.md`]);
    } catch {
      // product.md novo neste PR: nada a comparar.
    }
    const changed = git(root, ['diff', '--name-only', `${base}...HEAD`]).split('\n').filter(Boolean);
    const touchesCode = changed.some((f) => isCode(f, config.nonCodePaths));
    const decisionsChanged = changed.filter((f) => f.startsWith(`${spec}/decisions/`) && !f.endsWith('/README.md'));
    const { resolutions, rewrites, marks, changeEdits } = classifyProductDiff(before, product);
    if (changeEdits.length && !decisionsChanged.length) {
      for (const c of changeEdits) errors.push(`${CHANGE} criado, alterado ou desfeito sem decisão alterada no PR: ${c}`);
    }
    if (touchesCode && !labels.includes(LABEL_MISMATCH)) {
      for (const c of changeEdits) errors.push(`PR com código não pode criar ou alterar ${CHANGE} (proposta em PR próprio, ou label ${LABEL_MISMATCH}): ${c}`);
      for (const d of decisionsChanged) errors.push(`PR com código não pode alterar decisões (proposta em PR próprio, ou label ${LABEL_MISMATCH}): ${d}`);
    }
    if (!touchesCode) {
      for (const r of resolutions) errors.push(`${CHANGE} resolvido sem alteração de código: ${r}`);
      if (!labels.includes(LABEL_SPEC_ONLY)) {
        for (const r of rewrites) errors.push(`item ${DONE} alterado ou removido sem código (label ${LABEL_SPEC_ONLY} se for só redação): ${r}`);
        for (const m of marks) errors.push(`item marcado ${DONE} sem código (label ${LABEL_SPEC_ONLY} se já estava implementado): ${m}`);
      }
    }
  }

  return { errors, warnings, info };
}

// ---------- CLI ----------

function arg(argv, name) {
  const i = argv.indexOf(name);
  return i >= 0 ? argv[i + 1] : undefined;
}

function main(argv) {
  const root = resolve(arg(argv, '--root') ?? process.cwd());
  const spec = arg(argv, '--spec') ?? 'spec';
  const cmd = argv[0];
  if (cmd === 'build-map') {
    const layers = buildMaps(root, spec);
    console.log(`Mapas regerados: ${layers.join(', ')}`);
    return 0;
  }
  if (cmd === 'check') {
    const labels = (arg(argv, '--labels') ?? '').split(',').map((s) => s.trim()).filter(Boolean);
    const { errors, warnings, info } = check(root, { base: arg(argv, '--base'), labels, spec });
    for (const i of info) console.log(i);
    for (const w of warnings) console.log(`aviso: ${w}`);
    for (const e of errors) console.error(`erro: ${e}`);
    console.log(errors.length ? `${errors.length} erro(s).` : 'spec ok.');
    return errors.length ? 1 : 0;
  }
  console.error('uso: node scripts/spec.mjs <build-map | check [--base <ref>] [--labels a,b]> [--root <dir>] [--spec <pasta>]');
  return 2;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
