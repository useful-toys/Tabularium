# Iconula — Modelo conceitual

## Tipos
- ✓ **Sigla de seção**: texto; 3 letras maiúsculas
- ✓ **Código de figurinha**: texto; **Sigla de seção** seguida da posição na seção com 2 dígitos
- ✓ **Letra de grupo**: texto; uma letra de A a L
- ✓ **Contagem**: inteiro; de 0 a 99
- ✓ **Página do álbum**: inteiro; a partir de 0

## Entidades
- ✓ **Catálogo**
  - ✓ igual para todas as contas; não muda durante o uso
- ✓ **Seção**
  - ✓ sigla: **Sigla de seção**; identidade; imutável
  - ✓ pertence a 1 **Catálogo**
  - ✓ tipos: **Seleção** | **Especial**
  - ✓ **Seleção** pertence a 1 **Grupo da Copa**
  - ✓ páginas no álbum físico: **Página do álbum**; definem a ordem do álbum
- ✓ **Figurinha**
  - ✓ código: **Código de figurinha**; identidade; imutável
  - ✓ pertence a 1 **Seção**
- ✓ **Grupo da Copa**
  - ✓ letra: **Letra de grupo**; identidade
- ✓ **Conta**
  - ✓ estados de atestação: pendente | atestada
  - ✓ pendente → atestada: o usuário atesta no primeiro acesso
  - ✓ estados de aceite dos textos: pendente | em dia
  - ✓ pendente → em dia: o usuário aceita as versões vigentes da política e dos termos
  - ✓ em dia → pendente: publicação de versão com mudança material
- ✓ **Coleção**
  - ✓ pertence a 1 **Conta**
  - ✓ contagem por **Figurinha** do catálogo: **Contagem**
  - ✓ estados por figurinha: Faltante (derivado), Colada (derivado), Repetida (derivado)
- ✓ **Link do catálogo**
  - ✓ pertence a 1 **Conta**
  - ✓ estados: desligado | ligado; nasce desligado
  - ✓ desligado → ligado: o dono liga
  - ✓ ligado → desligado: o dono desliga
