---
name: spec-extract
description: Preenche spec/product.md, o modelo conceitual (spec/model.md) e as decisões de produto a partir de código existente, usando também testes e documentação antiga (README, docs/, ADRs, specs anteriores) como fonte. Use depois de spec-init, ao adotar a spec viva num repositório que já tem código.
---

# spec-extract

Regras de formato: `spec/AGENTS.md`. Leia antes de escrever.

## Princípios
- **`✓` só com evidência no código.** Anote o arquivo que implementa cada item; o relatório final lista essa evidência para os casos duvidosos.
- **Pergunte durante a execução**, a cada dúvida, antes de seguir. Não acumule perguntas para o final.
- **Nunca invente o porquê** de uma decisão.
- A documentação antiga **fica como está**. Não apague nem mova nada.

## Passos
1. **Mapeie as fontes**: pontos de entrada da aplicação, rotas e telas, testes, README, `docs/`, ADRs e specs antigas. Mostre a lista ao usuário e pergunte se falta alguma fonte ou se alguma deve ser ignorada.
2. **O que é e Diferenciais**: rascunhe a partir do README e da documentação. Confirme com o usuário.
3. **Glossário**: extraia os termos do domínio (entidades, estados) do comportamento, dos modelos de dados e da documentação; termo que só existe no banco vira pergunta. Pergunte quando dois nomes parecerem o mesmo conceito.
4. **Requisitos, domínio por domínio**:
   - Proponha os domínios (`###`) e confirme.
   - Para cada domínio, extraia o comportamento observável do código e dos testes. Escreva requisitos (verbo + objeto) e regras. Implementação, tela e navegação ficam de fora.
   - Tem código e documentação: `✓`.
   - Só código: `✓`, e pergunte se o comportamento é intencional.
   - Só documentação: pergunte se é compromisso (entra sem `✓`) ou se está desatualizado (fica de fora).
   - Documentação e código divergem: pergunte qual vale. Se for o documentado, é mudança significativa: `✓ <o código> ⇢ <o documentado>`.
5. **Regras transversais, Não funcionais e Fora de escopo**: extraia e confirme da mesma forma.
6. **Modelo conceitual** (`spec/model.md`), se o domínio tiver estrutura relevante (pergunte):
   - Parta do comportamento e do vocabulário do glossário, nunca do schema. Formato em `spec/AGENTS.md`.
   - O que só existe no banco (tabelas, colunas, IDs, índices) vira pergunta: é conceito de negócio? Se não for, fica de fora.
   - Invariantes que estavam nas regras transversais vão para o modelo.
   - `✓` com evidência no código, como nos requisitos.
7. **Decisões** (`spec/decisions/product/`):
   - ADRs e decisões antigas: converta ao novo formato só as decisões **de produto** e **vigentes**. As técnicas vão para a camada técnica correspondente, se existir em `spec/config.json`; senão, liste-as no relatório. As obsoletas não migram.
   - Histórico: `AAAA-MM-DD organização: migrada de <documento de origem>`, com a data de hoje.
   - Lacuna (escolha não óbvia sem justificativa): escreva `tema` e `decisao` e pergunte o contexto e as alternativas descartadas.
8. **Valide**: `node scripts/spec.mjs build-map` e `node scripts/spec.mjs check`. O check também valida o `model.md`.

## Entrega
PR com a label `spec-only`. A descrição do PR traz o relatório:
- domínios e quantidade de requisitos extraídos; entidades do modelo conceitual, se houver;
- itens `✓` duvidosos, com a evidência (arquivo) de cada um;
- decisões migradas, técnicas deixadas de fora e obsoletas descartadas;
- perguntas feitas e respostas;
- documentação antiga que agora duplica a spec, para o humano decidir o destino.
