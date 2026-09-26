---
tema: O que conta como código e o PR de código que não altera a spec
decisao: Código é o que está nos caminhos de código configurados; PR que o altera sem alterar a spec é classificado como neutro pelo CI, sem julgamento de comportamento por ora
carregar-quando: mudança no que conta como código, nos caminhos de código da configuração ou no tratamento de PR de código sem alteração na spec
---
- Decisão: a configuração lista os caminhos de código do produto (ex.: `src/`, `app/`), casados por prefixo; só o que está neles conta como código nas regras de PR; configuração, build, instruções de IA, infra e a própria spec ficam de fora; lista vazia é projeto sem código; configuração sem a lista é recusada pelo script; PR que altera código e não altera nenhum arquivo da spec é classificado pelo CI como mudança neutra, com a label spec-neutral; se ele muda comportamento sem mudar a spec é assunto de outra discussão, e por ora só a revisão e a verificação de drift o apontam
- Contexto: a análise de alteração de código deve focar só nas pastas de código; com a lista de exclusão, todo arquivo novo fora dela contava como código, e cada pasta de configuração, build, instrução ou infra precisava ser lembrada
- Alternativas descartadas
  - Caminhos que não são código, com todo o resto contando como código: a lista crescia com cada pasta de configuração, build, instrução de IA e infra, e o que se esquecia virava código por engano
  - Bloquear PR de código sem spec, salvo com o rótulo no-spec-change afirmando que o comportamento não muda: a afirmação só era conferida pela revisão, e o tipo agora é deduzido pelo CI
  - Mapa de caminhos de código para domínios na configuração: mais configuração a manter, e desatualiza quando o código ou os domínios se reorganizam
  - IA julgando todo PR de código sem spec: custo e falso positivo em quase todo PR de código
- Consequências
  - Ganha: lista curta e explícita do que é código; refatorações e testes sem rótulo manual
  - Aceita: a lista desatualiza quando o código muda de lugar, e código fora dela passa sem as regras de entrega; PR de código que muda comportamento sem mudar a spec passa na verificação, e o drift fica para a revisão e para a verificação sob demanda

## Histórico
- 2026-09-26 #17: caminhos de código no lugar de caminhos que não são código
- 2026-09-26 #14: classificado como neutro pelo CI; sai o rótulo no-spec-change
- 2026-09-26 #13: decisão criada
