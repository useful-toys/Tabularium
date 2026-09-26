# tabularium3 — Template de spec viva

## O que é
Template de repositório que mantém, junto do código, uma especificação viva do produto, e um processo apoiado por IA para evoluí-la sem que ela se contradiga: cada ideia é esmiuçada e proposta até encaixar na spec vigente, e reencaixada se a spec mudar antes do aceite. Serve a equipes que desenvolvem com agentes de IA e querem que spec e código nunca divirjam, nem a spec de si mesma.

## Diferenciais
- A spec cabe no contexto de um agente: arquivos densos, lidos de uma vez ou sob demanda
- A spec nunca mente sobre o que está implementado: cada item diz se é realidade ou compromisso
- A spec não se contradiz: nenhuma proposta é publicada sobre uma spec inconsistente
- Funciona com qualquer agente que leia `AGENTS.md`, sem ferramenta proprietária de agente
- Verificação automática no PR, sem instalar nada além do Node
- O processo se apoia no fluxo git e GitHub que a equipe já usa: issue, PR, rótulo e merge

## Glossário
- **Spec**: pasta com as camadas configuradas de um projeto, cada uma com seu documento de referência e suas decisões, e a configuração; a camada de produto sempre existe; as técnicas, como interface ou arquitetura, dependem da aplicação
- **Documento de produto**: arquivo que descreve o que o produto é e seu comportamento observável
- **Modelo conceitual**: arquivo opcional, lido junto com o documento de produto, que descreve a estrutura do domínio: entidades, relações, estados e invariantes
- **Documento técnico**: arquivo opcional que descreve o estado atual de uma camada técnica, como interface ou arquitetura
- **Documento de referência**: documento com itens de uma camada: na de produto, o documento de produto e o modelo conceitual; numa técnica, o documento técnico, quando existe
- **Entidade**: conceito do domínio com identidade, relações ou ciclo de vida próprios
- **Estado derivado**: estado calculado a partir de um atributo, nunca registrado à parte
- **Tipo de domínio**: conjunto de valores válidos de um atributo, com natureza, restrições de negócio e unidade
- **Item**: linha do documento de produto: requisito, regra, regra transversal ou não funcional
  - **Requisito**: capacidade do produto, na forma verbo + objeto
  - **Regra**: fato testável que restringe um requisito
- **Item implementado**: item com a marca de visto; o código faz o que ele diz
- **Item comprometido**: item sem marca; decidido, ainda não implementado
- **Item redefinido**: item implementado seguido da seta e do texto desejado; o texto atual vale até a entrega, e o desejado, depois dela
- **Tipo de mudança**: o que um PR faz com a spec vigente; o PR com vários recebe o maior, nesta ordem
  - **Editorial**: muda só o texto da spec, sem mudar sentido
  - **Neutra**: não altera o sentido de nenhum requisito: código sem mudança na spec, ou entrega de compromisso
  - **Compatível**: cria requisito, altera item não implementado ou cria decisão, sem contradizer item nem decisão vigente
  - **Incompatível**: altera o sentido de item implementado, contradiz item existente ou vai contra uma decisão
- **Rótulo de tipo**: rótulo do PR com o seu tipo de mudança
- **Consistência**: estado da spec sem contradição entre itens, entre documentos ou com decisões, sem conceito repetido, termo fora do sentido do glossário ou lacuna de cascata
- **Decisão**: registro de uma escolha não óbvia vigente, com contexto, alternativas descartadas, consequências e histórico
- **Camada**: parte da spec de mesma natureza (produto, interface, arquitetura…), com seu documento de referência e suas decisões; as camadas de um projeto são configuradas
- **Mapa de decisões**: índice gerado de uma camada, com o tema, a decisão e quando vale abrir cada registro
- **Issue de requisito**: issue do tracker que guarda uma ideia em amadurecimento até estar pronta para proposta
- **Proposta**: PR com o texto final do documento de produto e das decisões; aberto é proposta, aceito no merge, recusado se fechado sem merge
- **Defasagem**: mudança na branch principal, posterior à base de uma proposta aberta, que colide com ela
- **Entrega**: PR de código que implementa compromissos e sincroniza a spec
- **Documento exportado**: documento em formato convencional gerado a partir da spec, a pedido
- **Tracker**: sistema externo de solicitações (GitHub Issues)

