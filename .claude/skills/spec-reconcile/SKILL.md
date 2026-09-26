---
name: spec-reconcile
description: Verifica e restaura a consistência da spec consigo mesma, uma camada por vez - confronta o documento de referência da camada (product ↔ spec/product.md e spec/model.md; demais camadas ↔ spec/<camada>.md, também contra produto e modelo) consigo mesmo e com as decisões da camada, e organiza as decisões - para eliminar contradições, conceitos repetidos, termos inconsistentes, lacunas de cascata e decisões parecidas, contraditórias, obsoletas, faltantes ou fora do lugar. Use a pedido do usuário, ou sugira quando notar inconsistência na spec.
---

# spec-reconcile

Regras de formato: `spec/AGENTS.md`. Nada é alterado sem confirmação do humano.

## 1. Escopo
- Pergunte a camada (padrão: `product`). Uma camada por execução.
- Documento de referência: `product` → `spec/product.md` e, se existir, `spec/model.md`. Camada técnica → `spec/<camada>.md`, confrontado também com `spec/product.md` e `spec/model.md`. Sem documento técnico, confronte só as decisões entre si e com o produto.

## 2. Carga
- Leia o mapa da camada (`README.md`) e o documento de referência. Numa camada técnica, leia também o `product.md` e o `model.md`.
- Agrupe as decisões por tema próximo, pelo `tema` e pelo `carregar-quando`.
- Carregue um grupo por vez, junto com o trecho relevante do documento de referência.

## 3. Achados
Primeiro, o documento de referência consigo mesmo e com os demais documentos:

| Tipo | Tratamento proposto |
|---|---|
| Contradição entre itens (inclusive requisito × fora de escopo, documento técnico × produto) | Item `✓` vence o que não tem `✓`. Dois itens `✓`, ou nenhum: pergunte. |
| Conceito repetido em duas casas | Manter numa casa só, a que as regras de formato indicam. |
| Termo inconsistente (fora do sentido do glossário, sinônimo não canônico, termo de domínio sem definição) | Usar o termo canônico, ou definir o termo no glossário. |
| Lacuna de cascata (item que depende de outro inexistente ou removido) | Pergunte: acrescentar o que falta ou ajustar o dependente. |

Depois, para cada grupo de decisões:

| Tipo | Tratamento proposto |
|---|---|
| Contradição com o documento de referência | Item `✓` vence: a decisão se ajusta. Item sem `✓` ou `⇢`: pergunte. |
| Decisões contraditórias entre si | A que bate com item `✓` fica; a outra é apagada ou fundida, e a escolha perdedora vira alternativa descartada. Sem `✓` envolvido: pergunte. |
| Órfã ou obsoleta (não sustenta nenhum item) | Apagar, exceto se explica um item de Fora de escopo: nesse caso, "por que não fazer". |
| Lacuna (escolha não óbvia sem decisão) | Rascunho de `tema` e `decisao`. Contexto e alternativas: pergunte, nunca invente. |
| Sobreposição | Fundir: mantenha o slug mais representativo, una os históricos em ordem e acrescente `AAAA-MM-DD organização: fundida com <slug>`. |
| Mais de um assunto | Dividir: cada parte herda o histórico relevante e ganha `AAAA-MM-DD organização: dividida de <slug>`. |
| Camada errada | Mover para a camada certa, com `AAAA-MM-DD organização: movida de <camada>`. Sobreposição no destino: só aponte no relatório. |
| Forma | `carregar-quando` vago; requisito escondido na decisão; justificativa técnica numa decisão de produto. |

## 4. Documento de referência
Edições que não mudam o sentido de item `✓`:
- resolver contradição, repetição, termo inconsistente ou lacuna conforme aprovado;
- trazer para o documento de referência um requisito escondido numa decisão (com `✓` se estiver implementado, após confirmação);
- remover resíduo técnico ou temporal.

Nunca altere o sentido de um item `✓`. Se resolver o achado exigir isso, ele vira proposta (`/spec-grill`).

## 5. Relatório e aprovação
Mostre os achados numerados no chat, cada um com tipo, arquivos e ação proposta. O usuário aprova "todos", "todos exceto 3, 7" ou item a item.

## 6. Aplicação
- Crie uma branch própria e aplique só o que foi aprovado.
- Rode `node scripts/spec.mjs build-map` e `node scripts/spec.mjs check --base origin/main`.
- Abra um PR. O CI deduz o tipo e aplica a label; organização sem mudança de sentido é `spec-editorial`. O relatório vai na descrição do PR e não é commitado.
