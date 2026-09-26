---
name: spec-propose
description: Registra uma proposta já esmiuçada como texto final - diff do spec/product.md (e do modelo conceitual e dos documentos técnicos) e operações nas decisões (criar, alterar, fundir, dividir, remover) -, valida a consistência da spec resultante e abre ou atualiza o PR de proposta, vinculando-o à issue. Sem entrevista; só pergunta o que bloquear. Use depois de /spec-grill e /spec-ideas.
---

# spec-propose

Etapa 3 de 3 da proposta: esmiuçar (spec-grill) → sugerir (spec-ideas) → **registrar** (spec-propose). Esta etapa sintetiza: não reabra o que já foi decidido. Pergunte só o que impedir o registro, como um porquê ausente ou um conflito novo com a `main`.

Regras de formato: `spec/AGENTS.md`. O PR traz o **texto final**, pronto para virar compromisso no merge, nunca ideias soltas.

Mudança no próprio template (`tabularium-spec/`, só no repositório do template): siga a seção "Mudança no próprio template" no lugar dos passos 3 a 5.

## 1. Fontes
- Origem issue: `gh issue view <N> --comments`, com os resumos `<!-- spec-grill -->` e `<!-- spec-ideas -->`.
- Origem PR: `gh pr view <N> --comments` e `gh pr diff <N>`, com os mesmos resumos.
- Origem texto livre: o que foi decidido nesta conversa, inclusive os resumos de spec-grill e spec-ideas apresentados nela.
- Com origem issue ou PR, some às fontes o que foi decidido nesta conversa e ainda não foi publicado.
- Se algo necessário não estiver decidido, pare e sugira `/spec-grill`.

## 2. Branch
- **Origem PR**: use a branch do PR. Rebase na `main` atual (`git fetch`, `git rebase origin/main`) e publique com `git push --force-with-lease`.
  - A descrição do PR guia o reencaixe: reescreva o diff para cumprir a intenção descrita sobre a nova base, não só para resolver conflito de texto.
  - Se a intenção não couber mais na nova base, pare e pergunte ao usuário.
- **Demais origens**: crie uma branch a partir da `main` atual.

## 3. Texto final
Nos documentos com itens (`spec/product.md` e, quando existem, `spec/model.md` e os documentos técnicos):
- Compatível: item novo sem `✓`, no domínio certo; ou edite o item sem `✓` ou o lado direito do `⇢`.
- Incompatível: `✓ <o que vale hoje> ⇢ <texto completo desejado>`, na linha mais baixa afetada; numa remoção, `⇢ (removido)`. Nunca altere o lado esquerdo.
- Editorial (redação de item `✓` sem mudar o sentido) não entra numa proposta: vai num PR próprio, só com essa mudança.
- Abandono: apague o item, ou mova-o para Fora de escopo com motivo, conforme decidido.
- Glossário, modelo conceitual, transversais, não funcionais e fora de escopo afetados pela cascata.

Nas decisões:
- **Criar**: arquivo novo, com o porquê e as alternativas descartadas (as do resumo `spec-ideas` entram aqui).
- **Alterar**: a decisão passa a descrever o desejado, a escolha anterior vai para "Alternativas descartadas" com o motivo, e o histórico ganha `AAAA-MM-DD <issue ou #PR>: <o que mudou>`.
- **Fundir, dividir, mover, remover**: como em `spec/AGENTS.md`, com a entrada de organização no histórico.
- Mudança incompatível **sempre** cria ou altera uma decisão. Decisão nova de mudança compatível não pode violar decisão vigente.

Depois rode `node scripts/spec.mjs build-map` e `node scripts/spec.mjs check --base origin/main`, e corrija o que falhar. O `check` informa o tipo que o diff prova.

## 3a. Consistência
Antes de criar ou atualizar o PR, valide a spec resultante: o diff aplicado sobre a `main` atual. Confronte os itens tocados e a cascata deles com o `product.md`, o `model.md`, os documentos técnicos e as decisões relevantes pelo mapa, procurando:
- contradição entre itens, entre documentos ou com decisões vigentes (inclusive requisito × fora de escopo);
- conceito repetido em duas casas;
- termo usado fora do sentido do glossário, sinônimo não canônico ou termo de domínio sem definição;
- lacuna de cascata: item que depende de outro inexistente ou removido.