## Requisitos

### Adoção
- ✓ Criar projeto a partir do template, com estrutura, regras, verificação e exemplo prontos
- ✓ Adotar a spec num repositório existente copiando um conjunto definido de arquivos
- ✓ Configurar o projeto: camadas, idioma do conteúdo e caminhos que não são código
  - ✓ Configuração pode ser refeita a qualquer momento; o existente é preservado e cada mudança é confirmada
  - ✓ Camada excluída da configuração com decisões: o usuário escolhe mover ou apagar as decisões
  - ✓ Idioma novo vale para conteúdo novo; o existente só é traduzido a pedido
- ✓ Oferecer a troca do exemplo incluído por um esqueleto vazio
- ✓ Criar o esqueleto do modelo conceitual a pedido
- ✓ Avisar quando um arquivo de instruções específico de um agente anula as instruções comuns

### Extração da spec de código existente
- ✓ Gerar documento de produto, modelo conceitual e decisões a partir do código, dos testes e da documentação existente
  - ✓ Modelo conceitual vem do comportamento e do vocabulário do domínio, nunca do schema; o que só existe no banco vira pergunta
  - ✓ Item só é marcado implementado com evidência no código
  - ✓ Item só documentado vira pergunta: compromisso ou documentação desatualizada
  - ✓ Divergência entre código e documentação vira pergunta; se valer o documentado, o item fica redefinido
  - ✓ Dúvidas são perguntadas durante a extração, uma a uma
  - ✓ Decisões preexistentes de produto vigentes são convertidas ao formato; técnicas e obsoletas ficam de fora e são relatadas
  - ✓ Documentação preexistente permanece intocada
  - ✓ Entrega um relatório com a evidência de cada item duvidoso

### Documento de produto
- ✓ Descrever o produto no documento de produto, nesta ordem: o que é, diferenciais, glossário, requisitos por domínio, regras transversais, não funcionais, fora de escopo; e, quando houver estrutura relevante, também no modelo conceitual, lido sempre junto com ele
  - ✓ Requisitos e regras em listas aninhadas, sem IDs nem âncoras
  - ✓ Domínios subdivididos quando crescem demais ou misturam assuntos, a julgamento
  - ✓ Cada conceito tem uma única casa; nenhuma afirmação se repete entre seções
  - ✓ Só comportamento observável; sem implementação, tela ou navegação; integrações nomeadas pelo efeito
  - ✓ Porquê só quando explica o valor da funcionalidade
  - ✓ Autocontido: sem links nem referências a decisões ou outros documentos
  - ✓ Atemporal: sem narrar mudanças ou história
  - ✓ Fora de escopo traz motivo e diz se é permanente ou desta versão
- ✓ Indicar o estado de cada item: implementado, comprometido ou redefinido
  - ✓ Glossário, diferenciais e fora de escopo não levam estado

