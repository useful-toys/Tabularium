---
tema: Como o tabularium chega a um projeto e é atualizado
decisao: Comando de instalação em sh e ps1 que copia, de uma versão publicada, só os arquivos de um manifesto, sobrescrevendo; o mesmo comando atualiza, sem mesclar
carregar-quando: mudança na forma de adotar ou atualizar o tabularium, no manifesto, nas versões, na estrutura de pastas ou em instalação
---
- Decisão: o tabularium chega ao projeto por um comando de instalação na raiz do repositório do tabularium, em sh e ps1, baixado e executado com o curl ou o `irm` apontando a URL; o comando baixa a versão pedida, ou a última tag publicada, e copia só os arquivos listados num manifesto; a spec do próprio tabularium, os documentos derivados, o README, os testes e o fluxo de CI do próprio repositório ficam de fora; rodado de novo, o mesmo comando atualiza: sobrescreve os arquivos do manifesto, apaga os que saíram dele e troca só o bloco delimitado do processo no arquivo de instruções da raiz, que cria se não existir; registra num arquivo próprio do projeto a origem, a versão e os arquivos instalados; recusa voltar para versão menor, salvo pedido explícito; nunca faz commit; o que é do projeto fica fora dos arquivos do tabularium: textos de idioma extra num arquivo da spec, e passos de CI do repositório do tabularium num fluxo que não é distribuído; assim sobrescrever é seguro; versões com número semântico, publicadas em lote e à mão por uma pessoa; a maior muda quando a spec dos projetos precisa ser adaptada ao formato, e a adaptação é feita pela preparação, no mesmo PR da atualização; o repositório do tabularium não é marcado como template do GitHub; mantém o layout de um projeto real, com o exemplo na própria spec, validado pela verificação
- Contexto: "Use this template" copiava a spec do próprio tabularium, que quem adotava precisava apagar, e não havia como atualizar um projeto que já adotara; o desejo é uma instalação determinística e um mecanismo simples por ora
- Alternativas descartadas
  - Repositório template do GitHub com o layout real e cópia manual de arquivos: copia a spec do tabularium, e não atualiza
  - Pasta de template aninhada com instalador: o repositório não se parece com o que será entregue
  - Skill do agente que copia e atualiza: a skill não existe no projeto antes da instalação
  - Preparação atualizando com merge de três vias entre a versão instalada, a nova e a local: resultado depende do julgamento do agente; a instalação deixa de ser determinística
  - Comando que só instala e agente que atualiza: dois caminhos para a mesma cópia
  - Comando que só avisa arquivos órfãos, sem apagar: arquivo velho pode ser tomado por instrução válida
  - Cópia com exclusões fixas no script, sem manifesto: algo indevido pode vazar para o projeto, e as exclusões ficam duplicadas nos dois scripts
  - Registro da versão na configuração da spec: o shell não edita JSON sem ferramenta extra, e a versão não é preferência do projeto
  - Tag automática a cada mudança da definição: nem toda mudança merece versão; uma pessoa controla o que está estável para os projetos; sem automação nova por ora
  - Processo movido para o arquivo de instruções da spec, com a raiz livre para o projeto: a raiz deixaria de carregar o processo em toda sessão
- Consequências
  - Ganha: projeto sem arquivos do tabularium que não usa; atualização com um comando; a mesma versão dá o mesmo resultado em qualquer projeto; o diff do PR mostra tudo o que mudou
  - Aceita: customização nos arquivos do tabularium se perde a cada atualização; dois scripts com a mesma lógica; arquivo novo na definição exige entrada no manifesto; sem versão publicada, não há o que instalar; mudanças ficam sem versão até uma pessoa publicar

## Histórico
- 2026-09-28 #19: decisão criada, substitui template-com-layout-real
