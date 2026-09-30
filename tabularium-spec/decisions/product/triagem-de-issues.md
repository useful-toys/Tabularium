---
tema: Triagem de uma issue contra a spec
decisao: Toda issue é triada contra a spec como sugestão; o esmiuçar a resolve quando não está clara e uma pessoa decide; bug vira PR de código neutro, entrega pendente espera a implementação, requirement segue o ciclo
carregar-quando: mudança em como uma issue ou ideia é classificada, nas labels de issue, no destino de um bug ou na análise de impacto de uma issue
---
- Decisão: o tipo escolhido por quem abre a issue é um palpite; a triagem compara o relato com a spec: contradiz item implementado é bug, corrigido por PR de código sem mudança na spec que fecha a issue; contradiz item comprometido e não implementado é entrega pendente, sem o que decidir; pede spec nova, alterada, removida ou substituída, ou a spec é omissa ou ambígua, é requirement e segue o ciclo; mistura de bug e requirement vira duas issues ligadas; a análise de impacto sugere o veredito com a evidência (item, decisão ou código), e o esmiuçar o resolve com o usuário como primeiro ponto da árvore de decisões quando não está claro ou não foi feito, inclusive para a ideia que nasce na conversa; o rótulo aplicado por uma pessoa vence a sugestão, e o tipo pode mudar durante a conversa, com a evidência em comentário; o rótulo bug e o formulário de bug existem ao lado do requirement
- Contexto: quem relata um comportamento indesejado chama de bug o que pode ser uma necessidade de mudar a spec, e quem descreve um requisito pode estar descrevendo uma divergência do código; sem triagem, um bug vira discussão de requisito, e uma entrega pendente é tratada como pedido novo
- Alternativas descartadas
  - Confiar no tipo escolhido na criação: é um palpite sobre uma comparação com a spec que o autor não fez
  - Triagem que aplica o rótulo sozinha: esconde o palpite original e a IA pode errar
  - Triagem só no esmiuçar: um veredito com evidência é análise, e o esmiuçar só pergunta
  - Skill própria de triagem: a análise de impacto já lê a spec contra o relato
  - Sem rótulo de bug, tratando bug fora do tabularium: o bug real entra como requirement e para na fila
- Consequências
  - Ganha: cada issue vai ao caminho certo, e o hotfix não passa por proposta
  - Aceita: a triagem depende do julgamento da IA e da confirmação de uma pessoa; o rótulo bug precisa existir no repositório

## Histórico
- 2026-09-29 #21: decisão criada
