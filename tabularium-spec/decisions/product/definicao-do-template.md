---
tema: Spec do próprio template e como a definição dele muda
decisao: Pasta própria com as convenções da spec; mudança por PR único com rótulo tabularium, sem issue nem entrega separada, com revisão e documentos derivados por subagentes; verificação só de forma
carregar-quando: mudança na spec do próprio template, na separação entre ela e a spec dos projetos, ou nas regras, skills, instruções, script ou fluxo do próprio template
---
- Decisão: o próprio template tem uma spec em pasta separada, com documento de produto, modelo conceitual e decisões no mesmo formato, verificada pelo mesmo script; a definição do template é essa spec junto com tudo o que ele entrega (instruções, skills, script, fluxo de CI, comando de instalação, manifesto e documentação); a spec do template, os documentos derivados e o fluxo de CI que os verifica ficam fora do manifesto e nunca chegam aos projetos; o fluxo de CI distribuído só se abstém no PR com o rótulo tabularium; cada mudança nela entra num PR único, com o rótulo tabularium e sem rótulo de tipo, que já traz tudo alinhado; todo item da spec do template fica implementado; não há issue nem entrega separada, e o merge é aceite e entrega; a verificação da spec do template é só de forma, sem as regras de PR, e por isso a lista de caminhos de código dela fica vazia e não é lida; num PR com o rótulo tabularium, o tipo não é classificado e a conferência por agente não roda; PR que toca qualquer arquivo da definição exige o rótulo tabularium; os arquivos só mudam no registro: o agente que conduziu a conversa escreve a spec, as decisões e as instruções, um subagente de contexto limpo revisa o alinhamento delas com a spec, e subagentes em paralelo regeram o README e os documentos derivados (numa pasta própria, fora do manifesto), lendo só os arquivos finais; o README descreve só o que o template faz e aponta para os documentos derivados, onde fica o detalhe operacional (instalação, configuração, proteção da branch principal, conferência por agente e mudança do próprio template); sem subagentes, os mesmos passos em sequência
- Contexto: a pasta de spec padrão é a dos projetos que adotam, e as decisões que levaram ao template precisavam de registro sem se misturar com a deles; skills e instruções não são implementação da spec do template, são a própria definição; separar proposta e entrega só criaria períodos em que as regras e as skills divergem
- Alternativas descartadas
  - Decisões em pasta de documentação, sem documento de produto: não exercita o próprio formato por completo
  - A spec padrão descrever o template: quem adota receberia a spec do template no lugar da própria
  - Um arquivo corrido de decisões: fora do formato que o template prega
  - Proposta e entrega separadas, como num produto: regras e skills divergem entre a aceitação e a entrega
  - Requirement issue para amadurecer mudanças do template: a conversa basta; o tracker fica para o produto
  - Sem verificação da spec do template: ela deixaria de seguir as próprias regras de formato
  - Instruções escritas por subagente: skills, script e fluxo de CI dependem das decisões e dos porquês da conversa, que um resumo não carrega
  - Documentos derivados escritos pelo agente da conversa: tendem a refletir a conversa, e não a spec
  - Documento derivado do template na raiz ou em pasta genérica de documentação: mistura-se aos arquivos da definição
  - Passos do template no fluxo de CI distribuído, removidos na preparação: o projeto edita um arquivo do tabularium, que a atualização sobrescreve
  - Classificar também o PR do template pelo tipo: mais regra para um fluxo sem proposta nem entrega separadas
- Consequências
  - Ganha: o template usa o próprio método e fica sempre coerente com a própria spec; um olhar independente sobre as instruções; README e documentos derivados nunca defasados e escritos só a partir da spec
  - Aceita: tokens de três leituras a mais a cada mudança da definição; um fluxo de CI próprio do repositório do template, fora do manifesto; nenhuma verificação automática de que todo item está implementado; o caso especial vive só neste repositório e não tem item no documento de produto

## Histórico
- 2026-09-30 #21: README só descreve o que o template faz e aponta para os documentos derivados; detalhe operacional em documentos derivados
- 2026-09-29 #21: termo requirement issue
- 2026-09-29 #20: sem exemplo em spec/; a spec padrão só traz o que o INSTALL copia
- 2026-09-28 #19: spec do template, documentos derivados e fluxo de CI próprio fora do manifesto
- 2026-09-26 #17: lista de caminhos de código da spec do template vazia e sem uso
- 2026-09-26 #15: revisão por subagente e README e documentos derivados regerados por subagentes; documentos derivados em tabularium-docs
- 2026-09-26 #14: PR do template sem rótulo de tipo nem classificação
- 2026-09-26 #13: fluxo próprio da definição do template, sem entrega separada
- 2026-09-26 organização: fundida com spec-do-proprio-template
- 2026-09-24 plano-inicial: decisão criada
