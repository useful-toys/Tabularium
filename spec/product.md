# Iconula — Figurinhas da Copa 2026

## O que é
App web para quem coleciona o álbum oficial Panini da Copa do Mundo FIFA 2026: registrar quantas unidades tem de cada figurinha, acompanhar o progresso e organizar trocas de repetidas. Público brasileiro, interface em português.

## Diferenciais
- Cadastrar e consultar figurinhas leva segundos: sem modos, sem configuração
- Sem lock-in: a coleção pertence ao usuário, que exporta e importa sem restrição
- Troca por mensagem: listas de faltantes e repetidas prontas para colar em grupos de troca

## Glossário
- **Catálogo**: todas as figurinhas do álbum (códigos, nomes, seções); fixo, igual para todos os usuários
- **Figurinha**: item do catálogo, identificada pelo código (`BRA05`, `FWC12`)
- **Seção**: grupo de figurinhas com a mesma sigla; é uma seleção ou um especial
  - **Seleção**: um dos 48 times classificados, sigla FIFA (BRA, ARG…), 20 figurinhas; 01 é o escudo, 13 a foto do time, as demais são jogadores
  - **Especial**: Extras FIFA (`FWC`, 20 figurinhas: troféu, mascotes, campeãs do passado) e Coca-Cola (`COC`, 14)
- **Grupo da Copa**: os 12 grupos do torneio (A–L), com 4 seleções cada
- **Conta**: usuário do app, identificado pela conta Google
- **Coleção**: a contagem de cada figurinha do catálogo para um usuário
- **Contagem**: unidades registradas de uma figurinha
- **Faltante**: contagem 0
- **Colada**: contagem ≥ 1; presume-se que a primeira unidade está no álbum
- **Repetida**: figurinha com contagem ≥ 2; as **unidades sobrando** (contagem − 1) são o que está disponível para troca
- **Link do catálogo**: endereço que mostra a coleção de um usuário a quem não tem conta, só para leitura

## Requisitos

### Acesso
- ✓ Entrar com conta Google
  - ✓ Google é o único meio de entrada
  - ✓ Sem entrar, nada do catálogo ou da coleção é acessível, exceto pelo link do catálogo
  - ✓ Desistir da entrada não é erro e não gera aviso; falha de verdade é informada
  - ✓ No primeiro acesso, o usuário atesta ter 12 anos ou mais ou estar autorizado pelos responsáveis; uma vez por conta
  - ✓ Política de privacidade e termos de uso são acessíveis antes de entrar; entrar implica concordar com os termos
- ✓ Sair da conta
  - ✓ Ajustes ainda não salvos são salvos antes de sair
  - ✓ A coleção continua salva e volta na próxima entrada
- ✓ Apagar meus dados
  - ✓ Exige confirmação em dois passos e nova autenticação; desistir em qualquer ponto não apaga nada
  - ✓ Oferece exportar a coleção antes de apagar
  - ✓ Apaga a coleção e a conta no app; a conta Google não é afetada
  - ✓ Confirma a exclusão ao final, mesmo sem sessão
- ✓ Ver informações sobre o app: código-fonte aberto e canal para reportar problemas ou sugerir melhorias

### Catálogo
- ✓ Ver o catálogo completo: 994 figurinhas (48 seleções × 20, 20 Extras FIFA, 14 Coca-Cola)
  - ✓ Cada figurinha mostra código e nome impresso no cromo; escudo e foto do time mostram nome genérico
  - ✓ Seções com nome em português e bandeira; especiais com ícone próprio
- ✓ Ordenar as seções
  - ✓ Pela sigla, ou na ordem do álbum físico agrupada pelos grupos da Copa, com progresso de cada grupo
  - ✓ Em qualquer ordem, Extras FIFA abrem e Coca-Cola fecha o catálogo
- ✓ Ver cada seção como lista ou como a página do álbum físico — facilita conferir com o álbum real
- ✓ Ir direto a uma seção sem perder o restante do catálogo
- ✓ Filtrar por faltantes, coladas ou repetidas
  - ✓ Seções sem nenhuma figurinha no filtro ficam ocultas
- ✓ Ordem, disposição, filtro e seções recolhidas são lembrados no aparelho
- Buscar figurinha por código ou nome

### Contagem
- ✓ Ajustar a contagem de uma figurinha: incrementar e decrementar
  - ✓ Vai de 0 a 99; não há ação de zerar
  - ✓ O ajuste aparece na hora e é salvo automaticamente em poucos segundos, sem ação do usuário
  - ✓ Falha ao salvar não bloqueia o ajuste; o usuário é avisado e o próximo salvamento tenta de novo