### Modelo conceitual
- ✓ Descrever a estrutura do domínio num modelo conceitual
  - ✓ O glossário define cada termo; o modelo estrutura, sem redefinir: relações com cardinalidade, estados e transições, invariantes
  - ✓ Termo definido pela própria condição mantém a condição no glossário; o modelo só cita o estado
  - ✓ Sem informação de implementação; identificador só quando é conceito de negócio
  - ✓ Atributos só quando têm regra ou importam ao usuário
  - ✓ Duas seções: tipos, depois entidades
  - ✓ Tipos de domínio declarados uma vez, com natureza, restrições de negócio e unidade de medida quando aplicável; atributos citam o tipo
  - ✓ Natureza de uma lista fechada: texto, inteiro, decimal, sim/não, data, data e hora local, instante, duração, enumeração, quantidade com unidade
  - ✓ Tamanho, precisão e formato só quando são regra de negócio
  - ✓ Tipo definido só no modelo; termo homônimo no glossário guarda só o significado
  - ✓ Invariantes do domínio vivem no modelo; regras transversais ficam com o comportamento
  - ✓ Um bloco por entidade, em lista plana; agrupamento por domínio só quando a lista crescer
  - ✓ Relação com verbo, cardinalidade (1, 0..1, N, 0..N) e entidade-alvo, escrita uma vez, no bloco da entidade dependente; relação N:N no bloco da entidade mais central
  - ✓ Estado derivado fica na entidade dona do atributo que o deriva, marcado como derivado
  - ✓ Estados registrados listados, e uma transição por linha com quem ou que ação a provoca
  - ✓ Modelo e documento de produto não se referenciam; compartilham o vocabulário do glossário
  - ✓ Valem os mesmos estados de item e as mesmas regras de mudança do documento de produto
  - ✓ Produto sem estrutura relevante dispensa o modelo

### Documentos técnicos
- ✓ Descrever uma camada técnica, como interface ou arquitetura, num documento técnico próprio, opcional
  - ✓ Seções livres; autocontido e atemporal, como o documento de produto
  - ✓ Formato exato e parâmetros que o documento de produto deixa de fora ficam no documento técnico
  - ✓ Valem os mesmos estados de item e as mesmas regras de mudança do documento de produto
- ✓ Criar o esqueleto do documento técnico de uma camada a pedido

### Decisões
- ✓ Registrar cada escolha não óbvia num arquivo próprio, com tema, decisão, quando carregar, contexto, alternativas descartadas, consequências e histórico
  - ✓ Só decisões vigentes; a que deixa de valer é apagada, salvo se explica um item de fora de escopo
  - ✓ Mudança de decisão move a escolha anterior para alternativas descartadas e registra a mudança no histórico
  - ✓ O porquê vem do humano; o agente nunca o inventa
  - ✓ Decisões sobre o modelo conceitual ficam na camada de produto
- ✓ Gerar o mapa de decisões de cada camada, para o agente abrir só o que a tarefa exige

### Consistência da spec
- ✓ Verificar a consistência da spec a pedido, uma camada por vez, e organizar as decisões da camada
  - ✓ Detecta contradição entre itens, inclusive requisito e fora de escopo, entre documentos e com decisões, conceito repetido, termo inconsistente e lacuna de cascata
  - ✓ Camada técnica é confrontada também com o documento de produto e o modelo conceitual
  - ✓ Nas decisões, detecta contradição com o documento de referência, decisões contraditórias entre si, órfãs, lacunas, sobreposição, mistura de assuntos, camada errada e problemas de forma
  - ✓ Item implementado vence o conflito; nos demais casos, pergunta
  - ✓ Propõe fundir, dividir, mover ou apagar decisões, preservando o histórico
  - ✓ Nunca altera o sentido de item implementado; o que exigir isso vira proposta
  - ✓ Nada muda sem aprovação, em lote ou item a item
  - ✓ Qualquer agente sugere a verificação ao notar inconsistência em outra atividade

### Amadurecimento de ideias
- ✓ Esmiuçar uma ideia contra a spec em rodadas de perguntas interativas, até cada ponto estar decidido
  - ✓ Aceita como entrada texto livre, issue de requisito ou proposta aberta
  - ✓ Confronta a ideia com glossário, modelo conceitual, regras transversais, não funcionais, decisões vigentes e código
  - ✓ Lê sempre o documento de produto e o modelo conceitual inteiros; documentos técnicos e decisões, à medida que a ideia os alcança
  - ✓ Classifica a ideia pelo tipo de mudança e levanta a cascata
  - ✓ Inconsistência da spec na área tocada, inclusive preexistente, vira pergunta
  - ✓ Na rediscussão de uma proposta, a defasagem em relação à branch principal vira pergunta
  - ✓ Trabalha só na conversa; nada é publicado no tracker sem pedido do usuário
