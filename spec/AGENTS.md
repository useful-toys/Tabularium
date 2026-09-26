# Regras da spec

Regras para ler e escrever em `spec/`. Valem para humanos e agentes.

## Arquivos
- `product.md`: o que o produto é e como se comporta. Fonte da verdade do comportamento.
- `model.md` (opcional): modelo conceitual, a estrutura do domínio. Quando existe, é lido sempre junto com o `product.md`. Produto sem estrutura relevante dispensa o modelo.
- `<camada>.md` (opcional): documento técnico de uma camada além de `product` (ex.: `interface.md`, `architecture.md`).
- `decisions/<camada>/*.md`: uma decisão vigente por arquivo. Camadas em `config.json`. Nenhuma camada se chama `model`, nome reservado ao modelo conceitual; o modelo de dados usa a camada `data`.
- `decisions/<camada>/README.md`: mapa gerado por `node scripts/spec.mjs build-map`. Nunca editar à mão.
- `config.json`: preferências do projeto (camadas, idioma, caminhos que não são código). Alterado só pela skill `spec-init`.

`product.md`, `model.md` e os documentos técnicos são os **documentos com itens**. As regras de Status e de Mudanças valem para os três.

## product.md

### Conteúdo
- Só o que o produto é e o comportamento observável por usuário ou sistema cliente.
- Porquê só quando explica o valor da funcionalidade ("facilita conferir com o álbum real"). Por que foi feito deste jeito e não de outro vai numa decisão. Motivo técnico nunca entra.
- Não descreve implementação, tela, layout nem navegação.
- Integração é nomeada pelo efeito ("exporta a coleção em JSON para salvar no computador"), sem formato nem protocolo.
- Limites e conteúdos de saída entram pelo *o quê* ("desfaz até as 10 últimas alterações"). Formato exato fica nos docs de interface.
- Critério: se mudar o dado muda o que o usuário pode fazer ou recebe, é produto. Se muda só como ele vê, não é.
- Autocontido: sem links, sem citações de decisões, sem referências a outros documentos.
- Atemporal: escrito no presente. Nunca narra mudança ou história ("atual", "antigo", "removido", "migração", "corrige", "passa a").
- Sem IDs nem âncoras. Nenhuma instrução de formato dentro do arquivo.

### Seções, nesta ordem
1. `# <Produto> — <subtítulo>`
2. `## O que é`: 2–3 linhas, propósito e público.
3. `## Diferenciais`: lista curta.
4. `## Glossário`: `- **Termo**: definição`. Subtipos aninhados. Entidade com estados lista os estados e as transições numa linha.
5. `## Requisitos`: agrupados por domínio em `###`.
6. `## Regras transversais`: regras que valem para vários requisitos. Cada uma declara o próprio alcance.
7. `## Não funcionais`: `- <Aspecto>: <exigência>`.
8. `## Fora de escopo`: `- **Item** — permanente|nesta versão: motivo`.

### Requisitos
- Item de primeiro nível = requisito, na forma verbo + objeto ("Exportar a coleção…").
- Sub-itens = regras do requisito: uma frase declarativa curta, um fato testável.
- Terceiro nível só quando indispensável.
- `Nota:` só para esclarecimento ou limitação consciente.
- Domínios (`###`) têm hierarquia dinâmica. Subdivida (`####`) quando o grupo passar de ~10 requisitos ou misturar assuntos distintos.

### Uma casa por conceito
- O glossário define os termos. As transversais trazem só regras que o glossário não cobre.
- Nenhuma afirmação se repete em duas seções.
- Dados de referência extensos (tabelas, catálogos) ficam no código, não na spec.

## model.md

