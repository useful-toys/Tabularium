# Configuração do projeto e do repositório

> **Documento derivado.** Descreve a configuração definida em `tabularium-spec/` e nos arquivos da definição (`spec/AGENTS.md`, `scripts/spec.mjs`, `.github/workflows/`, `REVIEW.md`, `/spec-init`). Não é fonte para agentes: em caso de conflito, vale a spec. É regerado a cada PR `tabularium` pelo `/spec-propose`.

## Projeto: `spec/config.json`

Alterado só pelo `/spec-init`, que pode ser refeito a qualquer momento.

**Caminhos de código** (`codePaths`): as pastas ou arquivos do código do produto (ex.: `src/`, `app/`), casados por prefixo; só o que está neles conta como código nas regras de PR. Configuração, build, instruções de IA, infra e a própria spec ficam de fora. Lista vazia é projeto sem código, e é perguntada de novo a cada `/spec-init`; configuração sem a lista é recusada pelo script. O `/spec-init` sugere a lista a partir das pastas do repositório e a atualiza quando o código muda de lugar.

**Camadas** (`layers`): `product` sempre existe, e o projeto declara as camadas técnicas fundamentais, como `architecture`, `integration` ou `data`. Cada camada declarada exige o documento `spec/<camada>.md` e a pasta `spec/decisions/<camada>/`: o check falha se faltar um deles, e o `/spec-init` os cria. Documentos técnicos auxiliares, como telas ou guia de estilo, são opcionais e não são camadas.

**Idioma**: estrutura sempre em inglês; conteúdo no idioma configurado. O script traz embutidos os textos da verificação em `pt-BR`; outro idioma recebe os textos em `spec/locales/<idioma>.json`, com as mesmas chaves, criado pelo `/spec-init`. O script nunca é editado no projeto. Idioma novo vale para conteúdo novo; o existente só é traduzido a pedido.

## Repositório: proteção da `main` e conferência por agente

O `/spec-init` cria os rótulos `requirement`, `bug`, `plan`, `spec-editorial`, `spec-neutral`, `spec-compatible` e `spec-incompatible` (os de tipo existem, mas por ora ninguém os aplica nem os exige), e sugere duas configurações do repositório remoto que se ligam e desligam: a proteção da `main` e a conferência por agente. Para cada uma, ele segue o mesmo ciclo:
1. verifica a situação atual no repositório remoto;
2. pergunta o que você deseja, mostrando a atual;
3. se a atual já é a desejada, não faz nada;
4. senão, diz o que vai alterar e só segue com a sua confirmação; ligar ou desligar é configurar o repositório remoto pelo `gh`, se você aceitar; se preferir, ele mostra como fazê-lo à mão.

### Proteção da `main`

Ruleset da `main` em Settings → Rules. Está ligada quando o merge exige:
- PR;
- o check `spec-check-format`, que confere só a estrutura de pastas e arquivos e o formato dos documentos, sem IA e sem escrever no PR;
- branch atualizada com a `main` antes do merge;
- aprovação não é necessária: a aceitação é o merge decidido por um humano. Se a equipe exigir aprovação, descarte as aprovações quando houver commits novos.

Se faltar parte, o `/spec-init` trata como desligada e oferece ligar o que falta. Se você a desliga, ele avisa o risco: o merge deixa de exigir PR, o check e a branch atualizada, e uma proposta pode ser integrada sem revalidação depois de outra aceita antes dela.

### Conferência por agente

Um agente de IA confere cada PR de proposta contra a spec vigente, sobre tipo, regras de PR, cascata, decisões, consistência e forma, e só comenta: nunca aprova nem bloqueia, e quem decide é a pessoa que integra. É opcional, e só uma fica ligada: a do GitHub, a do Claude ou nenhuma. Ligar a escolhida desliga a outra.
- **GitHub (Copilot code review)**: ruleset da `main` com "Automatically request Copilot code review" e "Review new pushes". Segue o `REVIEW.md` e usa a assinatura do Copilot, sem secret. Escolhida a do GitHub, o `/spec-init` grava a variável do repositório `SPEC_REVIEW_AGENT=github`, que desliga o job do Claude.
- **Claude**: job `spec-review` do workflow, que já vem com o tabularium e roda o `/spec-impact` em modo PR nos PRs que tocam `spec/`, quando a variável `SPEC_REVIEW_AGENT` vale `claude` (ou não existe) e há o secret `ANTHROPIC_API_KEY`. O `/spec-init` grava `SPEC_REVIEW_AGENT=claude`. Só o secret falta: ele verifica se existe pelo nome e, se não existir, só orienta como criá-lo (Settings → Secrets and variables → Actions, ou `gh secret set`, rodado por você), sem nunca receber a chave. Desligar o Claude não apaga o secret.
- **Nenhuma**: `SPEC_REVIEW_AGENT=none`. O `/spec-init` avisa o risco: sem a conferência, a proposta é validada só quanto ao formato e à integração com a base, sem quem confira as regras de PR, e pode integrar sem conflito e ainda assim contradizer a spec vigente.
