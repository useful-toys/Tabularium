---
tema: Documento de referência das camadas técnicas e documentos auxiliares
decisao: Um documento obrigatório por camada técnica fundamental declarada e documentos auxiliares opcionais declarados pelo nome na configuração, todos com seções livres e as mesmas regras de itens do documento de produto; arquivo de documento que a configuração não declara é erro
carregar-quando: mudança em documentos técnicos fundamentais ou auxiliares, no documento de referência de uma camada, em arquitetura e integração na spec ou nas camadas e nos documentos declarados na configuração
---
- Decisão: cada camada declarada além da de produto tem um documento técnico fundamental, obrigatório, nomeado pela camada, que descreve o estado atual dela; a camada é fundamental quando a alteração dela depois da adoção causa grande impacto, e cada projeto define as suas; as seções são livres; valem as regras comuns do documento de produto (autocontido, atemporal, estados de item e regras de mudança), verificadas pelo mesmo script, que falha quando falta o documento de uma camada declarada; documentos técnicos auxiliares descrevem questões complementares, de menor impacto e independentes das camadas fundamentais, e são opcionais, mas só existem se declarados pelo nome em uma lista própria da configuração, separada da lista de camadas; o documento auxiliar declarado tem as mesmas regras de formato, não tem pasta de decisões, e as decisões sobre ele ficam na camada de produto, como as do modelo conceitual; o script falha quando o documento auxiliar declarado não existe e quando há arquivo de documento na raiz da spec que a configuração não declara como camada nem como auxiliar, e recusa nome repetido, fora do padrão, reservado ou comum a camada e a auxiliar; o modelo conceitual não se declara: existe quando o arquivo existe; a organização de decisões usa o documento fundamental como referência da camada; como o modelo conceitual ocupa o nome model, a camada do modelo de dados se chama data
- Contexto: camadas variam por projeto; estrutura rígida viraria burocracia; uma camada declarada sem documento deixa a organização de decisões sem estado atual de referência, e nenhum projeto usa o tabularium ainda, o que dispensa período de transição; o auxiliar não estava na configuração e por isso nenhuma verificação o via: um documento auxiliar com link ou referência a decisão passava em branco, e a única forma de validá-lo era declará-lo como camada, o que lhe impunha pasta de decisões e o tratava como fundamental
- Alternativas descartadas
  - Estrutura definida por camada: cada projeto tem camadas diferentes, e seções fixas viram burocracia
  - Só decisões, sem documento: a camada técnica perde o estado atual que a organização de decisões usa como referência
  - Documento opcional por camada: a camada declarada ficava sem referência, e a verificação não podia exigir nada dela; o custo do arquivo vazio some porque só se declara camada que importa
  - Aviso em vez de erro quando falta o documento: só faria sentido com projetos já adotando o tabularium
  - Validar todo arquivo de documento da raiz da spec, sem declaração: o arquivo solto passaria a ser verificado sem ninguém ter pedido, e a configuração deixaria de dizer quais documentos a spec tem; era a alternativa sem campo novo
  - Declarar o auxiliar como camada: lhe impõe pasta de decisões e mapa e o mistura com os documentos fundamentais; era a única forma de validá-lo
  - Ignorar o auxiliar na verificação: o documento descrito como "com as mesmas regras de formato" ficava sem nenhuma delas; era o comportamento anterior
  - Declarar também o modelo conceitual na configuração: o modelo é parte da camada de produto e já se reconhece pelo arquivo, e uma declaração a mais só criaria um jeito de os dois divergirem
  - Auxiliar com pasta de decisões própria: um documento complementar e de menor impacto raramente tem escolhas que justifiquem uma camada de decisões
- Consequências
  - Ganha: camada técnica com estado atual verificável, sem impor forma; a configuração separa as camadas dos documentos auxiliares, e nenhum documento fica fora da verificação
  - Aceita: a qualidade da estrutura depende de quem escreve; o nome model fica reservado; declarar uma camada obriga a escrever o documento; quem já tem documento auxiliar solto precisa declará-lo ao atualizar, o que o `/spec-init` conduz com o usuário; decisão sobre um documento auxiliar mora na camada de produto, e não junto de uma camada técnica

## Histórico
- 2026-09-30 #25: documento auxiliar passa a ser declarado em lista própria da configuração, validado como os demais e sem pasta de decisões; arquivo de documento não declarado é erro
- 2026-09-30 #21: documento da camada declarada passa a ser obrigatório; auxiliares opcionais; a verificação exige o documento
- 2026-09-26 #13: decisão criada
