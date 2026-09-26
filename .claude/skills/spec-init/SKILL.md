---
name: spec-init
description: Cria a estrutura da spec viva e grava as preferências do projeto (camadas de decisão, idioma, caminhos que não são código) em spec/config.json. Use para adotar a spec num repositório, novo ou existente, ou para mudar essas preferências depois. Não escreve requisitos; para extrair a spec de código existente, use spec-extract.
---

# spec-init

Regras de formato: `spec/AGENTS.md`. Toda alteração vai para um PR com a label `spec-only`.

## 1. Diagnóstico
- Verifique o que já existe: `AGENTS.md`, `spec/AGENTS.md`, `spec/config.json`, `spec/product.md`, `spec/model.md`, `spec/decisions/`, `scripts/spec.mjs`, `.github/workflows/spec-check.yml`.
- Se faltar `spec/AGENTS.md`, `AGENTS.md` ou `scripts/spec.mjs`, pare. Peça ao usuário para copiar esses arquivos do template (ver `README.md` do template) e rode de novo.
- Se existir `CLAUDE.md` na raiz ou em `spec/`, avise: com ele presente, o Claude Code ignora os `AGENTS.md`. Sugira mover o conteúdo para `AGENTS.md`.

## 2. Preferências
Se `spec/config.json` existir, mostre os valores atuais e pergunte só o que o usuário quer mudar. Senão, pergunte tudo:
- **Camadas de decisão** além de `product`: `interface`, `architecture`, `data` (modelo de dados), `operations` ou outras. Nenhuma se chama `model`, nome reservado ao modelo conceitual.
- **Idioma do conteúdo** (ex.: `pt-BR`). A estrutura fica sempre em inglês. O idioma precisa existir em `LOCALES` em `scripts/spec.mjs`; se não existir, avise e adicione a entrada, traduzindo os textos de `pt-BR`.
- **Caminhos que não são código** (`nonCodePaths`): mantenha o padrão (`spec/`, `README.md`, `AGENTS.md`, `REVIEW.md`, `.github/`, `.claude/`, `scripts/spec`) e acrescente o que o usuário indicar.

Grave em `spec/config.json`.

## 3. Estrutura
Crie o que faltar, sem sobrescrever nada:
- `spec/product.md` a partir de `assets/product.md`. Se o `product.md` existente for o exemplo do template (Iconula), pergunte se ele, o `model.md` e as decisões de exemplo devem ser substituídos pelo esqueleto.
- `spec/model.md` a partir de `assets/model.md`, só se o usuário quiser: pergunte se o domínio tem estrutura relevante (entidades com relações, estados ou invariantes). Produto sem estrutura relevante dispensa o modelo.
- Para cada camada além de `product`, pergunte se ela terá documento técnico. Se sim, crie `spec/<camada>.md` só com o título `# <Produto> — <Camada>`.
- Se existir `tabularium-spec/` (a spec do próprio template), pergunte se deve ser apagada. Em seguida, remova `tabularium-spec/` de `nonCodePaths` e, do workflow, os passos "Check da spec do próprio template" e "Label do PR do próprio template"; sem a pasta, eles e a condição da label `tabularium` ficam inertes.
- `spec/decisions/<camada>/` para cada camada.
- Rode `node scripts/spec.mjs build-map`.

## 4. Mudanças numa reexecução
- **Camada nova**: crie a pasta, pergunte se ela terá documento técnico e regere os mapas.
- **Camada removida com decisões**: pergunte se as decisões vão para outra camada (histórico: `AAAA-MM-DD organização: movida de <camada>`) ou se são apagadas.
- **Idioma novo**: vale para conteúdo novo. Só traduza o existente se o usuário pedir.

## 5. Fechamento
- Rode `node scripts/spec.mjs check` e corrija o que for estrutural.
- Crie as labels, se não existirem (`gh label create`):
  - `requirement`: issues e PRs de proposta de requisito;
  - `spec-only`: PR que altera só a spec;
  - `spec-mismatch`: PR de código que ajusta uma pequena divergência entre entrega e compromisso;
  - `no-spec-change`: PR de código que não muda comportamento e por isso não altera a spec.
- Oriente a proteção da `main` (Settings → Rules), que o usuário configura:
  - exigir PR;
  - exigir o check `spec-check`;
  - exigir branch atualizada com a `main` antes do merge;
  - não é preciso exigir aprovação: a aceitação é o merge decidido por um humano. Se a equipe quiser exigir aprovação, oriente também descartar aprovações quando houver commits novos.
- Revisão consultiva por agente (opcional). Pergunte qual usar; pode ser mais de um, ou nenhum:
  - **Copilot code review**: ruleset da `main` com "Automatically request Copilot code review" e "Review new pushes". Segue o `REVIEW.md`. Usa a assinatura do Copilot, sem secret.
  - **Claude**: o job `spec-review` do workflow roda o `spec-impact` quando existe o secret `ANTHROPIC_API_KEY`; sem ele, o job é pulado.
  - Se nenhum for usado, `REVIEW.md` e o job podem ficar: não têm efeito.
- Se o repositório já tiver código, sugira `/spec-extract` como próximo passo.
