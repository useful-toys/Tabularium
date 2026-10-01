# tabularium3 — Template de spec viva

## O que é
Conjunto instalável de regras, instruções, verificação e skills que mantém, junto do código de um repositório, uma especificação viva do produto, e um processo apoiado por IA para evoluí-la sem que ela se contradiga: cada ideia é esmiuçada e proposta até casar com a spec vigente, e casada de novo se a spec mudar antes do aceite. Serve a equipes que desenvolvem com agentes de IA e querem que spec e código nunca divirjam, nem a spec de si mesma.

## Diferenciais
- A spec cabe no contexto de um agente: arquivos densos, lidos de uma vez ou sob demanda
- A spec nunca mente sobre o que está implementado ou será implantado: cada item diz se é realidade ou compromisso
- A spec não se contradiz: nenhuma proposta inconsistente é incorporada na spec vigente
- Só a spec vigente fica no repositório: as ideias amadurecem fora dele, até virarem propostas consistentes com a spec vigente
- Funciona com qualquer agente que leia `AGENTS.md`, sem ferramenta proprietária de agente
- O processo se apoia no fluxo git e GitHub que a equipe já usa: issue, PR, rótulo e merge

## Glossário
- **Spec**: pasta com as camadas configuradas de um projeto, cada uma com seu documento de referência e suas decisões, os documentos técnicos auxiliares declarados e a configuração, com os textos de idioma quando o idioma não é embutido; a camada de produto sempre existe; as técnicas fundamentais, como arquitetura ou integração, dependem da aplicação
- **Documento de produto**: arquivo que descreve o que o produto é e seu comportamento observável
- **Modelo conceitual**: arquivo opcional, lido junto com o documento de produto, que descreve a estrutura do domínio: entidades, relações, estados e invariantes
- **Documento técnico**: arquivo que descreve o estado atual de uma camada técnica, como arquitetura ou integração; o fundamental, de uma camada declarada, é obrigatório, e o auxiliar, sobre questões complementares como telas, fluxos ou guia de estilo, é opcional, só existe se declarado na configuração e não é camada
- **Documento de referência**: documento com itens de uma camada: na de produto, o documento de produto e o modelo conceitual; numa técnica, o documento técnico fundamental
- **Entidade**: conceito do domínio com identidade, relações ou ciclo de vida próprios
- **Estado derivado**: estado calculado a partir de um atributo, nunca registrado à parte
- **Tipo de domínio**: conjunto de valores válidos de um atributo, com natureza, restrições de negócio e unidade
- **Item**: linha de um documento com itens, isto é, do documento de produto (requisito, regra, regra transversal ou não funcional), do modelo conceitual ou de um documento técnico
  - **Requisito**: capacidade do produto, na forma verbo + objeto
  - **Regra**: fato testável que restringe um requisito
- **Item implementado**: item com a marca de visto; o código faz o que ele diz
- **Item comprometido**: item sem marca; decidido, ainda não implementado
- **Item redefinido**: item implementado seguido da seta e do texto desejado, ou da indicação de remoção; o texto atual vale até a entrega, e o desejado, depois dela; na remoção, o item deixa de existir
- **Tipo de mudança**: o que um PR faz com a spec vigente; o PR com vários recebe o maior, nesta ordem
  - **Editorial**: muda só o texto da spec, sem mudar sentido
  - **Neutra**: não altera o sentido de nenhum requisito: código sem mudança na spec, ou entrega de compromisso
  - **Compatível**: cria requisito, altera item não implementado ou cria decisão, sem contradizer item nem decisão vigente
  - **Incompatível**: altera o sentido de item implementado, contradiz item existente ou vai contra uma decisão
