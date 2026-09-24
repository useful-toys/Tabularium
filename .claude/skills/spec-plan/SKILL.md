---
name: spec-plan
description: Transforma uma análise de impacto confirmada em plano de implementação (spec/plans/<TASK-ID>-slug.md) e registra o compromisso na spec (itens sem ✓, marcações ⇢ e decisões). Use depois de spec-impact, antes de implementar.
---

# spec-plan

Pré-requisito: a análise de `/spec-impact` confirmada pelo usuário. Regras de formato: `spec/AGENTS.md`.

## 1. Compromisso na spec
Aplique no `spec/product.md`, conforme a classificação:
- **Acréscimo**: novo item sem `✓` no lugar certo do domínio.
- **Ajuste de compromisso**: edite o item sem `✓` ou o lado direito do `⇢`.
- **Mudança significativa**: acrescente `⇢ <texto completo desejado>` ao item `✓`, na linha mais baixa afetada. Numa remoção, use `⇢ (removido)`. Nunca altere o lado esquerdo.
- **Abandono de requisito**: pergunte se ele é apagado ou se vira item de Fora de escopo com motivo.

## 2. Decisões
- Pergunte: houve escolha não óbvia, com alternativa que alguém poderia propor de novo, ou um trade-off aceito?
  - Se sim e já existe decisão sobre o tema, atualize: a decisão passa a descrever o desejado, a escolha anterior vai para "Alternativas descartadas" com o motivo, e entra uma linha no histórico.
  - Se sim e não existe decisão, crie uma. O porquê vem do usuário; nunca invente.
- Mudança significativa **sempre** exige decisão criada ou atualizada.
- Rode `node scripts/spec.mjs build-map`.

## 3. Plano
Crie `spec/plans/<TASK-ID>-<slug>.md`:
```markdown
# <TASK-ID> <título>
- Solicitação: <link ou referência no tracker>
- Impacto: <itens tocados, resumidos da análise>
- Decisões: <criadas ou atualizadas>

## Passos
1. …

## Pendências
- <perguntas ainda sem resposta; vazio quando não houver>
```
O plano é um documento de trabalho. Referências por título de requisito são aceitáveis aqui.

## 4. PR do compromisso
- Rode `node scripts/spec.mjs check`.
- Abra um PR com a label `spec-only` contendo o compromisso, as decisões e o plano. Ele pode ser mergeado antes da implementação: a `main` passa a mostrar a intenção.
- A implementação vem num PR próprio, que termina com `/spec-sync`.
