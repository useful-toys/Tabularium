---
tema: Limite dos valores de contagem no documento da coleção
decisao: Contagens gravadas de 1 a 99, validadas nas regras do Firestore por lista fechada de valores
carregar-quando: mudança no limite da contagem, nas regras de segurança do Firestore ou no formato do documento da coleção
---
- Decisão: o mapa de contagens guarda só valores inteiros de 1 a 99; zero não é gravado (chave ausente vale 0); as regras de segurança aceitam o mapa só se todos os valores estiverem nessa lista fechada
- Contexto: as regras do Firestore são a única garantia sobre o que um cliente grava, e a linguagem de regras não itera: não aplica uma condição a cada valor do mapa, só compara o conjunto de valores com uma lista escrita à mão
- Alternativas descartadas
  - Sem teto: nenhum valor do mapa poderia ser validado nas regras, e qualquer cliente forjado gravaria números arbitrários
  - Teto maior (ex.: 999): a lista de valores cresce e se aproxima do limite de 1.000 expressões avaliadas por requisição, sem ganho para quem coleciona
  - Validar só no cliente: o código do app é público e a requisição pode ser forjada
- Consequências
  - Ganha: valores sempre válidos no servidor, sem consulta extra
  - Aceita: o produto limita a contagem a 99 por figurinha

## Histórico
- 2026-09-26 organização: movida de model
- 2026-09-25 organização: migrada dos documentos de modelo de dados do app original
