#!/usr/bin/env node
// Ferramentas da spec viva. Sem dependências: só módulos nativos do Node.
//
//   node scripts/spec.mjs build-map                  regera os mapas de decisões
//   node scripts/spec.mjs check                      estrutura de pastas e arquivos e formato dos documentos
//   --spec <pasta>  pasta da spec (padrão: spec)
//
// Documentos com itens: product.md, model.md (modelo conceitual, opcional),
// <camada>.md (documento técnico fundamental, obrigatório de cada camada declarada em
// `layers` além de product) e <nome>.md (documento técnico auxiliar, declarado em
// `auxiliaryDocuments`). Arquivo .md na raiz da spec que a configuração não declara é erro.
//
// Regras de formato: spec/AGENTS.md.

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Textos que dependem do idioma do conteúdo (spec/config.json → language).
// Outro idioma vem de <spec>/locales/<idioma>.json, com as mesmas chaves; em mapTitle, {layer}
// marca o nome da camada. Assim o script nunca é editado no projeto e pode ser sobrescrito.
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

export function parseLocale(text, file) {
  const data = JSON.parse(text);
  const missing = Object.keys(LOCALES['pt-BR']).filter((k) => !(k in data));
  if (missing.length) throw new Error(`${file}: faltam as chaves ${missing.join(', ')}`);
  const title = String(data.mapTitle);
  return { ...data, mapTitle: (layer) => title.replaceAll('{layer}', layer) };
}

export function loadLocale(root, spec, language) {
  if (LOCALES[language]) return LOCALES[language];
  const file = join(root, spec, 'locales', `${language}.json`);
  if (!existsSync(file)) {
    throw new Error(`Idioma sem textos: ${language}. Crie ${spec}/locales/${language}.json com as chaves de LOCALES['pt-BR'] em scripts/spec.mjs`);
  }
  return parseLocale(readFileSync(file, 'utf8'), `${spec}/locales/${language}.json`);
}

export function loadConfig(root, spec = 'spec') {
  const config = JSON.parse(readFileSync(join(root, spec, 'config.json'), 'utf8'));
  const locale = loadLocale(root, spec, config.language);
  if (!Array.isArray(config.layers)) throw new Error(`${spec}/config.json sem \`layers\` (lista de camadas, com product)`);
  if (!Array.isArray(config.codePaths)) throw new Error(`${spec}/config.json sem \`codePaths\` (lista de caminhos de código; vazia se o projeto não tem código)`);
  if ('auxiliaryDocuments' in config && !Array.isArray(config.auxiliaryDocuments)) {
    throw new Error(`${spec}/config.json: \`auxiliaryDocuments\` deve ser uma lista de nomes de documentos técnicos auxiliares`);
  }
  return { ...config, auxiliaryDocuments: config.auxiliaryDocuments ?? [], locale };
}

const NAME = /^[a-z0-9]+(-[a-z0-9]+)*$/;
// Nomes de arquivos e pastas fixos da spec que a regra de minúsculas não já recusa (AGENTS.md):
// nenhum documento técnico auxiliar os usa.
const RESERVED_DOCS = ['product', 'model', 'config', 'decisions', 'locales'];