- **Rótulo de tipo**: rótulo do PR com o seu tipo de mudança; existe no repositório, mas por ora nada o aplica nem o exige
- **Consistência**: estado da spec sem contradição entre itens, entre documentos ou com decisões, sem conceito repetido, termo fora do sentido do glossário ou lacuna de cascata
- **Decisão**: registro de uma escolha não óbvia vigente, com contexto, alternativas descartadas, consequências e histórico
- **Camada**: parte da spec de mesma natureza (produto, arquitetura, integração…), com seu documento de referência e suas decisões; as camadas de um projeto são configuradas
- **Mapa de decisões**: índice gerado de uma camada, com o tema, a decisão e quando vale abrir cada registro
- **Issue**: solicitação registrada no tracker; nasce sem triagem e, depois dela, é requirement, bug, plan ou descartada
- **Ideia**: intenção de mudar o produto ou a spec, ainda em amadurecimento, que nasce numa pessoa, numa issue ou na conversa
- **Conversa**: diálogo entre a pessoa e o agente de IA, centro do ciclo, onde uma ideia ou issue é triada, entendida e ampliada, sem publicar nada no tracker
- **Requirement issue**: issue do tracker triada como requirement, que guarda o entendimento mais recente de uma ideia em amadurecimento, até estar pronta para proposta
- **Triagem**: comparação de uma issue ou ideia com a spec, feita na conversa, que a resolve de três formas: vira requirement issue, vira bug issue ou é descartada; a issue de plano é reconhecida e, por ora, recusada; a issue sem essa resolução está sem triagem
- **Bug issue**: issue triada como comportamento que contradiz item implementado, que não segue o ciclo de requisitos; a conversa a recusa por ora, e ela terá tratamento próprio, por skills dedicadas, ainda por especificar
- **Portão da proposta**: condição para uma conversa virar proposta: ideia triada como requirement issue, nada necessário em aberto e spec resultante consistente
- **Proposta**: PR sem código com o texto final dos documentos com itens e das decisões, de qualquer tipo de mudança; aberto é proposta, aceito no merge, recusado se fechado sem merge
- **Conferência por agente**: comentário de um agente de IA que confronta o texto final de uma proposta com a spec vigente, julga o tipo da mudança e confere as regras de PR, sem ver a conversa; nunca aprova nem bloqueia
- **Fila de aceite**: conjunto das propostas abertas, cada uma à espera de ser aceita ou recusada
- **Defasagem**: mudança na branch principal, posterior à base de uma proposta aberta, que colide com ela
- **Entrega**: PR de código que implementa compromissos e sincroniza a spec
- **Documento exportado**: documento em formato convencional gerado a partir da spec, a pedido
- **Documento derivado**: documento gerado a partir da definição do tabularium, como o README e os guias de instalação, configuração e manutenção; nunca é fonte, e em conflito vale a spec
- **Tracker**: sistema externo de solicitações (GitHub Issues)
- **Tabularium**: conjunto versionado de regras, instruções, verificação e skills que se instala num projeto, sem produto de exemplo; a spec dele descreve o template e nunca chega aos projetos
- **Arquivos do tabularium**: arquivos que a instalação copia para o projeto; nunca incluem a spec do próprio tabularium nem os documentos derivados
- **Processo**: regras de como a spec evolui, que o tabularium coloca em `AGENTS.md`, num bloco delimitado
- **Preparação**: etapa depois da instalação, que pode ser refeita: prepara o repositório, configura o projeto, cria a estrutura da spec e, depois de uma atualização, adapta a spec ao formato novo
- **Caminhos de código**: pastas ou arquivos da configuração onde está o código do produto; cada um abrange tudo o que começa por ele, e só o que está neles conta como código nas regras de PR

## Requisitos

### Adoção
- ✓ Instalar o tabularium num repositório, novo ou existente, com um comando
  - ✓ Instala a última versão publicada, ou a versão informada
  - ✓ Copia para o projeto só os arquivos do tabularium
  - ✓ Sem `AGENTS.md`, cria o arquivo só com o processo
  - ✓ Com `AGENTS.md`, coloca o processo no início do arquivo e não toca no resto
  - ✓ Registra no projeto a origem, a versão e os arquivos instalados
  - ✓ Recusa instalar enquanto existir `CLAUDE.md` na raiz ou em `spec/`, que anularia o `AGENTS.md`, e orienta migrá-lo à mão
  - ✓ Recusa instalar no repositório do próprio tabularium
  - ✓ Recusa instalar quando o `AGENTS.md` tem os marcadores do processo incompletos ou repetidos, e orienta corrigi-lo à mão
  - ✓ Recusa instalar quando não há versão publicada, quando a versão está fora do padrão numerado ou quando a versão não traz a lista de arquivos a copiar
  - ✓ Nunca faz commit; o resultado entra por PR
