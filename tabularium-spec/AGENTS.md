# tabularium-spec

Spec do próprio tabularium3, isto é, do template. Não confunda com `spec/`, que é o exemplo entregue a quem adota o template e serve para experimentar o ciclo de proposta.

- Segue as regras de formato de `spec/AGENTS.md`. Leia esse arquivo antes de editar aqui.
- A definição do tabularium é esta pasta junto com tudo o que o template entrega: `AGENTS.md`, `spec/AGENTS.md`, `REVIEW.md`, `README.md`, `tabularium-docs/`, `.gitattributes`, `scripts/`, `.claude/skills/` e `.github/`. Esses arquivos não são implementação desta spec: são parte da definição.
- Não valem aqui as regras de mudança de `spec/AGENTS.md` (proposta separada da entrega, issue, tipo de mudança e label de tipo, `/spec-sync`). No lugar delas:
  - Toda mudança na definição entra num único PR com a label `tabularium`, sem label de tipo, e sem issue.
  - O PR já traz a spec, as decisões e todos os arquivos da definição alinhados. Todo item daqui tem `✓`; não há item comprometido nem `⇢`.
  - Se a mudança exigir adaptar o exemplo em `spec/`, a adaptação vem no mesmo PR.
  - `/spec-grill` e `/spec-ideas` amadurecem a mudança na conversa; `/spec-propose` valida a consistência de `tabularium-spec/` e abre o PR.
  - O merge, decidido por um humano, é aceite e entrega.
- O CI verifica esta pasta só na forma e exige a label `tabularium` no PR que toca esta pasta ou `tabularium-docs/`. Num PR com a label `tabularium`, `spec/` também é verificada só na forma, o tipo não é classificado e a revisão consultiva não roda.
- Comandos: `node scripts/spec.mjs build-map --spec tabularium-spec` e `node scripts/spec.mjs check --spec tabularium-spec`.
- `tabularium-docs/` guarda os documentos derivados da definição, como `spec-flow.md`. Eles e o `README.md` são regerados a cada PR `tabularium` a partir dos arquivos finais, conforme `/spec-propose`, e nunca são fonte.
- Quem adota o template apaga esta pasta e `tabularium-docs/`.
