# SDD — Medley Maker

**Software Design Document**  
**Status:** em evolução
**Atualizado em:** 5 de novembro de 2026

## 1. Propósito

Este documento registra o propósito conhecido do Medley Maker, a base técnica já criada e as decisões de produto e arquitetura que ainda precisam ser tomadas. Ele deve evoluir junto com o projeto; pontos em aberto não são requisitos aprovados.

## 2. Contexto do produto

O Medley Maker é uma aplicação web voltada a músicos, especialmente músicos de igrejas. Seu objetivo é permitir a criação de cifras personalizadas de medleys, combinando trechos de diferentes músicas em uma única cifra organizada.

O projeto também é um espaço de aprendizagem para seu desenvolvedor, que pretende integrar inteligência artificial ao próprio fluxo diário de desenvolvimento. Isso descreve o contexto de desenvolvimento; ainda não define uma funcionalidade de IA para quem usa o aplicativo.

## 3. Objetivos conhecidos

- Apoiar a criação de cifras personalizadas para medleys.
- Reunir trechos de músicas diferentes em uma cifra organizada.
- Manter a aplicação web organizada para evoluir em etapas.
- Usar o projeto como prática de desenvolvimento front-end e integração de IA ao fluxo de trabalho.

## 4. Escopo e limites atuais

### Incluído no objetivo do produto

- Composição de um medley a partir de trechos de diferentes músicas.
- Organização do resultado em uma cifra personalizada.

### Ainda não definido

Os detalhes a seguir permanecem em aberto e não devem ser tratados como requisitos até serem decididos:

- Como músicas e cifras serão importadas de fontes externas além do cadastro manual da biblioteca.
- Quais elementos uma cifra poderá conter além de texto e acordes.
- Como transições entre trechos serão representadas.
- Se os medleys serão compartilhados ou terão outros formatos de exportação além do PDF definido para a pré-visualização.
- Se e como os dados serão sincronizados além do armazenamento local deste navegador.
- Se haverá contas, colaboração ou acesso sem autenticação.
- Se a IA fará parte do produto e, em caso afirmativo, quais tarefas realizará.
- Quais dispositivos, navegadores e requisitos de acessibilidade serão priorizados.

## 5. Usuários

O público indicado é formado por músicos, com atenção especial a músicos de igrejas. Ainda não há perfis de usuário, permissões ou diferenças de acesso definidos.

## 6. Requisitos de produto em alto nível

Requisitos aprovados para as etapas implementadas:

1. A aplicação permite compor um medley a partir de seções selecionadas na biblioteca.
2. A sequência é uma lista livre de trechos, ordenável com controles de mover para cima/baixo.
3. O medley salvo pode ser visualizado e editado; cada trecho mantém uma cópia do conteúdo e dos metadados no momento da seleção.
4. A persistência inicial dos medleys é local ao navegador, independente da biblioteca.

### 6.1 Etapa 1 — Biblioteca de músicas

As decisões abaixo foram definidas para a primeira etapa funcional:

- A biblioteca terá uma rota própria em `/biblioteca`; a página inicial permanece como dashboard e oferece acesso à biblioteca.
- Cadastro e edição acontecem em modal. A visualização da cifra e a confirmação de exclusão também usam janelas modais.
- Cada música tem identificador, título, artista/intérprete, tom original, seções ordenadas, data de criação e data de atualização.
- O tom original é escolhido em uma lista padronizada com tonalidades maiores e menores.
- Cada seção tem identificador, tipo, conteúdo ChordPro e posição. Os tipos disponíveis são introdução, verso, pré-refrão, refrão, ponte, final e outro.
- A letra permanece armazenada como texto ChordPro, com acordes entre colchetes. Um parser identifica símbolos de acorde sem alterar o texto original, permitindo reutilização futura em transposição.
- A biblioteca oferece cadastro, edição, visualização, exclusão com confirmação e pesquisa por título ou artista.
- A persistência inicial usa `localStorage`, com chave `medley-maker:song-library` e envelope de dados na versão `1`. Esse armazenamento é local ao navegador e não sincroniza entre dispositivos.
- Esta etapa não implementa criação ou edição de medleys.

