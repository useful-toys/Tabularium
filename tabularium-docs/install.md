# Instalar e atualizar

> **Documento derivado.** Descreve a instalação definida em `tabularium-spec/` e nos arquivos da definição (`INSTALL.sh`, `INSTALL.ps1`, `tabularium.manifest`). Não é fonte para agentes: em caso de conflito, vale a spec. É regerado a cada PR `tabularium` pelo `/spec-propose`.

Na raiz do repositório do projeto, com git:

```bash
curl -fsSL https://raw.githubusercontent.com/useful-toys/Tabularium/main/INSTALL.sh | sh
```

```powershell
irm https://raw.githubusercontent.com/useful-toys/Tabularium/main/INSTALL.ps1 | iex
```

O mesmo comando instala e atualiza:
- baixa a última tag `vX.Y.Z` publicada, ou a pedida, e copia os arquivos do manifesto dela, sobrescrevendo;
- apaga os arquivos da instalação anterior que saíram do manifesto;
- no `AGENTS.md`: sem ele, cria-o só com o bloco do processo; com ele, troca só o bloco entre os marcadores, ou o insere no início se não houver, sem tocar o resto;
- grava em `.tabularium` a origem, a versão e os arquivos instalados;
- recusa instalar enquanto existir `CLAUDE.md` na raiz ou em `spec/`: migre o conteúdo para `AGENTS.md` à mão e apague-o;
- recusa voltar para versão menor que a instalada;
- nunca faz commit.

Variáveis opcionais (no PowerShell, `$env:NOME = 'valor'` antes do comando):

| Variável | Efeito |
|---|---|
| `TABULARIUM_VERSION=v1.2.0` | tag a instalar (padrão: a última `vX.Y.Z`) |
| `TABULARIUM_SOURCE=<url git>` | repositório de origem (padrão: o do `.tabularium`, ou o oficial) |
| `TABULARIUM_ALLOW_DOWNGRADE=1` | permite instalar tag menor que a instalada |

Depois, rode `/spec-init`: na adoção, prepara o repositório, grava as preferências e cria a estrutura; numa atualização, adapta a spec ao formato novo sem mudar o sentido de nenhum item (o que mudaria sentido vira proposta). Se o repositório já tiver código, siga com `/spec-extract`. Revise o diff e leve tudo, instalação e adaptação, num PR.

Customizações nos arquivos do tabularium se perdem a cada atualização; o que é do projeto fica fora deles.

## Versões

Tags `vX.Y.Z`, criadas à mão por uma pessoa quando decide publicar um lote de mudanças; sem tag, o INSTALL não tem o que instalar. A versão maior muda quando a spec dos projetos precisa ser adaptada ao formato, e o INSTALL avisa ao cruzá-la.
