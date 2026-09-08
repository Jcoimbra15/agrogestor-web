# Migração GadoHub DEV.27 para Codex

## Branch oficial de trabalho
`codex/gadohub-dev27-migration`

## Objetivo
Trazer o GadoHub atual para um fluxo de desenvolvimento versionado e auditável pelo Codex sem alterar a produção oficial.

## Fonte atual
O projeto DEV.27 está publicado no projeto Vercel `gadohub-dev27-mobile-campo-preview`.

Domínio estável:
`https://gadohub-dev27-mobile-campo-preview.vercel.app`

O snapshot autocontido identificado em 08/09/2026 contém:
- `index.html`
- `dev27.css`
- `dev27.js`
- `runtime-config.js`
- `manifest.webmanifest`
- `sw.js`
- `vercel.json`
- `gadohub-icon-192.png`
- `gadohub-icon-512.png`
- `gadohub-icon-maskable-512.png`

## Bootstrap do source para o Codex
Antes de alterar qualquer funcionalidade, recuperar os artefatos diretamente do domínio DEV.27 e gravá-los em `gadohub-dev27/`, preservando bytes/conteúdo antes de qualquer edição:

```bash
mkdir -p gadohub-dev27
cd gadohub-dev27
curl -fL --retry 3 https://gadohub-dev27-mobile-campo-preview.vercel.app/ -o index.html
curl -fL --retry 3 https://gadohub-dev27-mobile-campo-preview.vercel.app/dev27.css -o dev27.css
curl -fL --retry 3 https://gadohub-dev27-mobile-campo-preview.vercel.app/dev27.js -o dev27.js
curl -fL --retry 3 https://gadohub-dev27-mobile-campo-preview.vercel.app/runtime-config.js -o runtime-config.js
curl -fL --retry 3 https://gadohub-dev27-mobile-campo-preview.vercel.app/manifest.webmanifest -o manifest.webmanifest
curl -fL --retry 3 https://gadohub-dev27-mobile-campo-preview.vercel.app/sw.js -o sw.js
curl -fL --retry 3 https://gadohub-dev27-mobile-campo-preview.vercel.app/gadohub-icon-192.png -o gadohub-icon-192.png
curl -fL --retry 3 https://gadohub-dev27-mobile-campo-preview.vercel.app/gadohub-icon-512.png -o gadohub-icon-512.png
curl -fL --retry 3 https://gadohub-dev27-mobile-campo-preview.vercel.app/gadohub-icon-maskable-512.png -o gadohub-icon-maskable-512.png
```

Depois:
1. registrar SHA-256 de todos os arquivos recuperados;
2. procurar `fetch()`/URLs que apontem para outros deployments Vercel temporários;
3. procurar recursos 404;
4. identificar toda inicialização Supabase/Auth;
5. auditar `signInWithPassword`, `onAuthStateChange`, restauração de sessão e remoção do `loginOverlay`;
6. auditar Service Worker/Cache Storage e lógica online/offline;
7. só então começar a correção.

## Snapshot local já identificado no histórico
Existe também um pacote de 08/09/2026 chamado `GadoHub_PRODUCAO_FIX_LOGIN_PC_MOBILE_20260908.zip`, SHA-256 `e71a2a723a683e190218f469fb85b8ce33d7ee0b70c08681d52a18cbe41f68e8`. Ele foi usado apenas como referência de preservação durante a migração; não publicar o conteúdo automaticamente em produção.

## Regra de ambiente
Qualquer preview/deploy de teste deve usar SOMENTE o projeto Vercel DEV.27 (`prj_32Wc8qnBupaPdH87mx4T2HPk7ftV`).

Produção oficial (`prj_DprhT4M20S3dK5WMRWxSWWh5up6d`) permanece bloqueada até autorização explícita.

## Primeira tarefa do Codex
Diagnosticar e corrigir definitivamente o login mobile/PWA recorrente, com teste de regressão no desktop, antes de qualquer nova feature.
