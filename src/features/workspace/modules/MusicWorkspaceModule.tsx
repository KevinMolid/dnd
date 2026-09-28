import { useEffect, useMemo, useRef, useState } from "react";

import { useCampaignMaps } from "../../maps/useCampaignMaps";

import { useSpotifyPlayer } from "../../spotify/SpotifyPlayerContext";

import { useWorkspace } from "../WorkspaceContext";

import type { WorkspaceModuleRenderProps } from "../workspaceTypes";

type MusicCue = {
  id: string;

  name: string;

  spotifyUrl: string;
};

type MusicCueListProps = {
  title: string;

  icon: string;

  cues: MusicCue[];

  playingUri: string | null;

  onPlay: (cue: MusicCue) => Promise<void>;

  emptyText?: string;
};

function MusicCueList({
  title,

  icon,

  cues,

  playingUri,

  onPlay,

  emptyText,
}: MusicCueListProps) {
  const [startingId, setStartingId] = useState<string | null>(null);

  return (
    <section>
      <div className="mb-1 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
        <i className={`${icon} text-[8px]`} />

        <span className="truncate">{title}</span>
      </div>

      {cues.length > 0 ? (
        <div className="space-y-0.5">
          {cues.map((cue) => {
            const isStarting = startingId === cue.id;

            const cueId = cue.spotifyUrl.match(/\/track\/([A-Za-z0-9]+)/)?.[1];

            const isPlaying = Boolean(
              cueId && playingUri?.includes(`spotify:track:${cueId}`),
            );

            return (
              <button
                key={cue.id}
                type="button"
                disabled={isStarting}
                onClick={async () => {
                  setStartingId(cue.id);

                  try {
                    await onPlay(cue);
                  } finally {
                    setStartingId(null);
                  }
                }}
                title={`Play ${cue.name || "music cue"} in Lorebound`}
                className={`group flex h-8 w-full min-w-0 items-center gap-2 rounded-md border px-2 text-left transition disabled:cursor-wait disabled:opacity-60 ${
                  isPlaying
                    ? "border-emerald-500/30 bg-emerald-500/[0.09]"
                    : "border-transparent bg-white/[0.02] hover:border-emerald-500/20 hover:bg-emerald-500/[0.07]"
                }`}
              >
                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded text-[9px] transition ${
                    isPlaying
                      ? "bg-emerald-500/15 text-emerald-300"
                      : "text-zinc-500 group-hover:text-emerald-300"
                  }`}
                >
                  <i
                    className={`fa-solid ${
                      isStarting
                        ? "fa-spinner fa-spin"
                        : isPlaying
                          ? "fa-volume-high"
                          : "fa-play"
                    }`}
                  />
                </div>

                <span
                  className={`min-w-0 flex-1 truncate text-[11px] font-semibold ${
                    isPlaying
                      ? "text-emerald-100"
                      : "text-zinc-300 group-hover:text-white"
                  }`}
                >
                  {cue.name || "Spotify music"}
                </span>

                {isPlaying ? (
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400"
                    aria-label="Playing"
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : emptyText ? (
        <div className="px-2 py-1.5 text-[10px] leading-4 text-zinc-600">
          {emptyText}
        </div>
      ) : null}
    </section>
  );
}

export default function MusicWorkspaceModule({
  module,

  campaignId,

  editing,

  removeModule,
}: WorkspaceModuleRenderProps) {
  const { maps, loading } = useCampaignMaps(campaignId);

  const { activeLocation } = useWorkspace();

  const {
    authenticated,

    ready,

    playback,

    volume,

    error,

    connectSpotify,

    disconnectSpotify,
    playSpotifyUrl,

    togglePlay,

    seek,
    setVolume,
  } = useSpotifyPlayer();

  const activeMap = useMemo(() => {
    if (!activeLocation) return null;

    return maps.find((map) => map.id === activeLocation.mapId) ?? null;
  }, [maps, activeLocation]);

  const activeRoom = useMemo(() => {
    if (!activeMap || !activeLocation || activeLocation.roomId < 0) {
      return null;
    }

    return (
      activeMap.rooms?.find((room) => room.id === activeLocation.roomId) ?? null
    );
  }, [activeMap, activeLocation]);

  const mapCues = activeMap?.musicCues ?? [];

  const locationCues = activeRoom?.musicCues ?? [];

  const hasAnyCues = locationCues.length > 0 || mapCues.length > 0;

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [repeatEnabled, setRepeatEnabled] = useState(false);
  const [displayPosition, setDisplayPosition] = useState(playback.position);
  const settingsRef = useRef<HTMLDivElement | null>(null);
  const repeatLockRef = useRef(false);

  useEffect(() => {
    setDisplayPosition(playback.position);
  }, [playback.position, playback.track?.uri]);

  useEffect(() => {
    if (playback.paused || !playback.track || playback.duration <= 0) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setDisplayPosition((current) =>
        Math.min(current + 250, playback.duration),
      );
    }, 250);

    return () => window.clearInterval(intervalId);
  }, [playback.paused, playback.track?.uri, playback.duration]);

  useEffect(() => {
    if (!settingsOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setSettingsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [settingsOpen]);

  useEffect(() => {
    if (
      !repeatEnabled ||
      playback.paused ||
      !playback.track ||
      playback.duration <= 0
    ) {
      repeatLockRef.current = false;
      return;
    }

    const remaining = playback.duration - displayPosition;

    if (remaining <= 500 && remaining >= 0 && !repeatLockRef.current) {
      repeatLockRef.current = true;
      setDisplayPosition(0);

      void seek(0).finally(() => {
        window.setTimeout(() => {
          repeatLockRef.current = false;
        }, 1000);
      });
    }
  }, [
    displayPosition,
    playback.duration,
    playback.paused,
    playback.track,
    repeatEnabled,
    seek,
  ]);

  const playCue = async (cue: MusicCue) => {
    await playSpotifyUrl(cue.spotifyUrl);
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-zinc-950/20">
      <div
        className={`workspace-drag-handle flex h-10 shrink-0 items-center gap-2 border-b border-white/10 bg-white/[0.025] px-2.5 ${
          editing ? "cursor-grab active:cursor-grabbing" : ""
        }`}
      >
        <div className="flex h-6 w-6 shrink-0 items-center justify-center text-emerald-300">
          <i className="fa-solid fa-music text-[11px]" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="truncate text-xs font-bold text-zinc-100">Music</div>
        </div>

        {authenticated ? (
          <span
            title={
              ready
                ? "Lorebound Spotify player ready"
                : "Connecting Spotify player"
            }
            className={`h-2 w-2 shrink-0 rounded-full ${
              ready ? "bg-emerald-400" : "bg-amber-400"
            }`}
          />
        ) : null}
        {authenticated ? (
          <div ref={settingsRef} className="workspace-no-drag relative">
            <button
              type="button"
              onClick={() => setSettingsOpen((current) => !current)}
              title="Music settings"
              aria-label="Music settings"
              aria-expanded={settingsOpen}
              className={`flex h-7 w-7 items-center justify-center rounded-md text-[10px] transition ${
                settingsOpen
                  ? "bg-white/10 text-zinc-100"
                  : "text-zinc-500 hover:bg-white/5 hover:text-zinc-200"
              }`}
            >
              <i className="fa-solid fa-gear" />
            </button>

            {settingsOpen ? (
              <div className="absolute right-0 top-full z-50 mt-1 w-44 overflow-hidden rounded-lg border border-white/10 bg-zinc-900 p-1 shadow-2xl">
                <div className="flex items-center gap-2 px-2 py-1.5 text-[10px] text-zinc-400">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      ready ? "bg-emerald-400" : "bg-amber-400"
                    }`}
                  />
                  <span>
                    {ready ? "Spotify connected" : "Spotify connecting"}
                  </span>
                </div>

                <div className="my-1 h-px bg-white/5" />

                <button
                  type="button"
                  onClick={() => {
                    setSettingsOpen(false);
                    disconnectSpotify();
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[10px] text-zinc-400 transition hover:bg-rose-500/10 hover:text-rose-300"
                >
                  <i className="fa-brands fa-spotify w-3 text-center" />
                  <span>Disconnect Spotify</span>
                </button>
              </div>
            ) : null}
          </div>
        ) : null}

        {hasAnyCues ? (
          <div className="workspace-no-drag flex h-5 min-w-5 shrink-0 items-center justify-center rounded bg-emerald-500/10 px-1.5 text-[9px] font-bold text-emerald-300">
            {locationCues.length + mapCues.length}
          </div>
        ) : null}

        {editing ? (
          <>
            <div className="h-5 w-px shrink-0 bg-white/10" />

            <button
              type="button"
              onClick={() => removeModule(module.id)}
              title="Remove module"
              aria-label="Remove music module"
              className="workspace-no-drag flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-400 transition hover:bg-rose-500/10 hover:text-rose-300"
            >
              <i className="fa-solid fa-xmark text-xs" />
            </button>
          </>
        ) : null}
      </div>

      <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto p-2">
        {!authenticated ? (
          <div className="flex h-full min-h-32 items-center justify-center px-3 text-center">
            <div className="w-full max-w-60">
              <i className="fa-brands fa-spotify mb-2 text-2xl text-emerald-400" />

              <div className="text-sm font-bold text-zinc-100">
                Connect Spotify
              </div>

              <p className="mt-1 text-[11px] leading-4 text-zinc-500">
                Connect your Premium account to play music directly inside
                Lorebound.
              </p>

              <button
                type="button"
                onClick={() => void connectSpotify()}
                className="mt-3 w-full rounded-lg bg-emerald-500 px-3 py-2 text-xs font-bold text-zinc-950 transition hover:bg-emerald-400"
              >
                <i className="fa-brands fa-spotify mr-2" />
                Connect Spotify
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {error ? (
              <div className="rounded-md border border-rose-500/20 bg-rose-500/[0.07] px-2 py-1.5 text-[10px] leading-4 text-rose-200">
                {error}
              </div>
            ) : null}

            {!ready ? (
              <div className="rounded-md border border-amber-500/15 bg-amber-500/[0.05] px-2 py-1.5 text-[10px] text-amber-200">
                <i className="fa-solid fa-spinner fa-spin mr-1.5" />
                Connecting Spotify player...
              </div>
            ) : null}

            {playback.track ? (
              <section className="min-w-0 overflow-hidden rounded-lg border border-white/10 bg-black/20">
                <div className="flex min-w-0 items-center gap-2 px-2 py-1.5">
                  <button
                    type="button"
                    onClick={() => void togglePlay()}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[10px] text-zinc-950 transition hover:scale-105"
                    title={playback.paused ? "Play" : "Pause"}
                    aria-label={playback.paused ? "Play" : "Pause"}
                  >
                    <i
                      className={`fa-solid ${
                        playback.paused ? "fa-play" : "fa-pause"
                      }`}
                    />
                  </button>

                  <div
                    className="min-w-0 flex-1 truncate text-[11px] font-semibold text-zinc-200"
                    title={playback.track.name}
                  >
                    {playback.track.name}
                  </div>

                  <button
                    type="button"
                    onClick={() => setRepeatEnabled((current) => !current)}
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded text-[9px] transition ${
                      repeatEnabled
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "text-zinc-600 hover:bg-white/5 hover:text-zinc-300"
                    }`}
                    title={repeatEnabled ? "Repeat on" : "Repeat off"}
                    aria-label={
                      repeatEnabled ? "Disable repeat" : "Enable repeat"
                    }
                    aria-pressed={repeatEnabled}
                  >
                    <i className="fa-solid fa-repeat" />
                  </button>

                  <i className="fa-solid fa-volume-low shrink-0 text-[8px] text-zinc-600" />

                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={(event) =>
                      void setVolume(Number(event.currentTarget.value))
                    }
                    className="w-16 min-w-10 max-w-20 shrink accent-emerald-400"
                    aria-label="Spotify volume"
                    title="Volume"
                  />
                </div>

                <div className="px-2 pb-1">
                  <input
                    type="range"
                    min={0}
                    max={Math.max(playback.duration, 1)}
                    value={Math.min(
                      displayPosition,
                      Math.max(playback.duration, 0),
                    )}
                    onChange={(event) => {
                      const position = Number(event.currentTarget.value);
                      setDisplayPosition(position);
                      void seek(position);
                    }}
                    className="block h-2 w-full cursor-pointer accent-emerald-400"
                    aria-label="Track position"
                    title="Track progress"
                  />
                </div>
              </section>
            ) : null}

            {loading ? (
              <div className="py-3 text-center text-[11px] text-zinc-500">
                Loading music...
              </div>
            ) : !activeLocation ? (
              <div className="px-2 py-3 text-center text-[10px] text-zinc-600">
                Select a map or area to show its music cues.
              </div>
            ) : !activeMap ? (
              <div className="px-2 py-2 text-[10px] text-zinc-500">
                The active map could not be found.
              </div>
            ) : (
              <>
                {activeRoom ? (
                  <MusicCueList
                    title={activeRoom.name || "Location"}
                    icon="fa-solid fa-location-dot"
                    cues={locationCues}
                    playingUri={playback.track?.uri ?? null}
                    onPlay={playCue}
                    emptyText="No music cues have been added to this area."
                  />
                ) : null}

                <MusicCueList
                  title="Map"
                  icon="fa-solid fa-map"
                  cues={mapCues}
                  playingUri={playback.track?.uri ?? null}
                  onPlay={playCue}
                  emptyText={
                    activeRoom && locationCues.length > 0
                      ? undefined
                      : "No music cues have been added to this map."
                  }
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
