#!/usr/bin/env node
// Ferramentas da spec viva. Sem dependências: só módulos nativos do Node.
//
//   node scripts/spec.mjs build-map                  regera os mapas de decisões
//   node scripts/spec.mjs classify --base <ref>        tipo mínimo da mudança e pontos ambíguos (JSON)
//   node scripts/spec.mjs check [--base <ref>] [--labels a,b] [--require-type]
//   --spec <pasta>  pasta da spec (padrão: spec)
//
// Documentos com itens: product.md, model.md (modelo conceitual, opcional) e
// <camada>.md (documento técnico opcional de cada camada além de product).
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
    glossarySection: 'Glossário',
    modelSections: ['Tipos', 'Entidades'],
    implementationWords: ['id', 'fk', 'chave', 'coluna', 'tabela', 'índice', 'sequence'],
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
export const CHANGE = '⇢';

// Tipos de mudança, do menor ao maior. PR com vários tipos recebe o maior.
export const TYPES = ['editorial', 'neutral', 'compatible', 'incompatible'];
export const typeLabel = (type) => `spec-${type}`;
export const TYPE_LABELS = TYPES.map(typeLabel);
const rank = (type) => TYPES.indexOf(type);
export const maxType = (...types) => types.filter(Boolean).reduce((a, b) => (rank(b) > rank(a) ? b : a));

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

// Regras comuns a todo documento com itens: autocontido, marcas e avisos temporais.
// sections: seções obrigatórias, nesta ordem (null = livres); unmarked: seções sem ✓.
export function checkItems(text, locale, { name, sections = null, unmarked = [] }) {
  const errors = [];
  const warnings = [];
  const lines = sectionsOf(text);

  if (sections) {
    const found = lines.filter((l) => /^## /.test(l.line)).map((l) => l.section);
    if (found.join('|') !== sections.join('|')) {
      errors.push(`${name}: seções devem ser, nesta ordem: ${sections.join(', ')} (encontradas: ${found.join(', ')})`);
    }
  }

  for (const { n, line: raw, section } of lines) {
    const at = `${name}:${n}`;
    // Trechos em `código` são texto literal: não contam como link, marcador ou referência.
    const line = raw.replace(/`[^`]*`/g, '');
    if (/\]\([^)]*\)|https?:\/\//.test(line)) errors.push(`${at}: link não é permitido (${name} é autocontido)`);
    if (/\b(ADR|IDR|TDR|MDR|DDR|PDR)[\s-]?\d+|decisions\//.test(line)) {
      errors.push(`${at}: referência a decisão não é permitida`);
    }
    if (line.includes(CHANGE) && !doneRe.test(line)) errors.push(`${at}: \`${CHANGE}\` só em item ${DONE}`);
    if (line.split(CHANGE).length > 2) errors.push(`${at}: mais de um \`${CHANGE}\` na linha`);
    if (doneRe.test(line) && unmarked.includes(section)) {
      errors.push(`${at}: itens de "${section}" não levam ${DONE}`);
    }
    if (itemRe.test(line) && line.includes(DONE) && !doneRe.test(line)) {
      errors.push(`${at}: ${DONE} deve vir logo após o marcador de lista`);
    }
    const plain = line.split(CHANGE)[0].toLowerCase();
    for (const w of locale.temporalWords) {
      if (wordRe(w).test(plain)) warnings.push(`${at}: possível referência temporal ("${w}")`);
    }
  }
  return { errors, warnings };
}

const wordRe = (w) => new RegExp(`(^|[^\\p{L}])${w}([^\\p{L}]|$)`, 'u');

export function checkProduct(text, locale) {
  return checkItems(text, locale, {
    name: 'product.md', sections: locale.productSections, unmarked: locale.unmarkedSections,
  });
}

// Nomes em negrito no início de um item da seção dada (termos do glossário, tipos do modelo).
export function definedTerms(text, section) {
  return sectionsOf(text)
    .filter((l) => l.section === section)
    .map((l) => l.line.match(new RegExp(`^\\s*- (?:${DONE} )?\\*\\*(.+?)\\*\\*`)))
    .filter(Boolean)
    .map((m) => m[1].trim());
}

