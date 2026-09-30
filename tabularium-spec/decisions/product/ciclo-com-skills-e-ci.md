---
tema: Como o ciclo de mudança é executado
decisao: Skills para cada etapa, check bloqueante determinístico salvo a classificação do caso ambíguo, e conferência por agente só consultiva e independente da conversa, que não libera o rascunho, com uma só ligada, a do GitHub (Copilot) ou a do Claude, à escolha de quem adota
carregar-quando: mudança nas etapas do ciclo, nas skills, no papel do CI ou em agentes no CI
---
- Decisão: esmiuçar, sugerir, levar à issue, propor, revisar, sincronizar, verificar, extrair, configurar e organizar são skills; o CI bloqueia com regras determinísticas, do script ou do próprio fluxo de CI, e com uma exceção: no caso ambíguo, o tipo da mudança é julgado por um agente, e o tipo julgado pode bloquear, salvo quando uma pessoa aplica o rótulo de tipo; um agente confere propostas contra a spec vigente e comenta, sem bloquear, só pelo texto final da spec (arquivos ou diff), sem a conversa, como segunda visão das mesmas regras do portão da proposta, que o `/spec-propose` aplica com o contexto da conversa; o julgamento do agente nunca bloqueia nem libera o rascunho da proposta, que só o autor libera, e sem ressalvas o CI apenas sinaliza: só uma conferência fica ligada, à escolha de quem adota, mudada pela preparação do repositório: a revisão de código do GitHub (Copilot), seguindo o REVIEW.md e sem chave própria, ou o Claude num job do CI com chave própria, ligado por uma variável do repositório; quem não quer nenhuma fica sem conferência
- Contexto: processo só descrito em texto se perde; e um agente que decide sozinho pode ser manipulado pelo próprio conteúdo que avalia, além de variar entre execuções
- Alternativas descartadas
  - Só documentação e modelos: sem garantia de que o ciclo é seguido
  - Skills sem CI: nada impede um PR que quebre a sincronia
  - Agente no CI como bloqueio: vulnerável a instruções embutidas na proposta e não determinístico; vale para a revisão, não para a classificação do caso ambíguo, em que o rótulo aplicado por uma pessoa sempre vence
  - Classificação por agente só consultiva: o tipo governa as regras do check, e um tipo errado as burla
  - CI que libera o rascunho sem ressalvas: o rascunho é a declaração do autor de que a proposta está pronta, a ausência de ressalvas de um agente não é aprovação, o resultado pode variar entre execuções, e o CI passaria a precisar de mais permissão
  - Ressalvas do agente como bloqueio, com override humano: complexidade sem necessidade; o que o script prova já bloqueia
  - Análise só pelo autor, localmente: depende de lembrar de rodar
  - Copilot por padrão e/ou Claude, podendo ficar os dois ligados: duas opiniões sobre o mesmo PR geram ruído e custo dobrado
  - Um único agente de revisão fixo: prende o template a uma assinatura ou chave específica
- Consequências
  - Ganha: ciclo guiado por agente, protegido por regras estáveis e, para quem quer, com uma conferência por agente presente
  - Aceita: duas configurações a manter coerentes (REVIEW.md e o prompt do job); o Copilot não mantém o comentário único da revisão; um check bloqueante depende de agente no caso ambíguo; quem recusa a conferência fica sem a segunda visão, e uma proposta pode integrar sem conflito e ainda assim contradizer a spec vigente

## Histórico
- 2026-09-30 #22: uma só conferência por agente fica ligada, a do GitHub ou a do Claude, e pode não haver nenhuma; a preparação pergunta e muda a ligada
- 2026-09-30 #21: a revisão é uma segunda visão, independente da conversa; o CI só bloqueia o que prova e não libera o rascunho
- 2026-09-26 #14: classificação do caso ambíguo por agente pode bloquear
- 2026-09-26 #13: regras determinísticas também no fluxo de CI
- 2026-09-24 #10: sem o termo revisor
- 2026-09-24 #7: Copilot como revisor padrão
- 2026-09-24 #3: skill para levar a discussão à issue
- 2026-09-24 plano-inicial: revisor consultivo configurável entre Copilot code review e Claude
- 2026-09-24 plano-inicial: revisão consultiva por agente no CI; análise deixa de depender do autor
- 2026-09-24 plano-inicial: decisão criada
