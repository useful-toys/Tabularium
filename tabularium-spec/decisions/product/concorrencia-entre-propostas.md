---
tema: Propostas concorrentes e defasagem
decisao: Branch atualizada antes do merge, revalidação e aprovação descartada; rediscussão sobre a base atual
carregar-quando: mudança em proteção de branch, conflitos entre propostas, rediscussão ou atualização de PR
---
- Decisão: a branch principal exige branch atualizada antes do merge; atualizar dispara de novo o check e a revisão consultiva, e a aprovação anterior é descartada; proposta rediscutida volta a rascunho e é atualizada por rebase na principal com envio forçado protegido
- Contexto: uma proposta aceita antes de outra pode invalidá-la, inclusive por contradição sem conflito de texto
- Alternativas descartadas
  - Confiar só no conflito de merge: contradição semântica passa despercebida
  - Fila de merge: mais configuração para o volume típico de propostas
  - Atualizar a proposta por merge da principal, sem reescrever: histórico mais poluído para revisar a versão final
- Consequências
  - Ganha: toda proposta é aceita sobre a spec vigente
  - Aceita: reaprovação a cada atualização

## Histórico
- 2026-09-24 plano-inicial: decisão criada
