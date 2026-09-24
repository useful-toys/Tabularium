---
tema: Formato do modelo conceitual
decisao: Um bloco por entidade, relações com cardinalidade escritas uma vez, estados derivados marcados, uma transição por linha
carregar-quando: mudança na organização, na notação de relações, cardinalidades, estados ou transições do modelo conceitual
---
- Decisão: duas seções, tipos e entidades; na de entidades, lista plana de blocos, um por entidade em negrito, agrupados por domínio só quando a lista crescer; relação como `- <verbo> <card> **Entidade**`, com cardinalidade 1, 0..1, N ou 0..N, escrita uma vez no bloco da entidade dependente, e a N:N no bloco da entidade mais central; estado derivado fica na entidade dona do atributo que o deriva, marcado `(derivado)`, sem repetir a condição; estados registrados em `- estados: A | B` e uma transição por linha, `- A → B: <quem ou que ação>`; as marcas de estado de item e as regras de mudança são as do documento de produto; o arquivo é opcional
- Contexto: o formato precisa mostrar numa leitura tudo o que toca uma entidade, ser denso para agentes e permitir marcar cada linha como implementada ou comprometida
- Alternativas descartadas
  - Seções por tipo (entidades, relações, estados, invariantes): uma entidade espalhada em quatro lugares
  - Relação escrita nos dois lados: duplica e diverge
  - Rótulo antes da cardinalidade: menos legível
  - N:N pela ordem alfabética: pouco natural
  - N:N sempre como entidade de associação: força conceito artificial
  - Entidade explícita para o par figurinha × coleção: termo novo sem ganho
  - Transições numa linha só: impede marcar cada transição
  - Cardinalidade em texto livre: cada autor escreve de um jeito
  - Modelo sem marcas de estado: não mostraria compromissos
  - Modelo obrigatório: arquivo vazio em produtos sem estrutura relevante
- Consequências
  - Ganha: estrutura escaneável, verificável e com estado por linha
  - Aceita: decidir o lado dependente e a entidade central exige julgamento

## Histórico
- 2026-09-24 #1: decisão criada
