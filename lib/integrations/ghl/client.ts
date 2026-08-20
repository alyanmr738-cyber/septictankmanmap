import { getGhlConfig, useMockGhlData } from "@/lib/env";

export const GHL_API_BASE = "https://services.leadconnectorhq.com";
export const GHL_API_VERSION = "2021-07-28";

export class GhlNotConfiguredError extends Error {
  constructor() {
    super("GoHighLevel credentials are not configured");
    this.name = "GhlNotConfiguredError";
  }
}

export function getGhlHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Version: GHL_API_VERSION,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
}

export function requireGhlConfig() {
  if (useMockGhlData()) {
    return null;
  }
  const config = getGhlConfig();
  if (!config) {
    throw new GhlNotConfiguredError();
  }
  return config;
}

export async function ghlFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const config = requireGhlConfig();
  if (!config) {
    throw new GhlNotConfiguredError();
  }

  const response = await fetch(`${GHL_API_BASE}${path}`, {
    ...init,
    headers: {
      ...getGhlHeaders(config.token),
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GHL request failed (${response.status}): ${body.slice(0, 180)}`);
  }

  return (await response.json()) as T;
}