- ✓ Preparar o repositório remoto no GitHub
  - ✓ Cria os rótulos de issue (`requirement`, `bug`, `plan`) e os de PR (`spec-editorial`, `spec-neutral`, `spec-compatible`, `spec-incompatible`) que ainda não existem, sem que nada os aplique ou exija por ora
  - ✓ Sugere a proteção da branch principal e a conferência por agente, configurações do repositório remoto que se ligam e desligam: para cada uma, verifica a situação atual no repositório remoto e pergunta ao usuário o que deseja, mostrando a atual
  - ✓ Se a situação atual já é a desejada, não faz nada; senão, liga ou desliga, depois de dizer ao usuário o que vai alterar e de ele confirmar
  - ✓ Ligar ou desligar é configurar o repositório remoto, ou apresentar como fazê-lo manualmente se o usuário preferir
  - ✓ A proteção da branch principal faz o merge exigir PR, o check `spec-check-format` e a branch atualizada; se o usuário a desliga, a skill avisa o risco: o merge deixa de exigir PR, o check e a branch atualizada, e uma proposta pode ser integrada sem revalidação depois de outra aceita antes dela
  - ✓ A conferência por agente, em que um agente de IA confere cada proposta contra a spec vigente, é a do GitHub ou a do Claude, e só uma fica ligada: ligar a escolhida desliga a outra; se o usuário não quer nenhuma, a skill avisa o risco: a proposta é validada só quanto ao formato e à integração com a base, sem quem confira as regras de PR, e pode integrar sem conflito e ainda assim contradizer a spec vigente
  - ✓ A chave de acesso que a conferência pelo Claude exige é criada pela pessoa: a skill só orienta como criá-la e nunca a recebe
- ✓ Configurar o projeto: camadas, documentos técnicos auxiliares, idioma do conteúdo e caminhos de código
  - ✓ Pode ser refeita a qualquer momento: mantém os valores existentes e confirma cada mudança
  - ✓ Camada excluída da configuração que tem decisões: o usuário escolhe entre mover as decisões para outra camada e apagá-las
  - ✓ Documento técnico auxiliar é declarado pelo nome, só a pedido do usuário; excluído da configuração, o usuário escolhe entre apagar o arquivo e transformá-lo em camada fundamental
  - ✓ Arquivo de documento na spec que a configuração não declara, como numa atualização, é apresentado ao usuário, que escolhe entre declará-lo como documento auxiliar, declará-lo como camada ou apagá-lo
  - ✓ Idioma novo vale para o conteúdo novo; o existente só é traduzido a pedido
  - ✓ Idioma cujas mensagens de verificação o tabularium não traz recebe as mensagens num arquivo da spec do projeto
  - ✓ Lista de caminhos de código vazia significa projeto sem código, e a pergunta se repete a cada configuração
- ✓ Criar a estrutura da spec do projeto a partir da configuração
  - ✓ Cria o documento de produto, sem requisitos, e uma pasta de decisões para cada camada
  - ✓ Cria o documento técnico fundamental, só com o título, de cada camada técnica
  - ✓ Cria o modelo conceitual só a pedido
  - ✓ Cria um documento técnico auxiliar só a pedido, e o declara na configuração
  - ✓ Cria só o que falta; nada existente é sobrescrito
- ✓ Atualizar o tabularium de um projeto com o mesmo comando
  - ✓ Vale na atualização o que vale na instalação, além do que segue
  - ✓ Sobrescreve os arquivos do tabularium, que ficam idênticos aos da versão instalada, e troca só o processo em `AGENTS.md`
  - ✓ Apaga os arquivos do tabularium que saíram da versão nova
  - ✓ Recusa instalar versão menor que a instalada, salvo pedido explícito
  - ✓ Avisa ao cruzar uma versão maior, que exige adaptar a spec ao formato
