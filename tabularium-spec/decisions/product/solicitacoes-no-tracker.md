---
tema: Onde vivem ideias, solicitações e o trabalho de uma mudança
decisao: Ideias amadurecem na conversa e, a pedido, no tracker; análise e discussão em comentários da issue e do PR; o repositório guarda só texto final aceito
carregar-quando: mudança em integração com tracker, backlog, requisitos futuros, planos ou onde fica a análise de impacto
---
- Decisão: ideias e solicitações guardadas vivem no GitHub Issues; ideias adiadas viram issues de requisito na milestone `someday`, por convenção manual; resumos de amadurecimento vão para a issue a pedido; análise de impacto e revisão ficam em comentários da issue e do PR; o repositório não guarda planos, só o documento de produto e as decisões aceitos
- Contexto: um documento de produto real acumulava requisitos futuros e decisões pendentes; e planos versionados duplicavam o que a issue e o PR já registram
- Alternativas descartadas
  - Pasta de mudanças no repositório com solicitação e impacto: duplica o tracker
  - Seção de requisitos futuros no documento de produto: gasta tokens do contexto permanente com algo muito improvável de ser usado, que não informa as decisões do agente
  - Arquivo de backlog separado na spec: continua sendo backlog no lugar errado
  - Plano por task em arquivo na spec: duplica o PR e fica obsoleto após a entrega
  - Milestone `v2`: sugere uma versão planejada, e as ideias adiadas não são compromisso
- Consequências
  - Ganha: spec só com o que é ou foi aceito; discussão junto de quem participa dela
  - Aceita: histórico da discussão depende do tracker; ideias adiadas só são vistas filtrando o tracker

## Histórico
- 2026-09-24 #7: tracker só GitHub Issues; ideias adiadas na milestone `someday`, por convenção manual; Jira descartado
- 2026-09-24 #3: resumos de amadurecimento vão para a issue só a pedido
- 2026-09-24 plano-inicial: planos por task saem do repositório; análise e plano viram comentários da issue e do PR
- 2026-09-24 plano-inicial: decisão criada
