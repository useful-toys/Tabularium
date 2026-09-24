# tabularium3 — Template de spec viva

## O que é
Template de repositório que mantém, junto do código, uma especificação viva do produto: o que ele é, como se comporta e as decisões que o moldaram. Serve a equipes que desenvolvem com agentes de IA e querem que spec e código nunca divirjam.

## Diferenciais
- A spec cabe no contexto de um agente: arquivos densos, lidos de uma vez ou sob demanda
- A spec nunca mente sobre o que está implementado: cada item diz se é realidade ou compromisso
- Funciona com qualquer agente que leia `AGENTS.md`, sem ferramenta proprietária
- Verificação automática no PR, sem instalar nada além do Node

## Glossário
- **Spec**: pasta com o documento de produto, os registros de decisão, os planos e a configuração de um projeto
- **Documento de produto**: arquivo único que descreve o que o produto é e seu comportamento observável
- **Item**: linha do documento de produto: requisito, regra, regra transversal ou não funcional
  - **Requisito**: capacidade do produto, na forma verbo + objeto
  - **Regra**: fato testável que restringe um requisito
- **Item implementado**: item com a marca de visto; o código faz o que ele diz
- **Item comprometido**: item sem marca; decidido, ainda não implementado
- **Mudança comprometida**: item implementado seguido da seta e do texto desejado; o que vale hoje e o que valerá após a entrega
- **Mudança significativa**: altera o sentido de item implementado, contradiz item existente ou vai contra uma decisão
- **Decisão**: registro de uma escolha não óbvia vigente, com contexto, alternativas descartadas, consequências e histórico
- **Camada**: grupo de decisões de mesma natureza (produto, interface, arquitetura…)
- **Mapa de decisões**: índice gerado de uma camada, com o tema, a decisão e quando vale abrir cada registro
- **Plano**: documento de trabalho de uma task, com impacto, passos e pendências
- **Tracker**: sistema externo de solicitações (GitHub Issues ou Jira)

## Requisitos

### Adoção
- ✓ Criar projeto a partir do template, com estrutura, regras, verificação e exemplo prontos
- ✓ Adotar a spec num repositório existente copiando um conjunto definido de arquivos
- ✓ Configurar o projeto: tracker, padrão de ID de task, camadas de decisão, idioma do conteúdo e caminhos que não são código
  - ✓ Configuração pode ser refeita a qualquer momento; o existente é preservado e cada mudança é confirmada
  - ✓ Camada excluída da configuração com decisões: o usuário escolhe mover ou apagar as decisões
  - ✓ Idioma novo vale para conteúdo novo; o existente só é traduzido a pedido
  - ✓ Padrão de task novo não reescreve históricos
- ✓ Oferecer a troca do exemplo incluído por um esqueleto vazio
- ✓ Avisar quando um arquivo de instruções específico de um agente anula as instruções comuns

### Extração da spec de código existente
- ✓ Gerar documento de produto e decisões a partir do código, dos testes e da documentação existente
  - ✓ Item só é marcado implementado com evidência no código
  - ✓ Item só documentado vira pergunta: compromisso ou documentação desatualizada
  - ✓ Divergência entre código e documentação vira pergunta; se valer o documentado, vira mudança comprometida
  - ✓ Dúvidas são perguntadas durante a extração, uma a uma
  - ✓ Decisões preexistentes de produto vigentes são convertidas ao formato; técnicas e obsoletas ficam de fora e são relatadas
  - ✓ Documentação preexistente permanece intocada
  - ✓ Entrega um relatório com a evidência de cada item duvidoso

### Documento de produto
- ✓ Descrever o produto num único arquivo, nesta ordem: o que é, diferenciais, glossário, requisitos por domínio, regras transversais, não funcionais, fora de escopo
  - ✓ Requisitos e regras em listas aninhadas, sem IDs nem âncoras
  - ✓ Domínios subdivididos quando crescem demais ou misturam assuntos, a julgamento
  - ✓ Cada conceito tem uma única casa; nenhuma afirmação se repete entre seções
  - ✓ Só comportamento observável; sem implementação, tela ou navegação; integrações nomeadas pelo efeito
  - ✓ Porquê só quando explica o valor da funcionalidade
  - ✓ Autocontido: sem links nem referências a decisões ou outros documentos
  - ✓ Atemporal: sem narrar mudanças ou história
  - ✓ Fora de escopo traz motivo e diz se é permanente ou desta versão
- ✓ Indicar o estado de cada item: implementado, comprometido ou mudança comprometida
  - ✓ Glossário, diferenciais e fora de escopo não levam estado

