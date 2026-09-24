---
tema: Tipos e restrições de domínio no modelo conceitual
decisao: Tipos de domínio declarados uma vez, com natureza de lista fechada, restrições de negócio e unidade; atributos citam o tipo
carregar-quando: mudança em tipos, naturezas, restrições, unidades de medida ou formato de atributos do modelo conceitual
---
- Decisão: o modelo declara numa seção de tipos, antes das entidades, cada tipo de domínio uma vez, com natureza, restrições de negócio e unidade de medida quando aplicável; a natureza vem de uma lista fechada (texto, inteiro, decimal, sim/não, data, data e hora local, instante, duração, enumeração, quantidade com unidade); tamanho, precisão e formato só entram quando são regra de negócio; o tipo é definido só no modelo, e um termo homônimo no glossário guarda só o significado
- Contexto: tipos genéricos (inteiro, texto, timestamp) não dizem o que o dado significa nem suas regras, e a mesma restrição acabaria repetida em cada entidade que usa o dado
- Alternativas descartadas
  - Tipos inline em cada atributo: repete restrições e diverge
  - Arquivo separado de tipos: mais uma leitura para um conteúdo pequeno
  - Natureza em vocabulário livre: volta aos tipos técnicos de cada autor
  - Tipos técnicos (int, float, string, timestamp): descrevem armazenamento, não significado
  - Limites técnicos sempre que conhecidos: trazem o modelo físico para o conceitual
  - Tipos também definidos no glossário: definição dupla
- Consequências
  - Ganha: restrições numa casa só e vocabulário de dados com significado de negócio
  - Aceita: nomear tipos e manter a lista de naturezas fechada

## Histórico
- 2026-09-24 #1: decisão criada