- ✓ Adaptar a spec às regras de formato da versão nova do tabularium, no mesmo PR da atualização
  - ✓ Nunca muda o sentido de um item; o que exigir isso vira proposta
  - ✓ Cada adaptação é confirmada com o usuário, em lote ou item a item
- ✓ Publicar o tabularium em versões numeradas, quando uma pessoa decide
  - ✓ A versão maior muda quando a spec dos projetos precisa ser adaptada ao formato; a escolha das demais fica com quem publica

### Extração da spec de código existente
- ✓ Gerar documento de produto, modelo conceitual e decisões a partir do código, dos testes e da documentação existente
  - ✓ Modelo conceitual vem do comportamento e do vocabulário do domínio, nunca do schema; o que só existe no banco vira pergunta
  - ✓ Item só é marcado implementado com evidência no código
  - ✓ Item só documentado vira pergunta: compromisso ou documentação desatualizada
  - ✓ Divergência entre código e documentação vira pergunta; se valer o documentado, o item fica redefinido
  - ✓ Dúvidas são perguntadas durante a extração, uma a uma
  - ✓ Decisões preexistentes vigentes são convertidas ao formato: as de produto, na camada de produto; as técnicas, na camada técnica correspondente, quando ela existe, e senão ficam de fora; as obsoletas não migram; as que ficam de fora e as obsoletas são relatadas
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
- ✓ Descrever cada camada técnica fundamental, como arquitetura ou integração, num documento técnico próprio, obrigatório para a camada declarada
  - ✓ Documento técnico auxiliar, sobre questões complementares e de menor impacto, como telas ou guia de estilo, é opcional, declarado na configuração e independente das camadas fundamentais
    - ✓ Não tem pasta de decisões: as decisões sobre ele ficam na camada de produto
  - ✓ Seções livres; autocontido e atemporal, como o documento de produto
  - ✓ Formato exato e parâmetros que o documento de produto deixa de fora ficam no documento técnico
  - ✓ Valem os mesmos estados de item e as mesmas regras de mudança do documento de produto

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
  - ✓ Aceita como entrada texto livre, issue ou proposta aberta; da issue lê o corpo, como entendimento atual, e os comentários, como histórico
  - ✓ Começa pela triagem da ideia e a mantém em aberto durante toda a conversa
  - ✓ Confronta a ideia com glossário, modelo conceitual, regras transversais, não funcionais, decisões vigentes e código
  - ✓ Lê sempre o documento de produto e o modelo conceitual inteiros; documentos técnicos e decisões, à medida que a ideia os alcança
  - ✓ Classifica a ideia pelo tipo de mudança e levanta a cascata
  - ✓ Inconsistência da spec na área tocada, inclusive preexistente, vira pergunta
  - ✓ Na rediscussão de uma proposta, a defasagem em relação à branch principal vira pergunta
  - ✓ Trabalha só na conversa; nada é publicado no tracker sem pedido do usuário
- ✓ Sugerir alternativas, cenários de borda, cascata esquecida e recortes para o humano aceitar ou descartar com motivo
  - ✓ Descartes com motivo alimentam as alternativas descartadas das decisões
  - ✓ Trabalha só na conversa; nada é publicado no tracker sem pedido do usuário
