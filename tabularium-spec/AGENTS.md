# tabularium-spec

Spec do próprio tabularium3, isto é, do template. Não confunda com `spec/`, que é o exemplo entregue a quem adota o template e serve para experimentar o ciclo de proposta.

- Segue as regras de formato de `spec/AGENTS.md`. Leia esse arquivo antes de editar aqui.
- A definição do tabularium é esta pasta junto com tudo o que o template entrega: `AGENTS.md`, `spec/AGENTS.md`, `REVIEW.md`, `README.md`, `DOCUMENTATION-FLOW.md`, `.gitattributes`, `scripts/`, `.claude/skills/` e `.github/`. Esses arquivos não são implementação desta spec: são parte da definição.
- Não valem aqui as regras de mudança de `spec/AGENTS.md` (proposta separada da entrega, issue, labels `requirement` e `spec-only`, `/spec-sync`). No lugar delas:
  - Toda mudança na definição entra num único PR com a label `tabularium`, sem `requirement` nem `spec-only`, e sem issue.
  - O PR já traz a spec, as decisões e todos os arquivos da definição alinhados. Todo item daqui tem `✓`; não há item comprometido nem `⇢`.
  - Se a mudança exigir adaptar o exemplo em `spec/`, a adaptação vem no mesmo PR.
  - `/spec-grill` e `/spec-ideas` amadurecem a mudança na conversa; `/spec-propose` abre o PR.
  - O merge, decidido por um humano, é aceite e entrega.
- O CI verifica esta pasta só na forma e exige a label `tabularium` no PR que a toca. Num PR com a label `tabularium`, `spec/` também é verificada só na forma e a revisão consultiva não roda.
- Comandos: `node scripts/spec.mjs build-map --spec tabularium-spec` e `node scripts/spec.mjs check --spec tabularium-spec`.
- Quem adota o template apaga esta pasta.
