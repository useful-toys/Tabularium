---
tema: Triagem de uma issue contra a spec
decisao: Toda issue sem triagem é triada contra a spec como sugestão; o esmiuçar a resolve quando não está clara e uma pessoa decide; a triagem termina em requirement issue, hotfix (bug) ou descarte, e a issue plan é recusada
carregar-quando: mudança em como uma issue ou ideia é classificada, nas labels de issue, no destino de um bug ou na análise de impacto de uma issue
---
- Decisão: qualquer issue entra no ciclo, e o que quem a abre acha que ela é vale só como palpite; a issue está sem triagem enquanto não tiver o rótulo requirement, bug ou plan, e a triagem só termina quando ela vira requirement issue (rótulo requirement), vira hotfix (rótulo bug, corrigido por PR de código sem mudança na spec que fecha a issue) ou é descartada (fechada com um comentário que aponta o item da spec que já a cobre, inclusive um item comprometido e ainda não implementado); a triagem compara o relato com a spec: contradiz item implementado é bug; pede spec nova, alterada, removida ou substituída, ou a spec é omissa ou ambígua, é requirement e segue o ciclo; mistura de bug e requirement vira duas issues ligadas; a requirement issue já triada segue direto para a conversa; a issue plan, com o rótulo plan, não segue o ciclo e é recusada na conversa, sem esmiuçar, até que o tratamento de planos seja definido; a análise de impacto sugere o veredito com a evidência (item, decisão ou código), e o esmiuçar o resolve com o usuário como primeiro ponto da árvore de decisões quando não está claro ou não foi feito, inclusive para a ideia que nasce na conversa; o rótulo aplicado por uma pessoa vence a sugestão, e o tipo pode mudar durante a conversa, com a evidência em comentário; o rótulo bug marca só a issue já triada como hotfix, e o formulário de issue não aplica rótulo, para a issue chegar sem triagem
- Contexto: quem relata um comportamento indesejado chama de bug o que pode ser uma necessidade de mudar a spec, e quem descreve um requisito pode estar descrevendo uma divergência do código; sem triagem, um bug vira discussão de requisito, e uma entrega pendente é tratada como pedido novo
- Alternativas descartadas
  - Confiar no tipo escolhido na criação: é um palpite sobre uma comparação com a spec que o autor não fez
  - Triagem que aplica o rótulo sozinha: esconde o palpite original e a IA pode errar
  - Triagem só no esmiuçar: um veredito com evidência é análise, e o esmiuçar só pergunta
  - Skill própria de triagem: a análise de impacto já lê a spec contra o relato
  - Sem rótulo de bug, tratando bug fora do tabularium: o bug real entra como requirement e para na fila
  - Entrega pendente como resultado próprio da triagem: uma issue sobre item já comprometido só espera a implementação, não há o que amadurecer, e descartar com o item apontado basta
  - Rótulo needs-triage aplicado pelo formulário: a issue criada sem formulário ficaria invisível; a ausência dos rótulos vale para toda issue
  - Formulários que aplicam requirement e bug: a issue recém-aberta pareceria triada sem que ninguém a tenha analisado
- Consequências
  - Ganha: cada issue vai ao caminho certo, e o hotfix não passa por proposta
  - Aceita: a triagem depende do julgamento da IA e da confirmação de uma pessoa; o rótulo bug precisa existir no repositório

## Histórico
- 2026-09-29 #21: triagem termina em requirement issue, hotfix ou descarte; issue plan recusada
- 2026-09-29 #21: decisão criada
