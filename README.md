# tabularium3: template de spec viva

Conjunto instalável de regras, instruções, verificação e skills que mantém, junto do código de um repositório, uma **especificação viva** do produto, e um processo apoiado por IA para evoluí-la sem que ela se contradiga. Cada relato é triado contra a spec; a ideia de requisito é esmiuçada e proposta até encaixar na spec vigente, é reencaixada se a `main` mudar antes do aceite, é aceita no merge e é entregue junto com o código. Serve a equipes que desenvolvem com agentes de IA e querem que spec e código nunca divirjam, nem a spec de si mesma.

## Diferenciais

- A spec cabe no contexto de um agente: arquivos densos, lidos de uma vez ou sob demanda.
- A spec nunca mente sobre o que está implementado: cada item diz se é realidade ou compromisso.
- A spec não se contradiz: nenhuma proposta é publicada sobre uma spec inconsistente.
- Funciona com qualquer agente que leia `AGENTS.md`, sem ferramenta proprietária de agente.
- Verificação automática no PR, sem instalar nada além do Node.
- O processo se apoia no fluxo git e GitHub que a equipe já usa: issue, PR, label e merge.

## O fluxo

```mermaid
flowchart LR
  ID["Ideia"] --> C
  IS["Issue genérica"] --> C
  RI["Requirement issue<br/>corpo: entendimento atual<br/>comentários: histórico"] --> C
  C(("Conversa<br/>triagem · entendimento · ideias<br/>/spec-grill · /spec-ideas"))
  C -->|"/spec-issue, a pedido"| RI
  C -->|"não é requirement"| B["Bug issue<br/>(sugerida ao usuário)<br/>hotfix parte dela"]
  C -->|"já coberta pela spec"| X["Descartada"]
  C --> G{"Portão /spec-propose<br/>maduro e consistente<br/>com a spec atual?"}
  G -->|"não: o que falta"| C
  G -->|sim| P["PR draft"]
  P --> R["CI: tipo + check bloqueante<br/>revisão consultiva"] --> A["Merge decidido por humano<br/>= compromisso"] --> E["Código + /spec-sync<br/>Closes #issue"]
```

```mermaid
flowchart LR
  PL["Plan issue (rótulo plan)"] --> Z["Recusada: planos ainda não são tratados"]
```

- A conversa é o centro do ciclo. Entram nela uma ideia, uma issue genérica (aberta por uma pessoa no formulário único `relato`; o tipo escolhido é só um palpite e nenhum rótulo é aplicado) ou uma requirement issue já triada (`/spec-grill #issue`). Sem os rótulos `requirement`, `bug` ou `plan`, a issue está sem triagem, e sem conversa continua assim, sem automação.
- A triagem é o primeiro passo da conversa, sem etapa própria, e termina em uma de três saídas. Pede spec nova, alterada ou removida, ou a spec é omissa: requirement issue (rótulo `requirement`), que segue o ciclo. Contradiz item `✓`: bug issue (rótulo `bug`); a conversa a sugere, aplicando o rótulo à issue de origem ou criando a issue se a origem é uma ideia, e o hotfix, PR de código `spec-neutral` com `Closes #N`, parte dela, fora do ciclo. Já coberta por item da spec, inclusive comprometido e ainda não implementado: descartada, com a issue de origem fechada por comentário que aponta o item, ou só abandonada se a origem é uma ideia. O `/spec-impact` sugere, o `/spec-grill` resolve o que ficou incerto, e uma pessoa decide: rótulo aplicado por pessoa vence. Issue com rótulo `plan` é recusada, até o tratamento de planos ser definido.
- A ideia amadurece na conversa; vira requirement issue apenas a pedido (`/spec-issue`), como memória entre sessões, e a issue volta à conversa quando a ideia é retomada: o corpo é o entendimento mais recente, os comentários são o histórico resumido e o primeiro deles, `Solicitação original`, guarda o texto de quem abriu a issue.
- O `/spec-propose` é um portão: só abre a proposta se a ideia estiver madura o bastante para encaixar na spec vigente e a spec resultante for consistente; senão devolve à conversa com o que falta. A proposta traz o texto final da spec e das decisões, sem código. Nasce em draft; o autor a libera depois de tratar a revisão consultiva.
- O CI deduz o tipo, aplica a label e bloqueia PR inválido; a revisão por agente só comenta. Não há aprovação formal obrigatória: qualquer pessoa com permissão de merge aceita.
- A entrega implementa, marca `✓` e resolve `⇢` no mesmo PR do código, que fecha a issue. Mudança compatível pode vir direto com o código.

