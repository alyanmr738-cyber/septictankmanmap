function readBoolean(value: string | undefined): boolean {
  return value === "true" || value === "1" || value === "yes";
}

function readOptional(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

export function isMockMode(): boolean {
  return readBoolean(process.env.MOCK_MODE);
}

export function getAppUrl(): string {
  return (
    readOptional(process.env.NEXT_PUBLIC_APP_URL) ??
    (isProduction() ? "" : "http://localhost:3000")
  );
}

export function getWordpressOrigin(): string | undefined {
  return readOptional(process.env.WORDPRESS_ORIGIN);
}

export function getDatabaseUrl(): string | undefined {
  return readOptional(process.env.DATABASE_URL);
}

export function hasDatabase(): boolean {
  return Boolean(getDatabaseUrl());
}

export function getAdminPassword(): string | undefined {
  return readOptional(process.env.ADMIN_PASSWORD);
}

export function getAuthSecret(): string | undefined {
  return readOptional(process.env.AUTH_SECRET);
}

export function getCronSecret(): string | undefined {
  return readOptional(process.env.CRON_SECRET);
}

export function getGhlConfig(): {
  token: string;
  locationId: string;
} | null {
  const token = readOptional(process.env.GHL_PRIVATE_INTEGRATION_TOKEN);
  const locationId = readOptional(process.env.GHL_LOCATION_ID);
  if (!token || !locationId) {
    return null;
  }
  return { token, locationId };
}

export function isGhlConfigured(): boolean {
  return getGhlConfig() !== null && !isMockMode();
}

export function getGoogleBusinessConfig(): {
  accountId: string;
  locationId: string;
  clientId?: string;
  clientSecret?: string;
  refreshToken?: string;
  accessToken?: string;
} | null {
  const accountId = readOptional(process.env.GOOGLE_BUSINESS_ACCOUNT_ID);
  const locationId = readOptional(process.env.GOOGLE_BUSINESS_LOCATION_ID);
  const accessToken = readOptional(process.env.GOOGLE_BUSINESS_ACCESS_TOKEN);
  const refreshToken = readOptional(process.env.GOOGLE_BUSINESS_REFRESH_TOKEN);
  const clientId = readOptional(process.env.GOOGLE_CLIENT_ID);
  const clientSecret = readOptional(process.env.GOOGLE_CLIENT_SECRET);

  if (!accountId || !locationId) {
    return null;
  }
  if (!accessToken && !(refreshToken && clientId && clientSecret)) {
    return null;
  }

  return {
    accountId,
    locationId,
    clientId,
    clientSecret,
    refreshToken,
    accessToken,
  };
}

export function isGoogleConfigured(): boolean {
  return getGoogleBusinessConfig() !== null && !isMockMode();
}

export function getGeocodingConfig(): {
  provider: "google" | "mapbox" | "nominatim" | "mock";
  apiKey?: string;
} {
  if (isMockMode()) {
    return { provider: "mock" };
  }

  const provider = (readOptional(process.env.GEOCODING_PROVIDER) ?? "mock") as
    | "google"
    | "mapbox"
    | "nominatim"
    | "mock";

  return {
    provider,
    apiKey: readOptional(process.env.GEOCODING_API_KEY),
  };
}

export function allowAutoApproval(): boolean {
  return readBoolean(process.env.AUTO_APPROVE_HIGH_CONFIDENCE);
}
