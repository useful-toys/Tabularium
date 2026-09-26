---
name: spec-sync
description: Sincroniza a spec com o código entregue, no mesmo PR da implementação - marca ✓ nos itens entregues e resolve as marcações ⇢. Use ao terminar a implementação de um compromisso, antes de abrir ou atualizar o PR de código.
---

# spec-sync

Regras de formato: `spec/AGENTS.md`. Os compromissos já estão na `main` (itens sem `✓` e `⇢`), vindos de um PR de proposta aceito.

## Passos
1. **O que foi entregue**: compare o diff da branch (`git diff origin/main...HEAD`) com os itens sem `✓` e os `⇢` do `spec/product.md` e, quando existem, do `spec/model.md` e dos documentos técnicos. Liste os que o código de fato implementa.
2. **Documentos com itens** (as mesmas regras nos três):
   - Item sem `✓` entregue: acrescente `✓`.
   - Item com `⇢` entregue: reescreva a linha com o texto desejado, com `✓` e sem `⇢`. Numa remoção (`⇢ (removido)`), apague a linha.
   - O que não foi entregue continua como está.
3. **Divergência**: se o código faz algo diferente do comprometido, pergunte ao usuário.
   - **Pequena** (detalhe que não muda a intenção): ajuste o texto do item e, se preciso, a decisão, com uma entrada no histórico `AAAA-MM-DD <issue ou #PR>: <o que divergiu>`. O PR precisa da label `spec-mismatch`, e a pessoa que integra avalia.
   - **Grande**: pare. A divergência vira uma nova proposta (`/spec-grill` → `/spec-propose`), aceita antes desta entrega.
4. **Mudança pequena com código**: acréscimos e ajustes que não contradizem nada e não mexem em decisões podem entrar direto neste PR, já com `✓`.
5. **Valide**: `node scripts/spec.mjs check --base origin/main`, sem a label `spec-only`, porque o PR tem código.

PR de código que não entrega nem muda comportamento (refatoração, teste) não passa por esta skill: leva a label `no-spec-change`.

## PR
- A descrição cita a issue com `Closes #N`, se houver: a issue fecha na entrega.
- Resumo para a descrição: itens marcados `✓`, `⇢` resolvidos, divergências e o que ficou comprometido.
