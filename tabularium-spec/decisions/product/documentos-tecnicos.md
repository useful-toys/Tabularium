---
tema: Documento de referência das camadas técnicas
decisao: Um documento opcional por camada técnica, com seções livres e as mesmas regras de itens do documento de produto
carregar-quando: mudança em documentos técnicos, no documento de referência de uma camada ou em interface e arquitetura na spec
---
- Decisão: cada camada além da de produto pode ter um documento técnico, nomeado pela camada, que descreve o estado atual dela; as seções são livres; valem as regras comuns do documento de produto (autocontido, atemporal, estados de item e regras de mudança), verificadas pelo mesmo script; a organização de decisões usa esse documento como referência da camada; como o modelo conceitual ocupa o nome model, a camada do modelo de dados se chama data
- Contexto: camadas variam por projeto; estrutura rígida viraria burocracia
- Alternativas descartadas
  - Estrutura definida por camada: cada projeto tem camadas diferentes, e seções fixas viram burocracia
  - Só decisões, sem documento: a camada técnica perde o estado atual que a organização de decisões usa como referência
  - Documento obrigatório por camada: arquivo vazio em projetos que só querem as decisões
- Consequências
  - Ganha: camada técnica com estado atual verificável, sem impor forma
  - Aceita: a qualidade da estrutura depende de quem escreve; o nome model fica reservado

## Histórico
- 2026-09-26 #13: decisão criada
