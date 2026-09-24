---
tema: Proposta e entrega no mesmo PR
decisao: Separadas, salvo mudança pequena; divergência pequena na entrega com rótulo próprio
carregar-quando: mudança em regras de PR de código, mudança pequena ou divergência entre entrega e compromisso
---
- Decisão: PR de código não cria nem altera mudança comprometida e não altera decisões; mudança pequena, sem mudança comprometida nem decisão, pode vir junto com o código; divergência pequena entre entrega e compromisso é ajustada no próprio PR com o rótulo spec-mismatch e aval do revisor; divergência grande vira nova proposta
- Contexto: juntar proposta significativa e código esconde a decisão dentro de uma revisão de código
- Alternativas descartadas
  - Sempre separados: burocracia para acréscimos triviais
  - Julgamento livre do revisor: critério não verificável
  - Toda divergência vira nova proposta: trava entregas por detalhes
- Consequências
  - Ganha: decisões sempre revistas como proposta; entregas pequenas sem atrito
  - Aceita: um rótulo a mais para o caso de divergência

## Histórico
- 2026-09-24 plano-inicial: decisão criada