### Conteúdo
- O glossário do `product.md` define cada termo. O modelo estrutura, sem redefinir: relações com cardinalidade, estados e transições, invariantes.
- Termo definido pela própria condição mantém a condição no glossário. O modelo só cita o estado.
- Invariantes do domínio vivem no modelo. Regras transversais ficam com o comportamento, no `product.md`.
- Vem do comportamento e do vocabulário do domínio, nunca do schema. Sem implementação (colunas de ID, sequences, índices, colunas de relacionamento). Identificador só quando é conceito de negócio.
- Atributos só quando têm regra ou importam ao usuário.
- Modelo e `product.md` não se referenciam: compartilham o vocabulário do glossário. As regras de autocontido e atemporal do `product.md` valem aqui.
- Decisões sobre o modelo ficam na camada `product`.

### Seções, nesta ordem
1. `# <Produto> — Modelo conceitual`
2. `## Tipos`: `- **Tipo**: <natureza>; <restrições de negócio>; <unidade>`. Cada tipo de domínio declarado uma vez.
3. `## Entidades`: um bloco por entidade, `- **Entidade**`, com as linhas dela aninhadas. Lista plana; agrupe por domínio (`###`) só quando a lista crescer.

### Tipos
- Natureza de uma lista fechada: texto, inteiro, decimal, sim/não, data, data e hora local, instante, duração, enumeração, quantidade com unidade.
- Tamanho, precisão e formato só quando são regra de negócio.
- O tipo é definido só no modelo. Termo homônimo no glossário guarda só o significado.
- Atributo cita o tipo: `- <atributo>: **Tipo**`.

### Entidades
- Relação: `- <verbo> <cardinalidade> **Entidade**`, com cardinalidade `1`, `0..1`, `N` ou `0..N`. Escrita uma vez, no bloco da entidade dependente. Relação N:N vai no bloco da entidade mais central.
- Estado derivado fica na entidade dona do atributo que o deriva, marcado `(derivado)`, sem repetir a condição.
- Estados registrados: `- estados: A | B`. Uma transição por linha: `- A → B: <quem ou que ação a provoca>`.
- Nome em negrito é sempre termo do glossário ou tipo declarado. O CI verifica. Termo do glossário que não aparece no modelo é permitido.

## Documentos técnicos
- `<camada>.md` descreve o estado atual de uma camada técnica, como interface ou arquitetura. É opcional, e as decisões da camada existem com ou sem ele.
- `# <Produto> — <Camada>`, com seções livres.
- Autocontido e atemporal, como o `product.md`: sem links nem referências a decisões.
- Formato exato, layout e parâmetros que o `product.md` deixa de fora vêm para cá (ex.: o formato do texto exportado vai para `interface.md`).

## Status
- `- ✓ <texto>`: implementado. Vale para todo item dos documentos com itens: no `product.md`, requisito, regra, transversal e não funcional; no `model.md`, cada linha de tipo e de entidade.
- `- <texto>` (sem marcador): planejado e comprometido. Ideia não comprometida vai para o tracker.
- `- ✓ <o que vale hoje> ⇢ <o desejado>`: mudança significativa comprometida sobre algo implementado. O lado direito é o texto completo que substituirá a linha. Numa remoção, `⇢ (removido)`.
- O que é, Diferenciais, Glossário, Fora de escopo e `Nota:` não levam marcador.

## Mudanças
- Toda mudança entra por PR. A `main` é protegida: exige branch atualizada antes do merge. Se a equipe exigir aprovação, as aprovações são descartadas quando há commits novos.
- Uma ideia amadurece na conversa, com `/spec-grill` e `/spec-ideas`. Quando precisa de memória entre sessões, vai a pedido para uma issue (label `requirement`) com `/spec-issue`. O PR de proposta traz o **texto final** dos documentos com itens e das decisões, nunca ideias soltas. PR sem issue vale se a ideia já estiver madura.
- PR de proposta: labels `requirement` e `spec-only`, sem código. PR aberto é proposta; o merge, decidido por um humano, é a aceitação e torna o conteúdo compromisso; não há aprovação formal obrigatória. O agente só integra a pedido explícito do humano, PR a PR. PR fechado sem merge é proposta recusada.
- Acréscimo que não contradiz nada entra sem `✓`. O PR da entrega adiciona o `✓`.
- Item sem `✓`, ou o lado direito de um `⇢`, pode ser ajustado num PR de proposta.
- Mudança significativa: altera o sentido de um item `✓`, contradiz um item existente (inclusive transversal ou NF) ou vai contra uma decisão. Mudar a redação sem mudar o sentido não conta.
  - Entra antes do código, como `⇢` na linha mais baixa afetada: na regra, se só a regra muda; no requisito, se ele muda inteiro. Se algo novo contradiz um item `✓`, o `⇢` vai no item contradito.
  - Criar, alterar ou desfazer um `⇢` exige decisão alterada no mesmo PR. O CI verifica.
  - Entrega: o item é reescrito conforme a nova realidade, mantém o `✓` e o `⇢` some, no mesmo PR do código.
  - Desistência: remove-se o `⇢` e o lado direito, e a decisão volta à escolha anterior.
