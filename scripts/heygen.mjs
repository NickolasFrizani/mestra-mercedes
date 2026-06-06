#!/usr/bin/env node
// HeyGen helper para a Mestra Mercedes — AVATAR V (engine real).
//
// Requer Node 18+ (fetch nativo). A API key NUNCA fica neste arquivo:
// leia de variavel de ambiente.
//
//   export HEYGEN_API_KEY="sk_..."
//
// Geracao usa o endpoint v3 (POST /v3/videos) com engine "avatar_v" — e o
// look digital_twin que de fato ANIMA no Avatar V (os looks photo_avatar de
// manto saem quase congelados no Avatar V). Defaults da Mercedes ja embutidos;
// da pra sobrescrever por variavel de ambiente:
//
//   HEYGEN_AVATAR_ID  (default: digital_twin da Mercedes que anima no Avatar V)
//   HEYGEN_VOICE_ID   (default: voz padrao da Mercedes)
//
// Uso:
//   node scripts/heygen.mjs list-today        # videos criados hoje (America/Sao_Paulo)
//   node scripts/heygen.mjs list [limit]      # ultimos N videos (default 20)
//   node scripts/heygen.mjs avatars [filtro]  # lista avatares (ex.: "avatars Mercedes")
//   node scripts/heygen.mjs voices [filtro]   # lista vozes
//   node scripts/heygen.mjs status <video_id> # status de um video
//   node scripts/heygen.mjs generate ["<texto>"]  # gera Avatar V (texto = MAIN_SCRIPT se omitido)
//   node scripts/heygen.mjs closing               # gera so o fechamento padrao em Avatar V
//   node scripts/heygen.mjs download <video_id> [saida.mp4]   # baixa o mp4 pronto
//   node scripts/heygen.mjs concat <orig.mp4> <fechamento.mp4> <saida.mp4>  # junta via ffmpeg
//   node scripts/heygen.mjs process-targets
//        # pipeline completo: recria o principal em Avatar V (final novo),
//        # gera o fechamento e o concatena nos demais. Saidas em ./out
//
// Obs.: as skills oficiais (github.com/heygen-com/skills) + a CLI `heygen`
// fazem o mesmo com mais robustez (auth, polling, download). Este script e o
// caminho raw self-contained, pensado para a maquina local da Mercedes.
//
// Endpoints: https://docs.heygen.com/   (ffmpeg necessario p/ concat)

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const HERE = fileURLToPath(new URL(".", import.meta.url));
const OUT_DIR = `${HERE}../out`;

const API_KEY = process.env.HEYGEN_API_KEY;
if (!API_KEY) {
  console.error("ERRO: defina a variavel de ambiente HEYGEN_API_KEY antes de rodar.");
  process.exit(1);
}

const BASE = "https://api.heygen.com";
const HEADERS = { "X-Api-Key": API_KEY, "Accept": "application/json" };
const TZ = "America/Sao_Paulo";

// --- Defaults Avatar V da Mestra Mercedes (descobertos via MCP/Supabase) ---
// Engine premium que anima de verdade. REGRA do projeto: sempre Avatar V.
const ENGINE = "avatar_v";
// digital_twin "Mestra Mercedes" — anima ~10x mais que os looks de manto
// (photo_avatar) no Avatar V, que saem quase parados.
const AVATAR_ID = process.env.HEYGEN_AVATAR_ID || "09ea20958a7343eea15272dd7b11775e";
// voz padrao da Mercedes (HeyGen voice_id; ElevenLabs PVC por tras).
const VOICE_ID = process.env.HEYGEN_VOICE_ID || "c0d044bb5f324e6eb278b991941f6331";
const ASPECT = "9:16";        // vertical (reels) — original era 1080x1920
const RESOLUTION = "1080p";
const SPEED = 1.1;            // prosodia serena da persona ~72 anos
// motion_prompt SEMPRE em ingles: e diretiva tecnica pro engine, nao texto falado.
const MOTION_PROMPT =
  "Look directly into the camera the entire time, maintaining steady eye contact. " +
  "Gesture naturally and warmly with both hands while speaking, with a calm, serene, maternal posture.";

// Texto de fechamento padrao pedido pela Mestra Mercedes (acentuado p/ TTS correto).
export const CLOSING_TEXT =
  "Com carinho, Mestra Mercedes. Gratidão.";

// Roteiro novo do video principal (final alterado), acentuado p/ TTS correto.
export const MAIN_SCRIPT =
  "Você já pensou que talvez não seja falta de dinheiro e sim falta de merecimento? " +
  "A sua energia financeira, minha querida, começa na relação que você tem consigo mesma. " +
  "Quem não se valoriza, sem perceber, sabota a própria abundância. " +
  "Ela não chega de fora, transborda de dentro para fora. " +
  "Você atrai o caminho da sua abundância e riqueza. " +
  "Com carinho, Mestra Mercedes. Gratidão.";

