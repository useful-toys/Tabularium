---
tema: Adoção da spec num repositório
decisao: Duas etapas - estrutura e preferências reexecutável; extração a partir de código com perguntas durante
carregar-quando: mudança em adoção, configuração do projeto ou extração da spec de código existente
---
- Decisão: uma etapa cria só a estrutura e grava as preferências numa configuração lida por scripts e skills, podendo ser refeita para mudar a configuração; outra etapa extrai a spec de código existente, marcando implementado só com evidência no código, perguntando a cada dúvida e deixando a documentação antiga intocada; decisões preexistentes vigentes migram para a camada de produto ou para a camada técnica configurada, e as técnicas sem camada e as obsoletas ficam de fora e são relatadas
- Contexto: repositório novo não tem o que extrair; repositório com código ou documentação antiga precisa de engenharia reversa assistida
- Alternativas descartadas
  - Uma etapa única com modos: mistura configuração com extração
  - Uma etapa por cenário (novo, código sem spec, código com documentação): código com e sem documentação só diferem nas fontes
  - Preferências registradas em texto nas regras: o script teria de ler Markdown
  - Perguntas acumuladas no fim da extração: retrabalho quando uma resposta muda o resto
  - Apagar ou mover a documentação antiga: o humano decide depois
  - Decisões técnicas sempre de fora, só relatadas: deixa sem casa um conhecimento que a camada técnica configurada já comporta, e o relatório vira uma segunda migração manual
- Consequências
  - Ganha: repositório novo adota em minutos; extração sem marcas de implementado infundadas; decisões técnicas vigentes chegam à camada configurada, com a mesma regra de vigência da camada de produto
  - Aceita: extração lenta e interativa

## Histórico
- 2026-09-24 #12: decisões técnicas vigentes migram para a camada técnica configurada
- 2026-09-24 plano-inicial: decisão criada
