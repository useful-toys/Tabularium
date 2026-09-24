---
tema: Documentação em formatos convencionais
decisao: A spec não mantém visão, casos de uso, diagramas, histórias ou BDD; esses documentos são exportados da spec a pedido
carregar-quando: pedido de documentação em formatos convencionais, exportação da spec ou documentos derivados dela
---
- Decisão: a spec mantém só o documento de produto, o modelo conceitual e as decisões, mínimos e compactos; documentos convencionais de mercado (visão, casos de uso, diagramas, histórias, BDD) não são mantidos; quem precisar deles pede ao agente que os exporte da spec; o exportado pode ser versionado fora da spec, declara que é derivado e de qual versão, e nunca é fonte para agentes
- Contexto: a spec é densa para caber no contexto do agente; a documentação convencional repete o mesmo conteúdo em outra forma, é muito intensiva em tokens e diverge da spec
- Alternativas descartadas
  - Manter documentos convencionais na spec: consomem muitos tokens, duplicam conteúdo e divergem
  - Escrever a própria spec num formato convencional: muitos tokens por regra e menos precisão para agentes
  - Gerar os documentos no CI a cada merge: gasta tokens sem que ninguém tenha pedido
- Consequências
  - Ganha: spec mínima e sempre única fonte; documentos convencionais disponíveis quando alguém precisa
  - Aceita: o exportado versionado fica defasado até ser exportado de novo; skills dedicadas de exportação ficam para quando houver demanda

## Histórico
- 2026-09-24 #4: decisão criada