- ✓ Sugerir alternativas, cenários de borda, cascata esquecida e recortes para o humano aceitar ou descartar com motivo
  - ✓ Descartes com motivo alimentam as alternativas descartadas das decisões
  - ✓ Trabalha só na conversa; nada é publicado no tracker sem pedido do usuário
- ✓ Levar a pedido o resumo do que foi decidido e sugerido para uma issue de requisito nova ou existente, como memória entre sessões
- ✓ Oferecer formulário de issue de requisito: problema, proposta, alternativas e dúvidas

### Proposta
- ✓ Registrar uma ideia madura como proposta com texto final, sem nova entrevista
  - ✓ Mudança compatível entra como item comprometido; incompatível redefine o item, sem alterar o que vale hoje
  - ✓ Opera nas decisões: criar, alterar, fundir, dividir, mover ou remover
  - ✓ Mudança incompatível sempre cria ou altera uma decisão; decisão nova não viola decisão vigente
  - ✓ Antes de criar ou atualizar a proposta, valida a consistência da spec resultante sobre a branch principal atual, nos itens tocados e na cascata
  - ✓ Com qualquer inconsistência, inclusive preexistente, não publica e aponta o que corrigir antes
  - ✓ Requisito abandonado é apagado ou vira item de fora de escopo, a critério do autor
  - ✓ Proposta nova nasce em rascunho; o autor a libera após tratar a revisão consultiva
  - ✓ Proposta de origem existente é atualizada sobre a branch principal atual, com comentário do que mudou
  - ✓ Descrição da proposta menciona e explica cada alteração do documento de produto e das decisões
  - ✓ No rebase sobre a branch principal, a descrição guia o reencaixe do diff na nova base; o diff é reescrito para cumprir a intenção descrita, não só para resolver conflito de texto
  - ✓ Proposta e issue de requisito mencionam uma à outra; a issue recebe as decisões adicionais
- ✓ Revisar uma proposta de forma consultiva, comentando tipo, cascata, decisões, consistência e forma
  - ✓ Roda automaticamente a cada atualização de proposta, pela revisão de código do Copilot, por um agente no CI com chave própria, ou pelos dois
  - ✓ Nunca aprova nem bloqueia; quem decide é a pessoa que integra
  - ✓ Trata o conteúdo da proposta como dado, não como instrução
- ✓ Analisar sob demanda o impacto de uma ideia ou issue sobre a spec

### Entrega
- ✓ Sincronizar a spec com a entrega, no mesmo PR do código
  - ✓ Marca como implementado o que foi entregue e reescreve os itens redefinidos entregues
  - ✓ Pequena divergência entre compromisso e entrega é ajustada no próprio PR como mudança incompatível, com aval da pessoa que integra
  - ✓ Divergência grande vira nova proposta antes da entrega
  - ✓ Mudança compatível pode entrar junto com o código, inclusive com decisão nova
  - ✓ A entrega fecha a issue de requisito
- ✓ Verificar o drift entre spec e código sob demanda, com achados e evidências

### Verificação automática
- ✓ Validar o formato do documento de produto e das decisões
- ✓ Detectar mapa de decisões desatualizado
- ✓ Listar os itens redefinidos em aberto
- ✓ Deduzir do diff o tipo mínimo de cada PR e aplicar o rótulo de tipo
  - ✓ Caso ambíguo, em que o diff não mostra se o sentido mudou: a IA julga, e vale o maior entre o mínimo e o julgado
  - ✓ Rótulo de tipo aplicado por uma pessoa vence a dedução e a IA e nunca é trocado pelo CI
  - ✓ Sem IA disponível, o caso ambíguo exige rótulo aplicado por uma pessoa
