---
tema: Consistência da spec consigo mesma
decisao: Processo apoiado por IA em três pontos - o esmiuçamento confronta a ideia, a proposta não publica sobre spec inconsistente e a organização sob demanda revisa uma camada por vez
carregar-quando: mudança em detecção de inconsistências, na validação antes da proposta, na organização de decisões ou em fusão, divisão e movimentação de decisões
---
- Decisão: a consistência da spec (sem contradição entre itens, entre documentos ou com decisões, sem conceito repetido, termo fora do sentido do glossário ou lacuna de cascata) é buscada por um processo apoiado por IA e decidida pelo humano, em três pontos; o esmiuçamento lê sempre o documento de produto e o modelo conceitual inteiros e abre documentos técnicos e decisões à medida que a ideia os alcança; o registro valida a spec resultante sobre a branch principal atual antes de criar ou atualizar o PR e não publica com qualquer inconsistência, inclusive preexistente; um processo a pedido verifica uma camada por vez, confrontando o documento de referência consigo mesmo, com as decisões da camada e, numa camada técnica, também com o documento de produto e o modelo conceitual, e organiza as decisões (fundir, dividir, mover ou apagar), rascunhando lacunas sem inventar o porquê e aplicando só o que o humano aprovar, numa branch própria; item implementado vence conflitos; qualquer agente sugere o processo ao notar inconsistência em outra atividade
- Contexto: cada proposta é revisada contra a spec da sua época, e contradições entre itens aceitos em momentos diferentes se acumulam sem que nenhuma revisão as veja; e o template se define como processo que mantém a spec consistente com o código e consigo mesma, promessa que a organização só de decisões não cobria
- Alternativas descartadas
  - Organização só das decisões contra o documento de referência: contradições entre itens e entre documentos passam despercebidas
  - Skill nova só para consistência: mais uma skill para aprender, e a organização já é a spec contra si mesma
  - Verificação de drift com código também para consistência: mistura o drift entre spec e código com o drift da spec consigo mesma
  - Consistência verificada no CI a cada proposta, ou periodicamente: tokens a cada PR, e a revisão consultiva já cobre os conflitos da proposta
  - Registro bloquear só a inconsistência introduzida pela proposta: nenhuma proposta é aceita sobre spec inconsistente; a inconsistência antiga é dívida a pagar antes de evoluir, senão se acumula
  - Registro perguntar e corrigir a inconsistência ali mesmo, ou publicar com ressalva: o registro não entrevista, e publicar leva a inconsistência adiante
  - Validação do registro sobre a spec inteira: mais tokens a cada proposta; os itens tocados e a cascata bastam
  - Esmiuçamento lendo tudo de forma gradual: contradição distante passa despercebida
  - Todas as camadas a cada execução da organização: caro em contexto
  - Só dentro da camada, sem confrontar a camada técnica com o produto: contradição entre camadas passa despercebida
  - Garantia de consistência sem ressalva: a revisão semântica é da IA e a decisão é do humano; só a forma é garantida pelo script
  - Só relatório, sem aplicar: deixa o trabalho braçal para o humano
  - Sugestão automática por contagem de decisões: sinal fraco; a inconsistência percebida é o gatilho real
- Consequências
  - Ganha: a spec não acumula contradições; propostas partem de uma base consistente
  - Aceita: inconsistência antiga trava toda proposta até ser corrigida num PR editorial ou pela organização; a organização depende de alguém pedir ou de um agente notar

## Histórico
- 2026-09-26 #14: consistência da spec consigo mesma no esmiuçamento, na validação antes da proposta e na organização ampliada; arquivo renomeado de organizacao-de-decisoes
- 2026-09-24 plano-inicial: decisão criada
