# GadoHub — instruções obrigatórias para Codex

## Estado oficial
- Projeto: GadoHub.
- Base migrada: DEV.27 / pacote autocontido de 08/09/2026.
- Branch de migração: `codex/gadohub-dev27-migration`.
- Trabalhar sobre a base mais recente. Não reconstruir o sistema do zero e não voltar para DEV.25, DEV.26, RC7.x ou layouts antigos.

## Proteção de produção
- Produção oficial Vercel: `gadohub-producao`.
- Project ID produção: `prj_DprhT4M20S3dK5WMRWxSWWh5up6d`.
- É PROIBIDO publicar, promover, alterar aliases, variáveis ou configuração da produção sem autorização explícita do proprietário.
- Projeto permitido para homologação/preview: `gadohub-dev27-mobile-campo-preview`.
- Project ID DEV.27: `prj_32Wc8qnBupaPdH87mx4T2HPk7ftV`.
- Team ID Vercel: `team_PWcfXcdm5QZJVonv4SokiHv4`.
- Nunca usar `.vercel/project.json` apontando para produção dentro desta branch. Para testes, vincular somente à DEV.27.

## Dados e backend
- Preservar integralmente Supabase, Auth, RLS, multi-tenant, clientes, fazendas, dados, regras de negócio e rollback.
- Não apagar tabelas, policies, usuários ou dados para corrigir problema de frontend.
- Nunca colocar `service_role`, chaves secretas, senhas ou tokens privados no navegador ou no repositório.

## UI aprovada
- Não redesenhar a UI já aprovada.
- Mobile deve iniciar em `Hoje na Fazenda`.
- Atalhos mobile: Manejo no Curral, Animais, Inventário, Movimentações, Pastagens, Mapa da Fazenda, OS/Ocorrências (`tarefas`) e Nascimentos.
- Barra inferior mobile: Início, Curral, Animais, Mapa, Perfil.
- Tema claro/escuro e preferência persistente devem continuar funcionando.
- Login mobile deve caber na tela sem rolagem e, após autenticação válida, o overlay deve desaparecer e o app deve abrir.

## Prioridade técnica atual
Resolver definitivamente o erro recorrente de login mobile/PWA sem regressões no desktop. Auditar como um fluxo completo, não como correções isoladas:
1. carregamento do `index.html`;
2. inicialização do Supabase;
3. `signInWithPassword` e restauração de sessão;
4. transição pós-login/remoção do overlay;
5. detecção online/offline;
6. Service Worker, Cache Storage e atualização de versão;
7. manifest/PWA e instalação;
8. comportamento em navegador móvel e PWA instalado;
9. cache antigo e atualização sem exigir desinstalação;
10. erros de console e recursos 404.

## Regras para Service Worker
- Auth, Supabase REST, Functions e chamadas sensíveis de rede não podem ser respondidas por cache de aplicação.
- Navegação deve ser resiliente, mas um cache antigo não pode mascarar uma nova versão ou manter login em estado falso de offline.
- Mudança de shell/PWA deve incrementar a versão de cache de forma explícita.

## Critério de conclusão da DEV.27
Só considerar a correção pronta quando houver evidência de:
- PC abre e login funciona;
- mobile navegador abre e login funciona;
- PWA instala;
- PWA instalado abre e login funciona;
- online/offline exibido corretamente;
- tema claro/escuro funciona;
- sync continua funcionando;
- clima e mapa não sofrem regressão;
- atualização do PWA ocorre sem desinstalar;
- nenhum recurso crítico 404;
- nenhuma dependência de deployment temporário/loader remoto;
- nenhuma regressão em módulos já aprovados.

## Fluxo de entrega
- Fazer mudanças somente nesta branch ou em branch derivada dela.
- Preferir commits pequenos e rastreáveis.
- Rodar validações de sintaxe antes de publicar preview.
- Testar primeiro na DEV.27.
- Não fazer merge em `main` automaticamente.
- Não publicar em produção automaticamente.
