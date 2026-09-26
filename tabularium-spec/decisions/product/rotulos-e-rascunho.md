---
tema: Rótulos e rascunho nas propostas
decisao: Rótulos em inglês - requirement nas issues e um rótulo por tipo de mudança nos PRs (spec-editorial, spec-neutral, spec-compatible, spec-incompatible); proposta nasce em rascunho e volta a ele na rediscussão
carregar-quando: mudança em labels, estado draft ou filtros de issues e PRs de requisito
---
- Decisão: issue de requisito leva o rótulo requirement; todo PR leva exatamente um rótulo de tipo, aplicado pelo CI: spec-editorial, spec-neutral, spec-compatible ou spec-incompatible; proposta é o PR sem código com spec-compatible ou spec-incompatible; a proposta nasce em rascunho até o autor tratar a revisão consultiva, e volta a rascunho quando é rediscutida
- Contexto: é preciso achar propostas abertas para detectar conflitos, distinguir texto pronto para aceitar de texto em ajuste, e o check precisa saber o tipo de cada PR
- Alternativas descartadas
  - Rótulos requirement e spec-only no PR de proposta, spec-mismatch na divergência e no-spec-change no código sem spec: cada um cobria uma exceção do check, sem dizer o tipo do PR; spec-only misturava proposta e correção de redação
  - Requirement também nos PRs de proposta: redundante com o tipo sem código
  - Só o rótulo spec-only: não distingue proposta de correção de redação ou organização
  - Rótulos distintos para ideia e proposta: dois nomes para a mesma trilha
  - Rótulos em português: fora do padrão da estrutura em inglês
  - PR sempre pronto para revisão: sem sinal de que o texto ainda está sendo ajustado
- Consequências
  - Ganha: busca direta por propostas abertas, tipo visível em todo PR e estado claro de cada proposta
  - Aceita: rótulos precisam existir no repositório; buscar propostas combina dois rótulos

## Histórico
- 2026-09-26 #14: um rótulo por tipo de mudança nos PRs; requirement só nas issues; saem spec-only, spec-mismatch e no-spec-change
- 2026-09-26 #13: rótulo no-spec-change
- 2026-09-24 plano-inicial: decisão criada
