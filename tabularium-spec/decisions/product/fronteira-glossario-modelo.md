---
tema: Fronteira entre glossário, modelo conceitual e regras transversais
decisao: Glossário define; modelo estrutura sem implementação; transversais ficam com comportamento
carregar-quando: dúvida sobre o que vai no glossário, no modelo conceitual ou nas regras transversais, ou sobre detalhes técnicos no modelo
---
- Decisão: todo termo tem definição de uma linha no glossário, inclusive a condição quando ela é a própria definição; o modelo não redefine, só estrutura: relações com cardinalidade, estados e transições, invariantes; invariantes do domínio saem das transversais para o modelo; o modelo não traz implementação (colunas de ID, sequences, índices, colunas de relacionamento), e identificador só entra quando é conceito de negócio; tipos de domínio são definidos só no modelo, e o termo homônimo no glossário guarda só o significado; atributos só quando têm regra ou importam ao usuário; modelo e documento de produto não se referenciam; o modelo nasce do comportamento e do vocabulário do domínio, nunca do schema; decisões sobre o modelo ficam na camada de produto
- Contexto: sem fronteira clara, o mesmo conceito ganharia duas definições que divergem, e o modelo conceitual deslizaria para o modelo de dados
- Alternativas descartadas
  - Glossário inteiro no modelo: o documento de produto perde o vocabulário de que precisa
  - Entidades só no modelo, glossário só com os demais termos: definição espalhada em dois arquivos conforme o tipo
  - Condição definidora no modelo, glossário só nomeando: o glossário deixa de definir
  - Invariantes mantidas nas transversais: estrutura continua espalhada
  - Lista exaustiva de atributos: aproxima o modelo conceitual do modelo de dados
  - Camada de decisão própria para o modelo: produto e modelo seguem um fluxo só; e `model` já nomeia o modelo de dados
- Consequências
  - Ganha: uma casa por conceito e um modelo que sobrevive a trocas de tecnologia
  - Aceita: casos de fronteira entre atributo relevante e detalhe exigem julgamento

## Histórico
- 2026-09-24 #1: decisão criada
