import Container from "../components/Container";

type LandingPageProps = {
  onOpenLogin: () => void;
  onOpenSignup: () => void;
};

const features = [
  {
    title: "Connected campaigns",
    description:
      "Keep your maps, NPCs, encounters, journals, handouts, and party data in one connected system.",
    icon: <i className="fa-solid fa-diagram-project"></i>,
  },
  {
    title: "Run encounters faster",
    description:
      "Track combat, initiative, conditions, HP, and party state without losing momentum at the table.",
    icon: <i className="fa-solid fa-angles-right"></i>,
  },
  {
    title: "Build memorable NPCs",
    description:
      "Create roleplay-ready NPCs with public details, secrets, goals, motivations, and linked campaign context.",
    icon: <i className="fa-solid fa-user-group"></i>,
  },
  {
    title: "Organize the whole world",
    description:
      "Use maps, journal entries, handouts, quests, characters, and campaign pages to keep everything accessible.",
    icon: <i className="fa-regular fa-map"></i>,
  },
];

function LandingPage({ onOpenLogin, onOpenSignup }: LandingPageProps) {
  return (
    <div className="relative overflow-hidden bg-zinc-950 text-white">
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-[-120px] h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute right-[5%] top-[25%] h-[260px] w-[260px] rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute bottom-[10%] left-[8%] h-[220px] w-[220px] rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <Container>
        <section className="relative py-20 sm:py-28">
          <div className="mx-auto max-w-5xl text-center">
            <div className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1 text-sm font-medium text-cyan-200">
              Built for Dungeon Masters
            </div>

            <h1 className="mt-6 text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
              Shape your world.
              <br />
              Run it from one system.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-300 sm:text-xl">
              <span className="font-semibold text-white">
                Your entire campaign, in one system.
              </span>{" "}
              Worldshaper brings together encounters, NPCs, maps, journals,
              handouts, and party management so your prep and play stay
              connected.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onOpenSignup}
                className="w-full rounded-2xl bg-cyan-700 px-6 py-3 text-base font-bold text-white transition hover:bg-cyan-600 sm:w-auto"
              >
                Start shaping your campaign
              </button>

              <button
                type="button"
                onClick={onOpenLogin}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10 sm:w-auto"
              >
                Log in
              </button>
            </div>
          </div>
        </section>

        <section className="relative pb-20 sm:pb-28">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-700/20 text-cyan-400">
                  {feature.icon}
                </div>

                <h2 className="mt-4 text-xl font-bold text-white">
                  {feature.title}
                </h2>

                <p className="mt-3 text-sm leading-7 text-zinc-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="relative pb-24">
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8 sm:p-10">
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">
                  Why Worldshaper
                </p>

                <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
                  Stop juggling disconnected tools.
                </h2>

                <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">
                  Worldshaper is built for GMs who want one place to prep,
                  organize, and run their campaigns. Build a living world where
                  your NPCs, encounters, maps, and campaign notes all belong to
                  the same system.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
                <div className="space-y-4">
                  {[
                    "Create and manage campaigns",
                    "Run encounters with party state",
                    "Build linked NPCs and locations",
                    "Store journals, handouts, and maps",
                    "Keep player characters organized",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-2xl bg-white/5 p-3"
                    >
                      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-700/50 text-sm font-bold text-cyan-400">
                        ✓
                      </span>
                      <span className="text-sm leading-6 text-zinc-200">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={onOpenSignup}
                  className="mt-6 w-full rounded-2xl bg-cyan-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-cyan-600"
                >
                  Create Free Account
                </button>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}

export default LandingPage;
