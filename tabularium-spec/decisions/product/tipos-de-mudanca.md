---
tema: Tipos de mudança e como o PR é classificado
decisao: Quatro tipos pela compatibilidade com o que vale hoje - editorial, neutra, compatível, incompatível -, deduzidos do diff pelo CI, que aplica a label; no caso ambíguo, a IA julga e a label aplicada por uma pessoa vence
carregar-quando: mudança nos tipos de mudança, na classificação de PRs, nas labels de tipo ou no papel da IA e das pessoas na classificação
---
- Decisão: todo PR tem um tipo, pelo que faz com a spec vigente, e o PR com vários recebe o maior, nesta ordem: editorial (só texto da spec, sem mudar sentido), neutra (não altera o sentido de nenhum requisito: código sem spec ou entrega de compromisso), compatível (cria requisito, altera item não implementado ou cria decisão, sem contradizer item nem decisão) e incompatível (altera o sentido de item implementado, contradiz item ou vai contra decisão); o CI deduz do diff o tipo mínimo que ele prova e aplica a label do tipo; quando o diff é ambíguo, porque o script não sabe se o sentido mudou, a IA julga e vale o maior entre o mínimo e o julgado; se o tipo torna o PR inválido, o check bloqueia; a label aplicada por uma pessoa vence a dedução e a IA, o bot nunca a troca, e abaixo do mínimo é erro; sem IA disponível, o caso ambíguo exige label aplicada por uma pessoa; por ora, o PR sem mudança na spec é neutro sem julgamento de comportamento
- Contexto: o tipo decide o que o check exige (decisão, seta, código); com o tipo declarado só pelo autor, um tipo errado burla as regras, e o merge sozinho não o pega
- Alternativas descartadas
  - Nomes significativa, simples e trivial: sugerem tamanho, e uma refatoração grande que não muda requisito não é trivial
  - Acréscimo e ajuste de compromisso como tipos distintos: o tratamento é o mesmo, item sem marca e sem seta
  - Uma label única para PRs de spec: sem a intenção declarada, o check não distingue redação de mudança de sentido
  - Tipo só declarado pelo autor: autor, humano ou agente, tende a declarar o tipo mais barato
  - Label só no caso ambíguo, sem o CI aplicar a deduzida: o tipo fica invisível em boa parte dos PRs
  - Label sempre declarada e só validada: trabalho manual em todo PR
  - Revisão por IA só consultiva também na classificação: o tipo governa as regras, e o tipo errado as burla
  - Aprovação de review como confirmação humana: contradiz a aceitação sem aprovação formal, é inviável com autor único e é descartada a cada commit
  - Comando em comentário como confirmação: mais um mecanismo, e a label já expressa o tipo
  - Sem IA, aplicar o tipo mínimo e seguir: o caso ambíguo passaria sem ninguém julgar o sentido
  - IA julgando também se PR só de código muda comportamento: custo e falso positivo em quase todo PR de código; fica para outra discussão
- Consequências
  - Ganha: o tipo de todo PR é visível e conferido contra o diff; redação e mudança de sentido deixam de se confundir
  - Aceita: um check obrigatório depende de IA no caso ambíguo; permissão de escrita nos PRs para o CI; em PR de fork, a label não é aplicada; mudança editorial em item implementado vai em PR próprio, porque o PR misto recebe o maior tipo; PR de código sem spec passa sem que ninguém afirme que o comportamento não muda

## Histórico
- 2026-09-26 #14: decisão criada