async function api(path, { method = "GET", body } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { ...HEADERS, ...(body ? { "Content-Type": "application/json" } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} em ${path}: ${JSON.stringify(json)}`);
  }
  return json;
}

function isToday(epochSeconds) {
  if (!epochSeconds) return false;
  const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });
  const d = fmt.format(new Date(epochSeconds * 1000));
  const now = fmt.format(new Date());
  return d === now;
}

async function listVideos(limit = 20) {
  // v1/video.list aceita ?limit= e ?token= (paginacao)
  const data = await api(`/v1/video.list?limit=${limit}`);
  return data?.data?.videos || data?.videos || [];
}

function printVideo(v) {
  const created = v.created_at ? new Date(v.created_at * 1000).toLocaleString("pt-BR", { timeZone: TZ }) : "?";
  console.log(
    `- ${v.video_title || "(sem titulo)"}\n    id: ${v.video_id}  status: ${v.status}  criado: ${created}`
  );
}

// Corpo da geracao v3 em Avatar V (corpo flat snake_case, espelha o MCP/CLI).
// avatar olhando p/ camera + gesticulando (motion_prompt), vertical 1080p.
function buildVideoBody(text, { avatarId = AVATAR_ID, voiceId = VOICE_ID, title } = {}) {
  const body = {
    avatar_id: avatarId,
    engine: { type: ENGINE },          // "avatar_v"
    script: text,
    voice_id: voiceId,
    voice_settings: { speed: SPEED },
    motion_prompt: MOTION_PROMPT,
    aspect_ratio: ASPECT,
    resolution: RESOLUTION,
  };
  if (title) body.title = title;
  return body;
}

// Dispara a geracao (POST /v3/videos) e devolve o video_id.
async function startGenerate(text, opts = {}) {
  const data = await api("/v3/videos", { method: "POST", body: buildVideoBody(text, opts) });
  const id = data?.data?.video_id || data?.video_id;
  if (!id) throw new Error(`resposta sem video_id: ${JSON.stringify(data)}`);
  return id;
}

// Faz polling ate o video ficar pronto; devolve a URL do mp4.
async function waitForVideo(videoId, { intervalMs = 10000, timeoutMs = 1800000 } = {}) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const data = await api(`/v1/video_status.get?video_id=${videoId}`);
    const d = data?.data || {};
    if (d.status === "completed") return d.video_url;
    if (d.status === "failed") throw new Error(`video ${videoId} falhou: ${JSON.stringify(d.error || d)}`);
    console.log(`  ...${videoId} status=${d.status}`);
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error(`timeout esperando ${videoId}`);
}

async function downloadTo(url, outPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download HTTP ${res.status} de ${url}`);
  writeFileSync(outPath, Buffer.from(await res.arrayBuffer()));
  console.log(`  baixado: ${outPath}`);
  return outPath;
}

// Concatena dois mp4 (re-encoda p/ garantir mesmo codec/resolucao).
function ffmpegConcat(originalPath, closingPath, outPath) {
  execFileSync(
    "ffmpeg",
    ["-y", "-i", originalPath, "-i", closingPath,
     "-filter_complex", "[0:v][0:a][1:v][1:a]concat=n=2:v=1:a=1[v][a]",
     "-map", "[v]", "-map", "[a]", outPath],
    { stdio: "inherit" }
  );
  console.log(`  concatenado: ${outPath}`);
}

function loadTargets() {
  const cfg = JSON.parse(readFileSync(`${HERE}heygen-targets.json`, "utf8"));
  return cfg.videos;
}

const cmd = process.argv[2];
const args = process.argv.slice(3);

