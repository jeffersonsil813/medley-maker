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

- Como músicas e cifras serão fornecidas ou cadastradas.
- Como o usuário selecionará e editará os trechos.
- Quais elementos uma cifra poderá conter além de texto e acordes.
- Como a ordem e as transições entre trechos serão organizadas.
- Como os medleys serão salvos, exportados, compartilhados ou impressos.
- Se haverá contas, colaboração, armazenamento remoto ou acesso sem autenticação.
- Se a IA fará parte do produto e, em caso afirmativo, quais tarefas realizará.
- Quais dispositivos, navegadores e requisitos de acessibilidade serão priorizados.

## 5. Usuários

O público indicado é formado por músicos, com atenção especial a músicos de igrejas. Ainda não há perfis de usuário, permissões ou diferenças de acesso definidos.

## 6. Requisitos de produto em alto nível

Estes requisitos são uma tradução direta do objetivo declarado e ainda precisam ser detalhados antes da implementação das funcionalidades:

1. A aplicação deverá permitir compor uma cifra de medley que reúna trechos de músicas diferentes.
2. A cifra resultante deverá ser organizada e personalizada pelo usuário.

Não estão definidos critérios de aceitação, regras musicais, limites de conteúdo ou comportamento para esses requisitos.

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

Essa estrutura é uma proposta, não uma exigência do framework. O scaffold atual contém `src/app/` e `public/`; as demais pastas devem surgir quando houver código que justifique sua criação.

### 8.1 Visão conceitual do domínio

O objetivo sugere os conceitos **medley**, **música**, **trecho** e **cifra**. Eles são apenas um vocabulário inicial para conversar sobre o produto. Modelo de dados, relações, campos e regras ainda não foram definidos.

### 8.2 Integrações e serviços

Nenhum banco de dados, serviço de autenticação, armazenamento de arquivos, API musical ou provedor de IA foi escolhido. A implementação dessas integrações depende de decisões de produto futuras.

## 9. Decisões técnicas registradas

| Tema | Decisão atual | Motivo / estado |
|---|---|---|
| Framework | Next.js | Solicitado para o projeto e já instalado. |
| Build e desenvolvimento | Pipeline padrão do Next.js com Turbopack | Next.js não usa Vite como bundler do projeto. |
| Linguagem | TypeScript | Solicitada e configurada no scaffold. |
| Estilos utilitários | Tailwind CSS 4 | Solicitado e configurado pelo scaffold atual do Next.js. |
| Backend e persistência | Em aberto | Nenhuma necessidade ou serviço foi especificado. |
| IA no produto | Em aberto | A IA foi mencionada como parte do aprendizado do desenvolvedor, não como requisito do aplicativo. |
| Interface e funcionalidades | Aguardam confirmação do usuário | O pedido inicial determinou que não fossem desenvolvidas antes da confirmação. |

## 10. Etapas sugeridas para evoluir o documento

1. Confirmar as decisões abertas da experiência: entrada das músicas, edição dos trechos e formato da cifra final.
2. Definir o menor fluxo de criação que represente o objetivo do produto.
3. Especificar regras e critérios de aceitação para esse fluxo.
4. Só então detalhar modelo de dados, persistência e integrações, caso sejam necessárias.
5. Implementar em etapas pequenas, revisando este documento quando decisões forem tomadas.

## 11. Glossário

- **Cifra:** representação musical cujo formato e conteúdo exatos ainda serão definidos no produto.
- **Medley:** combinação de trechos de diferentes músicas em uma sequência.
- **Trecho:** parte de uma música que poderá compor um medley; regras de seleção ainda não definidas.
- **SDD:** Software Design Document, documento que registra contexto, decisões e desenho de um sistema.
