---
tema: Forma do documento de produto
decisao: Um único arquivo denso, em listas aninhadas, lido de uma vez
carregar-quando: mudança na estrutura, nas seções ou na forma de escrever o documento de produto
---
- Decisão: todo o produto num arquivo, nesta ordem: o que é, diferenciais, glossário, requisitos por domínio (requisito com regras em sub-itens), regras transversais, não funcionais, fora de escopo
- Contexto: o agente precisa do produto inteiro no contexto para analisar impacto; prosa e arquivos espalhados custam tokens e leituras
- Alternativas descartadas
  - Uma pasta com um arquivo por capacidade: exige várias leituras e duplica contexto entre arquivos
  - Cenários Dado/Quando/Então: triplicam os tokens por regra
  - Seções em prosa, como conceitos fundamentais ou visão geral longa: repetem o glossário
- Consequências
  - Ganha: leitura única, barata e completa
  - Aceita: arquivo grande em produtos grandes; domínios são subdivididos quando crescem

## Histórico
- 2026-09-24 plano-inicial: decisão criada
