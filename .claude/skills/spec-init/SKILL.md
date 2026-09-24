---
name: spec-init
description: Cria a estrutura da spec viva e grava as preferências do projeto (tracker, padrão de task, camadas de decisão, idioma) em spec/config.json. Use para adotar a spec num repositório, novo ou existente, ou para mudar essas preferências depois. Não escreve requisitos; para extrair a spec de código existente, use spec-extract.
---

# spec-init

Regras de formato: `spec/AGENTS.md`. Toda alteração vai para um PR com a label `spec-only`.

## 1. Diagnóstico
- Verifique o que já existe: `AGENTS.md`, `spec/AGENTS.md`, `spec/config.json`, `spec/product.md`, `spec/decisions/`, `scripts/spec.mjs`, `.github/workflows/spec-check.yml`.
- Se faltar `spec/AGENTS.md`, `AGENTS.md` ou `scripts/spec.mjs`, pare. Peça ao usuário para copiar esses arquivos do template (ver `README.md` do template) e rode de novo.
- Se existir `CLAUDE.md` na raiz ou em `spec/`, avise: com ele presente, o Claude Code ignora os `AGENTS.md`. Sugira mover o conteúdo para `AGENTS.md`.

## 2. Preferências
Se `spec/config.json` existir, mostre os valores atuais e pergunte só o que o usuário quer mudar. Senão, pergunte tudo:
- **Tracker**: `github` (GitHub Issues) ou `jira`.
- **Padrão de task**: regex do ID de task usado nos históricos das decisões; `#\d+` (issue ou PR do GitHub) é sempre aceito (ex.: `#\d+`, `PROJ-\d+`).
- **Camadas de decisão** além de `product`: `interface`, `architecture`, `model`, `devops` ou outras.
- **Idioma do conteúdo** (ex.: `pt-BR`). A estrutura fica sempre em inglês. O idioma precisa existir em `LOCALES` em `scripts/spec.mjs`; se não existir, avise e adicione a entrada, traduzindo os textos de `pt-BR`.
- **Caminhos que não são código** (`nonCodePaths`): mantenha o padrão (`spec/`, `README.md`, `AGENTS.md`, `REVIEW.md`, `.github/`, `.claude/`, `scripts/spec`) e acrescente o que o usuário indicar.

Grave em `spec/config.json`.

## 3. Estrutura
Crie o que faltar, sem sobrescrever nada:
- `spec/product.md` a partir de `assets/product.md`. Se o `product.md` existente for o exemplo do template (Iconula), pergunte se ele e as decisões de exemplo devem ser substituídos pelo esqueleto.
- Se existir `tabularium-spec/` (a spec do próprio template), pergunte se deve ser apagada. Em seguida, remova `tabularium-spec/` de `nonCodePaths` e o passo correspondente do workflow.
- `spec/decisions/<camada>/` para cada camada.
- Rode `node scripts/spec.mjs build-map`.

## 4. Mudanças numa reexecução
- **Camada nova**: crie a pasta e regere os mapas.
- **Camada removida com decisões**: pergunte se as decisões vão para outra camada (histórico: `AAAA-MM-DD organização: movida de <camada>`) ou se são apagadas.
- **Idioma novo**: vale para conteúdo novo. Só traduza o existente se o usuário pedir.
- **Padrão de task novo**: não reescreva históricos. Se as entradas antigas deixarem de validar, inclua os dois padrões no regex (`TASK-\d+|PROJ-\d+`).

## 5. Fechamento
- Rode `node scripts/spec.mjs check` e corrija o que for estrutural.
- Crie as labels, se não existirem (`gh label create`):
  - `requirement`: issues e PRs de proposta de requisito;
  - `spec-only`: PR que altera só a spec;
  - `spec-mismatch`: PR de código que ajusta uma pequena divergência entre entrega e compromisso.
- Oriente a proteção da `main` (Settings → Rules), que o usuário configura:
  - exigir PR;
  - exigir o check `spec-check`;
  - exigir branch atualizada com a `main` antes do merge;
  - descartar aprovações quando houver commits novos.
- Revisão consultiva por agente (opcional). Pergunte qual usar; pode ser mais de um, ou nenhum:
  - **Copilot code review**: ruleset da `main` com "Automatically request Copilot code review" e "Review new pushes". Segue o `REVIEW.md`. Usa a assinatura do Copilot, sem secret.
  - **Claude**: o job `spec-review` do workflow roda o `spec-impact` quando existe o secret `ANTHROPIC_API_KEY`; sem ele, o job é pulado.
  - Se nenhum for usado, `REVIEW.md` e o job podem ficar: não têm efeito.
- Se o repositório já tiver código, sugira `/spec-extract` como próximo passo.
