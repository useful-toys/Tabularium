---
tema: Linguagem das ferramentas do template
decisao: Um script Node, só com módulos nativos
carregar-quando: mudança em scripts, dependências ou requisitos de ambiente para rodar a verificação
---
- Decisão: geração de mapas e verificação ficam num script Node, sem dependências, rodando igual no Windows e no Linux do CI
- Contexto: gerar mapas por script evita gastar tokens e dá resultado determinístico; o usuário não queria depender de Python
- Alternativas descartadas
  - Python só com biblioteca padrão: ainda exige o runtime Python
  - PowerShell 7: raro em máquinas Linux e macOS; o Windows PowerShell antigo difere
  - Binário Go: exige compilar e publicar binários por plataforma
- Consequências
  - Ganha: sem instalação além do Node, presente na maioria das máquinas de desenvolvimento e no CI
  - Aceita: repositórios sem Node precisam instalá-lo para verificar a spec

## Histórico
- 2026-09-24 plano-inicial: decisão criada
