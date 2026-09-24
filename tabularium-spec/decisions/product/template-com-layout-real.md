---
tema: Forma de distribuir o template
decisao: Repositório template com o layout de um projeto real, sem pasta de template nem instalador
carregar-quando: mudança na forma de adotar o template, na estrutura de pastas ou em instalação
---
- Decisão: os arquivos ficam exatamente onde ficarão na aplicação; adoção por "Use this template" do GitHub ou cópia de uma lista de arquivos; o exemplo preenchido vem na própria spec
- Contexto: o template precisa ser lido e testado como um projeto de verdade
- Alternativas descartadas
  - Pasta de template aninhada com script de instalação: o repositório não se parece com o que será entregue e exige manter um instalador
  - Exemplo em pasta separada: o exemplo não seria validado como spec de verdade
- Consequências
  - Ganha: o que se vê é o que se adota; a verificação roda no próprio template
  - Aceita: quem adota substitui o exemplo e apaga a spec do próprio template

## Histórico
- 2026-09-24 plano-inicial: decisão criada
