---
tema: Como o ciclo de mudança é executado
decisao: Skills para cada etapa, check determinístico bloqueante e revisão por agente só consultiva, feita pelo Copilot, pelo Claude ou pelos dois
carregar-quando: mudança nas etapas do ciclo, nas skills, no papel do CI ou em agentes no CI
---
- Decisão: esmiuçar, sugerir, levar à issue, propor, revisar, sincronizar, verificar, extrair, configurar e organizar são skills; o CI bloqueia só com regras determinísticas do script; um agente revisa propostas e comenta, sem bloquear: o revisor de código do Copilot, seguindo o REVIEW.md, e/ou o Claude num job do CI com chave própria, à escolha de quem adota
- Contexto: processo só descrito em texto se perde; e um agente que decide sozinho pode ser manipulado pelo próprio conteúdo que avalia, além de variar entre execuções
- Alternativas descartadas
  - Só documentação e modelos: sem garantia de que o ciclo é seguido
  - Skills sem CI: nada impede um PR que quebre a sincronia
  - Agente no CI como bloqueio: vulnerável a instruções embutidas na proposta e não determinístico
  - Análise só pelo autor, localmente: depende de lembrar de rodar
  - Um único agente revisor fixo: prende o template a uma assinatura ou chave específica
- Consequências
  - Ganha: ciclo guiado por agente, protegido por regras estáveis e com revisão sempre presente
  - Aceita: duas configurações a manter coerentes (REVIEW.md e o prompt do job); o Copilot não mantém o comentário único da revisão

## Histórico
- 2026-09-24 #3: skill para levar a discussão à issue
- 2026-09-24 plano-inicial: revisor consultivo configurável entre Copilot code review e Claude
- 2026-09-24 plano-inicial: revisão consultiva por agente no CI; análise deixa de depender do autor
- 2026-09-24 plano-inicial: decisão criada
