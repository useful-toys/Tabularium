---
name: spec-reconcile
description: Organiza as decisões de uma camada (spec/decisions/<camada>/) e as confronta com o documento de referência da camada (product ↔ spec/product.md) para eliminar decisões parecidas, contraditórias, obsoletas, faltantes ou fora do lugar. Use a pedido do usuário, ou sugira quando notar inconsistência entre decisões e requisitos.
---

# spec-reconcile

Regras de formato: `spec/AGENTS.md`. Nada é alterado sem confirmação do humano.

## 1. Escopo
- Pergunte a camada (padrão: `product`). Uma camada por execução.
- Documento de referência: `product` → `spec/product.md`. Para as camadas técnicas, use o documento definido para elas. Se não houver, confronte só as decisões entre si.

## 2. Carga
- Leia o mapa da camada (`README.md`) e o documento de referência.
- Agrupe as decisões por tema próximo, pelo `tema` e pelo `carregar-quando`.
- Carregue um grupo por vez, junto com o trecho relevante do documento de referência.

## 3. Achados
Para cada grupo, procure:

| Tipo | Tratamento proposto |
|---|---|
| Contradição com o `product.md` | Item `✓` vence: a decisão se ajusta. Item sem `✓` ou `⇢`: pergunte. |
| Decisões contraditórias entre si | A que bate com item `✓` fica; a outra é apagada ou fundida, e a escolha perdedora vira alternativa descartada. Sem `✓` envolvido: pergunte. |
| Órfã ou obsoleta (não sustenta nenhum item) | Apagar, exceto se explica um item de Fora de escopo: nesse caso, "por que não fazer". |
| Lacuna (escolha não óbvia sem decisão) | Rascunho de `tema` e `decisao`. Contexto e alternativas: pergunte, nunca invente. |
| Sobreposição | Fundir: mantenha o slug mais representativo, una os históricos em ordem e acrescente `AAAA-MM-DD organização: fundida com <slug>`. |
| Mais de um assunto | Dividir: cada parte herda o histórico relevante e ganha `AAAA-MM-DD organização: dividida de <slug>`. |
| Camada errada | Mover para a camada certa, com `AAAA-MM-DD organização: movida de <camada>`. Sobreposição no destino: só aponte no relatório. |
| Forma | `carregar-quando` vago; requisito escondido na decisão; justificativa técnica numa decisão de produto. |

## 4. product.md
Só edições que não mudam comportamento:
- trazer para o `product.md` um requisito escondido numa decisão (com `✓` se estiver implementado, após confirmação);
- remover resíduo técnico ou temporal.

Nunca altere o sentido de um item `✓`.

## 5. Relatório e aprovação
Mostre os achados numerados no chat, cada um com tipo, arquivos e ação proposta. O usuário aprova "todos", "todos exceto 3, 7" ou item a item.

## 6. Aplicação
- Crie uma branch própria e aplique só o que foi aprovado.
- Rode `node scripts/spec.mjs build-map` e `node scripts/spec.mjs check`.
- Abra um PR com a label `spec-only`. O relatório vai na descrição do PR e não é commitado.
