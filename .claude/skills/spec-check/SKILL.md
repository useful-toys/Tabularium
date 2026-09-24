---
name: spec-check
description: Verifica a saúde da spec viva - roda o check determinístico (scripts/spec.mjs) e faz uma revisão semântica de drift entre spec/product.md e o comportamento do código. Use antes de abrir um PR, ao revisar um PR, ou quando suspeitar que a spec não reflete o código.
---

# spec-check

Regras de formato: `spec/AGENTS.md`. Esta skill só verifica. Correções acontecem depois de o usuário aprovar.

## 1. Check determinístico
Rode `node scripts/spec.mjs check`, ou `--base <ref>` num PR. Relate erros, avisos e os `⇢` em aberto.

## 2. Revisão semântica
Escolha o escopo com o usuário: a spec inteira, um domínio, ou os itens tocados pelo PR atual. Para cada item do escopo:
- **`✓` sem código**: procure a implementação. Não encontrou: achado.
- **Código sem item**: comportamento observável relevante que o `product.md` não descreve.
- **Divergência**: o código faz diferente do que o item `✓` afirma.
- **Forma**: implementação, tela ou navegação no `product.md`; conceito repetido em duas seções; justificativa técnica.
- **Compromissos parados**: itens sem `✓` e `⇢` listados pelo check. Pergunte ao usuário se continuam valendo. Desistir é um PR que remove o item (ou o move para Fora de escopo) e desfaz o `⇢`, com a decisão ajustada.

## Saída
Achados numerados, cada um com:
- tipo;
- local (`product.md` › seção › item);
- evidência (arquivo do código);
- correção sugerida.

Se houver inconsistência entre decisões e `product.md`, sugira `/spec-reconcile`.
