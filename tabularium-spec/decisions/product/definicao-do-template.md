---
tema: Spec do próprio template e como a definição dele muda
decisao: Pasta própria com as convenções da spec; mudança por PR único com rótulo tabularium, sem issue nem entrega separada; verificação só de forma
carregar-quando: mudança na spec do próprio template, na separação entre ela e o exemplo, ou nas regras, skills, instruções, script ou fluxo do próprio template
---
- Decisão: o próprio template tem uma spec em pasta separada, com documento de produto, modelo conceitual e decisões no mesmo formato, verificada pelo mesmo script; a definição do template é essa spec junto com tudo o que ele entrega (instruções, skills, script, fluxo de CI e documentação); cada mudança nela entra num PR único, com o rótulo tabularium e sem rótulo de tipo, que já traz tudo alinhado; todo item da spec do template fica implementado; não há issue nem entrega separada, e o merge é aceite e entrega; a verificação da spec do template é só de forma, sem as regras de PR; num PR com o rótulo tabularium, a spec do exemplo também é verificada só na forma, o tipo não é classificado e a revisão consultiva não roda; PR que toca a spec do template exige o rótulo tabularium
- Contexto: a pasta de spec padrão está ocupada pelo exemplo entregue a quem adota, e as decisões que levaram ao template precisavam de registro sem se misturar com ele; skills e instruções não são implementação da spec do template, são a própria definição; separar proposta e entrega só criaria períodos em que as regras e as skills divergem
- Alternativas descartadas
  - Decisões em pasta de documentação, sem documento de produto: não exercita o próprio formato por completo
  - A spec padrão descrever o template, com o exemplo movido: quem adota receberia a spec do template no lugar do exemplo
  - Um arquivo corrido de decisões: fora do formato que o template prega
  - Proposta e entrega separadas, como num produto: regras e skills divergem entre a aceitação e a entrega
  - Issue de requisito para amadurecer mudanças do template: a conversa basta; o tracker fica para o produto
  - Sem verificação da spec do template: ela deixaria de seguir as próprias regras de formato
  - Adaptação do exemplo em PR separado: a verificação do exemplo ficaria vermelha entre os dois PRs
  - Classificar também o PR do template pelo tipo: mais regra para um fluxo sem proposta nem entrega separadas
- Consequências
  - Ganha: o template usa o próprio método e fica sempre coerente com a própria spec; o exemplo acompanha cada mudança de regra
  - Aceita: quem adota apaga essa pasta; nenhuma verificação automática de que todo item está implementado; o caso especial vive só neste repositório e não tem item no documento de produto

## Histórico
- 2026-09-26 #14: PR do template sem rótulo de tipo nem classificação
- 2026-09-26 #13: fluxo próprio da definição do template, sem entrega separada
- 2026-09-26 organização: fundida com spec-do-proprio-template
- 2026-09-24 plano-inicial: decisão criada
