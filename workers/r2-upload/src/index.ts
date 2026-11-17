export interface Env {
  BUCKET: R2Bucket;
  FIREBASE_API_KEY: string;
  FIREBASE_PROJECT_ID: string;
  ALLOWED_ORIGIN: string;
}

type FirebaseUser = { localId: string; email?: string; displayName?: string };

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

function corsHeaders(origin: string, env: Env): HeadersInit {
  const allowed = env.ALLOWED_ORIGIN.split(",").map((v) => v.trim());
  if (!allowed.includes(origin)) return { Vary: "Origin" };
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(data: unknown, status = 200, headers: HeadersInit = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...headers },
  });
}

async function verifyFirebaseToken(request: Request, env: Env): Promise<FirebaseUser | null> {
  const auth = request.headers.get("Authorization") || "";
  if (!auth.startsWith("Bearer ")) return null;
  const idToken = auth.slice(7).trim();
  if (!idToken) return null;

  // Firebase Identity Toolkit validates the ID token and returns its user record.
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(env.FIREBASE_API_KEY)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    },
  );
  if (!response.ok) return null;
  const data = (await response.json()) as { users?: FirebaseUser[] };
  return data.users?.[0] ?? null;
}

async function hasUploadRole(user: FirebaseUser, idToken: string, env: Env): Promise<boolean> {
  const url = `https://firestore.googleapis.com/v1/projects/${env.FIREBASE_PROJECT_ID}/databases/(default)/documents/users/${encodeURIComponent(user.localId)}`;
  const response = await fetch(url, { headers: { Authorization: `Bearer ${idToken}` } });
  if (!response.ok) return false;
  const doc = (await response.json()) as { fields?: { role?: { stringValue?: string } } };
  const role = doc.fields?.role?.stringValue;
  return role === "teacher" || role === "superadmin";
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin") || "";
    const cors = corsHeaders(origin, env);
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }
    if (origin && !("Access-Control-Allow-Origin" in cors)) {
      return json({ error: "Origin not allowed" }, 403);
    }

    const url = new URL(request.url);
    if (url.pathname === "/health" && request.method === "GET") {
      return json({ ok: true, service: "qazaq-olymp-upload" }, 200, cors);
    }

    const authHeader = request.headers.get("Authorization") || "";
    const user = await verifyFirebaseToken(request, env);
    if (!user) return json({ error: "Кіру қажет. Firebase токені жарамсыз." }, 401, cors);
    const idToken = authHeader.slice(7).trim();

    if (url.pathname === "/upload" && request.method === "POST") {
      if (!(await hasUploadRole(user, idToken, env))) {
        return json({ error: "Файл жүктеу тек мұғалімдер мен суперадминге рұқсат." }, 403, cors);
      }
      const contentType = (request.headers.get("Content-Type") || "").split(";")[0].toLowerCase();
      if (!ALLOWED_TYPES.has(contentType)) {
        return json({ error: "Тек JPG, PNG, WEBP немесе PDF файлдары рұқсат." }, 415, cors);
      }
      const declaredLength = Number(request.headers.get("Content-Length") || 0);
      if (declaredLength > MAX_FILE_SIZE) {
        return json({ error: "Файл көлемі 10 MB-тан аспауы керек." }, 413, cors);
      }
      const body = await request.arrayBuffer();
      if (body.byteLength === 0 || body.byteLength > MAX_FILE_SIZE) {
        return json({ error: "Файл бос немесе көлемі 10 MB-тан үлкен." }, 413, cors);
      }

      const extension: Record<string, string> = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
        "application/pdf": "pdf",
      };
      const key = `uploads/${user.localId}/${crypto.randomUUID()}.${extension[contentType]}`;
      await env.BUCKET.put(key, body, {
        httpMetadata: { contentType, cacheControl: "private, max-age=3600" },
        customMetadata: { ownerUid: user.localId },
      });
      return json({ ok: true, key, url: `/file/${encodeURIComponent(key)}`, size: body.byteLength }, 201, cors);
    }

    if (url.pathname.startsWith("/file/") && request.method === "GET") {
      const key = decodeURIComponent(url.pathname.slice("/file/".length));
      if (!key || key.includes("..") || key.startsWith("/")) {
        return json({ error: "Файл жолы дұрыс емес." }, 400, cors);
      }
      const object = await env.BUCKET.get(key);
      if (!object) return json({ error: "Файл табылмады." }, 404, cors);
      const headers = new Headers(cors);
      object.writeHttpMetadata(headers);
      headers.set("ETag", object.httpEtag);
      headers.set("Cache-Control", "private, max-age=300");
      return new Response(object.body, { headers });
    }

    return json({ error: "Not found" }, 404, cors);
  },
};
