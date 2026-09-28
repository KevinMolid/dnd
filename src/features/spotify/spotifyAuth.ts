const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string | undefined;

const TOKEN_KEY = "lorebound.spotify.tokens";
const PKCE_KEY = "lorebound.spotify.pkce";

const SCOPES = [
  "streaming",
  "user-read-private",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
];

export type SpotifyTokens = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  scope?: string;
};

type SpotifyTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
};

type PendingPkce = {
  verifier: string;
  state: string;
  returnTo: string;
};

function requireClientId() {
  if (!CLIENT_ID) {
    throw new Error(
      "Missing VITE_SPOTIFY_CLIENT_ID. Add it to your Vite environment and restart the dev server.",
    );
  }
  return CLIENT_ID;
}

function redirectUri() {
  return `${window.location.origin}/spotify/callback`;
}

function generateRandomString(length: number) {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = crypto.getRandomValues(new Uint8Array(length));

  return Array.from(values, (value) => possible[value % possible.length]).join("");
}

async function sha256(value: string) {
  const data = new TextEncoder().encode(value);
  return crypto.subtle.digest("SHA-256", data);
}

function base64UrlEncode(input: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function saveTokens(tokens: SpotifyTokens) {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
}

function getPendingPkce(): PendingPkce | null {
  const raw = localStorage.getItem(PKCE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as PendingPkce;
  } catch {
    localStorage.removeItem(PKCE_KEY);
    return null;
  }
}

export function getStoredSpotifyTokens(): SpotifyTokens | null {
  const raw = localStorage.getItem(TOKEN_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as SpotifyTokens;
  } catch {
    localStorage.removeItem(TOKEN_KEY);
    return null;
  }
}

export function clearSpotifyTokens() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function beginSpotifyAuthorization(
  returnTo = window.location.pathname,
) {
  const clientId = requireClientId();

  // Follow Spotify's documented PKCE construction exactly.
  const verifier = generateRandomString(64);
  const challenge = base64UrlEncode(await sha256(verifier));
  const state = generateRandomString(32);

  const pending: PendingPkce = {
    verifier,
    state,
    returnTo,
  };

  // localStorage deliberately survives the full-page Spotify redirect.
  localStorage.setItem(PKCE_KEY, JSON.stringify(pending));

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri(),
    code_challenge_method: "S256",
    code_challenge: challenge,
    state,
    scope: SCOPES.join(" "),
  });

  window.location.assign(
    `https://accounts.spotify.com/authorize?${params.toString()}`,
  );
}

export async function completeSpotifyAuthorization(
  code: string,
  returnedState: string | null,
) {
  const clientId = requireClientId();
  const pending = getPendingPkce();

  if (!pending) {
    throw new Error(
      "Spotify login state was lost. Return to the workspace and connect Spotify again.",
    );
  }

  if (!returnedState || returnedState !== pending.state) {
    throw new Error(
      "Spotify returned an invalid login state. Return to the workspace and connect again.",
    );
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri(),
      code_verifier: pending.verifier,
    }),
  });

  const payload = (await response.json()) as SpotifyTokenResponse & {
    error?: string;
    error_description?: string;
  };

  if (!response.ok) {
    throw new Error(
      payload.error_description ||
        payload.error ||
        "Spotify authorization failed.",
    );
  }

  if (!payload.refresh_token) {
    throw new Error("Spotify did not return a refresh token.");
  }

  const tokens: SpotifyTokens = {
    accessToken: payload.access_token,
    refreshToken: payload.refresh_token,
    expiresAt: Date.now() + payload.expires_in * 1000,
    scope: payload.scope,
  };

  saveTokens(tokens);
  return tokens;
}

export function consumeSpotifyReturnTo() {
  const pending = getPendingPkce();
  const returnTo = pending?.returnTo || "/";
  localStorage.removeItem(PKCE_KEY);
  return returnTo;
}

export async function refreshSpotifyTokens(
  current = getStoredSpotifyTokens(),
): Promise<SpotifyTokens> {
  const clientId = requireClientId();

  if (!current?.refreshToken) {
    throw new Error("Spotify is not connected.");
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: "refresh_token",
      refresh_token: current.refreshToken,
    }),
  });

  const payload = (await response.json()) as SpotifyTokenResponse & {
    error?: string;
    error_description?: string;
  };

  if (!response.ok) {
    if (payload.error === "invalid_grant") {
      clearSpotifyTokens();
    }

    throw new Error(
      payload.error_description ||
        payload.error ||
        "Spotify token refresh failed.",
    );
  }

  const tokens: SpotifyTokens = {
    accessToken: payload.access_token,
    refreshToken: payload.refresh_token ?? current.refreshToken,
    expiresAt: Date.now() + payload.expires_in * 1000,
    scope: payload.scope ?? current.scope,
  };

  saveTokens(tokens);
  return tokens;
}

export async function getValidSpotifyAccessToken() {
  const tokens = getStoredSpotifyTokens();

  if (!tokens) return null;

  if (tokens.expiresAt > Date.now() + 60_000) {
    return tokens.accessToken;
  }

  const refreshed = await refreshSpotifyTokens(tokens);
  return refreshed.accessToken;
}