// Modelo conceitual: regras do product.md, seções Tipos e Entidades, vocabulário
// só do glossário ou dos tipos declarados, e aviso para termos de implementação.
export function checkModel(text, glossary, locale) {
  const { errors, warnings } = checkItems(text, locale, { name: 'model.md', sections: locale.modelSections });
  const known = new Set([...glossary, ...definedTerms(text, locale.modelSections[0])]);
  for (const { n, line: raw } of sectionsOf(text)) {
    const line = raw.replace(/`[^`]*`/g, '');
    for (const m of line.matchAll(/\*\*(.+?)\*\*/g)) {
      if (!known.has(m[1].trim())) {
        errors.push(`model.md:${n}: **${m[1].trim()}** não é termo do glossário nem tipo declarado`);
      }
    }
    if (!itemRe.test(line)) continue;
    const plain = line.toLowerCase();
    for (const w of locale.implementationWords) {
      if (wordRe(w).test(plain)) warnings.push(`model.md:${n}: possível termo de implementação ("${w}")`);
    }
  }
  return { errors, warnings };
}

export function openChanges(text, name = 'product.md') {
  return sectionsOf(text)
    .filter(({ line }) => doneRe.test(line) && hasChange(line))
    .map(({ n, line }) => `${name}:${n}: ${line.trim()}`);
}

// Itens comprometidos (sem ✓) nas seções que levam estado.
export function commitments(text, locale, name = 'product.md', unmarked = locale.unmarkedSections) {
  return sectionsOf(text)
    .filter(({ line, section }) =>
      section && !unmarked.includes(section) &&
      itemRe.test(line) && !doneRe.test(line) && !/^\s*- Nota:/.test(line))
    .map(({ n, line }) => `${name}:${n}: ${line.trim()}`);
}

// Parte "o que vale hoje" de uma linha ✓ (sem o ⇢ e o desejado), normalizada.
const leftOf = (line) => {
  const i = changeIndex(line);
  return (i < 0 ? line : line.slice(0, i)).trim();
};

// Compara duas versões de um documento com itens e aponta o que exige código no mesmo PR.
// - resolutions: ⇢ removido e item reescrito (entrega) → sempre exige código.
// - rewrites: lado esquerdo de linha ✓ alterado ou removido → exige código ou PR spec-editorial.
// - marks: linha ✓ nova (item entregue) → exige código ou PR spec-editorial.
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
      // Lado esquerdo preservado: criou/editou/desistiu de um ⇢ → mudança incompatível, sem código.
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

// Linhas presentes em `a` e ausentes em `b`, contando repetições.
function minus(a, b) {
  const rest = [...b];
  return a.filter((l) => {
    const i = rest.indexOf(l);
    if (i < 0) return true;
    rest.splice(i, 1);
    return false;
  });
}

const textOf = (line) => line.trim().replace(new RegExp(`^- (${DONE} )?`), '').trim();

// Completa classifyProductDiff com o que o tipo da mudança precisa:
// - delivered: ✓ novo cujo texto era item comprometido, ou lado desejado de ⇢ resolvido (entrega);
// - newDone: ✓ novo que não existia como compromisso;
// - addedCommitments / removedCommitments: itens sem ✓ nas seções que levam estado;
// - otherText: demais linhas (descrição, glossário, fora de escopo, notas, títulos).
export function classifyDocDiff(before, after, unmarked = []) {
  const base = classifyProductDiff(before, after);
  const parts = (t) => {
    const committed = [];
    const other = [];
    for (const { line, section } of sectionsOf(t)) {
      if (!line.trim() || doneRe.test(line)) continue;
      const isCommitment = section && !unmarked.includes(section) && itemRe.test(line) && !/^\s*- Nota:/.test(line);
      (isCommitment ? committed : other).push(line.trim());
    }
    return { committed, other };
  };
  const old = parts(before);
  const now = parts(after);
  const removedAll = minus(old.committed, now.committed);
  const addedCommitments = minus(now.committed, old.committed);
  const resolvedTexts = base.resolutions.map((l) => l.slice(changeIndex(l) + CHANGE.length).trim());
  const pool = [...removedAll.map(textOf), ...resolvedTexts];
  const delivered = [];
  const newDone = [];
  for (const m of base.marks) {
    const i = pool.indexOf(textOf(m));
    if (i >= 0) {
      pool.splice(i, 1);
      delivered.push(m);
    } else newDone.push(m);
  }
  const deliveredTexts = delivered.map(textOf);
  const removedCommitments = removedAll.filter((l) => !deliveredTexts.includes(textOf(l)));
  const otherText = [...minus(old.other, now.other), ...minus(now.other, old.other)];
  return { ...base, delivered, newDone, addedCommitments, removedCommitments, otherText };
}

// Tipo mínimo que o diff prova e os pontos que só um julgamento de sentido resolve.
// Entrada: diffs dos documentos com itens, se o PR tem código, decisões criadas e
// alteradas (ou apagadas) e outros arquivos da spec alterados.
export function changeType({ docs, touchesCode, touchesSpec, decisionsAdded = [], decisionsChanged = [], otherFiles = [] }) {
  let min = touchesCode || !touchesSpec ? 'neutral' : 'editorial';
  const ambiguous = [];
  const raise = (t) => { min = maxType(min, t); };
  for (const { file, d } of docs) {
    if (d.changeEdits.length) raise('incompatible');
    if (d.addedCommitments.length && !d.removedCommitments.length) raise('compatible');
    if (touchesCode && d.newDone.length) raise('compatible');
    if (d.rewrites.length) ambiguous.push(`${file}: item ${DONE} alterado ou removido sem ${CHANGE}`);
    if (!touchesCode && d.marks.length) ambiguous.push(`${file}: item marcado ${DONE} sem código`);
    if (d.removedCommitments.length) ambiguous.push(`${file}: item comprometido alterado ou removido`);
    if (d.otherText.length) ambiguous.push(`${file}: texto fora dos itens alterado`);
  }
  if (decisionsAdded.length) raise('compatible');
  if (decisionsChanged.length) ambiguous.push('decisão existente alterada ou apagada');
  if (otherFiles.length) ambiguous.push(`outro arquivo da spec alterado: ${otherFiles.join(', ')}`);
  // Acima de incompatível não há o que julgar.
  return { min, ambiguous: min === 'incompatible' ? [] : ambiguous };
}

export function isCode(path, nonCodePaths) {
  return !nonCodePaths.some((p) => path === p || path.startsWith(p));
}

// ---------- check ----------

function git(root, args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8' });
}

// Documentos com itens da spec: product.md sempre; model.md e <camada>.md se existirem.
export function specDocs(root, spec, config) {
  const docs = [{ file: 'product.md', kind: 'product' }, { file: 'model.md', kind: 'model' }];
  for (const layer of config.layers) {
    if (layer !== 'product') docs.push({ file: `${layer}.md`, kind: 'technical' });
  }
  return docs.filter((d) => d.kind === 'product' || existsSync(join(root, spec, d.file)));
}

export function check(root, { base, labels = [], spec = 'spec', requireType = false } = {}) {
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

  const docs = specDocs(root, spec, config).map((d) => ({ ...d, text: readFileSync(join(root, spec, d.file), 'utf8') }));
  const product = docs[0].text;
  const glossary = definedTerms(product, locale.glossarySection);
  const changes = [];
  const pending = [];
  for (const { file, kind, text } of docs) {
    const r = kind === 'product' ? checkProduct(text, locale)
      : kind === 'model' ? checkModel(text, glossary, locale)
      : checkItems(text, locale, { name: file });
    errors.push(...r.errors);
    warnings.push(...r.warnings);
    changes.push(...openChanges(text, file));
    pending.push(...commitments(text, locale, file, kind === 'product' ? locale.unmarkedSections : []));
  }
  if (changes.length) info.push(`Itens redefinidos (${CHANGE}) em aberto:`, ...changes.map((c) => `  ${c}`));
  if (pending.length) info.push('Itens comprometidos, ainda não implementados:', ...pending.map((c) => `  ${c}`));

  for (const f of ['CLAUDE.md', join(spec, 'CLAUDE.md')]) {
    if (existsSync(join(root, f))) warnings.push(`${f} existe: o Claude Code ignora os AGENTS.md quando há CLAUDE.md`);
  }

  if (base) {
    const pr = classifyPR(root, { base, spec, config, docs });
    const { touchesCode, decisionsAdded, decisionsChanged, min, ambiguous } = pr;
    const at = (file, l) => (file === 'product.md' ? l : `${file}: ${l}`);
    const all = (k) => pr.docs.flatMap(({ file, d }) => d[k].map((l) => at(file, l)));

    // Tipo: a label de tipo do PR, que não pode ficar abaixo do mínimo do diff.
    const declared = labels.filter((l) => TYPE_LABELS.includes(l));
    let type = min;
    if (declared.length > 1) errors.push(`PR com mais de uma label de tipo: ${declared.join(', ')}`);
    if (declared.length === 1) {
      type = declared[0].slice('spec-'.length);
      if (rank(type) < rank(min)) errors.push(`label ${declared[0]} abaixo do tipo mínimo deduzido do diff: ${typeLabel(min)}`);
    } else if (ambiguous.length) {
      const msg = `tipo ambíguo acima de ${typeLabel(min)} (${ambiguous.join('; ')}): a IA classifica no CI, ou uma pessoa aplica a label de tipo`;
      (requireType ? errors : warnings).push(msg);
    }
    info.push(`Tipo da mudança: ${typeLabel(type)}${declared.length ? '' : ' (deduzido do diff)'}`);

    for (const c of all('changeEdits')) {
      if (!decisionsAdded.length && !decisionsChanged.length) errors.push(`${CHANGE} criado, alterado ou desfeito sem decisão criada ou alterada no PR: ${c}`);
    }
    if (type === 'incompatible' && !decisionsAdded.length && !decisionsChanged.length && !all('changeEdits').length) {
      errors.push('mudança incompatível sem decisão criada ou alterada no PR');
    }
    if (!touchesCode) {
      for (const r of all('resolutions')) errors.push(`${CHANGE} resolvido sem alteração de código: ${r}`);
      if (type !== 'editorial') {
        for (const r of all('rewrites')) errors.push(`item ${DONE} alterado ou removido sem código só em PR ${typeLabel('editorial')}; mudança de sentido entra como ${CHANGE}: ${r}`);
        for (const m of all('marks')) errors.push(`item marcado ${DONE} sem código só em PR ${typeLabel('editorial')} (já estava implementado): ${m}`);
      }
    }
  }

  return { errors, warnings, info };
}

// Diferença do PR em relação à base: arquivos, diffs dos documentos com itens e tipo.
export function classifyPR(root, { base, spec = 'spec', config = loadConfig(root, spec), docs } = {}) {
  const status = git(root, ['diff', '--name-status', '--no-renames', `${base}...HEAD`])
    .split('\n').filter(Boolean).map((l) => l.split('\t'));
  const changed = status.map(([, f]) => f);
  const touchesCode = changed.some((f) => isCode(f, config.nonCodePaths));
  const touchesSpec = changed.some((f) => f.startsWith(`${spec}/`));
  const isDecision = (f) => f.startsWith(`${spec}/decisions/`);
  const decisionsAdded = status.filter(([s, f]) => s === 'A' && isDecision(f) && !f.endsWith('/README.md')).map(([, f]) => f);
  const decisionsChanged = status.filter(([s, f]) => s !== 'A' && isDecision(f) && !f.endsWith('/README.md')).map(([, f]) => f);
  const specDocsNow = docs ?? specDocs(root, spec, config).map((d) => ({ ...d, text: readFileSync(join(root, spec, d.file), 'utf8') }));
  const docFiles = specDocsNow.map((d) => `${spec}/${d.file}`);
  const otherFiles = changed.filter((f) => f.startsWith(`${spec}/`) && !isDecision(f) && !docFiles.includes(f));
  const diffs = specDocsNow.map(({ file, kind, text }) => {
    let before = '';
    try {
      before = git(root, ['show', `${base}:${spec}/${file}`]);
    } catch {
      // Documento novo neste PR: nada a comparar.
    }
    const unmarked = kind === 'product' ? config.locale.unmarkedSections : [];
    return { file, d: classifyDocDiff(before, text, unmarked) };
  });
  const { min, ambiguous } = changeType({ docs: diffs, touchesCode, touchesSpec, decisionsAdded, decisionsChanged, otherFiles });
  return { changed, touchesCode, touchesSpec, decisionsAdded, decisionsChanged, otherFiles, docs: diffs, min, ambiguous };
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
  if (cmd === 'classify') {
    const base = arg(argv, '--base');
    if (!base) {
      console.error('uso: node scripts/spec.mjs classify --base <ref>');
      return 2;
    }
    const { min, ambiguous, touchesCode, touchesSpec } = classifyPR(root, { base, spec });
    console.log(JSON.stringify({ min, ambiguous, touchesCode, touchesSpec }));
    return 0;
  }
  if (cmd === 'check') {
    const labels = (arg(argv, '--labels') ?? '').split(',').map((s) => s.trim()).filter(Boolean);
    const requireType = argv.includes('--require-type');
    const { errors, warnings, info } = check(root, { base: arg(argv, '--base'), labels, spec, requireType });
    for (const i of info) console.log(i);
    for (const w of warnings) console.log(`aviso: ${w}`);
    for (const e of errors) console.error(`erro: ${e}`);
    console.log(errors.length ? `${errors.length} erro(s).` : 'spec ok.');
    return errors.length ? 1 : 0;
  }
  console.error('uso: node scripts/spec.mjs <build-map | classify --base <ref> | check [--base <ref>] [--labels a,b] [--require-type]> [--root <dir>] [--spec <pasta>]');
  return 2;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
