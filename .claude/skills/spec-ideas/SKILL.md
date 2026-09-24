---
name: spec-ideas
description: Sugere alternativas, cenários de borda, efeitos em cascata e simplificações para uma ideia de requisito já esmiuçada, para o humano aceitar ou descartar com motivo. Trabalha só na conversa, sem publicar nada. Entrada - texto livre, issue ou PR de proposta. Use depois de /spec-grill e antes de /spec-propose.
---

# spec-ideas

Etapa 2 de 3 da proposta: esmiuçar (spec-grill) → **sugerir** (spec-ideas) → registrar (spec-propose). Esta etapa diverge: você propõe o que ninguém levantou, e o humano aceita ou descarta.

Trabalhe só na conversa. Não edite arquivos da spec e não crie nem altere nada no tracker. Issue e PR de origem são só lidos. Publicar é pedido explícito do usuário, via `/spec-issue` ou `/spec-propose`.

Regras de formato: `spec/AGENTS.md`.

## 1. Origem e contexto
- Leia a origem (texto, `gh issue view <N> --comments` ou `gh pr view <N> --comments` + `gh pr diff <N>`) e o resumo `<!-- spec-grill -->`, que pode estar na conversa ou nos comentários da origem.
- Leia `spec/product.md`, o mapa de decisões e as decisões relevantes pelo `carregar-quando`.

## 2. Sugestões
Gere, para a ideia como está decidida:
- **Alternativas**: outras formas de atender a mesma necessidade, inclusive mais simples ou sem mudar nada.
- **Cenários de borda**: situações que a proposta não cobre (limites, vazio, erro, uso simultâneo, dados legados).
- **Cascata esquecida**: itens, transversais, não funcionais e decisões que também deveriam mudar.
- **Riscos para o usuário**: perda de dados, surpresa, contradição com um diferencial do produto.
- **Recortes**: partes que podem ficar fora de escopo agora.

Seja concreto e curto; cada sugestão numa frase, com o impacto.

## 3. Triagem
Apresente as sugestões com a ferramenta de pergunta interativa (até 4 por chamada, opções como "aceitar", "descartar", "fora de escopo"). Sem essa ferramenta, use lista numerada.
- **Aceita**: vira ponto a esmiuçar. Sugira voltar a `/spec-grill` só para ela.
- **Descartada**: pergunte o motivo em uma linha. Ela vira material de "Alternativas descartadas" da decisão.
- **Fora de escopo**: vira candidata a item de Fora de escopo, com motivo.

## 4. Memória
Apresente o resumo na conversa, sem publicá-lo. Para guardá-lo, o usuário usa `/spec-issue` ou `/spec-propose`.
```markdown
<!-- spec-ideas -->
## Sugestões
- Aceitas: <sugestão → o que muda>
- Descartadas: <alternativa: motivo>
- Fora de escopo: <item: motivo>
```

## 5. Próximo passo
Se houve sugestão aceita, `/spec-grill` sobre ela. Senão, `/spec-propose`.