### 6.2 Etapa 2 — Criador de medleys

Decisões aprovadas em conjunto para o criador:

- A área de medleys tem uma página de listagem em `/medleys`, criação em `/medleys/novo` e edição/visualização em `/medleys/[id]`.
- A composição é uma lista livre de trechos. Cada seção escolhida vira um item ordenável independentemente, mesmo quando vários itens vêm da mesma música.
- A seleção ocorre a partir das músicas e seções da biblioteca, com pesquisa pelo título ou artista e possibilidade de adicionar várias seções.
- A ordem pode ser ajustada com controles para mover trechos e grupos de músicas para cima ou para baixo; cada trecho também pode ser removido individualmente ou junto com todos os trechos de sua música.
- A pré-visualização apresenta os trechos em sequência, incluindo título da música, seção, artista, tom original e conteúdo ChordPro.
- Cada item salva identificadores de origem e cópias do título, artista, tom, seção e conteúdo. Alterações e exclusões posteriores da biblioteca não alteram cifras de medleys existentes.
- O medley contém identificador, nome, descrição opcional, datas de criação e atualização e a lista ordenada de itens.
- A persistência usa `localStorage`, chave `medley-maker:medleys` e envelope versão `1`, separado do armazenamento da biblioteca.
- Na pré-visualização, o usuário pode gerar e baixar um PDF do medley diretamente. O arquivo reflete a sequência e a tonalidade exibidas, sem alterar o armazenamento local.
- O dashboard mantém sua estrutura visual e exibe os medleys reais mais recentes, com acesso à criação e à lista completa.
- Não fazem parte desta etapa: transposição automática, autenticação, banco de dados externo ou serviços de terceiros.

## 7. Base técnica atual

O scaffold criado no repositório utiliza:

- **Next.js 16.4.5**, com App Router.
- **React 19.3.0**.
- **TypeScript 5**.
- **Tailwind CSS 4**.
- **ESLint 9**.
- **npm** para dependências e scripts.
- **Git** para controle de versão.

O servidor de desenvolvimento usa `next dev` e o bundler padrão do Next.js, Turbopack. Vite não faz parte da configuração: Next.js utiliza seu próprio pipeline de desenvolvimento e build. Se Vite for uma exigência, será necessário rever a escolha entre Next.js e Vite antes de avançar.

## 8. Arquitetura inicial proposta

Enquanto não houver requisitos de backend, persistência ou autenticação, a arquitetura deve começar simples, no próprio projeto Next.js. A separação por domínio pode ser introduzida conforme funcionalidades forem confirmadas, sem criar camadas vazias antecipadamente.

Estrutura de referência para etapas futuras:

```text
src/
  app/                 # rotas, layouts e estilos globais do Next.js
  features/            # funcionalidades organizadas por domínio, quando existirem
  components/          # componentes compartilhados, quando houver reutilização real
  lib/                 # integrações e utilitários compartilhados, se necessários
public/                # arquivos estáticos
```

Essa estrutura é uma proposta, não uma exigência do framework. O projeto já mantém a rota e o layout em `src/app/`, componentes compartilhados do dashboard em `src/components/dashboard/` e a biblioteca organizada por domínio em `src/features/library/`.

### 8.1 Visão conceitual do domínio

O modelo da biblioteca de músicas e seções está definido na seção 6.1. O medley contém uma sequência de itens independentes, cada um referenciando a música e a seção de origem e mantendo uma cópia dos metadados e conteúdo selecionados. A lista de itens guarda a posição explícita de cada trecho.

### 8.2 Integrações e serviços

Nenhum banco de dados, serviço de autenticação, armazenamento de arquivos, API musical ou provedor de IA foi escolhido. A implementação dessas integrações depende de decisões de produto futuras.

### 8.3 Implementação da biblioteca

