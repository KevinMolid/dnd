export type SpotifyTrack = {
  uri: string;
  id: string | null;
  name: string;
  artists: string[];
  albumName: string;
  imageUrl: string | null;
};

export type SpotifyPlaybackState = {
  paused: boolean;
  position: number;
  duration: number;
  track: SpotifyTrack | null;
};
