---
tema: Onde ficam as instruções para agentes
decisao: Só em AGENTS.md - processo na raiz, regras de formato na pasta da spec
carregar-quando: mudança em instruções para agentes, compatibilidade entre agentes ou onde vivem as regras de formato
---
- Decisão: a raiz tem um AGENTS.md só com o processo; a pasta da spec tem um AGENTS.md aninhado, fonte única das regras de formato, carregado quando o agente trabalha nela; não há arquivo de instruções específico de agente; na raiz, o processo fica num bloco delimitado, que a atualização troca sem tocar o que o projeto escreveu fora dele; a instalação e a preparação se recusam a seguir enquanto houver arquivo de instruções do Claude na raiz ou na pasta da spec, e orientam migrá-lo à mão
- Contexto: o template deve funcionar com vários agentes; e regras de formato só são necessárias quando se lê ou escreve a spec; com o arquivo de instruções do Claude presente, o Claude Code ignora o AGENTS.md, e o tabularium ficaria inativo sem que ninguém percebesse
- Alternativas descartadas
  - Arquivo de instruções do Claude importando o AGENTS.md: a presença dele faz o Claude Code ignorar os AGENTS.md aninhados e quebra a compatibilidade desejada
  - Regras na raiz: carregadas em toda sessão, mesmo sem tocar a spec
  - Regras em README da spec, lido por instrução: depende de o agente obedecer a um "leia antes"
  - Regras dentro das skills: indisponíveis para agentes sem skills e duplicadas entre skills
  - Só avisar sobre o arquivo de instruções do Claude e instalar mesmo assim: instalação que parece pronta e não funciona
  - Instalação que acrescenta ao arquivo de instruções do Claude uma linha apontando para o AGENTS.md: edita um arquivo que não é do tabularium, contra a instalação determinística
- Consequências
  - Ganha: uma fonte de regras, carregada automaticamente e só quando preciso
  - Aceita: as regras também entram quando o agente só lê a spec; quem tem arquivo de instruções do Claude migra à mão antes de instalar

## Histórico
- 2026-09-28 #19: processo em bloco delimitado; recusa com arquivo de instruções do Claude
- 2026-09-24 plano-inicial: decisão criada