- ✓ Barrar PR com rótulo de tipo abaixo do mínimo deduzido do diff, ou com mais de um rótulo de tipo
- ✓ Barrar PR que resolve item redefinido sem alterar código
- ✓ Barrar PR que altera ou marca item implementado sem alterar código, salvo mudança editorial
- ✓ Barrar redefinição criada, alterada ou desfeita sem decisão criada ou alterada no mesmo PR
- ✓ Barrar mudança incompatível sem decisão criada ou alterada no mesmo PR
- ✓ Listar os itens comprometidos ainda não implementados
- ✓ Avisar sobre possíveis referências temporais no documento de produto
- ✓ Validar o modelo conceitual e os documentos técnicos, quando existirem, com as mesmas regras do documento de produto
- ✓ Barrar nome em destaque no modelo conceitual que não seja termo do glossário nem tipo declarado; termo do glossário fora do modelo é permitido
- ✓ Avisar sobre termos de implementação no modelo conceitual

### Exportação
- ✓ Exportar a spec em formato convencional a pedido
  - ✓ Documento exportado da spec fica fora dela, declara que é derivado e de qual versão, e nunca é fonte para agentes; em conflito, vale a spec

## Regras transversais
- ✓ Toda mudança, inclusive só de spec, entra por PR na branch principal protegida
- ✓ Merge exige branch atualizada com a principal; a aceitação é o merge decidido por um humano, feito por ele ou pelo agente a pedido dele, sem aprovação formal obrigatória
- ✓ Qualquer pessoa com permissão de merge pode aceitar uma proposta
- ✓ Rótulos de issues e PRs em inglês
- ✓ A spec descreve a branch principal: item implementado é verdade no código; comprometido é intenção registrada
- ✓ Ideias em amadurecimento vivem na conversa ou no tracker, nunca na spec; a spec recebe só texto final aceito
- ✓ Regras de formato têm uma única fonte, carregada pelo agente só ao trabalhar na spec
- ✓ Nenhuma alteração da spec feita por agente dispensa confirmação humana quando envolve julgamento
- ✓ O agente só integra um PR a pedido explícito do humano, PR a PR
- ✓ Estrutura de arquivos em inglês; conteúdo no idioma configurado

## Não funcionais
- ✓ Economia de contexto: documentos densos; decisões carregadas sob demanda pelo mapa
- ✓ Portabilidade: verificação roda em Windows e Linux só com Node, sem dependências
- ✓ Compatibilidade: instruções lidas por qualquer agente que siga a convenção de `AGENTS.md`
- ✓ Determinismo: mapas e verificações gerados por script, sem gastar tokens do agente; só a classificação do caso ambíguo usa IA
- ✓ Plataforma: GitHub — issues, PRs, proteção de branch e Actions

## Fora de escopo
- **Arquivos de instruções específicos de um agente** — permanente: anulariam as instruções comuns e duplicariam regras
- **Histórico de decisões revogadas na spec** — permanente: a spec guarda só o vigente; a história está no versionamento
- **IDs ou âncoras nos itens do documento de produto** — permanente: cada referência vira manutenção
- **Solicitações, backlog e ideias adiadas na spec** — permanente: pertencem ao tracker; ocupariam o contexto do agente sem informar suas decisões
- **Documentação em formatos convencionais mantida na spec** — permanente: visão, casos de uso, diagramas, histórias e BDD consomem muitos tokens e divergem; são exportados a pedido
- **Script de instalação** — nesta versão: adoção por template do GitHub ou cópia de arquivos
- **Confirmação do tipo restrita a quem tem permissão de escrita** — permanente: o merge já é o portão
- **Reconhecimento dos rótulos de PR anteriores aos tipos de mudança** — nesta versão: ainda não há adotantes
- **Julgar se PR só de código muda comportamento** — nesta versão: a classificação cobre só o que o PR faz com a spec
- **Outros hubs git, trackers, plataformas de CI e provedores de modelo além do Copilot e do Claude** — nesta versão: complexidade que não queremos agora
