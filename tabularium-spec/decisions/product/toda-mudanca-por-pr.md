---
tema: Via de entrada das mudanças
decisao: Toda mudança por PR, com a branch principal protegida
carregar-quando: mudança em fluxo de git, proteção de branch, rótulos ou verificação de PR
---
- Decisão: código e spec só entram por PR; PR que altera só a spec leva o rótulo só-spec, e a verificação barra código num PR com esse rótulo; a verificação roda no PR
- Contexto: as regras de entrega, como resolver mudança comprometida só com código, só são verificáveis comparando com a base de um PR
- Alternativas descartadas
  - PR só para código e push direto para mudanças só de spec: exige verificação também no push e abre brecha
  - Sem exigência de PR, verificação depois do fato: a violação já está na branch principal
  - Proposta sem código garantida só pelo processo: uma proposta com código seria aceita sem entrega separada
  - Barrar código pelo rótulo de requisito: só-spec já significa sem código e cobre também correções de redação
- Consequências
  - Ganha: um único caminho, regras simples
  - Aceita: até ajuste de redação exige PR

## Histórico
- 2026-09-24 #12: verificação barra código em PR só-spec
- 2026-09-24 plano-inicial: decisão criada