Achou qualquer inconsistência, inclusive uma que já existia na `main`: não publique. Relate os achados e sugira voltar ao `/spec-grill`; inconsistência preexistente fora da proposta é corrigida antes, num PR editorial ou pelo `/spec-reconcile`. Numa proposta defasada, esta validação também confere o reencaixe.

## 4. PR
- Commit e push. O PR nunca inclui código e não leva label de tipo: o CI deduz o tipo (`spec-compatible` ou `spec-incompatible`) e aplica a label. Mudança compatível pode ir direto no PR de implementação, sem proposta separada.
- **Draft**: PR novo abre em draft (`gh pr create --draft`). O agente consultivo do CI comenta. O autor trata os achados e marca como pronto (`gh pr ready`). PR existente mantém o estado em que está.
- Descrição do PR:
```markdown
Proposta de requisito. Refs #<issue>

## O que muda
- <item: antes → depois, e por quê; uma linha cada>

## Decisões
- <arquivo: criada | alterada | fundida | dividida | removida — resumo e por quê>

## Cascata
- <itens afetados junto>
```
  Sem issue, o resumo da conversa (esmiuçado e sugestões) vai também na descrição.
- **Origem PR**: atualize o título e a descrição (`gh pr edit`) e comente o que mudou nesta revisão, inclusive a defasagem resolvida.
- **Origem issue**: comente na issue as decisões adicionais tomadas desde o último resumo e o link do PR. O PR cita a issue com `Refs #N`, não `Closes`: a issue só fecha na entrega.

## 5. Fechamento
Informe o link do PR. A validação consultiva (`spec-impact` em modo PR) roda no CI e comenta no PR. Quem decide é a pessoa que integra.

## Mudança no próprio template
A definição do template é `tabularium-spec/` junto com tudo o que o template entrega. Regras em `tabularium-spec/AGENTS.md`.
- Branch a partir da `main` atual. Nada de issue. Nenhum arquivo muda durante `/spec-grill` e `/spec-ideas`: tudo é escrito aqui.
- No mesmo PR, nesta ordem:
  1. **Você**, que tem as decisões e os porquês da conversa: `tabularium-spec/` (documentos e decisões) e os arquivos da definição alinhados a ela: instruções, skills, script e testes, workflow. Se a mudança exigir, adapte também o exemplo em `spec/`. Todo item de `tabularium-spec/` fica com `✓`; sem item comprometido e sem `⇢`. Decisões seguem as mesmas operações do passo 3.
  2. **Revisão por subagente**, com contexto limpo: ele lê só `tabularium-spec/` e o diff da branch e aponta instrução, skill, script ou workflow desalinhado com a spec, ou inválido. Corrija os achados, ou leve ao usuário os que pedirem decisão, antes de seguir.
  3. **Documentos derivados por subagentes, em paralelo**, cada um lendo só os arquivos finais, nunca a conversa:
     - `README.md`: o que é e os diferenciais, conforme `tabularium-spec/product.md`; o fluxo resumido; cada skill em uma linha; as partes operacionais (estrutura, adoção, comandos) atualizadas;
     - `tabularium-docs/spec-flow.md`: o fluxo completo, regerado a partir de `tabularium-spec/` e do comportamento das skills, com o cabeçalho de documento derivado.
  - Sem subagentes disponíveis, faça os passos 2 e 3 em sequência, relendo só os arquivos finais.
- Valide a consistência (passo 3a) sobre `tabularium-spec/`, e rode `node scripts/spec.mjs build-map` e `check`, sem `--base`, nas duas specs (`--spec tabularium-spec` e a padrão), e `node --test scripts/spec.test.mjs` se o script mudou.
- PR pronto (sem draft), só com a label `tabularium`: sem label de tipo. A descrição lista o que muda na spec do template, as decisões e os arquivos da definição alterados.
- O merge, decidido por um humano, é aceite e entrega. Não há revisão consultiva nem `/spec-sync`.