### Estado dos itens

Vale em `spec/product.md`, `spec/model.md` e nos documentos técnicos, sempre descrevendo a `main`:

| Item | Estado |
|---|---|
| `- ✓ texto` | implementado: o código faz o que ele diz |
| `- texto` | comprometido: decidido, ainda não implementado |
| `- ✓ hoje ⇢ desejado` | redefinido: vale `hoje` até a entrega de `desejado`; numa remoção, `⇢ (removido)` |

### Tipos de mudança e labels

Todo PR tem um tipo, pelo que faz com a spec vigente; com vários, recebe o maior. O CI deduz o tipo mínimo pelo diff e aplica a label. Quando o diff não mostra se o sentido mudou, a IA julga e vale o maior entre o mínimo e o julgado. Label aplicada por uma pessoa vence, e o CI nunca a troca; sem IA disponível, o caso ambíguo exige label de uma pessoa.

| Label | Uso |
|---|---|
| `spec-editorial` | só texto da spec, sem mudar sentido; único tipo que altera ou marca item `✓` sem código |
| `spec-neutral` | não altera o sentido de nenhum requisito: código sem mudança na spec, ou entrega de compromisso |
| `spec-compatible` | cria requisito, altera item sem `✓` ou o lado direito de um `⇢`, ou cria decisão, sem contradizer item nem decisão vigente |
| `spec-incompatible` | altera o sentido de item `✓`, contradiz item ou vai contra decisão; exige `⇢` e decisão criada ou alterada no mesmo PR |
| `requirement` | issue triada com ideia de requisito, que segue o ciclo de proposta; aplicada só pela triagem |
| `bug` | issue triada como divergência do código em relação à spec, corrigida por hotfix; aplicada só pela triagem |
| `plan` | reconhecida só para recusa: a issue não segue o ciclo até o tratamento de planos ser definido |
| `tabularium` | só neste repositório: PR que muda a definição do próprio tabularium, sem label de tipo |

## Skills

Em `.claude/skills/`. Todas seguem `spec/AGENTS.md`.

- `/spec-init`: depois do INSTALL, cria a estrutura, grava camadas, idioma e caminhos de código em `spec/config.json`, adapta a spec ao formato de uma versão nova e cria as labels; reexecutável.
- `/spec-extract`: preenche `product.md`, `model.md` e decisões de produto a partir de código, testes e documentação existente; `✓` só com evidência, perguntas durante a extração.
- `/spec-grill`: faz a triagem (requirement issue, bug issue ou descarte) e esmiúça a ideia (texto, issue ou proposta) contra glossário, modelo, transversais, decisões e código, em rodadas de perguntas; só na conversa.
- `/spec-ideas`: sugere alternativas, cenários de borda, cascata esquecida e recortes, para aceitar ou descartar com motivo; só na conversa.
- `/spec-issue`: a pedido, leva o entendimento da conversa para uma requirement issue, nova ou existente: reescreve o corpo, comenta o resumo da rodada e, no primeiro toque, guarda o original como comentário.
- `/spec-propose`: portão: só se a ideia estiver madura e consistente com a spec vigente escreve o texto final e as operações nas decisões, valida a consistência da spec resultante e abre ou atualiza o PR de proposta em draft, reencaixando uma proposta defasada.
- `/spec-impact`: triagem sugerida (requirement issue, bug issue ou descarte) e impacto de uma issue ou texto; revisão consultiva de um PR de proposta; classificação do tipo no caso ambíguo, para o CI. Nunca aprova nem reprova.
- `/spec-sync`: no PR do código, marca `✓` no entregue, reescreve os `⇢` entregues e trata divergências entre entrega e compromisso.
- `/spec-check`: roda o check e revisa o drift entre spec e código, com achados e evidências; só verifica.
- `/spec-reconcile`: restaura a consistência da spec consigo mesma, uma camada por vez, e organiza as decisões; nada muda sem aprovação.

## Estrutura

O que o INSTALL leva ao projeto, listado em `tabularium.manifest`, mais o bloco do processo no `AGENTS.md`:

```
AGENTS.md (bloco)                  processo, entre <!-- tabularium:begin --> e <!-- tabularium:end -->
spec/AGENTS.md                     regras de formato e de mudança da spec
REVIEW.md                          instruções para agentes de revisão (ex.: Copilot code review)
scripts/spec.mjs                   build-map, classify e check (Node, sem dependências)
.github/workflows/spec-check.yml   tipo, check bloqueante e revisão consultiva por agente
.github/ISSUE_TEMPLATE/relato.yml  formulário único de issue (palpite e relato obrigatórios; não aplica rótulo)
.claude/skills/                    as dez skills, com os esqueletos de product.md e model.md do /spec-init
.tabularium                        gerado pelo INSTALL: origem, versão e arquivos instalados
```

O que é do projeto, criado pelo `/spec-init` e pelo trabalho na spec, e que o INSTALL nunca toca:

```
spec/product.md                    o que o produto é e como se comporta
spec/model.md                      modelo conceitual (opcional): tipos e entidades do domínio
spec/<camada>.md                   documento técnico de uma camada (opcional)
spec/config.json                   preferências: camadas, idioma, caminhos de código (codePaths)
spec/locales/<idioma>.json         textos da verificação para idioma não embutido no script (opcional)
spec/decisions/<camada>/           uma decisão vigente por arquivo + mapa gerado (README.md)
```

O que fica só neste repositório e nunca chega aos projetos:

```
tabularium-spec/                   spec do próprio tabularium (requisitos e decisões que o moldaram)
tabularium-docs/                   documentos derivados, como spec-flow.md (o fluxo com o porquê de cada etapa)
README.md                          este arquivo
scripts/spec.test.mjs, scripts/spec-fixtures/   testes do script
.github/workflows/tabularium.yml   CI da definição do tabularium
INSTALL.sh, INSTALL.ps1, tabularium.manifest    instalação
.gitattributes                     finais de linha LF (cada projeto mantém o seu)
```

## Instalar e atualizar

Na raiz do repositório do projeto, com git:

```bash
curl -fsSL https://raw.githubusercontent.com/useful-toys/Tabularium/main/INSTALL.sh | sh
```

```powershell
irm https://raw.githubusercontent.com/useful-toys/Tabularium/main/INSTALL.ps1 | iex
```

O mesmo comando instala e atualiza:
- baixa a última tag `vX.Y.Z` publicada, ou a pedida, e copia os arquivos do manifesto dela, sobrescrevendo;
- apaga os arquivos da instalação anterior que saíram do manifesto;
- no `AGENTS.md`: sem ele, cria-o só com o bloco do processo; com ele, troca só o bloco entre os marcadores, ou o insere no início se não houver, sem tocar o resto;
- grava em `.tabularium` a origem, a versão e os arquivos instalados;
- recusa instalar enquanto existir `CLAUDE.md` na raiz ou em `spec/`: migre o conteúdo para `AGENTS.md` à mão e apague-o;
- recusa voltar para versão menor que a instalada;
- nunca faz commit.

Variáveis opcionais (no PowerShell, `$env:NOME = 'valor'` antes do comando):

| Variável | Efeito |
|---|---|
| `TABULARIUM_VERSION=v1.2.0` | tag a instalar (padrão: a última `vX.Y.Z`) |
| `TABULARIUM_SOURCE=<url git>` | repositório de origem (padrão: o do `.tabularium`, ou o oficial) |
| `TABULARIUM_ALLOW_DOWNGRADE=1` | permite instalar tag menor que a instalada |

Depois, rode `/spec-init`: na adoção, cria a estrutura e as preferências; numa atualização, adapta a spec ao formato novo sem mudar o sentido de nenhum item (o que mudaria sentido vira proposta). Se o repositório já tiver código, siga com `/spec-extract`. Revise o diff e leve tudo, instalação e adaptação, num PR.

Customizações nos arquivos do tabularium se perdem a cada atualização; o que é do projeto fica fora deles.

### Versões

Tags `vX.Y.Z`, criadas à mão por uma pessoa quando decide publicar um lote de mudanças; sem tag, o INSTALL não tem o que instalar. A versão maior muda quando a spec dos projetos precisa ser adaptada ao formato, e o INSTALL avisa ao cruzá-la.

## Configuração

Em `spec/config.json`, alterado só pelo `/spec-init`, que pode ser refeito a qualquer momento.

