---
name: spec-sync
description: Sincroniza a spec com o código entregue, no mesmo PR da implementação - marca ✓ nos itens entregues, resolve marcações ⇢, atualiza decisões e mapas e limpa resíduos temporais. Use ao terminar a implementação de uma task, antes de abrir ou atualizar o PR.
---

# spec-sync

Entrada: ID da task (o plano está em `spec/plans/<TASK-ID>-*.md`). Regras de formato: `spec/AGENTS.md`.

## Passos
1. **O que foi entregue**: leia o plano e o diff da branch (`git diff <base>...HEAD`). Liste os itens do plano que o código de fato implementa.
2. **Divergências**: compare o que foi entregue com o que estava comprometido. Se algo foi implementado de forma diferente, ou ficou de fora, pergunte ao usuário antes de mexer na spec.
   - Ficou de fora: o item continua sem `✓` (ou com `⇢`).
   - Feito diferente: ajuste o texto ao que foi entregue, com confirmação do usuário.
3. **product.md**:
   - Item sem `✓` entregue: acrescente `✓`.
   - Item com `⇢` entregue: reescreva a linha com o texto desejado, com `✓` e sem `⇢`. Numa remoção (`⇢ (removido)`), apague a linha.
   - Remova resíduos temporais ("antigo", "passa a", "removido"…) e detalhes de implementação que tenham entrado.
4. **Decisões**: acrescente ao histórico das decisões tocadas `AAAA-MM-DD <TASK-ID>: <o que foi entregue>` quando a entrega mudar algo em relação ao compromisso. Rode `node scripts/spec.mjs build-map`.
5. **Plano**: registre em `## Pendências` o que ficou de fora. O arquivo permanece em `spec/plans/` como registro da task.
6. **Valide**: `node scripts/spec.mjs check --base <base>`. Deve passar sem a label `spec-only`, porque o PR contém código.

## Saída
Resumo no chat, para colar na descrição do PR:
- itens marcados `✓`;
- `⇢` resolvidos;
- decisões atualizadas;
- divergências confirmadas;
- pendências.
