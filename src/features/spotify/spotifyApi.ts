import { getValidSpotifyAccessToken } from "./spotifyAuth";

type ParsedSpotifyUrl =
  | { kind: "track"; uri: string }
  | { kind: "context"; uri: string };

function parseSpotifyUrl(value: string): ParsedSpotifyUrl | null {
  const trimmed = value.trim();

  const uriMatch = trimmed.match(/^spotify:(track|album|playlist):([A-Za-z0-9]+)$/);

  if (uriMatch) {
    const [, type, id] = uriMatch;
    const uri = `spotify:${type}:${id}`;

    return type === "track"
      ? { kind: "track", uri }
      : { kind: "context", uri };
  }

  try {
    const url = new URL(trimmed);

    if (url.hostname !== "open.spotify.com") {
      return null;
    }

    const [type, id] = url.pathname.split("/").filter(Boolean);

    if (!id || !["track", "album", "playlist"].includes(type)) {
      return null;
    }

    const uri = `spotify:${type}:${id}`;

    return type === "track"
      ? { kind: "track", uri }
      : { kind: "context", uri };
  } catch {
    return null;
  }
}

async function spotifyFetch(
  path: string,
  init: RequestInit = {},
) {
  const token = await getValidSpotifyAccessToken();

  if (!token) {
    throw new Error("Spotify is not connected.");
  }

  const response = await fetch(`https://api.spotify.com/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });

  if (!response.ok) {
    let message = `Spotify request failed (${response.status}).`;

    try {
      const payload = await response.json();
      message = payload?.error?.message || message;
    } catch {
      // Spotify sometimes returns an empty response body.
    }

    throw new Error(message);
  }

  return response;
}

export async function playSpotifyUrlOnDevice(
  spotifyUrl: string,
  deviceId: string,
) {
  const parsed = parseSpotifyUrl(spotifyUrl);

  if (!parsed) {
    throw new Error(
      "This music cue is not a supported Spotify track, album, or playlist URL.",
    );
  }

  const body =
    parsed.kind === "track"
      ? { uris: [parsed.uri] }
      : { context_uri: parsed.uri };

  await spotifyFetch(
    `/me/player/play?device_id=${encodeURIComponent(deviceId)}`,
    {
      method: "PUT",
      body: JSON.stringify(body),
    },
  );
}

export { parseSpotifyUrl };
