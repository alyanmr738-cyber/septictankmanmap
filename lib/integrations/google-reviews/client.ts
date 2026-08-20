import { getGoogleBusinessConfig, isMockMode } from "@/lib/env";
import { logger } from "@/lib/logger";

export class GoogleReviewsNotConfiguredError extends Error {
  constructor() {
    super("Google Business Profile credentials are not configured");
    this.name = "GoogleReviewsNotConfiguredError";
  }
}

async function refreshAccessToken(config: {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}): Promise<string> {
  const body = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    refresh_token: config.refreshToken,
    grant_type: "refresh_token",
  });

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  if (!response.ok) {
    logger.error("Google OAuth token refresh failed", { status: response.status });
    throw new Error("Unable to refresh Google Business Profile access token");
  }

  const data = (await response.json()) as { access_token?: string };
  if (!data.access_token) {
    throw new Error("Google token response did not include an access token");
  }
  return data.access_token;
}

export async function getGoogleAccessToken(): Promise<string> {
  if (isMockMode()) {
    throw new GoogleReviewsNotConfiguredError();
  }

  const config = getGoogleBusinessConfig();
  if (!config) {
    throw new GoogleReviewsNotConfiguredError();
  }

  if (config.accessToken) {
    return config.accessToken;
  }

  if (!config.refreshToken || !config.clientId || !config.clientSecret) {
    throw new GoogleReviewsNotConfiguredError();
  }

  return refreshAccessToken({
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    refreshToken: config.refreshToken,
  });
}
