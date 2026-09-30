# tabularium-spec

Spec do próprio tabularium3, isto é, do template. Não confunda com `spec/`, que traz só o `spec/AGENTS.md` distribuído aos projetos.

- Segue as regras de formato de `spec/AGENTS.md`. Leia esse arquivo antes de editar aqui.
- A definição do tabularium é esta pasta junto com tudo o que compõe o repositório do tabularium; o que chega aos projetos é o listado em `tabularium.manifest`, mais o bloco do `AGENTS.md`. Arquivos da definição: `AGENTS.md`, `spec/AGENTS.md`, `REVIEW.md`, `README.md`, `tabularium-docs/`, `.gitattributes`, `scripts/`, `.claude/skills/`, `.github/`, `INSTALL.sh`, `INSTALL.ps1` e `tabularium.manifest`. Esses arquivos não são implementação desta spec: são parte da definição.
- Não valem aqui as regras de mudança de `spec/AGENTS.md` (proposta separada da entrega, issue, tipo de mudança e label de tipo, `/spec-sync`). No lugar delas:
  - Toda mudança na definição entra num único PR com a label `tabularium`, sem label de tipo, e sem issue.
  - O PR já traz a spec, as decisões e todos os arquivos da definição alinhados. Todo item daqui tem `✓`; não há item comprometido nem `⇢`.
  - `/spec-grill` e `/spec-ideas` amadurecem a mudança na conversa; `/spec-propose` valida a consistência de `tabularium-spec/` e abre o PR.
  - O merge, decidido por um humano, é aceite e entrega.
- O `tabularium.manifest` lista o que o INSTALL copia para os projetos. Arquivo novo da definição que os projetos precisam entra nele; o teste do script falha se faltar uma skill, se um caminho não existir ou se entrar algo que não é distribuível. `INSTALL.sh` e `INSTALL.ps1` têm a mesma lógica: mude os dois juntos.
- O CI desta pasta fica em `.github/workflows/tabularium.yml`, fora do manifesto: roda os testes do script, verifica esta pasta só na forma e exige a label `tabularium` no PR que toca qualquer arquivo da definição (esta pasta, `tabularium-docs/`, o que está no manifesto, o próprio manifesto, o INSTALL, `AGENTS.md`, `README.md`, os testes do script e `tabularium.yml`). O `spec-check.yml` distribuído se abstém no PR com a label `tabularium`. Num PR com a label `tabularium`, o tipo não é classificado e a revisão consultiva não roda.
- Comandos: `node scripts/spec.mjs build-map --spec tabularium-spec` e `node scripts/spec.mjs check --spec tabularium-spec`.
- `tabularium-docs/` guarda os documentos derivados da definição, como `spec-flow.md`, `install.md`, `config.md` e `maintenance.md`. O `README.md` descreve só o que o tabularium faz e aponta para eles; o detalhe operacional fica nesses documentos. Eles e o `README.md` são regerados a cada PR `tabularium` a partir dos arquivos finais, conforme `/spec-propose`, e nunca são fonte.
- Esta pasta, `tabularium-docs/`, o `README.md`, os testes do script e o `.gitattributes` (arquivo do projeto, que não se sobrescreve) ficam fora do manifesto: nunca chegam aos projetos.
- Versões: tags `vX.Y.Z`, criadas à mão por uma pessoa quando decide publicar um lote de mudanças. A maior muda quando a spec dos projetos precisa ser adaptada ao formato. Sem tag, o INSTALL não tem o que instalar.
