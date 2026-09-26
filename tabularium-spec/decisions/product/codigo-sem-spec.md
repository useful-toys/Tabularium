---
tema: PR de código que não altera a spec
decisao: Bloqueado pela verificação, salvo com o rótulo no-spec-change; qualquer código conta
carregar-quando: mudança na exigência de atualizar a spec em PR de código, no rótulo no-spec-change ou no que conta como código
---
- Decisão: PR que altera código, isto é, qualquer arquivo fora dos caminhos que não são código, e não altera nenhum arquivo da spec falha na verificação; o rótulo no-spec-change libera o PR e afirma que ele não muda comportamento, como numa refatoração, num teste ou numa correção sem efeito no que a spec descreve
- Contexto: a spec nunca mente; PR de código sem spec é o caminho mais comum de drift, e o rótulo torna explícita a afirmação de que o comportamento não muda
- Alternativas descartadas
  - Mapa de caminhos de código para domínios na configuração: mais configuração a manter, e desatualiza quando o código ou os domínios se reorganizam
  - Só a revisão consultiva cobra a spec: a revisão por agente pode faltar ou errar, e drift é justamente o que a spec viva não tolera
- Consequências
  - Ganha: nenhum PR de código passa sem que alguém afirme se ele muda ou não o comportamento
  - Aceita: um rótulo a mais em refatorações e testes; a afirmação do rótulo só é conferida pela revisão

## Histórico
- 2026-09-26 #13: decisão criada
