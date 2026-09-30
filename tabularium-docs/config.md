# Configuração do projeto e do repositório

> **Documento derivado.** Descreve a configuração definida em `tabularium-spec/` e nos arquivos da definição (`spec/AGENTS.md`, `scripts/spec.mjs`, `.github/workflows/`, `REVIEW.md`, `/spec-init`). Não é fonte para agentes: em caso de conflito, vale a spec. É regerado a cada PR `tabularium` pelo `/spec-propose`.

## Projeto: `spec/config.json`

Alterado só pelo `/spec-init`, que pode ser refeito a qualquer momento.

**Caminhos de código** (`codePaths`): as pastas ou arquivos do código do produto (ex.: `src/`, `app/`), casados por prefixo; só o que está neles conta como código nas regras de PR. Configuração, build, instruções de IA, infra e a própria spec ficam de fora. Lista vazia é projeto sem código, e é perguntada de novo a cada `/spec-init`; configuração sem a lista é recusada pelo script. O `/spec-init` sugere a lista a partir das pastas do repositório e a atualiza quando o código muda de lugar.

**Camadas** (`layers`): `product` sempre existe, e o projeto declara as camadas técnicas fundamentais, como `architecture`, `integration` ou `data`. Cada camada declarada exige o documento `spec/<camada>.md` e a pasta `spec/decisions/<camada>/`: o check falha se faltar um deles, e o `/spec-init` os cria. Documentos técnicos auxiliares, como telas ou guia de estilo, são opcionais e não são camadas.

**Idioma**: estrutura sempre em inglês; conteúdo no idioma configurado. O script traz embutidos os textos da verificação em `pt-BR`; outro idioma recebe os textos em `spec/locales/<idioma>.json`, com as mesmas chaves, criado pelo `/spec-init`. O script nunca é editado no projeto. Idioma novo vale para conteúdo novo; o existente só é traduzido a pedido.

## Repositório: proteção da `main`

O `/spec-init` cria os rótulos `requirement`, `bug`, `plan`, `spec-editorial`, `spec-neutral`, `spec-compatible` e `spec-incompatible`, e orienta a proteção da `main` (Settings → Rules), que você configura:
- exigir PR;
- exigir o check `spec-check`, que deduz o tipo, aplica o rótulo (o workflow tem escrita nos PRs só para isso) e bloqueia quando o tipo torna o PR inválido;
- exigir branch atualizada com a `main` antes do merge;
- aprovação não é necessária: a aceitação é o merge decidido por um humano. Se a equipe exigir aprovação, descarte as aprovações quando houver commits novos.

## Repositório: revisão consultiva

Por agente, opcional e nunca bloqueante; um, os dois ou nenhum:
- **Copilot code review**: ruleset da `main` com "Automatically request Copilot code review" e "Review new pushes". Segue o `REVIEW.md` e usa a assinatura do Copilot, sem secret.
- **Claude**: job `spec-review` do workflow, que roda o `/spec-impact` em modo PR nos PRs que tocam `spec/`, quando existe o secret `ANTHROPIC_API_KEY`.

Com o secret, o check também usa o Claude para classificar o tipo no caso ambíguo. Sem ele, ou em PR de fork, o caso ambíguo exige que uma pessoa aplique o rótulo de tipo.