- ✓ Desfazer ajustes: até os 10 últimos, na ordem inversa ⇢ Desfazer ajustes: até os 20 últimos, na ordem inversa
- ✓ Ver quando a coleção foi salva pela última vez
- ✓ Avisos ao usuário em três severidades
  - ✓ Sucesso e aviso (recusa esperada, nada quebrado) somem sozinhos
  - ✓ Falha fica até ser dispensada ou até a mesma operação dar certo, e mostra o detalhe técnico se pedido
- Nota: com o app aberto em dois aparelhos ao mesmo tempo, o último salvamento vence
- Lançar de uma vez as figurinhas de um pacotinho

### Progresso e listas
- ✓ Ver o progresso: total, coladas, faltantes e repetidas, geral e por seção
  - ✓ Repetidas no progresso contam figurinhas distintas; nas listas, unidades sobrando
- ✓ Listar faltantes, coladas e repetidas (repetidas com unidades sobrando)
- ✓ Ver estatísticas da coleção, só leitura
  - ✓ Resumo geral, progresso por grupo da Copa e por seção, repetidas por seção, distribuição das contagens

### Compartilhamento
- ✓ Gerar texto de troca com faltantes ou repetidas, para colar em apps de mensagem
  - ✓ Uma linha por seção, com nome, sigla e números das figurinhas; repetidas indicam as unidades sobrando
  - ✓ Faltantes e repetidas geram textos separados
  - ✓ Copiar o texto ou enviar pelo compartilhamento do aparelho, quando disponível
- ✓ Compartilhar o catálogo por link
  - ✓ Um link por conta mostra a coleção atual, só leitura, sem exigir entrada
  - ✓ O dono liga e desliga o link; religar reativa o mesmo link
  - ✓ Nada identifica o dono

### Portabilidade
- ✓ Exportar a coleção num arquivo JSON para salvar no computador
  - ✓ Contém todas as contagens, suficiente para restaurar a coleção exatamente; sem dados pessoais
- ✓ Importar a coleção de um arquivo exportado pelo app
  - ✓ Substitui a coleção inteira, após confirmação
  - ✓ Arquivo inválido é rejeitado sem alterar nada
  - ✓ Descarta o histórico de desfazer

### Apoio ao projeto
- ✓ Doar via Pix
  - ✓ QR code com valor sugerido de R$ 5,00, editável no app do banco; chave em texto para copiar
  - ✓ Acessível sem entrar
  - ✓ O app não sabe se alguém doou nem quanto

### Privacidade
- ✓ Ver a política de privacidade (LGPD)
  - ✓ Declara: dados tratados (identidade Google e coleção), finalidade e base legal de cada um, controlador e encarregado com canal de contato, operador e transferência internacional, retenção (24 meses sem uso; até 90 dias após o fim do projeto), dados guardados no aparelho, visibilidade pelo link do catálogo, tratamento de menores, vigência e histórico de versões
  - ✓ Direitos do titular: exclusão e portabilidade no próprio app; os demais pelo canal de contato, respondidos em até 15 dias
- ✓ Ver os termos de uso: uso no estado em que se encontra, sem garantia de disponibilidade nem contra perda de dados
- ✓ Registrar o aceite: versão aceita da política e dos termos e quando; mudança material pede novo aceite, correção de texto não
- ✓ Medir uso só com consentimento
  - ✓ Recusar não afeta nenhuma função; dados de uso armazenados no Brasil
- ✓ Aviso de independência: sem vínculo com Panini ou FIFA; marcas pertencem aos titulares

## Regras transversais
- ✓ A coleção de um usuário só é visível a ele, exceto pelo link do catálogo ativo
- ✓ Nenhum dado é tratado além da identidade Google, da coleção e das métricas de uso consentidas
- ✓ Falha de salvamento nunca trava o app e sempre é informada
- ✓ O app não exibe imagens dos cromos (direitos autorais da Panini)
- ✓ Cadastrar e consultar são os fluxos mais curtos do app; nenhuma funcionalidade os atravessa
- ✓ Usuário presumido especialista: sem textos explicativos nem reforços redundantes

## Não funcionais
- ✓ Idioma: 100% português do Brasil
- ✓ Acessibilidade: operável por teclado; cor nunca é o único sinal de estado; abreviações têm leitura por extenso para leitores de tela
- ✓ Navegadores: duas últimas versões de Chrome, Edge, Firefox e Safari, desktop e mobile
- ✓ Desempenho: catálogo inteiro rola e filtra sem travar
- ✓ Responsividade: fluxos essenciais completos em celular, tablet e desktop
- ✓ Link do app compartilhado mostra título e descrição em português
- ✓ Custo: opera sem custo de infraestrutura para o mantenedor
- Funciona sem rede para consultar a coleção já carregada

## Fora de escopo
- **Usar sem conta** — permanente: o produto é centrado na conta
- **Imagens dos cromos** — permanente: direitos autorais da Panini
- **Outros álbuns** — nesta versão: o catálogo é o da Copa 2026
