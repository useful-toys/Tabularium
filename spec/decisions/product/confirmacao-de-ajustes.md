---
tema: Confirmação de ajustes de contagem
decisao: Sem confirmação; erro se corrige desfazendo (até 20)
carregar-quando: mudança em confirmação, desfazer ou fluxo de ajuste
---
- Decisão: ajustar a contagem nunca pede confirmação; qualquer ajuste pode ser desfeito, até os 20 últimos, na ordem inversa
- Contexto: ajustar é o fluxo mais frequente do app, feito em série ao abrir pacotinhos; confirmação a cada toque o tornaria lento
- Alternativas descartadas
  - Confirmar cada decremento: atrito no fluxo essencial, e o usuário passa a confirmar sem ler
  - Sem desfazer: toque errado vira perda silenciosa
  - Desfazer só o último ajuste: insuficiente para uma sequência de toques errados
  - Desfazer até 10: não cobre uma sessão de lançamento de vários pacotinhos seguidos
- Consequências
  - Ganha: ajuste em um toque
  - Aceita: erro só é corrigido se o usuário perceber a tempo

## Histórico
- 2026-09-20 TASK-091: limite de desfazer passa de 10 para 20 (comprometido, ainda não entregue)
- 2026-06-18 TASK-052: limite de desfazer passa de 1 para 10; "desfazer só o último" vira alternativa descartada
- 2026-06-02 TASK-041: decisão criada
