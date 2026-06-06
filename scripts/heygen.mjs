#!/usr/bin/env node
// HeyGen helper para a Mestra Mercedes.
//
// Requer Node 18+ (fetch nativo). A API key NUNCA fica neste arquivo:
// leia de variavel de ambiente.
//
//   export HEYGEN_API_KEY="sk_..."
//
// Uso:
//   node scripts/heygen.mjs list-today        # videos criados hoje (America/Sao_Paulo)
//   node scripts/heygen.mjs list [limit]      # ultimos N videos (default 20)
//   node scripts/heygen.mjs avatars [filtro]  # lista avatares (ex.: "avatars Avatar V")
//   node scripts/heygen.mjs voices [filtro]   # lista vozes
//   node scripts/heygen.mjs status <video_id> # status de um video
//   node scripts/heygen.mjs generate <avatar_id> <voice_id> "<texto>"
//   node scripts/heygen.mjs closing  <avatar_id> <voice_id>   # gera so o fechamento padrao
//
// Endpoints: https://docs.heygen.com/

const API_KEY = process.env.HEYGEN_API_KEY;
if (!API_KEY) {
  console.error("ERRO: defina a variavel de ambiente HEYGEN_API_KEY antes de rodar.");
  process.exit(1);
}

const BASE = "https://api.heygen.com";
const HEADERS = { "X-Api-Key": API_KEY, "Accept": "application/json" };
const TZ = "America/Sao_Paulo";

// Texto de fechamento padrao pedido pela Mestra Mercedes.
export const CLOSING_TEXT =
  "Com carinho, Mestra Mercedes. Gratidao.";

// Roteiro novo do video principal (final alterado).
export const MAIN_SCRIPT =
  "Voce ja pensou que talvez nao seja falta de dinheiro e sim falta de merecimento? " +
  "A sua energia financeira, minha querida, comeca na relacao que voce tem consigo mesma. " +
  "Quem nao se valoriza, sem perceber, sabota a propria abundancia. " +
  "Ela nao chega de fora, transborda de dentro para fora. " +
  "Voce atrai o caminho da sua abundancia e riqueza. " +
  "Com carinho, Mestra Mercedes. Gratidao.";

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
    case "generate":
    case "closing": {
      const avatarId = args[0];
      const voiceId = args[1];
      const text = cmd === "closing" ? CLOSING_TEXT : (args[2] || MAIN_SCRIPT);
      if (!avatarId || !voiceId) throw new Error("uso: generate <avatar_id> <voice_id> [texto]");
      const body = {
        video_inputs: [
          {
            character: {
              type: "avatar",
              avatar_id: avatarId,
              avatar_style: "normal", // olhar para a camera / pose padrao
            },
            voice: {
              type: "text",
              input_text: text,
              voice_id: voiceId,
            },
          },
        ],
        dimension: { width: 1080, height: 1920 }, // vertical (reels/stories)
      };
      const data = await api("/v2/video/generate", { method: "POST", body });
      console.log("Video em geracao. video_id:", data?.data?.video_id);
      console.log("Acompanhe com: node scripts/heygen.mjs status", data?.data?.video_id);
      break;
    }
    default:
      console.log("Comandos: list-today | list [n] | avatars [filtro] | voices [filtro] | status <id> | generate <avatar_id> <voice_id> \"texto\" | closing <avatar_id> <voice_id>");
  }
} catch (err) {
  console.error("Falhou:", err.message);
  process.exit(1);
}
