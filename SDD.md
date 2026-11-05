# SDD — Medley Maker

**Software Design Document**  
**Status:** rascunho inicial  
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

Os detalhes a seguir não foram especificados e não devem ser tratados como requisitos até serem decididos:

- Como músicas e cifras serão importadas de fontes externas além do cadastro manual da biblioteca.
- Como o usuário selecionará e editará os trechos.
- Quais elementos uma cifra poderá conter além de texto e acordes.
- Como a ordem e as transições entre trechos serão organizadas.
- Como os medleys serão salvos, exportados, compartilhados ou impressos.
- Se e como os dados serão sincronizados além do armazenamento local deste navegador.
- Se haverá contas, colaboração ou acesso sem autenticação.
- Se a IA fará parte do produto e, em caso afirmativo, quais tarefas realizará.
- Quais dispositivos, navegadores e requisitos de acessibilidade serão priorizados.

## 5. Usuários

O público indicado é formado por músicos, com atenção especial a músicos de igrejas. Ainda não há perfis de usuário, permissões ou diferenças de acesso definidos.

## 6. Requisitos de produto em alto nível

Estes requisitos são uma tradução direta do objetivo declarado e ainda precisam ser detalhados antes da implementação das funcionalidades:

1. A aplicação deverá permitir compor uma cifra de medley que reúna trechos de músicas diferentes.
2. A cifra resultante deverá ser organizada e personalizada pelo usuário.

Não estão definidos critérios de aceitação, regras musicais, limites de conteúdo ou comportamento para esses requisitos.

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

O objetivo sugere os conceitos **medley**, **música**, **trecho** e **cifra**. O modelo de dados da biblioteca de músicas e suas seções está definido na seção 6.1. O modelo de medleys, seus trechos e as regras de combinação ainda não foram definidos.

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

## 10. Etapas sugeridas para evoluir o documento

1. Definir em conjunto como músicas e seções da biblioteca serão usadas na composição de um medley.
2. Decidir o fluxo e as regras de composição antes de iniciar o criador de medleys.
3. Especificar critérios de aceitação para as decisões aprovadas.
4. Detalhar persistência remota ou integrações apenas se forem necessárias para o fluxo escolhido.
5. Implementar as próximas etapas em incrementos pequenos, revisando este documento após cada decisão.

## 11. Glossário

- **Cifra:** representação musical cujo formato e conteúdo exatos ainda serão definidos no produto.
- **Medley:** combinação de trechos de diferentes músicas em uma sequência.
- **Trecho:** parte de uma música que poderá compor um medley; regras de seleção ainda não definidas.
- **SDD:** Software Design Document, documento que registra contexto, decisões e desenho de um sistema.
