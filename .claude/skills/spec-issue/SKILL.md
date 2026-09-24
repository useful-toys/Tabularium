---
name: spec-issue
description: Leva para uma issue de requisito, nova ou existente, a discussão de uma ideia feita na conversa - os resumos de /spec-grill e /spec-ideas - como memória entre sessões. Só a pedido do usuário. Entrada - nada (issue nova) ou referência a uma issue existente. Para registrar a proposta como PR, use /spec-propose.
---

# spec-issue

Guarda numa issue o que foi discutido na conversa, para continuar em outra sessão ou com outras pessoas. As etapas de proposta (`/spec-grill`, `/spec-ideas`) trabalham só na conversa. Esta skill é o passo explícito que publica no tracker. Não reabra decisões e não edite arquivos da spec. Pergunte só o que bloquear a publicação.

## 1. Conteúdo
- Reúna o que está na conversa: os resumos `<!-- spec-grill -->` e `<!-- spec-ideas -->`, nos formatos dessas skills. Sem resumo, monte-o a partir do que foi discutido.
- Se a ideia ainda não foi esmiuçada, publique o que houver e registre o resto em "Em aberto".

## 2. Destino
- **Issue nova** (sem argumento):
  - Título curto. Corpo no formato do formulário `.github/ISSUE_TEMPLATE/requirement.yml`: problema ou necessidade, proposta, alternativas consideradas e dúvidas em aberto.
  - Label `requirement`, criada com `gh issue create`.
  - Os resumos entram em seguida como comentário (`gh issue comment`), onde `/spec-grill`, `/spec-ideas` e `/spec-propose` os procuram.
- **Issue existente** (`#N` ou link): leia `gh issue view <N> --comments` e comente só o que é novo desde o último resumo publicado.

Antes de publicar, mostre o texto ao usuário e peça confirmação.

## 3. Próximo passo
Informe o link da issue. Para continuar a discussão: `/spec-grill #N`. Para registrar a proposta: `/spec-propose #N`.
