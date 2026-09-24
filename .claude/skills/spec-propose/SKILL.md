---
name: spec-propose
description: Registra uma proposta já esmiuçada como texto final - diff do spec/product.md e operações nas decisões (criar, alterar, fundir, dividir, remover) - e abre ou atualiza o PR de proposta, vinculando-o à issue. Sem entrevista; só pergunta o que bloquear. Use depois de /spec-grill e /spec-ideas.
---

# spec-propose

Etapa 3 de 3 da proposta: esmiuçar (spec-grill) → sugerir (spec-ideas) → **registrar** (spec-propose). Esta etapa sintetiza: não reabra o que já foi decidido. Pergunte só o que impedir o registro, como um porquê ausente ou um conflito novo com a `main`.

Regras de formato: `spec/AGENTS.md`. O PR traz o **texto final**, pronto para virar compromisso no merge, nunca ideias soltas.

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
No `spec/product.md`:
- Acréscimo: item novo sem `✓`, no domínio certo.
- Ajuste de compromisso: edite o item sem `✓` ou o lado direito do `⇢`.
- Mudança significativa: `✓ <o que vale hoje> ⇢ <texto completo desejado>`, na linha mais baixa afetada; numa remoção, `⇢ (removido)`. Nunca altere o lado esquerdo.
- Abandono: apague o item, ou mova-o para Fora de escopo com motivo, conforme decidido.
- Glossário, transversais, não funcionais e fora de escopo afetados pela cascata.

Nas decisões:
- **Criar**: arquivo novo, com o porquê e as alternativas descartadas (as do resumo `spec-ideas` entram aqui).
- **Alterar**: a decisão passa a descrever o desejado, a escolha anterior vai para "Alternativas descartadas" com o motivo, e o histórico ganha `AAAA-MM-DD <issue ou #PR>: <o que mudou>`.
- **Fundir, dividir, mover, remover**: como em `spec/AGENTS.md`, com a entrada de organização no histórico.
- Mudança significativa **sempre** cria ou altera uma decisão.

Depois rode `node scripts/spec.mjs build-map` e `node scripts/spec.mjs check --base origin/main`, e corrija o que falhar.

## 4. PR
- Commit e push. O PR leva as labels `requirement` e `spec-only` e nunca inclui código. Proposta com código só vale para mudança pequena, feita direto no PR de implementação.
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
Informe o link do PR. A validação consultiva (`spec-impact` em modo PR) roda no CI e comenta no PR. Quem decide é o revisor.
