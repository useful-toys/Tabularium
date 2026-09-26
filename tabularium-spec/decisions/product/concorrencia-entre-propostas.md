---
tema: Propostas concorrentes e defasagem
decisao: Branch atualizada antes do merge e revalidação; aprovação descartada se a equipe exigir aprovação; rediscussão sobre a base atual
carregar-quando: mudança em proteção de branch, conflitos entre propostas, rediscussão ou atualização de PR
---
- Decisão: a branch principal exige branch atualizada antes do merge; atualizar dispara de novo o check e a revisão consultiva; se a equipe exigir aprovação, a anterior é descartada; proposta rediscutida volta a rascunho e é atualizada por rebase na principal com envio forçado protegido; no rebase, a descrição do PR guia o reencaixe do diff, que é reescrito para cumprir a intenção descrita
- Contexto: uma proposta aceita antes de outra pode invalidá-la, inclusive por contradição sem conflito de texto
- Alternativas descartadas
  - Confiar só no conflito de merge: contradição semântica passa despercebida
  - Rebase guiado só pelo conflito de texto: o diff não carrega intenção e pode se aplicar limpo contradizendo a nova base
  - Sempre descartar aprovações: sem aprovação obrigatória, a orientação não tem efeito e só confunde
  - Fila de merge: mais configuração para o volume típico de propostas
  - Atualizar a proposta por merge da principal, sem reescrever: histórico mais poluído para revisar a versão final
- Consequências
  - Ganha: toda proposta é aceita sobre a spec vigente, fiel à intenção que a pessoa que integra aceitou
  - Aceita: reaprovação a cada atualização, quando a equipe exige aprovação; descrição do PR precisa explicar cada alteração

## Histórico
- 2026-09-24 #10: descarte de aprovação só quando a equipe exige aprovação; sem o termo revisor
- 2026-09-24 #7: rebase guiado pela descrição do PR
- 2026-09-24 plano-inicial: decisão criada