- Requisito abandonado: apagar, ou transformar em item de Fora de escopo com motivo.
- PR de código:
  - Resolver um `⇢` ou marcar `✓` exige código no mesmo PR.
  - Não cria nem altera `⇢` e não altera decisões. Exceção: pequena divergência entre entrega e compromisso, com a label `spec-mismatch` e o aval da pessoa que integra.
  - Mudança pequena (acréscimo ou ajuste sem `⇢` e sem mexer em decisões) pode vir junto com o código, já com `✓`.
  - Altera a spec. PR de código que não muda comportamento (refatoração, teste, correção sem efeito no que a spec descreve) leva a label `no-spec-change`. O CI verifica.
  - Cita a issue com `Closes #N`: a issue fecha na entrega.
- Alterar o lado esquerdo de uma linha `✓` sem código só com a label `spec-only` (correção de redação).

## Decisões

### Quando criar
- Toda escolha não óbvia: houve alternativa que alguém poderia propor de novo, ou um trade-off aceito conscientemente.
- A decisão nasce junto com o item comprometido que ela justifica.
- Nunca invente o porquê. Se ele não for conhecido, pergunte ao humano.

### Arquivo
- Nome: só o slug do tema (`confirmacao-de-ajustes.md`), sem número.
- Pasta plana, só decisões vigentes. A que deixa de valer é apagada, e a história fica no git.
- Exceção: decisão que explica um item de Fora de escopo continua, como "por que não fazer".
- Decisão de produto não traz justificativa técnica. Esse motivo vai para uma camada técnica.

### Formato
```markdown
---
tema: <a questão decidida>
decisao: <a escolha, em uma frase curta>
carregar-quando: <situações em que vale abrir este arquivo>
---
- Decisão: <a escolha, detalhada>
- Contexto: <o problema, 1–3 linhas>
- Alternativas descartadas
  - <alternativa>: <motivo>
- Consequências
  - Ganha: <…>
  - Aceita: <…>

## Histórico
- AAAA-MM-DD <#N da issue ou do PR>: <o que mudou>
```
- O histórico é a última seção, com a entrada mais recente no topo.
- Quando a decisão muda, a escolha anterior entra em "Alternativas descartadas" com o motivo do abandono, e o histórico ganha uma entrada.
- Reorganizações usam `AAAA-MM-DD organização: <fundida com X | dividida de X | movida de <camada> | migrada de <documento de origem>>`.
- Depois de criar, editar, mover ou apagar decisões, rode `node scripts/spec.mjs build-map`.

### Leitura
- Leia o mapa da camada (`README.md`) e abra só as decisões cujo `carregar-quando` corresponda à tarefa.

## Exportação
- A spec não mantém documentos em formatos convencionais (visão, casos de uso, diagramas, histórias, BDD). Quando alguém pedir um deles, gere-o a partir da spec.
- O exportado fica fora de `spec/` e abre declarando que é derivado, de qual spec e de qual versão (commit da `main`), e que não é fonte para agentes: em conflito, vale a spec.
- Nunca use um documento exportado como fonte ao trabalhar na spec ou no código.

## Inconsistências
- Ao notar, em qualquer atividade, uma inconsistência entre decisões e os documentos com itens, sugira ao usuário rodar `/spec-reconcile`. Não corrija fora desse fluxo.
