# HeyGen — geração de vídeos da Mestra Mercedes

Script: [`scripts/heygen.mjs`](./heygen.mjs) (Node 18+, sem dependências extras).

## 1. Liberar a API do HeyGen na sessão do Claude Code na web

Por padrão o ambiente usa a política de rede **Trusted**, que **não** inclui o
HeyGen. Para liberar:

1. Clique no **ícone de nuvem** (nome do ambiente atual) → passe o mouse sobre o
   ambiente → clique no **ícone de engrenagem**.
2. Em **Network access**, selecione **Custom**.
3. No campo **Allowed domains**, adicione (um por linha):
   ```
   api.heygen.com
   *.heygen.com
   *.heygen.ai
   ```
   > Se o download dos vídeos prontos falhar (HeyGen serve via S3/CloudFront),
   > adicione também `*.amazonaws.com`.
4. Marque **Also include default list of common package managers** para manter os
   domínios padrão.
5. **(Recomendado)** No mesmo diálogo, em **Environment variables**, adicione:
   ```
   HEYGEN_API_KEY = <sua key>
   ```
   Assim a key fica fora do chat e fora do git.
6. Salve e **inicie uma nova sessão** — a política de rede só vale para sessões
   novas (resumir uma sessão não recarrega a configuração).

## 2. Usar o script

Requer **Node 18+** e **ffmpeg** (para o `concat`/`process-targets`).

```bash
export HEYGEN_API_KEY="sk_..."   # se não configurou como env var do ambiente

node scripts/heygen.mjs list-today          # vídeos criados hoje
node scripts/heygen.mjs inspect-targets     # status dos 4 IDs em heygen-targets.json
node scripts/heygen.mjs avatars "Avatar V"  # achar o avatar_id do Avatar V
node scripts/heygen.mjs voices pt           # achar a voice_id em português
node scripts/heygen.mjs generate <avatar_id> <voice_id>   # gera o vídeo principal (final novo)
node scripts/heygen.mjs closing  <avatar_id> <voice_id>   # gera só o fechamento padrão
node scripts/heygen.mjs status <video_id>   # acompanha a renderização
node scripts/heygen.mjs download <video_id> # baixa o mp4 pronto p/ ./out
node scripts/heygen.mjs concat <orig.mp4> <fechamento.mp4> <saida.mp4>
```

### Pipeline completo (recomendado)

Faz tudo de uma vez: recria o principal em Avatar V com o final novo, gera o
fechamento e o concatena nos outros 3. Resultados em `./out/`:

```bash
node scripts/heygen.mjs process-targets <avatar_id> <voice_id>
```

## 3. Upload no Google Drive

A pasta `./out/` é ignorada pelo git. O upload é feito pelo **conector MCP do
Google Drive** (roteado pela Anthropic, não precisa de allowlist): peça ao Claude
na sessão *"suba os arquivos de `./out` no meu Drive"* e ele lê cada `.mp4` e
chama `create_file` (mimetype `video/mp4`).

> Observação: o upload via MCP carrega o arquivo em base64 na chamada da
> ferramenta; para vídeos muito grandes isso pode estourar o limite. Se ocorrer,
> faça o upload manual de `./out/*.mp4` ou use o app/CLI do Drive.

## 4. Sobre "Avatar V", gestos e fechamento

- **Avatar V**: na API o avatar é referenciado por `avatar_id`. Rode
  `avatars "Avatar V"` para descobrir o id exato na conta. O olhar para a câmera
  e a gesticulação dependem do avatar/look escolhido (Avatar IV/V já fazem por
  padrão) — não há um "comando" de gesto avulso na API.
- **Final alterado do vídeo principal**: o roteiro completo já está em
  `MAIN_SCRIPT` no script.
- **"Adicionar ao final dos outros vídeos: *Com carinho, Mestra Mercedes.
  Gratidão.*"**: a API gera vídeos novos, **não edita um vídeo já renderizado**.
  Para colar o fechamento num vídeo existente: gere o clipe com `closing`, baixe
  os dois e junte com `ffmpeg`:
  ```bash
  ffmpeg -i original.mp4 -i fechamento.mp4 \
    -filter_complex "[0:v][0:a][1:v][1:a]concat=n=2:v=1:a=1[v][a]" \
    -map "[v]" -map "[a]" final.mp4
  ```
