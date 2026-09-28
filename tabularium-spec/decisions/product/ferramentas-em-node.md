---
tema: Linguagem das ferramentas do template
decisao: Um script Node, só com módulos nativos; só o comando de instalação é em sh e ps1
carregar-quando: mudança em scripts, dependências ou requisitos de ambiente para rodar a verificação
---
- Decisão: geração de mapas e verificação ficam num script Node, sem dependências, rodando igual no Windows e no Linux do CI; a exceção é o comando de instalação, em sh e ps1 finos, que só baixam e copiam pelo manifesto
- Contexto: gerar mapas por script evita gastar tokens e dá resultado determinístico; o usuário não queria depender de Python; o curl e o `irm` já existem antes de haver qualquer arquivo do tabularium no projeto
- Alternativas descartadas
  - Python só com biblioteca padrão: ainda exige o runtime Python
  - PowerShell 7: raro em máquinas Linux e macOS; o Windows PowerShell antigo difere
  - Binário Go: exige compilar e publicar binários por plataforma
  - Comando de instalação em Node: comando menos familiar, e o Node passa a ser exigido antes da instalação
- Consequências
  - Ganha: sem instalação além do Node, presente na maioria das máquinas de desenvolvimento e no CI
  - Aceita: repositórios sem Node precisam instalá-lo para verificar a spec; o comando de instalação tem a mesma lógica em dois scripts

## Histórico
- 2026-09-28 #19: comando de instalação em sh e ps1
- 2026-09-24 plano-inicial: decisão criada
