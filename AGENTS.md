# Processo

Este repositório mantém uma spec viva em `spec/`. As regras de formato estão em `spec/AGENTS.md`.

- A spec é a fonte da verdade do comportamento. `spec/product.md` com `✓` descreve o que o código faz. Sem `✓`, ou depois de `⇢`, está o que foi comprometido.
- Toda mudança de comportamento segue o ciclo:
  1. `/spec-impact <task>`: analisa o impacto a partir da spec.
  2. `/spec-plan <task>`: escreve o plano e registra o compromisso na spec (item sem `✓` ou `⇢`, e decisão).
  3. Implementação.
  4. `/spec-sync`: no mesmo PR do código, marca `✓`, resolve `⇢` e atualiza as decisões.
- Não implemente comportamento que não esteja comprometido na spec.
- Toda mudança entra por PR. PR que só altera a spec leva a label `spec-only`.
- Antes de abrir um PR, rode `node scripts/spec.mjs check`.
- Outras skills: `/spec-init` (estrutura e preferências), `/spec-extract` (spec a partir de código existente), `/spec-check` (drift), `/spec-reconcile` (organizar decisões).
