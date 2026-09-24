---
tema: Forma da descrição do produto
decisao: Dois arquivos densos lidos juntos - documento de produto e modelo conceitual opcional - em listas aninhadas
carregar-quando: mudança na estrutura, nas seções, nos arquivos ou na forma de escrever a descrição do produto
---
- Decisão: o produto é descrito em dois arquivos lidos sempre juntos: o documento de produto, nesta ordem: o que é, diferenciais, glossário, requisitos por domínio (requisito com regras em sub-itens), regras transversais, não funcionais, fora de escopo; e o modelo conceitual, opcional, com a estrutura do domínio
- Contexto: o agente precisa do produto inteiro no contexto para analisar impacto; definições de uma linha não expressam relações, estados e invariantes, que acabavam espalhados pelas regras transversais, e é essa estrutura que revela a cascata de uma mudança
- Alternativas descartadas
  - Arquivo único: o glossário não expressa estrutura, e estendê-lo faria o arquivo crescer sem organização
  - Modelo como seção do documento de produto: o arquivo cresce e mistura comportamento com estrutura
  - Diagramas Mermaid: mais tokens e menos precisos para agentes
  - Uma pasta com um arquivo por capacidade: exige várias leituras e duplica contexto entre arquivos
  - Cenários Dado/Quando/Então: triplicam os tokens por regra
  - Seções em prosa, como conceitos fundamentais ou visão geral longa: repetem o glossário
- Consequências
  - Ganha: leitura completa em dois arquivos pequenos, com a estrutura explícita
  - Aceita: dois arquivos a manter coerentes pelo vocabulário do glossário

## Histórico
- 2026-09-24 #1: produto passa a dois arquivos, com o modelo conceitual; arquivo renomeado de documento-de-produto-unico
- 2026-09-24 plano-inicial: decisão criada