### Decisões
- ✓ Registrar cada escolha não óbvia num arquivo próprio, com tema, decisão, quando carregar, contexto, alternativas descartadas, consequências e histórico
  - ✓ Só decisões vigentes; a que deixa de valer é apagada, salvo se explica um item de fora de escopo
  - ✓ Mudança de decisão move a escolha anterior para alternativas descartadas e registra a mudança no histórico
  - ✓ O porquê vem do humano; o agente nunca o inventa
- ✓ Gerar o mapa de decisões de cada camada, para o agente abrir só o que a tarefa exige
- ✓ Organizar as decisões de uma camada a pedido, confrontando-as com o documento de referência
  - ✓ Detecta contradição, decisões contraditórias entre si, órfãs, lacunas, sobreposição, mistura de assuntos, camada errada e problemas de forma
  - ✓ Item implementado vence o conflito; nos demais casos, pergunta
  - ✓ Propõe fundir, dividir, mover ou apagar, preservando o histórico
  - ✓ Nada muda sem aprovação, em lote ou item a item
  - ✓ Qualquer agente sugere a organização ao notar inconsistência em outra atividade

### Ciclo de mudança
- ✓ Analisar o impacto de uma solicitação do tracker sobre a spec
  - ✓ Lista todos os itens e decisões tocados, inclusive em cascata, para confirmação humana
  - ✓ Classifica cada efeito como acréscimo, ajuste de compromisso ou mudança significativa
  - ✓ Aponta conflito com mudanças comprometidas em aberto
- ✓ Registrar o compromisso na spec antes do código, com o plano da task
  - ✓ Acréscimo entra como item comprometido; mudança significativa entra como mudança comprometida, sem alterar o que vale hoje
  - ✓ Mudança significativa sempre cria ou atualiza uma decisão
  - ✓ Requisito abandonado é apagado ou vira item de fora de escopo, a critério do autor
- ✓ Sincronizar a spec com a entrega, no mesmo PR do código
  - ✓ Marca como implementado o que foi entregue e reescreve as mudanças comprometidas entregues
  - ✓ Divergência entre compromisso e entrega é confirmada com o usuário antes de ajustar a spec
  - ✓ O que ficou de fora continua comprometido e é registrado nas pendências do plano
- ✓ Verificar o drift entre spec e código sob demanda, com achados e evidências

### Verificação automática
- ✓ Validar o formato do documento de produto e das decisões
- ✓ Detectar mapa de decisões desatualizado
- ✓ Listar as mudanças comprometidas em aberto
- ✓ Barrar PR que entrega mudança comprometida sem alterar código
- ✓ Barrar PR que altera ou marca item implementado sem alterar código, salvo quando rotulado como só-spec
- ✓ Avisar sobre possíveis referências temporais no documento de produto
- Exigir atualização da spec quando o PR altera código ligado a ela
- Descrever interface e arquitetura em documentos técnicos da spec, com suas camadas de decisão

## Regras transversais
- ✓ Toda mudança, inclusive só de spec, entra por PR na branch principal protegida
- ✓ A spec descreve a branch principal: item implementado é verdade no código; comprometido é intenção registrada
- ✓ Ideias não comprometidas e solicitações vivem no tracker, não na spec
- ✓ Regras de formato têm uma única fonte, carregada pelo agente só ao trabalhar na spec
- ✓ Nenhuma alteração da spec feita por agente dispensa confirmação humana quando envolve julgamento
- ✓ Estrutura de arquivos em inglês; conteúdo no idioma configurado

## Não funcionais
- ✓ Economia de contexto: documentos densos; decisões carregadas sob demanda pelo mapa
- ✓ Portabilidade: verificação roda em Windows e Linux só com Node, sem dependências
- ✓ Compatibilidade: instruções lidas por qualquer agente que siga a convenção de `AGENTS.md`
- ✓ Determinismo: mapas e verificações gerados por script, sem gastar tokens do agente

## Fora de escopo
- **Arquivos de instruções específicos de um agente** — permanente: anulariam as instruções comuns e duplicariam regras
- **Histórico de decisões revogadas na spec** — permanente: a spec guarda só o vigente; a história está no versionamento
- **IDs ou âncoras nos itens do documento de produto** — permanente: cada referência vira manutenção
- **Solicitações e backlog de ideias na spec** — permanente: pertencem ao tracker
- **Script de instalação** — nesta versão: adoção por template do GitHub ou cópia de arquivos
