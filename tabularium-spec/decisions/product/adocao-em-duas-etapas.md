---
tema: Adoção da spec num repositório
decisao: Depois da instalação, duas etapas - preparação reexecutável, com repositório, preferências, estrutura e adaptação ao formato; extração a partir de código com perguntas durante
carregar-quando: mudança em adoção, configuração do projeto ou extração da spec de código existente
---
- Decisão: depois que o comando de instalação copia o tabularium, uma etapa de preparação prepara o repositório remoto no GitHub (rótulos, e proteção da branch principal e conferência por agente sugeridas: a skill verifica a situação atual; se não existirem, pergunta se a pessoa as deseja e, se sim, as configura, ou mostra como fazê-lo à mão se ela preferir; quem recusa a conferência por agente segue sem ela e a skill avisa o risco de uma proposta integrar sem conflito e ainda assim contradizer a spec vigente; a chave de acesso de agente é sempre da pessoa), grava as preferências numa configuração lida por scripts e skills, cria só a estrutura da spec e, depois de uma atualização, adapta a spec ao formato novo sem mudar sentido, podendo ser refeita para mudar a configuração; outra etapa extrai a spec de código existente, marcando implementado só com evidência no código, perguntando a cada dúvida e deixando a documentação antiga intocada
- Contexto: repositório novo não tem o que extrair; repositório com código ou documentação antiga precisa de engenharia reversa assistida
- Alternativas descartadas
  - Uma etapa única com modos: mistura configuração com extração
  - Preparação que também instala e atualiza os arquivos: a skill não existe no projeto antes da instalação, e a cópia deixa de ser determinística
  - Uma etapa por cenário (novo, código sem spec, código com documentação): código com e sem documentação só diferem nas fontes
  - Preferências registradas em texto nas regras: o script teria de ler Markdown
  - Perguntas acumuladas no fim da extração: retrabalho quando uma resposta muda o resto
  - Apagar ou mover a documentação antiga: o humano decide depois
  - Só orientar a proteção da branch principal e a conferência por agente, sem oferecer configurá-las: preferência do autor, que a skill sugira e pergunte se pode fazer, e a pessoa decida
- Consequências
  - Ganha: repositório novo adota em minutos; extração sem marcas de implementado infundadas
  - Aceita: extração lenta e interativa; a configuração do repositório pode falhar por falta de permissão ou ser recusada pelo agente, e então a skill mostra como fazê-la à mão

## Histórico
- 2026-09-30 #22: preparação passa a incluir o preparar do repositório remoto no GitHub; a skill sugere a proteção e a conferência por agente e pergunta se a pessoa aceita que ela as configure, em vez de só orientar
- 2026-09-28 #19: preparação depois da instalação, com adaptação da spec ao formato de uma versão nova
- 2026-09-24 plano-inicial: decisão criada
