import Container from "../components/Container";

import logo from "/images/Lorebound.png";

type LandingPageProps = {
  onOpenLogin: () => void;
  onOpenSignup: () => void;
};

const features = [
  {
    title: "Campaigns",
    description:
      "Keep your party, maps, handouts, journal, NPCs, monsters, and encounters connected.",
    icon: <i className="fa-solid fa-book-open"></i>,
  },
  {
    title: "Characters",
    description:
      "Create characters, manage sheets, equipment, spells, progression, and everything needed during play.",
    icon: <i className="fa-solid fa-users"></i>,
  },
  {
    title: "Run the game",
    description:
      "Track encounters, party state, conditions, HP, maps, and campaign information without leaving the table.",
    icon: <i className="fa-solid fa-dice-d20"></i>,
  },
];

function LandingPage({ onOpenLogin, onOpenSignup }: LandingPageProps) {
  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-zinc-950 text-zinc-100">
      {/* =====================================================
          SUBTLE BRAND GLOW
      ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[460px]"
      >
        <div className="absolute left-1/2 top-[-260px] h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-amber-200/[0.035] blur-3xl" />
      </div>

      <Container>
        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="relative py-14 sm:py-20">
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <img
              src={logo}
              alt=""
              className="h-20 w-20 object-contain sm:h-24 sm:w-24"
            />

            <p
              className="mt-3 text-4xl font-medium tracking-[-0.035em] text-zinc-100 sm:text-5xl"
              style={{
                fontFamily: 'Georgia, "Times New Roman", Times, serif',
              }}
            >
              Lorebound
            </p>

            <h1 className="mt-8 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Get your campaign going.
              <br />
              <span className="text-amber-100">Get Lorebound.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
              One place for campaigns, characters, maps, encounters, journals,
              handouts, NPCs, monsters, and everything your table needs.
            </p>

            <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
              <button
                type="button"
                onClick={onOpenSignup}
                className="min-h-11 w-full rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 sm:w-auto"
              >
                Create account
              </button>

              <button
                type="button"
                onClick={onOpenLogin}
                className="min-h-11 w-full rounded-lg border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-zinc-200 transition hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 sm:w-auto"
              >
                Log in
              </button>
            </div>
          </div>
        </section>

        {/* =====================================================
            CORE FEATURES
        ===================================================== */}

        <section className="relative pb-8 sm:pb-12">
          <div className="grid gap-3 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-white/[0.08] bg-zinc-900/35 p-5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-amber-200/10 bg-amber-100/[0.05] text-sm text-amber-100">
                  {feature.icon}
                </div>

                <h2 className="mt-4 text-lg font-semibold text-white">
                  {feature.title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* =====================================================
            SECONDARY PITCH
        ===================================================== */}

        <section className="relative pb-16 sm:pb-20">
          <div className="rounded-2xl border border-white/[0.08] bg-zinc-900/30 p-5 sm:p-6">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-100/70">
                  Everything connected
                </p>

                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  Less time managing tools.
                  <br />
                  More time playing.
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">
                  Lorebound keeps the parts of your campaign together instead of
                  scattering them across notes, spreadsheets, character tools,
                  and separate encounter trackers.
                </p>
              </div>

              <div className="grid gap-2">
                {[
                  "Campaign and party management",
                  "Characters and progression",
                  "Maps and encounter tools",
                  "NPCs, monsters, and handouts",
                  "Journal and campaign history",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex min-h-11 items-center gap-3 rounded-lg border border-white/[0.07] bg-black/15 px-3 py-2"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center text-xs text-amber-100">
                      <i className="fa-solid fa-check"></i>
                    </span>

                    <span className="text-sm text-zinc-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}

export default LandingPage;
