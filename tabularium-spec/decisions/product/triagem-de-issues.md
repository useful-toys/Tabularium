---
tema: Triagem de uma ideia ou issue contra a spec
decisao: A triagem é um processo contínuo da conversa, sem etapa definida, e a IA pode sugerir alterá-la conforme o entendimento amadurece; ela termina em requirement issue, bug issue ou descarte; a issue sem conversa fica sem triagem; a issue plan é recusada
carregar-quando: mudança em como uma issue ou ideia é classificada, nas labels de issue, no tratamento de bug ou plan ou na análise de impacto de uma issue
---
- Decisão: a conversa aceita como origem uma ideia, uma issue sem triagem ou uma requirement issue já triada, e faz a triagem de forma contínua, desde o início e sem etapa definida, comparando a issue ou ideia com a spec; o que quem abre a issue acha que ela é vale só como palpite; a issue está sem triagem enquanto não tiver o rótulo requirement, bug ou plan, e só termina a triagem quando vira requirement issue (rótulo requirement), bug issue (rótulo bug) ou é descartada; contradizer item implementado é bug, e a conversa sugere a bug issue, aplicando o rótulo à issue de origem ou, se a origem é uma ideia, criando a issue; a bug issue é reconhecida, rotulada e recusada na conversa, que aponta o processo dedicado, ainda por definir; pedir spec nova, alterada, removida ou substituída, ou a spec ser omissa ou ambígua, é requirement e segue o ciclo; o que a spec já cobre, inclusive por item comprometido e ainda não implementado, é descartado, e a issue de origem é fechada como descartada com um comentário que aponta o item, enquanto a ideia de origem é só abandonada; mistura de bug e requirement vira duas issues ligadas; a análise de impacto pode sugerir o veredito, e a conversa o resolve com o usuário; o rótulo aplicado por uma pessoa vence a sugestão, e a IA pode sugerir alterar uma triagem já decidida quando o entendimento amadurece, e a alteração vale com a confirmação de uma pessoa e a evidência em comentário; a issue sem conversa continua sem triagem, sem automação; a issue plan, com o rótulo plan, é reconhecida e recusada na conversa, que aponta o processo dedicado, ainda por definir; o formulário de issue não aplica rótulo, para a issue chegar sem triagem
- Contexto: quem relata um comportamento indesejado chama de bug o que pode ser uma necessidade de mudar a spec, e quem descreve um requisito pode estar descrevendo uma divergência do código; sem triagem, um bug vira discussão de requisito, e uma issue sobre item já comprometido é tratada como pedido novo
- Alternativas descartadas
  - Confiar no tipo escolhido na criação: é um palpite sobre uma comparação com a spec que o autor não fez
  - Triagem que aplica o rótulo sozinha: esconde o palpite original e a IA pode errar
  - Triagem decidida uma vez, no início: o entendimento amadurece na conversa e pode mostrar que o tipo era outro
  - Triagem como etapa própria, fora da conversa: um veredito com dúvida acaba em perguntas ao usuário, que é o que a conversa faz
  - Skill própria de triagem: a conversa e a análise de impacto já leem a spec contra a issue ou ideia
  - Bug issue seguindo para hotfix já neste ciclo: o comportamento de bug e de plan será especificado em processo dedicado, por outras skills; até lá a conversa só as reconhece, rotula e recusa
  - A conversa lançar o fluxo de hotfix: o hotfix precisa de uma issue para rastrear e fechar; sugerir a bug issue mantém a issue como ponto de partida
  - Sem rótulo de bug, tratando bug fora do tabularium: o bug real entra como requirement e para na fila
  - Entrega pendente como resultado próprio da triagem: uma issue sobre item já comprometido só espera a implementação, não há o que amadurecer, e descartar com o item apontado basta
  - Triagem automática da issue sem conversa: sem conversa não há confirmação de uma pessoa; adiado
  - Rótulo needs-triage aplicado pelo formulário: a issue criada sem formulário ficaria invisível; a ausência dos rótulos vale para toda issue
  - Formulários que aplicam requirement e bug: a issue recém-aberta pareceria triada sem que ninguém a tenha analisado
- Consequências
  - Ganha: cada issue vai ao caminho certo, e bug e plan não entram por engano no ciclo de requisitos
  - Aceita: bug issue e plan issue ficam sem tratamento até o processo dedicado; a triagem depende do julgamento da IA e da confirmação de uma pessoa; a issue sem conversa fica sem triagem até alguém abrir uma; o rótulo bug precisa existir no repositório

## Histórico
- 2026-09-30 #21: bug issue e plan issue são reconhecidas, rotuladas e recusadas na conversa; o tratamento fica para processo dedicado
- 2026-09-30 #21: triagem é contínua e pode ser alterada durante a conversa, com confirmação de uma pessoa
- 2026-09-29 #21: triagem é o primeiro passo da conversa; bug vira bug issue; descarte fecha a issue de origem; issue sem conversa fica sem triagem
- 2026-09-29 #21: triagem termina em requirement issue, hotfix ou descarte; issue plan recusada
- 2026-09-29 #21: decisão criada
