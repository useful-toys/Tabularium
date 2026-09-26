---
tema: PR de código que não altera a spec
decisao: Classificado como neutro pelo CI, sem julgamento de comportamento por ora; qualquer código conta
carregar-quando: mudança no tratamento de PR de código sem alteração na spec ou no que conta como código
---
- Decisão: PR que altera código, isto é, qualquer arquivo fora dos caminhos que não são código, e não altera nenhum arquivo da spec é classificado pelo CI como mudança neutra, com a label spec-neutral; se ele muda comportamento sem mudar a spec é assunto de outra discussão, e por ora só a revisão e a verificação de drift o apontam
- Contexto: a classificação passou a cobrir só o que o PR faz com a spec; julgar se o código muda comportamento é outro problema, com custo e falso positivo próprios
- Alternativas descartadas
  - Bloquear, salvo com o rótulo no-spec-change afirmando que o comportamento não muda: a afirmação só era conferida pela revisão, e o tipo agora é deduzido pelo CI
  - Mapa de caminhos de código para domínios na configuração: mais configuração a manter, e desatualiza quando o código ou os domínios se reorganizam
  - IA julgando todo PR de código sem spec: custo e falso positivo em quase todo PR de código
- Consequências
  - Ganha: refatorações e testes sem rótulo manual
  - Aceita: PR de código que muda comportamento sem mudar a spec passa na verificação; o drift fica para a revisão e para a verificação sob demanda

## Histórico
- 2026-09-26 #14: classificado como neutro pelo CI; sai o rótulo no-spec-change
- 2026-09-26 #13: decisão criada
