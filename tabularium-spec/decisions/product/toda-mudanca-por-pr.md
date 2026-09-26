---
tema: Via de entrada das mudanças
decisao: Toda mudança por PR, com a branch principal protegida
carregar-quando: mudança em fluxo de git, proteção de branch, rótulos ou verificação de PR
---
- Decisão: código e spec só entram por PR; todo PR recebe o rótulo do seu tipo de mudança; a verificação roda no PR; a definição do próprio template segue `definicao-do-template`
- Contexto: as regras de entrega, como resolver item redefinido só com código, só são verificáveis comparando com a base de um PR
- Alternativas descartadas
  - PR só para código e push direto para mudanças só de spec: exige verificação também no push e abre brecha
  - Sem exigência de PR, verificação depois do fato: a violação já está na branch principal
- Consequências
  - Ganha: um único caminho, regras simples
  - Aceita: até ajuste de redação exige PR

## Histórico
- 2026-09-26 #14: rótulo de tipo no lugar de só-spec; termo item redefinido
- 2026-09-26 #13: exceção da definição do próprio template
- 2026-09-24 plano-inicial: decisão criada
