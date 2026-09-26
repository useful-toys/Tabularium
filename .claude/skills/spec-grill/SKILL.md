---
name: spec-grill
description: Esmiúça uma ideia de requisito ou de mudança de requisito contra a spec viva (glossário, modelo conceitual, regras transversais, decisões e código), em rodadas de perguntas, até cada ponto estar decidido. Trabalha só na conversa, sem publicar nada. Entrada - texto livre, referência a uma issue ou a um PR de proposta (para rediscuti-lo, especialmente se estiver defasado). Use para amadurecer uma ideia antes de /spec-propose.
---

# spec-grill

Etapa 1 de 3 da proposta: **esmiuçar** (spec-grill) → sugerir (spec-ideas) → registrar (spec-propose). Esta etapa converge: você pergunta, o humano decide.

Trabalhe só na conversa. Não edite arquivos da spec e não crie nem altere nada no tracker: nada de issue, comentário ou mudança de estado de PR. Issue e PR de origem são só lidos. Publicar é pedido explícito do usuário, via `/spec-issue` ou `/spec-propose`.

Regras de formato: `spec/AGENTS.md`. Mudança no próprio template (`tabularium-spec/`, só no repositório do template): use essa pasta no lugar de `spec/` e siga `tabularium-spec/AGENTS.md`.

## 1. Origem
- **Texto livre**: a ideia descrita pelo usuário.
- **Issue** (`#N` ou link): `gh issue view <N> --comments`. Leia o formulário e os resumos já publicados por spec-grill e spec-ideas; o que já está decidido ali não é perguntado de novo.
- **PR de proposta** (`#N` ou link): `gh pr view <N> --comments` e `gh pr diff <N>`. Compare também com a `main` atual (`git fetch` e `git diff <base-do-PR>..origin/main -- spec/`): o que mudou na `main` desde que o PR foi aberto e que colide com a proposta é a **defasagem**, e entra como pergunta.

## 2. Contexto
- Leia sempre `spec/product.md` inteiro e o `spec/model.md`, se existir: a cascata exige o todo. Leia também o mapa de decisões de cada camada.
- Abra os documentos técnicos e as decisões cujo `carregar-quando` corresponda à ideia à medida que a árvore de decisões os alcançar, inclusive em rodadas posteriores.
- Rode `node scripts/spec.mjs check` para ver os `⇢` e os itens comprometidos em aberto.
- Rode `gh pr list --state open --search "label:spec-compatible,spec-incompatible" --json number,title,files` e veja se outras propostas abertas tocam a mesma área.
- Consulte o código quando a ideia afirmar algo sobre o comportamento atual.

## 3. Árvore de decisões
Mapeie a ideia como uma árvore: cada decisão abre as que dependem dela. A **fronteira** são as decisões cujos pré-requisitos já estão resolvidos. Em cada rodada, pergunte toda a fronteira e espere as respostas antes da próxima.

- Use a ferramenta de pergunta interativa, com até 4 perguntas por chamada e 2–4 opções cada, colocando a recomendada primeiro, marcada "(Recomendado)". Sem essa ferramenta, use texto numerado com a recomendação.
- Fatos você busca sozinho (código, spec, histórico). Decisões são do humano.

O que perguntar:
- **Contra o glossário**: termo usado com outro sentido, ou termo novo. "O glossário define X como…, e você parece querer dizer…". Proponha o termo canônico.
- **Contra o modelo conceitual**: relações, cardinalidades, estados, transições e invariantes que a ideia cria, muda ou contradiz. Entidade nova pede termo no glossário e bloco no modelo.
- **Contra regras transversais e não funcionais**: a ideia respeita cada uma que a alcança?
- **Contra decisões vigentes**: a ideia contraria alguma? Se sim, é mudança incompatível: confirme e pergunte o porquê da virada.
- **Contra o código**: o que a ideia afirma sobre o comportamento atual confere?
- **Tipo**: incompatível (`⇢`), compatível ou editorial (tipos em `spec/AGENTS.md`)?
- **Consistência**: a ideia deixa a spec com contradição entre itens, entre documentos ou com decisões, conceito repetido, termo fora do sentido do glossário ou lacuna de cascata? Inconsistência que já existe na área tocada também vira pergunta: a proposta não publica sobre uma spec inconsistente.
- **Cascata**: requisitos, regras, glossário, modelo conceitual, fora de escopo e decisões que mudam junto.
- **Cenários de borda**: invente casos concretos que forcem a precisão (limites, vazio, erro, concorrência).
- **Decisões**: toda escolha não óbvia pede o porquê e as alternativas consideradas. Nunca invente.
- **Fronteira de conteúdo**: o que é produto e o que é interface ou implementação (critério em `spec/AGENTS.md`).

## 4. Memória
Ao fim da sessão, ou quando o usuário pedir, apresente o resumo **na conversa**. Não o publique nem ofereça abrir issue por conta própria. Se o usuário quiser guardá-lo:
- numa issue nova ou existente: `/spec-issue`;
- como proposta: `/spec-propose`.

Formato do resumo:
```markdown
<!-- spec-grill -->
## Esmiuçado
- Tipo: <incompatível | compatível | editorial>
- Decidido: <item → decisão, uma linha cada>
- Porquês e alternativas: <para as decisões>
- Cascata: <itens afetados>
- Defasagem (origem PR): <o que mudou na main e como foi resolvido>
- Em aberto: <o que ainda falta>
```

## 5. Próximo passo
Sugira `/spec-ideas` para abrir alternativas e cenários, ou `/spec-propose` se nada mais faltar. Se a discussão precisar continuar em outra sessão, mencione `/spec-issue`.
