---
tema: Organização da spec e das decisões por natureza
decisao: A spec se divide em camadas configuradas, cada uma com seu documento de referência e uma pasta de decisões, todas com o mesmo esquema
carregar-quando: mudança em camadas de decisão, na organização das pastas ou em decisões técnicas
---
- Decisão: a spec se divide em camadas de mesma natureza (produto, interface, arquitetura, dados, operação); cada camada tem seu documento de referência (na de produto, o documento de produto e o modelo conceitual; numa técnica, o documento técnico, quando existe) e uma pasta de decisões com seu mapa; o mesmo formato e as mesmas regras valem para todas; a camada de produto sempre existe, e o projeto configura quais camadas técnicas usa
- Contexto: a documentação de origem tinha cinco tipos de registro de decisão com nomes de pasta sem padrão
- Alternativas descartadas
  - Pastas por tipo na raiz da spec: nomes sem padrão e um nível a mais de dispersão
  - Pasta única com tipo no frontmatter: mapa único grande, carregado mesmo quando a tarefa é de uma camada só
  - Camada do modelo de dados chamada model: confunde-se com o modelo conceitual, que é do produto
  - Camada como simples grupo de decisões: cada camada também tem o seu documento, e a composição da spec depende da aplicação
- Consequências
  - Ganha: um lugar para decisões e uma regra para todas
  - Aceita: decisões na camada errada precisam ser movidas na organização

## Histórico
- 2026-09-26 #14: camada é parte da spec, com documento de referência e decisões
- 2026-09-26 #13: camada do modelo de dados chamada dados
- 2026-09-24 plano-inicial: decisão criada
