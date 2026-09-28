---
tema: Exemplo incluído no template
decisao: Um produto real preenchido na spec, com decisões inferidas e um item redefinido de demonstração, usado para experimentar o ciclo de proposta
carregar-quando: mudança no exemplo do template, na forma de demonstrar o formato ou de experimentar o ciclo
---
- Decisão: a spec do template traz um aplicativo real, reescrito pelas regras, com decisões de produto inferidas da documentação original e um item redefinido para mostrar o ciclo completo; o exemplo passa pelas mesmas verificações e regras de um produto e serve para experimentar o ciclo de proposta; como não tem código, sua lista de caminhos de código é vazia, a entrega não pode ser experimentada com ele, e as regras de entrega são exercitadas pelos casos de teste do script
- Contexto: o usuário precisava ver o formato aplicado a um caso concreto para avaliá-lo
- Alternativas descartadas
  - Só o esqueleto vazio: não mostra como fica um produto de verdade
  - Exemplo em pasta separada de documentação: não seria validado como spec
  - Exemplo só no plano de implementação: some depois da implementação
  - Exemplo com código simulado: manutenção de código que não é o produto do template
- Consequências
  - Ganha: referência concreta, validada pela verificação; campo de prova do mecanismo
  - Aceita: quem adota precisa trocar o exemplo pelo esqueleto; a entrega não é experimentada no exemplo

## Histórico
- 2026-09-26 #18: lista de caminhos de código vazia e entrega fora do exemplo, explícitas
- 2026-09-26 #14: termo item redefinido
- 2026-09-26 #13: exemplo como experimento do ciclo de proposta
- 2026-09-24 plano-inicial: decisão criada