`src/features/library/` contém os tipos de música e seção, opções de tonalidade, parser ChordPro, funções de armazenamento e hook de estado. A rota `src/app/biblioteca/page.tsx` compõe o shell compartilhado e o módulo client-side responsável pelas interações com `localStorage`.

## 9. Decisões técnicas registradas

| Tema | Decisão atual | Motivo / estado |
|---|---|---|
| Framework | Next.js | Solicitado para o projeto e já instalado. |
| Build e desenvolvimento | Pipeline padrão do Next.js com Turbopack | Next.js não usa Vite como bundler do projeto. |
| Linguagem | TypeScript | Solicitada e configurada no scaffold. |
| Estilos utilitários | Tailwind CSS 4 | Solicitado e configurado pelo scaffold atual do Next.js. |
| Backend e persistência | `localStorage` versão 1 para a biblioteca; backend em aberto | A persistência local atende à primeira etapa e pode ser substituída por integração remota futura. |
| IA no produto | Em aberto | A IA foi mencionada como parte do aprendizado do desenvolvedor, não como requisito do aplicativo. |
| Biblioteca | Rota `/biblioteca`, modais para cadastro/edição/visualização e confirmação de exclusão | Decisão tomada em conjunto para esta etapa. |
| Organização da biblioteca | `src/features/library/` | Decisão tomada em conjunto; a rota Next correspondente fica em `src/app/biblioteca/`. |
| Biblioteca de músicas | Primeira etapa funcional implementada | CRUD local, seções ChordPro, busca e interface responsiva. |
| Criador de medleys | Etapa 2 definida e implementada | Lista livre de trechos, rotas dedicadas, snapshots independentes da biblioteca e persistência local versão 1. |
| Transposição musical | Etapa 3 implementada | Motor independente em `src/features/transposition/`; prévia de músicas sem mutação, transposição do medley a partir dos snapshots e configuração de tom/notação persistida no próprio medley. |
| Exportação de medley | PDF direto na pré-visualização | Gera arquivo com nome do medley, tom selecionado e conteúdo ChordPro unido na ordem exibida, com espaço entre trechos e sem cabeçalhos por trecho. |

### 9.1 Transposição musical (Etapa 3)

- O motor recebe conteúdo ChordPro e desloca apenas as fundamentais e os baixos de acordes invertidos, mantendo qualidade, letra e demais caracteres.
- A preferência de acidentes (`sharp`, `flat` ou `auto`) é escolhida para cada operação, sem configuração global.
- Na biblioteca, a transposição é somente uma prévia; a música original não é sobrescrita.
- No medley, a tonalidade do primeiro trecho ordenado define a referência inicial. Os destinos permanecem no mesmo modo maior/menor da referência.
- Aplicar uma transposição salva apenas `referenceKey`, `targetKey` e `notation` no medley. O conteúdo exibido é sempre recalculado a partir dos `contentSnapshot` e `originalKeySnapshot`; a aplicação nunca substitui snapshots nem acumula transposições.
- Os registros anteriores seguem compatíveis: a propriedade `transposition` é opcional no formato armazenado.
- Testes automatizados do motor usam `node:test`, sem dependência externa.
- O teste automatizado também valida a junção dos conteúdos no PDF, preservando acordes e separando trechos com uma linha em branco.

## 10. Etapas sugeridas para evoluir o documento

1. Definir em conjunto os próximos recursos do produto, sem presumir transposição, exportação ou sincronização.
2. Detalhar persistência remota ou integrações apenas se forem necessárias para um fluxo aprovado.
3. Implementar as próximas etapas em incrementos pequenos, revisando este documento após cada decisão.

## 11. Glossário

- **Cifra:** representação musical cujo formato e conteúdo exatos ainda serão definidos no produto.
- **Medley:** combinação de trechos de diferentes músicas em uma sequência.
- **Trecho:** parte de uma música que poderá compor um medley; regras de seleção ainda não definidas.
- **SDD:** Software Design Document, documento que registra contexto, decisões e desenho de um sistema.
