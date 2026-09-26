---
tema: Como muda a definição do próprio template
decisao: PR único com rótulo tabularium, sem issue e sem entrega separada; a spec do template só é verificada na forma
carregar-quando: mudança nas regras, skills, instruções, script ou fluxo do próprio template, ou nas verificações de PR sobre a spec do template
---
- Decisão: a definição do template é a sua spec junto com tudo o que ele entrega (instruções, skills, script, fluxo de CI e documentação); cada mudança nela entra num PR único, com o rótulo tabularium e sem os rótulos de requisito ou só-spec, que já traz tudo alinhado; todo item da spec do template fica implementado; não há issue nem entrega separada, e o merge é aceite e entrega; a verificação da spec do template é só de forma, sem as regras de PR; num PR com o rótulo tabularium, a spec do exemplo também é verificada só na forma e a revisão consultiva não roda; PR que toca a spec do template exige o rótulo tabularium
- Contexto: skills e instruções não são implementação da spec do template, são a própria definição; separar proposta e entrega só criaria períodos em que as regras e as skills divergem
- Alternativas descartadas
  - Proposta e entrega separadas, como num produto: regras e skills divergem entre a aceitação e a entrega
  - Issue de requisito para amadurecer mudanças do template: a conversa basta; o tracker fica para o produto
  - Sem verificação da spec do template: ela deixaria de seguir as próprias regras de formato
  - Adaptação do exemplo em PR separado: a verificação do exemplo ficaria vermelha entre os dois PRs
- Consequências
  - Ganha: template sempre coerente com a própria spec; o exemplo acompanha cada mudança de regra
  - Aceita: nenhuma verificação automática de que todo item está implementado; o caso especial vive só neste repositório

## Histórico
- 2026-09-26 #13: decisão criada
