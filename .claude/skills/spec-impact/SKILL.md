---
name: spec-impact
description: Analisa o impacto de uma solicitação de mudança (issue do GitHub ou task do Jira) sobre a spec viva, identificando itens do product.md e decisões afetados e classificando a mudança como acréscimo ou mudança significativa. Use no início de qualquer mudança de comportamento, antes de spec-plan.
---

# spec-impact

Entrada: ID da task. Regras de formato: `spec/AGENTS.md`. Esta skill só analisa, sem alterar arquivos.

## Passos
1. **Solicitação**: se o tracker em `spec/config.json` for `github`, rode `gh issue view <id>`. Se for `jira`, peça o texto ao usuário, ou use o conector do Jira se houver. Resuma a necessidade em 2–3 linhas.
2. **Spec**: leia `spec/product.md` inteiro e o mapa `spec/decisions/product/README.md`. Abra só as decisões cujo `carregar-quando` corresponda à solicitação.
3. **Mudanças em aberto**: rode `node scripts/spec.mjs check` para listar os `⇢` abertos. Verifique se algum toca a mesma área.
4. **Itens tocados**: liste tudo o que a mudança afeta: requisitos, regras, transversais, não funcionais, termos do glossário, itens de Fora de escopo e decisões. Inclua os efeitos em cascata: o que passaria a contradizer o quê.
5. **Classificação** de cada item:
   - **acréscimo**: nada existente muda de sentido;
   - **ajuste de compromisso**: altera item sem `✓` ou o lado direito de um `⇢`;
   - **mudança significativa**: muda o sentido de um item `✓`, contradiz um item existente ou vai contra uma decisão.
6. **Decisões**: aponte as decisões que precisam ser atualizadas e as escolhas não óbvias que pedem decisão nova.

## Saída
Relatório no chat:
- solicitação resumida;
- tabela de itens tocados (seção › item, classificação, efeito);
- decisões afetadas ou a criar;
- conflitos com `⇢` em aberto;
- perguntas em aberto.

Peça ao usuário para confirmar a lista de itens tocados antes de seguir para `/spec-plan`.