- ✓ Fazer a triagem de uma issue ou ideia contra a spec, na conversa, como sugestão que uma pessoa confirma
  - ✓ A conversa aceita como origem uma ideia, uma issue sem triagem ou uma requirement issue já triada; a triagem é um processo contínuo da conversa, sem etapa definida, e a IA pode sugerir alterar uma triagem já decidida quando o entendimento amadurece; a alteração vale com a confirmação de uma pessoa
  - ✓ A issue só está triada quando vira requirement issue, vira bug issue ou é descartada; sem nenhum dos rótulos requirement, bug ou plan, está sem triagem
  - ✓ A issue sem conversa continua sem triagem, sem automação
  - ✓ Pede spec nova, diferente ou sem um item, ou a spec é omissa ou ambígua: requirement issue, que segue o ciclo
  - ✓ Contradiz item implementado: bug; a conversa sugere a bug issue, aplicando o rótulo bug à issue de origem ou, se a origem é uma ideia, criando a issue; a conversa a recusa por ora e aponta que ela terá tratamento próprio, por skills dedicadas, ainda por especificar
  - ✓ Já é coberta pela spec, inclusive por item comprometido e ainda não implementado, ou não é problema: descartada; a issue de origem é fechada como descartada, com um comentário que aponta o item, e a ideia de origem é abandonada sem publicar nada
  - ✓ Mistura de bug e requirement: separa em duas issues ligadas
  - ✓ O que quem abre a issue acha que ela é vale só como palpite; o rótulo aplicado por uma pessoa vence a sugestão
  - ✓ A sugestão vem da análise de impacto; o esmiuçar a resolve com o usuário quando não está clara, inclusive para a ideia nascida na conversa
  - ✓ A issue de plano, com o rótulo plan, é reconhecida e, por ora, recusada na conversa, que aponta que ela terá tratamento próprio, por skills dedicadas, ainda por especificar
- ✓ Levar a pedido para uma requirement issue, nova ou existente, o que foi decidido e sugerido na conversa
  - ✓ Uma ideia nasce numa issue aberta por uma pessoa ou numa conversa com o agente
  - ✓ O corpo da issue é o entendimento mais recente: evidência da triagem, problema, decidido, descartado com motivo, cascata e o que está em aberto
  - ✓ Cada vez que o resumo é levado, o corpo é reescrito e um comentário novo registra o resumo da rodada
  - ✓ No primeiro toque numa issue existente, o texto original é guardado, sem alteração, como primeiro comentário da IA, com o título Solicitação original; o primeiro toque é reconhecido pela falta desse comentário
  - ✓ Pessoas contribuem por comentários; o corpo é mantido pelo agente
  - ✓ O corpo é conferido com o estado publicado antes de ser reescrito, para não sobrescrever edição concorrente
- ✓ Oferecer um formulário de issue com a descrição e o palpite de quem abre (bug, requisito ou não sei), sem aplicar rótulo, para a issue chegar sem triagem