// Consistência da própria configuração: camadas e documentos técnicos auxiliares.
export function checkConfig(config, spec = 'spec') {
  const errors = [];
  const at = `${spec}/config.json`;
  const names = (key, list, reserved) => {
    const seen = new Set();
    for (const n of list) {
      if (typeof n !== 'string' || !NAME.test(n)) errors.push(`${at}: \`${key}\` aceita só nomes com minúsculas, dígitos e hífens: ${JSON.stringify(n)}`);
      else if (reserved.includes(n)) errors.push(`${at}: \`${key}\` não aceita o nome reservado ${n}`);
      if (seen.has(n)) errors.push(`${at}: \`${key}\` repete ${n}`);
      seen.add(n);
    }
  };
  if (!config.layers.includes('product')) errors.push(`${at}: \`layers\` deve incluir product`);
  names('layers', config.layers, ['model']);
  names('auxiliaryDocuments', config.auxiliaryDocuments, RESERVED_DOCS);
  for (const d of config.auxiliaryDocuments) {
    if (config.layers.includes(d)) errors.push(`${at}: ${d} está em \`layers\` e em \`auxiliaryDocuments\`: é camada ou documento auxiliar, não os dois`);
  }
  return errors;
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

// ---------- check ----------

// Arquivo e pasta de decisões obrigatórios de cada camada declarada, e arquivo de cada documento
// técnico auxiliar declarado.
function missingFiles(root, spec, config) {
  const errors = [];
  for (const layer of config.layers) {
    if (layer !== 'product' && !existsSync(join(root, spec, `${layer}.md`))) {
      errors.push(`${spec}/${layer}.md ausente: o documento técnico da camada declarada é obrigatório`);
    }
    if (!existsSync(join(root, spec, 'decisions', layer))) {
      errors.push(`${spec}/decisions/${layer}/ ausente: a pasta de decisões da camada declarada é obrigatória`);
    }
  }
  for (const doc of config.auxiliaryDocuments) {
    if (!existsSync(join(root, spec, `${doc}.md`))) {
      errors.push(`${spec}/${doc}.md ausente: o documento técnico auxiliar declarado em \`auxiliaryDocuments\` precisa existir`);
    }
  }
  return errors;
}

// Arquivo .md na raiz da spec que a configuração não declara: nem o AGENTS.md, o produto, o modelo,
// uma camada nem um documento técnico auxiliar. Sem isso, o arquivo ficaria fora de toda verificação.
function undeclaredDocs(root, spec, config) {
  const known = new Set([
    'AGENTS.md', 'product.md', 'model.md',
    ...config.layers.map((l) => `${l}.md`),
    ...config.auxiliaryDocuments.map((d) => `${d}.md`),
  ]);
  return readdirSync(join(root, spec), { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith('.md') && !known.has(e.name))
    .map((e) => `${spec}/${e.name} não está declarado em config.json: declare o nome em \`layers\` (camada técnica fundamental, com decisões) ou em \`auxiliaryDocuments\` (documento técnico auxiliar), ou apague o arquivo`);
}

// Documentos com itens da spec que existem: product.md sempre; model.md, se existir; <camada>.md das
// camadas declaradas e <nome>.md dos documentos técnicos auxiliares declarados (a falta de um deles é
// erro, reportado por missingFiles).
export function specDocs(root, spec, config) {
  const docs = [{ file: 'product.md', kind: 'product' }, { file: 'model.md', kind: 'model' }];
  for (const layer of config.layers) {
    if (layer !== 'product') docs.push({ file: `${layer}.md`, kind: 'technical' });
  }
  for (const doc of config.auxiliaryDocuments) docs.push({ file: `${doc}.md`, kind: 'auxiliary' });
  return docs.filter((d) => d.kind === 'product' || existsSync(join(root, spec, d.file)));
}

export function check(root, { spec = 'spec' } = {}) {
  const config = loadConfig(root, spec);
  const { locale } = config;
  const errors = [...checkConfig(config, spec), ...missingFiles(root, spec, config), ...undeclaredDocs(root, spec, config)];
  const warnings = [];
  const info = [];

  for (const layer of config.layers) {
    if (!existsSync(join(root, spec, 'decisions', layer))) continue;
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
    const { errors, warnings, info } = check(root, { spec });
    for (const i of info) console.log(i);
    for (const w of warnings) console.log(`aviso: ${w}`);
    for (const e of errors) console.error(`erro: ${e}`);
    console.log(errors.length ? `${errors.length} erro(s).` : 'spec ok.');
    return errors.length ? 1 : 0;
  }
  console.error('uso: node scripts/spec.mjs <build-map | check> [--root <dir>] [--spec <pasta>]');
  return 2;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
