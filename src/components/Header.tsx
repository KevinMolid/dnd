import Container from "./Container";
import NavTab from "./NavTab";

import logo from "/images/logo.png";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { appUser, user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const displayName =
    appUser?.displayName?.trim() ||
    user?.displayName?.trim() ||
    user?.email ||
    "User";

  const email = appUser?.email || user?.email || "";

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/95 text-white backdrop-blur">
      <Container>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Link to="/" className="min-w-0">
              <div className="flex items-center gap-3">
                <img
                  src={logo}
                  alt="rphub logo"
                  className="h-12 w-12 shrink-0 rounded-xl object-cover sm:h-14 sm:w-14"
                />

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">
                    Tabletop Campaign Hub
                  </p>
                  <p className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    rphub
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">
                    Run the campaign. Reveal the world.
                  </p>
                </div>
              </div>
            </Link>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="min-w-0 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Signed in as
                </p>
                <p className="mt-1 truncate text-sm font-medium text-white sm:text-base">
                  {loading ? "Loading..." : displayName}
                </p>
                {email && (
                  <p className="mt-1 truncate text-xs text-zinc-400 sm:text-sm">
                    {email}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10 active:scale-[0.99]"
              >
                Log out
              </button>
            </div>
          </div>

          <nav className="-mx-1 overflow-x-auto">
            <ul className="flex min-w-max items-center gap-1 px-1 pb-1">
              <NavTab to="/historien">Story</NavTab>
              <NavTab to="/tips">Tips</NavTab>
              <NavTab to="/reglene">Rules</NavTab>
              <NavTab to="/karakterer">Characters</NavTab>
              <NavTab to="/stats">Stats</NavTab>
              <NavTab to="/kamp">Combat</NavTab>
              <NavTab to="/spillere">Players</NavTab>
              <NavTab to="/handouts">Handouts</NavTab>
              <NavTab to="/quests">Quests</NavTab>
            </ul>
          </nav>
        </div>
      </Container>
    </header>
  );
}

export default Header;
