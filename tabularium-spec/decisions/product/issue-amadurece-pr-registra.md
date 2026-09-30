---
tema: Papéis da issue e do PR na evolução de requisitos
decisao: Requirement issue é a discussão em prosa e guarda o entendimento atual, sem compromisso; PR traz os arquivos da nova spec no formato do tabularium; merge é a aceitação
carregar-quando: mudança em como requisitos são propostos, discutidos, aceitos ou recusados
---
- Decisão: a ideia nasce numa issue aberta por uma pessoa ou numa conversa e amadurece na conversa, e a requirement issue, que é a discussão em prosa e nunca compromisso, guarda o entendimento mais recente quando o usuário pede, com o histórico em comentários (`requirement-issue-estado-e-historico`); o PR de proposta traz o diff final do documento de produto e as operações nas decisões, redigidos no formato do tabularium e nunca ideias soltas, e por isso passa pelo fluxo formal de validação, aceite e entrega; e a descrição menciona e explica cada alteração; PR aberto é proposta, merge é aceitação, fechado sem merge é recusa; a aceitação é o merge decidido por um humano, sem aprovação formal obrigatória; o merge é feito por ele ou pelo agente, que só integra a pedido explícito do humano, PR a PR, e nesse caso o pedido é o ato de aceitação; o PR de proposta cita a issue com `Refs #N` e a issue recebe o link dele; PR sem issue vale quando a ideia já está madura, usando o próprio número como identificador; qualquer pessoa com permissão de merge pode aceitar
- Contexto: propostas precisam chegar prontas para serem comprometidas, e a discussão exploratória precisa de um lugar que não seja a spec
- Alternativas descartadas
  - PR só com o diff, sem explicação: o diff não carrega intenção, e a conversa e a issue opcional não servem de memória para a pessoa que integra nem para o novo casamento
  - Aceitação na issue antes do PR (ou no lugar do merge): dois atos de aceite para a mesma coisa, ou aceite de uma intenção sem ver o efeito no texto da spec, com o entendimento da issue sujeito a mudar depois e sem a garantia do merge protegido nem o registro no histórico do repositório
  - Estado de proposto no documento de produto: terceiro marcador para algo que ainda não foi aceito
  - Sempre exigir issue: burocracia para ideias já maduras
  - Issue como guardiã só da discussão, sem o entendimento atual: quem chega depois reconstrói o estado lendo tudo
  - Aprovação formal obrigatória antes do merge: o merge já é o ato consciente de aceitação; quantas aprovações e de quem é política da equipe que adota, não do template
  - Aprovação configurável pelo tamanho da equipe: idem, a política de revisão é da equipe
  - Agente nunca integra: o humano pode delegar o merge explicitamente
  - Aprovação restrita a um dono do produto: não reflete como as equipes do template trabalham
- Consequências
  - Ganha: aceitação com um único ato, rastreável no PR
  - Aceita: recusas ficam só no PR fechado, salvo se viram item de fora de escopo; sem segundo par de olhos obrigatório além da revisão consultiva

## Histórico
- 2026-09-30 #21: issue é discussão em prosa, PR é a spec redigida que passa pelo fluxo formal; aceite continua no merge, não na issue
- 2026-09-29 #21: requirement issue guarda o entendimento atual e nasce também de uma pessoa; proposta cita a issue com Refs
- 2026-09-24 #10: aceitação pelo merge humano, sem aprovação formal obrigatória; agente integra só a pedido; sem o termo revisor
- 2026-09-24 #7: descrição do PR explica cada alteração
- 2026-09-24 #3: amadurecimento na conversa; issue só a pedido
- 2026-09-24 plano-inicial: decisão criada
