---
name: spec-init
description: Cria a estrutura da spec viva, grava as preferências do projeto (camadas, idioma, caminhos de código) em spec/config.json e adapta a spec ao formato de uma versão nova do tabularium. Use depois do INSTALL, para adotar ou atualizar o tabularium num repositório, novo ou existente, ou para mudar essas preferências depois. Não escreve requisitos; para extrair a spec de código existente, use spec-extract.
---

# spec-init

Regras de formato: `spec/AGENTS.md`. Toda alteração vai para um PR. Nunca edite os arquivos do tabularium (os listados em `.tabularium` e o bloco do tabularium no `AGENTS.md`): o INSTALL os sobrescreve a cada atualização.

## 1. Diagnóstico
- Verifique o que já existe: `.tabularium`, `AGENTS.md`, `spec/AGENTS.md`, `spec/config.json`, `spec/product.md`, `spec/model.md`, `spec/decisions/`, `scripts/spec.mjs`, `.github/workflows/spec-check.yml`.
- Se faltar `.tabularium`, `spec/AGENTS.md` ou `scripts/spec.mjs`, pare. O tabularium se instala e se atualiza pelo INSTALL (ver `tabularium-docs/install.md` do tabularium); peça ao usuário para rodá-lo na raiz do repositório e rode de novo.
- Se existir `CLAUDE.md` na raiz ou em `spec/`, pare: com ele presente, o Claude Code ignora o `AGENTS.md`, e o tabularium não funciona. Peça ao usuário para migrar o conteúdo para `AGENTS.md` manualmente e apagar o `CLAUDE.md`.

## 2. Preferências
Se `spec/config.json` existir, mostre os valores atuais, pergunte só o que o usuário quer mudar e confirme cada mudança antes de gravar; se `codePaths` estiver vazio, pergunte-o sempre. Senão, pergunte tudo:
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
  As labels de tipo existem, mas por ora ninguém as aplica nem as exige: nem o CI, nem o agente.
- Sugira duas configurações do repositório remoto que se ligam e desligam: a proteção da `main` e a conferência por agente. Para cada uma, siga este ciclo, pelo `gh`:
  1. Verifique a situação atual no repositório remoto.
  2. Pergunte ao usuário o que deseja, mostrando a atual: a proteção, ligada ou desligada; a conferência, a do GitHub, a do Claude ou nenhuma.
  3. Se a situação atual já é a desejada, não faça nada.
  4. Senão, diga exatamente o que vai alterar e só siga com a confirmação do usuário. Ligar ou desligar é configurar o repositório remoto, pelo `gh`, se o usuário aceitar; se preferir, ou se a configuração falhar, mostre como fazê-lo à mão. Nunca altere sem a resposta.
- **Proteção da `main`** (ruleset em Settings → Rules): ligada quando o merge exige:
  - PR;
  - o check `spec-check-format`, que confere só a estrutura de pastas e arquivos e o formato dos documentos;
  - branch atualizada com a `main` antes do merge;
  - aprovação não é necessária: a aceitação é o merge decidido por um humano. Se a equipe quiser exigir aprovação, oriente também descartar aprovações quando houver commits novos.
  Se faltar parte do que segue, trate como desligada e ofereça ligar o que falta. Se o usuário a desliga, avise o risco: o merge deixa de exigir PR, o check e a branch atualizada, e uma proposta pode ser integrada sem revalidação depois de outra aceita antes dela.
- **Conferência por agente** (opcional): um agente de IA confere cada PR de proposta contra a spec vigente e só comenta, sem aprovar nem bloquear. Só uma fica ligada, a do GitHub (Copilot code review) ou a do Claude; ligar a escolhida desliga a outra. Explique isso ao usuário ao perguntar. Para saber qual está ligada: a do GitHub, se o ruleset da `main` tem "Automatically request Copilot code review"; a do Claude, se a variável do repositório `SPEC_REVIEW_AGENT` vale `claude`, ou se não existe e há o secret `ANTHROPIC_API_KEY` (verifique pelo nome com `gh secret list`, nunca pelo valor).
  - **GitHub (Copilot code review)**: liga com o ruleset da `main` ("Automatically request Copilot code review" e "Review new pushes"), que segue o `REVIEW.md` e usa a assinatura do Copilot, sem secret; grave `SPEC_REVIEW_AGENT=github` para desligar o job do Claude. Desliga removendo a regra do ruleset.
  - **Claude**: liga gravando `SPEC_REVIEW_AGENT=claude` (`gh variable set`); o job `spec-review` do workflow já vem no tabularium e roda o `spec-impact` quando a variável é `claude`, ou não existe, e há o secret `ANTHROPIC_API_KEY`. Só o secret falta, e a chave é do usuário: aqui "configurar" é orientar. Explique como criar o secret (Settings → Secrets and variables → Actions, ou `gh secret set`, rodado por ele) e nunca peça, receba nem digite a chave. Desliga gravando `SPEC_REVIEW_AGENT=github` ou `none`; o secret não é apagado, porque é do usuário.
  - **Nenhuma**: desligue a que estiver ligada, grave `SPEC_REVIEW_AGENT=none` e avise o risco: sem a conferência por agente, a proposta é validada só quanto ao formato e à integração com a base, sem quem confira as regras de PR, e pode integrar sem conflito e ainda assim contradizer a spec vigente.
  - Com a conferência desligada, `REVIEW.md` e o job podem ficar: não têm efeito.
- Se o repositório já tiver código, sugira `/spec-extract` como próximo passo.
