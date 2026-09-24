---
tema: Drift entre decisões e documento de produto
decisao: Organização sob demanda, uma camada por vez, com aprovação humana e PR só-spec
carregar-quando: mudança na organização de decisões, em detecção de inconsistências ou em fusão, divisão e movimentação de decisões
---
- Decisão: um processo a pedido confronta as decisões de uma camada com o documento de referência, propõe fundir, dividir, mover ou apagar, rascunha lacunas sem inventar o porquê e só aplica o que o humano aprovar, numa branch própria; item implementado vence conflitos; qualquer agente sugere o processo ao notar inconsistência em outra atividade
- Contexto: com o tempo, surgem decisões parecidas, contraditórias, obsoletas, faltantes ou tratando de mais de um assunto
- Alternativas descartadas
  - Todas as camadas a cada execução: caro em contexto
  - Cruzar camadas na mesma execução: aumenta o escopo sem necessidade; decisão fora do lugar é movida e a sobreposição no destino fica para a próxima execução
  - Só relatório, sem aplicar: deixa o trabalho braçal para o humano
  - Sugestão automática por contagem de decisões: sinal fraco; a inconsistência percebida é o gatilho real
  - Modo da verificação de drift: a verificação roda em todo ciclo; a organização é ocasional
- Consequências
  - Ganha: pasta de decisões coerente, com histórico preservado nas fusões e divisões
  - Aceita: depende de alguém pedir ou de um agente notar

## Histórico
- 2026-09-24 plano-inicial: decisão criada
