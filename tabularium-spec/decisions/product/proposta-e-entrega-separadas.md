---
tema: Proposta e entrega no mesmo PR
decisao: Separadas para mudança incompatível; mudança compatível pode vir com o código, inclusive com decisão nova; divergência pequena na entrega é mudança incompatível no próprio PR
carregar-quando: mudança em regras de PR de código, mudança compatível junto com código ou divergência entre entrega e compromisso
---
- Decisão: mudança incompatível entra por proposta antes do código; mudança compatível pode vir junto com o código, inclusive criando decisão, desde que a decisão nova não viole decisão vigente; divergência pequena entre entrega e compromisso é ajustada no próprio PR como mudança incompatível, com decisão ajustada e aval da pessoa que integra; divergência grande vira nova proposta
- Contexto: juntar mudança incompatível e código esconde a virada dentro de uma revisão de código; mudança que não contradiz nada não precisa desse cuidado
- Alternativas descartadas
  - Mudança pequena, sem seta nem decisão, como única exceção: decisão nova que não viola as vigentes não esconde nenhuma virada, e a exigência só criava atrito
  - Sempre separados: burocracia para acréscimos triviais
  - Julgamento livre de quem integra: critério não verificável
  - Toda divergência vira nova proposta: trava entregas por detalhes
  - Rótulo próprio para a divergência: o tipo incompatível, deduzido pelo CI, já a identifica
- Consequências
  - Ganha: viradas sempre revistas como proposta; entregas com requisito novo sem atrito
  - Aceita: a decisão nova de uma mudança compatível só é conferida contra as vigentes pela revisão

## Histórico
- 2026-09-26 #14: mudança compatível com decisão nova junto com o código; divergência como mudança incompatível, sem rótulo próprio
- 2026-09-24 #10: sem o termo revisor
- 2026-09-24 plano-inicial: decisão criada
