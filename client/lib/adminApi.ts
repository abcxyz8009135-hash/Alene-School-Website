import { API_BASE_URL } from "./constants";

const TOKEN_KEY = "alene_hs_admin_token";
const USER_KEY = "alene_hs_admin_user";

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function getAdminUser(): AdminUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
}

export function setAdminSession(token: string, user: AdminUser) {
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAdminSession() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

export class AdminApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

/**
 * Authenticated fetch helper for the admin dashboard. Attaches the stored
 * admin JWT and throws AdminApiError on non-2xx responses so callers can
 * surface a message without repeating the same parsing logic everywhere.
 */
export async function adminFetch(path: string, options: RequestInit = {}) {
  const token = getAdminToken();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new AdminApiError(data.message || "Request failed.", res.status);
  }

  return data;
}

/**
 * Uploads an image file to the admin upload endpoint and returns its public URL.
 * Uses a bare fetch (not adminFetch) so the browser sets the multipart boundary itself.
 */
export async function adminUploadImage(file: File): Promise<string> {
  const token = getAdminToken();
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/admin/upload`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new AdminApiError(data.message || "Image upload failed.", res.status);
  }

  return data.url as string;
}
