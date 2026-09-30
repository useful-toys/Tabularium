# Configuração do projeto e do repositório

> **Documento derivado.** Descreve a configuração definida em `tabularium-spec/` e nos arquivos da definição (`spec/AGENTS.md`, `scripts/spec.mjs`, `.github/workflows/`, `REVIEW.md`, `/spec-init`). Não é fonte para agentes: em caso de conflito, vale a spec. É regerado a cada PR `tabularium` pelo `/spec-propose`.

## Projeto: `spec/config.json`

Alterado só pelo `/spec-init`, que pode ser refeito a qualquer momento.

**Caminhos de código** (`codePaths`): as pastas ou arquivos do código do produto (ex.: `src/`, `app/`), casados por prefixo; só o que está neles conta como código nas regras de PR. Configuração, build, instruções de IA, infra e a própria spec ficam de fora. Lista vazia é projeto sem código, e é perguntada de novo a cada `/spec-init`; configuração sem a lista é recusada pelo script. O `/spec-init` sugere a lista a partir das pastas do repositório e a atualiza quando o código muda de lugar.

**Camadas** (`layers`): `product` sempre existe, e o projeto declara as camadas técnicas fundamentais, como `architecture`, `integration` ou `data`. Cada camada declarada exige o documento `spec/<camada>.md` e a pasta `spec/decisions/<camada>/`: o check falha se faltar um deles, e o `/spec-init` os cria. Documentos técnicos auxiliares, como telas ou guia de estilo, são opcionais e não são camadas.

**Idioma**: estrutura sempre em inglês; conteúdo no idioma configurado. O script traz embutidos os textos da verificação em `pt-BR`; outro idioma recebe os textos em `spec/locales/<idioma>.json`, com as mesmas chaves, criado pelo `/spec-init`. O script nunca é editado no projeto. Idioma novo vale para conteúdo novo; o existente só é traduzido a pedido.

## Repositório: proteção da `main`

O `/spec-init` cria os rótulos `requirement`, `bug`, `plan`, `spec-editorial`, `spec-neutral`, `spec-compatible` e `spec-incompatible`, e sugere a proteção da `main` (ruleset em Settings → Rules). Ele verifica a situação atual no repositório remoto: se a proteção já estiver habilitada, não faz nada; se estiver desabilitada, pergunta se você aceita que ele a habilite e, se não aceitar, mostra como fazê-lo à mão. A proteção tem:
- exigir PR;
- exigir o check `spec-check`, que deduz o tipo, aplica o rótulo (o workflow tem escrita nos PRs só para isso) e bloqueia quando o tipo torna o PR inválido;
- exigir branch atualizada com a `main` antes do merge;
- aprovação não é necessária: a aceitação é o merge decidido por um humano. Se a equipe exigir aprovação, descarte as aprovações quando houver commits novos.

## Repositório: revisão consultiva

Um agente comenta cada PR de proposta, sobre tipo, cascata, decisões, consistência e forma. É opcional e nunca aprova nem bloqueia: quem decide é a pessoa que integra. Você usa um, os dois ou nenhum, e o `/spec-init` pergunta qual usar:
- **Copilot code review**: ruleset da `main` com "Automatically request Copilot code review" e "Review new pushes". Segue o `REVIEW.md` e usa a assinatura do Copilot, sem secret. Como na proteção, o `/spec-init` verifica se o ruleset já existe e, se não existir, pergunta se você aceita que ele o habilite e, senão, mostra como fazê-lo.
- **Claude**: job `spec-review` do workflow, que já vem com o tabularium e roda o `/spec-impact` em modo PR nos PRs que tocam `spec/`, quando existe o secret `ANTHROPIC_API_KEY`. Só o secret falta: você o cria (Settings → Secrets and variables → Actions, ou `gh secret set`), e o `/spec-init` só orienta, sem nunca receber a chave.

Com o secret, o check também usa o Claude para classificar o tipo no caso ambíguo. Sem ele, ou em PR de fork, o caso ambíguo exige que uma pessoa aplique o rótulo de tipo.
