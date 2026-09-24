---
tema: Efeito da importação
decisao: Importar substitui a coleção inteira e zera o desfazer
carregar-quando: mudança em importação, exportação ou desfazer
---
- Decisão: importar um arquivo substitui toda a coleção, após confirmação; o histórico de desfazer é descartado
- Contexto: a importação existe para restaurar ou migrar uma coleção exportada, não para combinar coleções
- Alternativas descartadas
  - Somar contagens do arquivo à coleção atual: resultado ambíguo e irreversível para quem só quer restaurar
  - Manter o desfazer após importar: desfazer levaria a um estado misto, nem antigo nem importado
- Consequências
  - Ganha: exportar e importar é uma volta exata
  - Aceita: importar por engano só se desfaz com outro arquivo exportado antes

## Histórico
- 2026-07-08 TASK-066: decisão criada
