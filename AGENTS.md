# Processo

Este repositório mantém uma spec viva em `spec/`. As regras de formato e de mudança estão em `spec/AGENTS.md`.

- A spec é a fonte da verdade do comportamento. Em `spec/product.md`, e também em `spec/model.md` e nos documentos técnicos quando existem:
  - item com `✓` descreve o que o código faz;
  - item sem `✓`, ou texto depois de `⇢`, é compromisso aceito.
- Evolução de requisitos:
  1. **Amadurecer** na conversa: `/spec-grill` esmiúça e `/spec-ideas` sugere alternativas, a partir de texto, issue ou PR. As duas só trabalham na conversa. Para guardar a discussão numa issue com label `requirement`, nova ou existente, use `/spec-issue`, a pedido.
  2. **Propor**: `/spec-propose` abre ou atualiza o PR de proposta (draft, labels `requirement` e `spec-only`) com o texto final da spec e das decisões.
  3. **Validar**: no CI, o agente roda `/spec-impact` em modo PR e comenta, sem bloquear. Quem decide é a pessoa que integra.
  4. **Aceitar**: o merge, decidido por um humano, torna a proposta compromisso. Não há aprovação formal obrigatória.
  5. **Entregar**: implemente, rode `/spec-sync` no mesmo PR do código e cite a issue com `Closes #N`.
- Não implemente comportamento que não esteja comprometido na spec.
- PR de código altera a spec. Se não muda comportamento, leva a label `no-spec-change`.
- Só faça o merge de um PR quando o humano pedir explicitamente, PR a PR.
- Toda mudança entra por PR. Antes de abrir um PR, rode `node scripts/spec.mjs check --base origin/main`.
- Documentos em formatos convencionais são exportados da spec a pedido, conforme `spec/AGENTS.md`, e nunca são fonte.
- Outras skills:
  - `/spec-init`: estrutura e preferências;
  - `/spec-extract`: spec a partir de código existente;
  - `/spec-check`: drift entre spec e código;
  - `/spec-reconcile`: organização das decisões.