try {
  switch (cmd) {
    case "list": {
      const vids = await listVideos(Number(args[0]) || 20);
      console.log(`${vids.length} video(s):`);
      vids.forEach(printVideo);
      break;
    }
    case "list-today": {
      const vids = await listVideos(100);
      const todays = vids.filter((v) => isToday(v.created_at));
      console.log(`${todays.length} video(s) criado(s) hoje (${TZ}):`);
      todays.forEach(printVideo);
      break;
    }
    case "avatars": {
      const data = await api("/v2/avatars");
      const list = data?.data?.avatars || [];
      const filtro = (args.join(" ") || "").toLowerCase();
      const filtered = filtro
        ? list.filter((a) => (a.avatar_name || "").toLowerCase().includes(filtro))
        : list;
      console.log(`${filtered.length} avatar(es):`);
      filtered.forEach((a) => console.log(`- ${a.avatar_name}  id: ${a.avatar_id}`));
      // Tambem mostra "talking photos" (Avatar IV/V costumam aparecer aqui)
      const photos = data?.data?.talking_photos || [];
      if (photos.length) {
        console.log(`\n${photos.length} talking photo(s):`);
        photos.forEach((p) => console.log(`- ${p.talking_photo_name || "(sem nome)"}  id: ${p.talking_photo_id}`));
      }
      break;
    }
    case "voices": {
      const data = await api("/v2/voices");
      const list = data?.data?.voices || [];
      const filtro = (args.join(" ") || "").toLowerCase();
      const filtered = filtro
        ? list.filter((v) => `${v.name} ${v.language}`.toLowerCase().includes(filtro))
        : list.slice(0, 50);
      console.log(`${filtered.length} voz(es):`);
      filtered.forEach((v) => console.log(`- ${v.name} [${v.language}]  id: ${v.voice_id}`));
      break;
    }
    case "status": {
      const id = args[0];
      if (!id) throw new Error("informe o video_id");
      const data = await api(`/v1/video_status.get?video_id=${id}`);
      console.log(JSON.stringify(data?.data || data, null, 2));
      break;
    }
    case "inspect-targets": {
      // Le scripts/heygen-targets.json e mostra status + acao de cada video.
      for (const t of loadTargets()) {
        try {
          const data = await api(`/v1/video_status.get?video_id=${t.video_id}`);
          const d = data?.data || {};
          console.log(`- ${t.video_id} [${t.acao}]\n    status: ${d.status}  titulo: ${d.video_title || "?"}  url: ${d.video_url || "-"}`);
        } catch (e) {
          console.log(`- ${t.video_id} [${t.acao}]\n    ERRO: ${e.message}`);
        }
      }
      break;
    }
    case "generate":
    case "closing": {
      const text = cmd === "closing" ? CLOSING_TEXT : (args[0] || MAIN_SCRIPT);
      const title = cmd === "closing" ? "AV_fechamento" : "AV_principal";
      const id = await startGenerate(text, { title });
      console.log(`Video em geracao (Avatar V). video_id: ${id}`);
      console.log(`Avatar: ${AVATAR_ID}  voz: ${VOICE_ID}`);
      console.log("Acompanhe com: node scripts/heygen.mjs status", id);
      break;
    }
    case "download": {
      const id = args[0];
      if (!id) throw new Error("informe o video_id");
      const data = await api(`/v1/video_status.get?video_id=${id}`);
      const url = data?.data?.video_url;
      if (!url) throw new Error(`video ${id} sem video_url (status=${data?.data?.status})`);
      mkdirSync(OUT_DIR, { recursive: true });
      await downloadTo(url, args[1] || `${OUT_DIR}/${id}.mp4`);
      break;
    }
    case "concat": {
      const [orig, closing, out] = args;
      if (!orig || !closing || !out) throw new Error("uso: concat <orig.mp4> <fechamento.mp4> <saida.mp4>");
      ffmpegConcat(orig, closing, out);
      break;
    }
    case "process-targets": {
      // Avatar/voz vem dos defaults (ou HEYGEN_AVATAR_ID / HEYGEN_VOICE_ID).
      mkdirSync(OUT_DIR, { recursive: true });
      const targets = loadTargets();

      // 1) Gera o clipe de fechamento uma unica vez (reaproveitado em todos).
      console.log("[1/3] Gerando clipe de fechamento (Avatar V)...");
      const closingId = await startGenerate(CLOSING_TEXT, { title: "AV_fechamento" });
      const closingUrl = await waitForVideo(closingId);
      const closingPath = `${OUT_DIR}/fechamento.mp4`;
      await downloadTo(closingUrl, closingPath);

      // 2) Recria o principal em Avatar V com o roteiro/final novo.
      console.log("[2/3] Recriando o video principal (Avatar V, final novo)...");
      const principal = targets.find((t) => t.acao === "recriar-avatar-v-final-novo");
      if (principal) {
        const newId = await startGenerate(MAIN_SCRIPT, { title: "AV_principal" });
        const url = await waitForVideo(newId);
        await downloadTo(url, `${OUT_DIR}/principal-${newId}.mp4`);
      }

      // 3) Nos demais: baixa o original e concatena o fechamento.
      console.log("[3/3] Adicionando fechamento aos demais videos...");
      for (const t of targets.filter((x) => x.acao === "adicionar-fechamento")) {
        const data = await api(`/v1/video_status.get?video_id=${t.video_id}`);
        const url = data?.data?.video_url;
        if (!url) { console.log(`  pulando ${t.video_id}: sem video_url`); continue; }
        const origPath = `${OUT_DIR}/${t.video_id}-orig.mp4`;
        await downloadTo(url, origPath);
        ffmpegConcat(origPath, closingPath, `${OUT_DIR}/${t.video_id}-final.mp4`);
      }
      console.log(`\nPronto. Arquivos finais em ${OUT_DIR}`);
      break;
    }
    default:
      console.log("Comandos: list-today | list [n] | avatars [filtro] | voices [filtro] | status <id> | inspect-targets | generate [\"texto\"] | closing | download <video_id> [saida.mp4] | concat <orig> <fechamento> <saida> | process-targets");
  }
} catch (err) {
  console.error("Falhou:", err.message);
  process.exit(1);
}
