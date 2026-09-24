---
tema: Onde ficam as instruções para agentes
decisao: Só em AGENTS.md - processo na raiz, regras de formato na pasta da spec
carregar-quando: mudança em instruções para agentes, compatibilidade entre agentes ou onde vivem as regras de formato
---
- Decisão: a raiz tem um AGENTS.md só com o processo; a pasta da spec tem um AGENTS.md aninhado, fonte única das regras de formato, carregado quando o agente trabalha nela; não há arquivo de instruções específico de agente
- Contexto: o template deve funcionar com vários agentes; e regras de formato só são necessárias quando se lê ou escreve a spec
- Alternativas descartadas
  - Arquivo de instruções do Claude importando o AGENTS.md: a presença dele faz o Claude Code ignorar os AGENTS.md aninhados e quebra a compatibilidade desejada
  - Regras na raiz: carregadas em toda sessão, mesmo sem tocar a spec
  - Regras em README da spec, lido por instrução: depende de o agente obedecer a um "leia antes"
  - Regras dentro das skills: indisponíveis para agentes sem skills e duplicadas entre skills
- Consequências
  - Ganha: uma fonte de regras, carregada automaticamente e só quando preciso
  - Aceita: as regras também entram quando o agente só lê a spec

## Histórico
- 2026-09-24 plano-inicial: decisão criada