### Proposta
- ✓ Registrar uma ideia madura como proposta com texto final, sem nova entrevista
  - ✓ Mudança compatível entra como item comprometido; incompatível redefine o item, sem alterar o que vale hoje
  - ✓ Remover um item implementado é mudança incompatível: o item fica redefinido com a indicação de remoção no lugar do texto desejado, e vale até a entrega
  - ✓ Opera nas decisões: criar, alterar, fundir, dividir, mover ou remover
  - ✓ Mudança incompatível sempre cria ou altera uma decisão; decisão nova não viola decisão vigente
  - ✓ Antes de criar ou atualizar a proposta, valida a consistência da spec resultante sobre a branch principal atual, nos itens tocados e na cascata
  - ✓ Com qualquer inconsistência, inclusive preexistente, não publica e aponta o que corrigir antes
  - ✓ Aplica o portão da proposta: só abre a proposta se a ideia estiver madura o bastante para casar com a spec vigente; senão devolve à conversa com o que falta
    - ✓ Triagem: a ideia foi triada como requirement issue; bug e descarte não viram proposta
    - ✓ Nada em aberto: nenhuma pergunta necessária fica sem resposta
    - ✓ Porquê registrado: cada decisão tem o seu porquê e as alternativas descartadas
    - ✓ Sem contradição: a spec resultante, com os documentos técnicos fundamentais e as decisões, não se contradiz, inclusive entre itens, entre documentos, com decisões e entre requisito e fora de escopo
    - ✓ Uma casa por conceito: nenhum conceito aparece repetido em dois lugares
    - ✓ Vocabulário do glossário: nenhum termo é usado fora do sentido do glossário, e todo termo do domínio está definido
    - ✓ Cascata completa: nenhum item depende de outro que não existe mais
    - ✓ Mudança declarada: só contraria item ou decisão vigente quem declara isso, com a seta e uma decisão criada ou alterada
    - ✓ Inconsistência preexistente na spec vigente também impede a proposta, e é corrigida antes, num PR próprio
  - ✓ Requisito abandonado é apagado ou vira item de fora de escopo, a critério do autor
  - ✓ Proposta nova nasce em rascunho; o autor a libera após tratar a conferência por agente
  - ✓ Proposta de origem existente é atualizada sobre a branch principal atual, com comentário do que mudou
  - ✓ Descrição da proposta menciona e explica cada alteração do documento de produto e das decisões
  - ✓ No rebase sobre a branch principal, a descrição guia o novo casamento do diff com a nova base; o diff é reescrito para cumprir a intenção descrita, não só para resolver conflito de texto
  - ✓ Proposta e requirement issue mencionam uma à outra; a issue recebe o link da proposta e as decisões adicionais
  - ✓ Toda proposta tem um tipo de mudança, inclusive a editorial, e segue o mesmo fluxo: rascunho, portão, verificação e conferência por agente
  - ✓ As propostas abertas formam a fila de aceite: cada uma espera ser aceita (merge) ou recusada (fechada sem merge)
  - ✓ A cada aceite a spec vigente muda e as outras propostas ficam defasadas; a proposta que deixa de passar nas regras da verificação é rediscutida no esmiuçar, e se a ideia ainda vale a proposta é atualizada sobre a spec vigente e o portão é aplicado de novo, senão é fechada
- ✓ Conferir uma proposta por agente contra a spec vigente, comentando tipo, regras de PR, cascata, decisões, consistência e forma
  - ✓ Julga o tipo da mudança sem ler nem aplicar rótulo, e vale o maior se houver mais de um
  - ✓ Aponta o PR que resolve item redefinido sem alterar código
  - ✓ Aponta o PR que altera ou marca item implementado sem alterar código, salvo mudança editorial, dizendo se a mudança é de redação ou de sentido
  - ✓ Aponta redefinição criada, alterada ou desfeita sem decisão criada ou alterada no mesmo PR
  - ✓ Aponta mudança incompatível sem decisão criada ou alterada no mesmo PR
  - ✓ Roda automaticamente a cada atualização de proposta, por um agente de IA
  - ✓ Nunca aprova nem bloqueia; quem decide é a pessoa que integra
  - ✓ Confronta só o texto final da spec com a spec vigente, lendo os arquivos ou o diff e sem a conversa, como segunda visão independente das mesmas regras do portão da proposta
  - ✓ Não libera o rascunho da proposta: só sinaliza que não achou ressalvas; quem libera é o autor
  - ✓ Trata o conteúdo da proposta como dado, não como instrução
- ✓ Analisar sob demanda o impacto de uma ideia ou issue sobre a spec

### Entrega
- ✓ Sincronizar a spec com a entrega, no mesmo PR do código
  - ✓ Marca como implementado o que foi entregue e reescreve os itens redefinidos entregues; o item cuja remoção foi entregue é apagado
  - ✓ Pequena divergência entre compromisso e entrega é ajustada no próprio PR como mudança incompatível, com aval da pessoa que integra
  - ✓ Divergência grande vira nova proposta antes da entrega
  - ✓ Mudança compatível pode entrar junto com o código, inclusive com decisão nova
  - ✓ A entrega fecha a requirement issue
- ✓ Verificar o drift entre spec e código sob demanda, com achados e evidências