**Caminhos de código** (`codePaths`): as pastas ou arquivos do código do produto (ex.: `src/`, `app/`), casados por prefixo; só o que está neles conta como código nas regras de PR. Configuração, build, instruções de IA, infra e a própria spec ficam de fora. Lista vazia é projeto sem código, como um projeto sem código, e é perguntada de novo a cada `/spec-init`; configuração sem a lista é recusada pelo script. O `/spec-init` sugere a lista a partir das pastas do repositório e a atualiza quando o código muda de lugar.

**Idioma**: estrutura sempre em inglês; conteúdo no idioma configurado. O script traz embutidos os textos da verificação em `pt-BR`; outro idioma recebe os textos em `spec/locales/<idioma>.json`, com as mesmas chaves, criado pelo `/spec-init`. O script nunca é editado no projeto. Idioma novo vale para conteúdo novo; o existente só é traduzido a pedido.

## Proteção da `main` e revisão consultiva

O `/spec-init` cria as labels `requirement`, `bug`, `spec-editorial`, `spec-neutral`, `spec-compatible` e `spec-incompatible`, e orienta a proteção da `main` (Settings → Rules), que você configura:
- exigir PR;
- exigir o check `spec-check`, que deduz o tipo, aplica a label (o workflow tem escrita nos PRs só para isso) e bloqueia quando o tipo torna o PR inválido;
- exigir branch atualizada com a `main` antes do merge;
- aprovação não é necessária: a aceitação é o merge decidido por um humano. Se a equipe exigir aprovação, descarte as aprovações quando houver commits novos.

Revisão consultiva por agente, opcional e nunca bloqueante; um, os dois ou nenhum:
- **Copilot code review**: ruleset da `main` com "Automatically request Copilot code review" e "Review new pushes". Segue o `REVIEW.md` e usa a assinatura do Copilot, sem secret.
- **Claude**: job `spec-review` do workflow, que roda o `/spec-impact` em modo PR nos PRs que tocam `spec/`, quando existe o secret `ANTHROPIC_API_KEY`.

Com o secret, o check também usa o Claude para classificar o tipo no caso ambíguo. Sem ele, ou em PR de fork, o caso ambíguo exige que uma pessoa aplique a label de tipo.

## Comandos

```bash
node scripts/spec.mjs build-map                      # regera os mapas de decisões
node scripts/spec.mjs check                          # formato, mapas, ⇢ e compromissos em aberto
node scripts/spec.mjs check --base origin/main       # + tipo da mudança e regras de PR
node scripts/spec.mjs classify --base origin/main    # tipo mínimo e pontos ambíguos, em JSON
node --test scripts/spec.test.mjs                    # testes do script (só neste repositório)
```

Todos os comandos do script aceitam `--spec <pasta>` (padrão: `spec`), como `--spec tabularium-spec`. No CI, o `check` roda também com `--labels <label>` e `--require-type`.

O `check` valida o formato do `product.md`, do `model.md` (inclusive se todo nome em destaque é termo do glossário ou tipo declarado), dos documentos técnicos e das decisões; verifica se os mapas estão atualizados; avisa sobre possíveis referências temporais, termos de implementação no modelo e `CLAUDE.md` presente; e lista os `⇢` e os itens comprometidos em aberto. Com `--base`, deduz o tipo da mudança e aplica as regras de PR:
- label de tipo abaixo do mínimo do diff, ou mais de uma, é erro; com `--require-type`, o caso ambíguo sem label também;
- resolver `⇢` exige código;
- alterar ou marcar `✓` sem código só em PR `spec-editorial`;
- criar, alterar ou desfazer `⇢`, e toda mudança incompatível, exigem decisão criada ou alterada.

## Mudar o próprio tabularium

A definição do tabularium é `tabularium-spec/` junto com os arquivos deste repositório. Muda por PR único com a label `tabularium`, sem issue, sem label de tipo e sem entrega separada, já com spec, decisões, arquivos, `README.md` e `tabularium-docs/` alinhados; o CI em `tabularium.yml` exige a label em todo PR que toca a definição. Detalhes em `tabularium-spec/AGENTS.md`.

## Instruções para agentes

As instruções ficam só em `AGENTS.md` (processo na raiz, regras de formato em `spec/AGENTS.md`). Não crie `CLAUDE.md`: quando ele existe, o Claude Code ignora os `AGENTS.md`.
