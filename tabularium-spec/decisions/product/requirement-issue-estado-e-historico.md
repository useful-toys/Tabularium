---
tema: Como a requirement issue guarda o entendimento e o histórico
decisao: O corpo da issue é o entendimento mais recente, reescrito só pelo agente; os comentários são o histórico resumido, com a solicitação original como primeiro comentário da IA
carregar-quando: mudança no formato da requirement issue, na skill que a publica ou na leitura dela pelas demais skills
---
- Decisão: a requirement issue nasce da descrição de uma pessoa ou de uma conversa com o agente; o corpo é sempre o entendimento mais recente, com triagem, problema, decidido, descartado com motivo, cascata, o que está em aberto e o link da proposta, escrito só pela skill que leva a discussão à issue; cada vez que a skill roda, reescreve o corpo e grava um comentário novo com o resumo da rodada; no primeiro toque numa issue existente, o corpo original é guardado sem alteração como primeiro comentário da IA, com o título `Solicitação original`, antes do comentário de resumo; o primeiro toque é reconhecido pela falta de comentário com esse título; pessoas contribuem por comentários; antes de reescrever o corpo, a skill confere o estado publicado e pede confirmação; issue criada pela conversa não tem original e seu primeiro comentário já é o resumo; a ideia solta vive na issue e a spec só recebe texto final
- Contexto: com o estado no corpo e os resumos em comentários, quem lia precisava reconstruir o entendimento atual percorrendo tudo, e resumos velhos contradiziam os novos; e a issue espontânea nasce sem o formato esperado, com o texto de quem a abriu
- Alternativas descartadas
  - Corpo do formulário fixo, com os resumos só em comentários: o estado fica espalhado e o corpo, que é o mais visível, é o mais desatualizado
  - Estado num comentário fixado: leitura pior e sem lugar óbvio para o link da proposta
  - Corpo reescrito sem guardar o original: perde a voz e a intenção de quem abriu a issue
  - Primeiro toque reconhecido por a issue não ter comentários: perde o original quando uma pessoa comenta antes do agente
  - Corpo editável por qualquer um e consolidado às vezes: duas fontes do entendimento atual
- Consequências
  - Ganha: um só lugar para o estado atual, histórico rastreável nos comentários e nas revisões de edição, original preservado
  - Aceita: edição direta do corpo por pessoas é sobrescrita na próxima rodada; o original pode ficar depois de comentários humanos na ordem cronológica

## Histórico
- 2026-09-29 #21: decisão criada