### Verificação automática
- ✓ Validar o formato do documento de produto e das decisões
- ✓ O check do CI confere só a estrutura de pastas e arquivos e o formato dos documentos: não usa IA, não escreve no PR e não aplica rótulo, e bloqueia o merge quando falha
- ✓ Recusar configuração sem a lista de camadas ou de caminhos de código, ou com documentos técnicos auxiliares que não são uma lista
- ✓ Barrar configuração sem a camada de produto, com a camada do modelo conceitual, ou com nome de camada ou de documento auxiliar repetido, fora do padrão ou reservado, ou igual a nome de camada
- ✓ Detectar mapa de decisões desatualizado
- ✓ Listar os itens redefinidos em aberto
- ✓ Listar os itens comprometidos ainda não implementados
- ✓ Avisar sobre possíveis referências temporais no documento de produto
- ✓ Validar o modelo conceitual, quando existe, o documento técnico de cada camada declarada e os documentos técnicos auxiliares declarados, com as mesmas regras do documento de produto
- ✓ Barrar camada declarada sem documento técnico fundamental ou sem pasta de decisões
- ✓ Barrar documento técnico auxiliar declarado sem o arquivo
- ✓ Barrar arquivo de documento na raiz da spec que a configuração não declara como camada nem como documento auxiliar
- ✓ Barrar nome em destaque no modelo conceitual que não seja termo do glossário nem tipo declarado; termo do glossário fora do modelo é permitido
- ✓ Avisar sobre termos de implementação no modelo conceitual
- ✓ Avisar quando existe `CLAUDE.md` na raiz ou em `spec/`, que anularia o `AGENTS.md`

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
  - ✓ A issue é a discussão em prosa e nada nela é compromisso; o PR traz os arquivos da nova spec, redigidos no formato do tabularium, e passa pelo fluxo formal de validação, aceite no merge e entrega
- ✓ Regras de formato têm uma única fonte, carregada pelo agente só ao trabalhar na spec
- ✓ Nenhuma alteração da spec feita por agente dispensa confirmação humana quando envolve julgamento
- ✓ O agente só integra um PR a pedido explícito do humano, PR a PR
- ✓ Estrutura de arquivos em inglês; conteúdo no idioma configurado
- ✓ O que é do projeto fica fora dos arquivos do tabularium: a atualização os sobrescreve e a preparação nunca os altera, nem ao processo em `AGENTS.md`

## Não funcionais
- ✓ Economia de contexto: documentos densos; decisões carregadas sob demanda pelo mapa
- ✓ Portabilidade: verificação roda em Windows e Linux só com Node, sem dependências; instalação e atualização rodam em Windows e Linux só com git e o shell nativo
- ✓ Compatibilidade: instruções lidas por qualquer agente que siga a convenção de `AGENTS.md`
- ✓ Determinismo: mapas e verificações gerados por script, sem gastar tokens do agente; nenhuma verificação que bloqueia usa IA
- ✓ Plataforma: GitHub — issues, PRs, proteção de branch e Actions

## Fora de escopo
- **Arquivos de instruções específicos de um agente** — permanente: anulariam as instruções comuns e duplicariam regras
- **Histórico de decisões revogadas na spec** — permanente: a spec guarda só o vigente; a história está no versionamento
- **IDs ou âncoras nos itens do documento de produto** — permanente: cada referência vira manutenção
- **Solicitações, backlog e ideias adiadas na spec** — permanente: pertencem ao tracker; ocupariam o contexto do agente sem informar suas decisões
- **Documentação em formatos convencionais mantida na spec** — permanente: visão, casos de uso, diagramas, histórias e BDD consomem muitos tokens e divergem; são exportados a pedido
- **Deduzir ou aplicar o tipo da mudança por script ou CI** — nesta versão: o tipo é julgado pela conferência por agente e por quem integra, e os rótulos de tipo não são aplicados
- **Reconhecimento dos rótulos de PR anteriores aos tipos de mudança** — nesta versão: ainda não há adotantes
- **Julgar se PR só de código muda comportamento** — nesta versão: a conferência cobre só o que o PR faz com a spec
- **Mesclar customizações do projeto nos arquivos do tabularium ao atualizar** — nesta versão: a atualização é determinística; o que é do projeto fica fora dos arquivos do tabularium
- **Outros hubs git, trackers, plataformas de CI e provedores de modelo além do Copilot e do Claude** — nesta versão: complexidade que não queremos agora
