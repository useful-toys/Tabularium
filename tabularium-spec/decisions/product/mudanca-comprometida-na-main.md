---
tema: Mudança significativa em item implementado
decisao: Coexistência na branch principal - o que vale hoje, seta, o desejado
carregar-quando: mudança na forma de alterar ou remover algo já implementado, ou nas regras de entrega
---
- Decisão: a mudança entra antes do código, anexando ao item implementado a seta e o texto completo desejado (ou a remoção); na entrega, o item é reescrito, mantém a marca e a seta some; sempre acompanhada de decisão criada ou atualizada no mesmo PR
- Contexto: o documento com marca deve refletir o código, mas uma mudança importante precisa ficar visível na branch principal, sem depender de PR aberto
- Alternativas descartadas
  - Só na branch da mudança, com PR em rascunho: PRs pendurados escondem a intenção de mudar algo importante
  - Delta guardado só no plano: o desejado sai do documento de produto
  - Editar o item diretamente antes do código: o documento deixaria de refletir o implementado
- Consequências
  - Ganha: intenção visível na branch principal, e o lado esquerdo continua verdadeiro
  - Aceita: um segundo marcador e linhas mais longas até a entrega

## Histórico
- 2026-09-24 plano-inicial: decisão criada
