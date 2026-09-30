---
name: spec-init
description: Cria a estrutura da spec viva, grava as preferências do projeto (camadas, idioma, caminhos de código) em spec/config.json e adapta a spec ao formato de uma versão nova do tabularium. Use depois do INSTALL, para adotar ou atualizar o tabularium num repositório, novo ou existente, ou para mudar essas preferências depois. Não escreve requisitos; para extrair a spec de código existente, use spec-extract.
---

# spec-init

Regras de formato: `spec/AGENTS.md`. Toda alteração vai para um PR; o CI deduz o tipo e aplica a label. Nunca edite os arquivos do tabularium (os listados em `.tabularium` e o bloco do tabularium no `AGENTS.md`): o INSTALL os sobrescreve a cada atualização.

## 1. Diagnóstico
- Verifique o que já existe: `.tabularium`, `AGENTS.md`, `spec/AGENTS.md`, `spec/config.json`, `spec/product.md`, `spec/model.md`, `spec/decisions/`, `scripts/spec.mjs`, `.github/workflows/spec-check.yml`.
- Se faltar `.tabularium`, `spec/AGENTS.md` ou `scripts/spec.mjs`, pare. O tabularium se instala e se atualiza pelo INSTALL (ver `tabularium-docs/install.md` do tabularium); peça ao usuário para rodá-lo na raiz do repositório e rode de novo.
- Se existir `CLAUDE.md` na raiz ou em `spec/`, pare: com ele presente, o Claude Code ignora o `AGENTS.md`, e o tabularium não funciona. Peça ao usuário para migrar o conteúdo para `AGENTS.md` manualmente e apagar o `CLAUDE.md`.

## 2. Preferências
Se `spec/config.json` existir, mostre os valores atuais e pergunte só o que o usuário quer mudar; se `codePaths` estiver vazio, pergunte-o sempre. Senão, pergunte tudo:
- **Camadas fundamentais** além de `product`: aquelas cuja alteração depois da adoção causa grande impacto, como `architecture`, `integration`, `data` (modelo de dados) ou outras. Cada camada tem seu documento técnico e suas decisões, ambos obrigatórios. Documento técnico auxiliar (`interface`, `flows`, `style`) não é camada. Nenhuma se chama `model`, nome reservado ao modelo conceitual.
- **Idioma do conteúdo** (ex.: `pt-BR`). A estrutura fica sempre em inglês. Idioma fora de `LOCALES`, em `scripts/spec.mjs`, precisa de `spec/locales/<idioma>.json`, com as mesmas chaves de `LOCALES['pt-BR']`, traduzidas (em `mapTitle`, `{layer}` marca o nome da camada). Se o arquivo não existir, avise e crie-o.
- **Caminhos de código** (`codePaths`): as pastas ou arquivos onde está o código do produto (ex.: `src/`, `app/`, `lib/`), casados por prefixo. Sugira a lista a partir das pastas do repositório e confirme. Configuração, build, instruções de IA, infra e a própria spec ficam de fora. Lista vazia: projeto sem código. Quando o código mudar de lugar, a lista é atualizada por aqui.

Grave em `spec/config.json`.

## 3. Estrutura
Crie o que faltar, sem sobrescrever nada:
- `spec/product.md` a partir de `assets/product.md`.
- `spec/model.md` a partir de `assets/model.md`, só se o usuário quiser: pergunte se o domínio tem estrutura relevante (entidades com relações, estados ou invariantes). Produto sem estrutura relevante dispensa o modelo.
- Para cada camada além de `product`, crie `spec/<camada>.md` só com o título `# <Produto> — <Camada>`: o documento é obrigatório.
- Documento técnico auxiliar, só se o usuário pedir: `spec/<nome>.md` com o mesmo título.
- `spec/decisions/<camada>/` para cada camada.
- Rode `node scripts/spec.mjs build-map`.

## 4. Mudanças numa reexecução
- **Camada nova**: crie a pasta e o documento técnico e regere os mapas.
- **Camada removida com decisões**: pergunte se as decisões vão para outra camada (histórico: `AAAA-MM-DD organização: movida de <camada>`) ou se são apagadas.
- **Idioma novo**: vale para conteúdo novo. Só traduza o existente se o usuário pedir.

## 5. Migração depois de uma atualização
Depois que o INSTALL atualiza o tabularium, sobretudo numa versão major, o formato da spec pode ter mudado.
- Rode `node scripts/spec.mjs check` e leia as regras novas em `spec/AGENTS.md`.
- Para cada erro de formato, proponha a adaptação do conteúdo sem mudar o sentido de nenhum item, e aplique com a confirmação do usuário, em lote ou item a item.
- O que exigir mudar sentido não é migração: vira proposta (`/spec-grill`, `/spec-propose`).
- A migração vai no mesmo PR da atualização.

## 6. Fechamento
- Rode `node scripts/spec.mjs check` e corrija o que for estrutural.
- Crie as labels, se não existirem (`gh label create`):
  - `requirement`: requirement issue, isto é, triada e a amadurecer; só a triagem a aplica;
  - `bug`: bug issue, isto é, triada como comportamento que contradiz a spec, hoje recusada pelo `/spec-grill`, pois terá skills dedicadas; só a triagem a aplica;
  - `plan`: issue de plano, hoje recusada pelo `/spec-grill`, pois terá skills dedicadas; só a triagem a aplica;
  - `spec-editorial`: PR que muda só o texto da spec, sem mudar sentido;
  - `spec-neutral`: PR que não altera o sentido de nenhum requisito (código sem spec, ou entrega de compromisso);
  - `spec-compatible`: PR que cria requisito, altera item não implementado ou cria decisão, sem contradizer nada;
  - `spec-incompatible`: PR que altera o sentido de item implementado, contradiz item ou vai contra decisão.
  O CI aplica a label de tipo: o workflow declara permissão de escrita nos PRs só para isso.
- Oriente a proteção da `main` (Settings → Rules), que o usuário configura:
  - exigir PR;
  - exigir o check `spec-check`, que também classifica o tipo e bloqueia quando o tipo torna o PR inválido;
  - exigir branch atualizada com a `main` antes do merge;
  - não é preciso exigir aprovação: a aceitação é o merge decidido por um humano. Se a equipe quiser exigir aprovação, oriente também descartar aprovações quando houver commits novos.
- Revisão consultiva por agente (opcional). Pergunte qual usar; pode ser mais de um, ou nenhum:
  - **Copilot code review**: ruleset da `main` com "Automatically request Copilot code review" e "Review new pushes". Segue o `REVIEW.md`. Usa a assinatura do Copilot, sem secret.
  - **Claude**: o job `spec-review` do workflow roda o `spec-impact` quando existe o secret `ANTHROPIC_API_KEY`; sem ele, o job é pulado.
  - Com o secret, o check também usa o Claude para classificar o tipo no caso ambíguo; sem ele, ou em PR de fork, o caso ambíguo pede que uma pessoa aplique a label de tipo.
  - Se nenhum for usado, `REVIEW.md` e o job podem ficar: não têm efeito.
- Se o repositório já tiver código, sugira `/spec-extract` como próximo passo.
