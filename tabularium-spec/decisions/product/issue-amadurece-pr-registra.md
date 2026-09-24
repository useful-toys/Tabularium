---
tema: Papéis da issue e do PR na evolução de requisitos
decisao: Issue amadurece a ideia; PR traz o texto final; merge é a aceitação
carregar-quando: mudança em como requisitos são propostos, discutidos, aceitos ou recusados
---
- Decisão: a ideia amadurece na conversa, e a issue de requisito guarda a discussão quando o usuário pede; o PR de proposta traz o diff final do documento de produto e as operações nas decisões, nunca ideias soltas, e a descrição menciona e explica cada alteração; PR aberto é proposta, merge é aceitação, fechado sem merge é recusa; a aceitação é o merge feito por um humano, sem aprovação formal obrigatória, e o agente só integra a pedido explícito do humano, PR a PR; PR sem issue vale quando a ideia já está madura, usando o próprio número como identificador; qualquer pessoa com permissão de merge pode aceitar
- Contexto: propostas precisam chegar prontas para serem comprometidas, e a discussão exploratória precisa de um lugar que não seja a spec
- Alternativas descartadas
  - PR só com o diff, sem explicação: o diff não carrega intenção, e a conversa e a issue opcional não servem de memória para o revisor nem para o reencaixe
  - Aceitação na issue antes do PR: dois atos de aceite para a mesma coisa
  - Estado de proposto no documento de produto: terceiro marcador para algo que ainda não foi aceito
  - Sempre exigir issue: burocracia para ideias já maduras
  - Aprovação formal obrigatória antes do merge: o merge já é o ato consciente de aceitação; quantas aprovações e de quem é política da equipe que adota, não do template
  - Aprovação configurável pelo tamanho da equipe: idem, a política de revisão é da equipe
  - Agente nunca integra: o humano pode delegar o merge explicitamente
  - Aprovação restrita a um dono do produto: não reflete como as equipes do template trabalham
- Consequências
  - Ganha: aceitação com um único ato, rastreável no PR
  - Aceita: recusas ficam só no PR fechado, salvo se viram item de fora de escopo; sem segundo par de olhos obrigatório além da revisão consultiva

## Histórico
- 2026-09-24 #10: aceitação pelo merge humano, sem aprovação formal obrigatória; agente integra só a pedido
- 2026-09-24 #7: descrição do PR explica cada alteração
- 2026-09-24 #3: amadurecimento na conversa; issue só a pedido
- 2026-09-24 plano-inicial: decisão criada
