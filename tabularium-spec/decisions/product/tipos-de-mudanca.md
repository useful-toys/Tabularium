---
tema: Tipos de mudança e quem os julga
decisao: Quatro tipos pela compatibilidade com o que vale hoje - editorial, neutra, compatível, incompatível -, julgados pela conferência por agente e por quem integra; nenhum script os deduz e nenhum rótulo os declara, e os rótulos de tipo existem mas por ora ninguém os aplica nem os exige
carregar-quando: mudança nos tipos de mudança, nas regras de PR que dependem do tipo, nas labels de tipo ou no papel da IA e das pessoas ao julgar o tipo
---
- Decisão: todo PR tem um tipo, pelo que faz com a spec vigente, e o PR com vários recebe o maior, nesta ordem: editorial (só texto da spec, sem mudar sentido), neutra (não altera o sentido de nenhum requisito: código sem spec ou entrega de compromisso), compatível (cria requisito, altera item não implementado ou cria decisão, sem contradizer item nem decisão) e incompatível (altera o sentido de item implementado, contradiz item ou vai contra decisão); o tipo é julgado pela conferência por agente, que o diz no comentário, e por quem integra; o CI não o deduz, não o verifica e não aplica rótulo; as regras de PR que dependem do tipo (código para resolver `⇢` ou marcar `✓`, decisão para `⇢` e para mudança incompatível) são conferidas pela conferência por agente, que só comenta; os rótulos spec-editorial, spec-neutral, spec-compatible e spec-incompatible continuam sendo criados pela preparação do repositório, mas por ora ninguém os aplica nem os exige; PR sem mudança na spec é neutro, sem julgamento de comportamento por ora
- Contexto: o script só prova o tipo em poucos casos, e na maior parte das mudanças de texto o diff não mostra se o sentido mudou; reordenar itens ou mover um item para outro pai passa sem ser visto; com um modelo de IA dentro de um check obrigatório, o mesmo PR podia ser bloqueado numa execução e liberado em outra
- Alternativas descartadas
  - Nomes significativa, simples e trivial: sugerem tamanho, e uma refatoração grande que não muda requisito não é trivial
  - Acréscimo e ajuste de compromisso como tipos distintos: o tratamento é o mesmo, item sem marca e sem seta
  - Uma label única para PRs de spec: sem a intenção declarada, a conferência não distingue redação de mudança de sentido
  - Tipo deduzido do diff pelo CI, com a IA julgando o caso ambíguo e o bot aplicando o rótulo: o script só prova o tipo em poucos casos, o resto é ambíguo, e uma IA dentro de um check obrigatório torna o bloqueio não reproduzível; era a escolha anterior, abandonada por isso
  - Rótulo de tipo aplicado por uma pessoa e conferido contra o mínimo do diff: um clique em quase todo PR de spec, e o rótulo editorial ainda libera a troca de sentido sem código
  - Aprovação de review ou comando em comentário como confirmação humana do tipo: contradiz a aceitação sem aprovação formal, é inviável com autor único e é mais um mecanismo
  - IA julgando também se PR só de código muda comportamento: custo e falso positivo em quase todo PR de código; fica para outra discussão
- Consequências
  - Ganha: o check bloqueante é determinístico, não usa IA, não escreve no PR e dá o mesmo resultado em PR de fork; não há mais rótulo trocado pelo bot nem caso ambíguo a resolver
  - Aceita: as regras de PR deixam de ser barradas e viram achado de um agente, que pode errar ou não rodar; um tipo errado não é pego por script; quem recusa a conferência fica sem quem confira essas regras; mudança editorial em item implementado vai em PR próprio, porque o PR misto recebe o maior tipo; PR de código sem spec passa sem que ninguém afirme que o comportamento não muda

## Histórico
- 2026-09-30 #24: o tipo deixa de ser deduzido pelo CI e aplicado como rótulo; passa a ser julgado pela conferência por agente e por quem integra, e os rótulos de tipo ficam sem uso
- 2026-09-26 #14: decisão criada
