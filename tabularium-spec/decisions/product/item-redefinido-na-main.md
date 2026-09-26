---
tema: Mudança incompatível em item implementado
decisao: Item redefinido na branch principal - o que vale hoje, seta, o desejado
carregar-quando: mudança na forma de alterar ou remover algo já implementado, no estado redefinido ou nas regras de entrega
---
- Decisão: a mudança entra antes do código, anexando ao item implementado a seta e o texto completo desejado (ou a remoção), e o item fica redefinido; vale o texto atual até a entrega; na entrega, o item é reescrito, mantém a marca e a seta some; sempre acompanhada de decisão criada ou atualizada no mesmo PR
- Contexto: o documento com marca deve refletir o código, mas uma mudança importante precisa ficar visível na branch principal, sem depender de PR aberto
- Alternativas descartadas
  - Só na branch da mudança, com PR em rascunho: PRs pendurados escondem a intenção de mudar algo importante
  - Delta guardado só no plano: o desejado sai do documento de produto
  - Editar o item diretamente antes do código: o documento deixaria de refletir o implementado
  - Estado chamado mudança comprometida: substantivo entre estados no particípio, e mudança passa a nomear o tipo do que um PR faz
  - Estado chamado em transição, em revisão ou a substituir: em revisão soa como ainda em discussão; a substituir não diz que o substituto está definido
- Consequências
  - Ganha: intenção visível na branch principal, e o lado esquerdo continua verdadeiro
  - Aceita: um segundo marcador e linhas mais longas até a entrega; redefinido pode soar como já concluído, e o glossário precisa dizer que o texto atual vale até a entrega

## Histórico
- 2026-09-26 #14: estado mudança comprometida vira item redefinido; arquivo renomeado de mudanca-comprometida-na-main
- 2026-09-24 plano-inicial: decisão criada
