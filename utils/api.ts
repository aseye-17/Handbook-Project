// Lightweight API client for the Handbook backend
// Works for web and can be adjusted for device/emulator testing.

export type LoginResponse = { access_token: string; token_type: string };

// Determine API base URL
function detectBaseUrl(): string {
  // Prefer explicit env override (Expo public env var)
  const fromEnv = (process.env as any)?.EXPO_PUBLIC_API_BASE_URL as string | undefined;
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  // If running on web, localhost works
  if (typeof window !== "undefined") {
    return "http://localhost:8000";
  }

  // Fallback for emulators/devices (adjust as needed):
  // Android emulator special loopback to host machine
  return "http://10.0.2.2:8000";
}

export const BASE_URL = detectBaseUrl();

async function toError(res: Response) {
  try {
    const data = await res.json();
    const msg = (data && (data.detail || data.message)) || `HTTP ${res.status}`;
    return new Error(msg);
  } catch (_) {
    return new Error(`HTTP ${res.status}`);
  }
}

export async function signup(data: { email: string; password: string; full_name?: string }) {
  const res = await fetch(`${BASE_URL}/api/v1/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await toError(res);
  return res.json();
}

export async function login(email: string, password: string) {
  const form = new URLSearchParams({ username: email, password });
  const res = await fetch(`${BASE_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form,
  });
  if (!res.ok) throw await toError(res);
  return (await res.json()) as LoginResponse;
}

export async function getMe(token: string) {
  const res = await fetch(`${BASE_URL}/api/v1/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw await toError(res);
  return res.json();
}

export async function updateMe(token: string, data: { full_name?: string; password?: string }) {
  const res = await fetch(`${BASE_URL}/api/v1/users/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await toError(res);
  return res.json();
}

export async function logout() {
  // Optional server call (stateless JWT)
  try {
    await fetch(`${BASE_URL}/api/v1/auth/logout`, { method: "POST" });
  } catch (_) {
    // ignore network errors here
  }
}
