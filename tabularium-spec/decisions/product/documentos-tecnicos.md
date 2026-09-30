---
tema: Documento de referência das camadas técnicas
decisao: Um documento obrigatório por camada técnica fundamental declarada, com seções livres e as mesmas regras de itens do documento de produto; documentos auxiliares são opcionais
carregar-quando: mudança em documentos técnicos, no documento de referência de uma camada ou em arquitetura e integração na spec
---
- Decisão: cada camada declarada além da de produto tem um documento técnico fundamental, obrigatório, nomeado pela camada, que descreve o estado atual dela; a camada é fundamental quando a alteração dela depois da adoção causa grande impacto, e cada projeto define as suas; as seções são livres; valem as regras comuns do documento de produto (autocontido, atemporal, estados de item e regras de mudança), verificadas pelo mesmo script, que falha quando falta o documento de uma camada declarada; documentos técnicos auxiliares descrevem questões complementares, de menor impacto e independentes das camadas fundamentais, e são opcionais; a organização de decisões usa o documento fundamental como referência da camada; como o modelo conceitual ocupa o nome model, a camada do modelo de dados se chama data
- Contexto: camadas variam por projeto; estrutura rígida viraria burocracia; uma camada declarada sem documento deixa a organização de decisões sem estado atual de referência, e nenhum projeto usa o tabularium ainda, o que dispensa período de transição
- Alternativas descartadas
  - Estrutura definida por camada: cada projeto tem camadas diferentes, e seções fixas viram burocracia
  - Só decisões, sem documento: a camada técnica perde o estado atual que a organização de decisões usa como referência
  - Documento opcional por camada: a camada declarada ficava sem referência, e a verificação não podia exigir nada dela; o custo do arquivo vazio some porque só se declara camada que importa
  - Aviso em vez de erro quando falta o documento: só faria sentido com projetos já adotando o tabularium
- Consequências
  - Ganha: camada técnica com estado atual verificável, sem impor forma
  - Aceita: a qualidade da estrutura depende de quem escreve; o nome model fica reservado; declarar uma camada obriga a escrever o documento

## Histórico
- 2026-09-30 #21: documento da camada declarada passa a ser obrigatório; auxiliares opcionais; a verificação exige o documento
- 2026-09-26 #13: decisão criada
