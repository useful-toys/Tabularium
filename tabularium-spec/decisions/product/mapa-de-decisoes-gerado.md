---
tema: Descoberta das decisões pelo agente
decisao: Mapa plano por camada, gerado por script, com tema, decisão e quando carregar
carregar-quando: mudança no mapa de decisões, na forma de o agente achar decisões ou na ligação entre decisões e domínios
---
- Decisão: cada camada tem um índice gerado a partir do frontmatter, uma linha por decisão; o agente lê o índice e abre só as decisões cujo quando-carregar corresponde à tarefa; o índice não se liga aos domínios do documento de produto
- Contexto: carregar todas as decisões gasta contexto; ligar decisões a domínios cria referência que quebra quando os domínios são subdivididos
- Alternativas descartadas
  - Índice escrito à mão: gasta tokens para gerar e fica desatualizado
  - Campo de domínio em cada decisão: exige manutenção quando os domínios mudam
  - Só o resumo, sem quando carregar: o agente tende a abrir tudo por precaução
- Consequências
  - Ganha: descoberta barata e determinística
  - Aceita: a qualidade depende de o quando-carregar ser bem escrito

## Histórico
- 2026-09-24 plano-inicial: decisão criada
