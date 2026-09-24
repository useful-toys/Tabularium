---
tema: Plataforma e processo em que o template se apoia
decisao: Git e GitHub - issue como fila, PR como proposta, merge como aceitação, Actions e Copilot; amarração consciente
carregar-quando: mudança em plataforma, hub git, tracker, CI, provedor de modelo ou em novo estado ou fluxo de processo
---
- Decisão: o processo usa as primitivas do git e do GitHub em vez de criar as suas
  - Issue é a fila de descobertas, discussões e mudanças na base de conhecimento; PR aberto é proposta, merge é aceitação, fechado sem merge é recusa; rascunho e rótulos marcam o andamento
  - Fluxo convencional: branch principal protegida, branch atualizada antes do merge, aprovação descartada a cada commit; nada de branch ou fluxo próprio da spec
  - A história fica no git; o repositório guarda só o que vale agora, sem discussões nem textos de transição
  - Texto feito para o diff: um fato por linha, mudança comprometida na mesma linha
  - Verificação no GitHub Actions; revisão consultiva pelo Copilot por padrão, com o Claude como opção de quem adota
  - O template assume o GitHub; transpor os conceitos para outra plataforma fica com quem adota
- Contexto: é a plataforma que a equipe já usa; um processo de spec com estados, ferramentas ou fluxos próprios exigiria aprendizado e reinventaria revisão, aprovação e auditoria
- Alternativas descartadas
  - Ferramenta própria de requisitos, com estados e aprovação: processo novo a aprender e a manter
  - Wiki, Confluence ou Notion: spec fora do repositório, diverge do código
  - Estados de proposta e discussão dentro do arquivo: duplica o que issue e PR já registram e gasta contexto
  - Branch ou repositório só da spec: fluxo paralelo; spec e código deixam de mudar juntos
  - Jira e outros trackers fora do hub: complexidade que não queremos agora; pode voltar se o template se mostrar útil
  - Outros hubs git, plataformas de CI e provedores de modelo: idem
- Consequências
  - Ganha: nenhuma curva de aprendizado; revisão, aprovação, permissões e auditoria do hub reaproveitadas; spec e código mudam no mesmo PR; qualquer agente já sabe operar git e `gh`
  - Aceita: amarração ao GitHub; garantias dependem da configuração do hub (proteção, rótulos, CI); discussão e recusas presas ao hub; quem não opera PR participa pelo hub ou por documentos exportados; até ajuste mínimo exige PR

## Histórico
- 2026-09-24 #7: decisão criada
