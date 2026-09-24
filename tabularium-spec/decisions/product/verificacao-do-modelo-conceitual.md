---
tema: Verificação automática do modelo conceitual
decisao: Mesmas regras do documento de produto, erro para entidade fora do glossário e aviso para termos de implementação
carregar-quando: mudança no check do modelo conceitual ou na consistência entre modelo e glossário
---
- Decisão: quando o modelo existe, o check aplica as mesmas regras do documento de produto (sem links nem referências, marcas, avisos temporais, regras de PR); acusa erro se uma entidade em negrito no modelo não existir no glossário; avisa sobre termos de implementação (id, fk, chave, coluna, tabela, índice, sequence); termo do glossário fora do modelo é permitido e avaliado caso a caso pela revisão consultiva e pela organização de decisões
- Contexto: nem todo termo do glossário é entidade (estados derivados, atributos, sistemas externos), mas toda entidade precisa de definição
- Alternativas descartadas
  - Exigir correspondência nos dois sentidos: falso positivo para termos que não são entidades
  - Consistência só como aviso: o modelo poderia inventar vocabulário
  - Sem aviso de termos técnicos: a fronteira com o modelo de dados dependeria só da revisão
- Consequências
  - Ganha: o modelo nunca usa vocabulário indefinido
  - Aceita: termo que deveria virar entidade depende de revisão humana

## Histórico
- 2026-09-24 #1: decisão criada
