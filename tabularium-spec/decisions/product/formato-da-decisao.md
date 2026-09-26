---
tema: Formato do registro de decisão
decisao: Frontmatter tema, decisao e carregar-quando; corpo em lista com a decisão primeiro e o histórico por último
carregar-quando: mudança nos campos ou nas seções do registro de decisão
---
- Decisão: frontmatter com o tema (a questão), a decisão em frase curta e quando carregar; corpo com Decisão, Contexto, Alternativas descartadas, Consequências e a seção Histórico por último, com data, número da issue ou do PR (ou a marca de organização) e uma linha por entrada
- Contexto: o agente deve saber, pelo mapa, se precisa abrir o arquivo e, ao abrir, parar na primeira linha se só precisa saber o que foi decidido
- Alternativas descartadas
  - Só resumo no frontmatter: sem o tema, o mapa não diz qual questão foi decidida
  - Sem frontmatter, mapa extraído do corpo: perde o campo de quando carregar
  - Título no corpo: repete o tema
  - Campos de afetados, tags, origem e decisores: referências a manter ou dados que o versionamento já tem
- Consequências
  - Ganha: mapa informativo gerado sem ler o corpo; leitura em profundidade só quando preciso
  - Aceita: três campos a manter coerentes com o corpo

## Histórico
- 2026-09-26 #13: histórico cita issue, PR ou organização
- 2026-09-24 plano-inicial: decisão criada
