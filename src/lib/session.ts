import "server-only";

const SECRET = process.env.AUTH_SECRET ?? "rgpi-logo-contest-session-v1";
const COOKIE = "rgpi_admin_session";

type Payload = { role: "admin" | "judge"; email: string; exp: number };

async function hmacKey() {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function encode(data: string) {
  return Buffer.from(data, "utf8").toString("base64url");
}

function decode(data: string) {
  return Buffer.from(data, "base64url").toString("utf8");
}

export async function createSessionToken(role: Payload["role"], email: string): Promise<string> {
  const payload: Payload = { role, email, exp: Date.now() + 8 * 60 * 60 * 1000 };
  const body = encode(JSON.stringify(payload));
  const sig = await crypto.subtle.sign("HMAC", await hmacKey(), new TextEncoder().encode(body));
  return `${body}.${Buffer.from(sig).toString("hex")}`;
}

export async function readSessionToken(token: string | undefined): Promise<Payload | null> {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  try {
    const expected = await crypto.subtle.sign("HMAC", await hmacKey(), new TextEncoder().encode(body));
    if (Buffer.from(expected).toString("hex") !== sig) return null;
    const payload = JSON.parse(decode(body)) as Payload;
    if (!payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = COOKIE;
