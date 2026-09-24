# tabularium3 — Modelo conceitual

## Tipos
- ✓ **Slug de decisão**: texto; minúsculas sem acento, dígitos e hífens; resume o tema

## Entidades
- ✓ **Spec**
  - ✓ preferências: camadas, idioma do conteúdo e caminhos que não são código
- ✓ **Documento de produto**
  - ✓ pertence a 1 **Spec**
- **Modelo conceitual**
  - pertence a 1 **Spec**; a Spec pode não ter modelo
  - suas linhas seguem os mesmos estados de **Item**
- ✓ **Item**
  - ✓ pertence a 1 **Documento de produto**
  - ✓ tipos: **Requisito** | **Regra** | regra transversal | não funcional
  - ✓ **Regra** pertence a 1 **Requisito**
  - ✓ estados: comprometido | implementado | mudança comprometida
  - ✓ comprometido → implementado: a entrega marca o item
  - ✓ implementado → mudança comprometida: uma proposta aceita anexa o texto desejado
  - ✓ mudança comprometida → implementado: a entrega reescreve o item com o texto desejado
  - ✓ mudança comprometida → implementado: a desistência descarta o texto desejado
- ✓ **Camada**
  - ✓ pertence a 1 **Spec**
- ✓ **Decisão**
  - ✓ pertence a 1 **Camada**
  - ✓ nome: **Slug de decisão**; identidade
  - ✓ só existe enquanto vigente, salvo quando explica um item de fora de escopo
- ✓ **Mapa de decisões**
  - ✓ pertence a 1 **Camada**
  - ✓ derivado das decisões da camada; nunca escrito à mão
- ✓ **Issue de requisito**
  - ✓ vive em 1 **Tracker**
  - ✓ estados: aberta | fechada
  - ✓ aberta → fechada: a entrega que a implementa é aceita
- ✓ **Proposta**
  - ✓ altera 1 **Spec**
  - ✓ refere 0..1 **Issue de requisito**
  - ✓ nunca contém código
  - ✓ estados: rascunho | pronta | aceita | recusada
  - ✓ rascunho → pronta: o autor trata a revisão consultiva
  - ✓ pronta → rascunho: a proposta volta a ser discutida
  - ✓ pronta → aceita: um humano integra, ou o agente a pedido dele
  - ✓ pronta → recusada: fechada sem integrar
- ✓ **Entrega**
  - ✓ fecha 0..1 **Issue de requisito**
  - ✓ implementa N **Item**
  - ✓ sempre contém código
