---
tema: Organização das decisões por natureza
decisao: Uma pasta por camada sob a pasta de decisões, todas com o mesmo esquema
carregar-quando: mudança em camadas de decisão, na organização das pastas ou em decisões técnicas
---
- Decisão: decisões de produto, interface, arquitetura, dados e operação ficam em camadas separadas, cada uma com seu mapa; o mesmo formato e as mesmas regras valem para todas; o projeto escolhe quais camadas usa
- Contexto: a documentação de origem tinha cinco tipos de registro de decisão com nomes de pasta sem padrão
- Alternativas descartadas
  - Pastas por tipo na raiz da spec: nomes sem padrão e um nível a mais de dispersão
  - Pasta única com tipo no frontmatter: mapa único grande, carregado mesmo quando a tarefa é de uma camada só
  - Camada do modelo de dados chamada model: confunde-se com o modelo conceitual, que é do produto
- Consequências
  - Ganha: um lugar para decisões e uma regra para todas
  - Aceita: decisões na camada errada precisam ser movidas na organização

## Histórico
- 2026-09-26 #13: camada do modelo de dados chamada dados
- 2026-09-24 plano-inicial: decisão criada
