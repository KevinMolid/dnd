import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Container from "./Container";
import Avatar from "./Avatar";
import logo from "/images/WorldshaperLogo.jpg";
import { useAuth } from "../context/AuthContext";

type HeaderProps = {
  onOpenLogin?: () => void;
  onOpenSignup?: () => void;
};

function Header({ onOpenLogin, onOpenSignup }: HeaderProps) {
  const { appUser, user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

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

  const email = user?.email || "";
  const profileImage = appUser?.imageUrl?.trim() || "";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/95 text-white backdrop-blur">
      <Container>
        <div className="flex items-center justify-between gap-4 py-0">
          <Link to="/" className="min-w-0">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="Worldshaper logo"
                className="h-12 shrink-0 rounded-xl object-cover sm:h-16"
              />

              <div className="min-w-0 hidden sm:block">
                <p className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Worldshaper
                </p>
              </div>
            </div>
          </Link>

          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="group flex items-center gap-3 rounded-full border border-white/10 bg-white/5 p-1 pr-3 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/70"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                aria-label="Open profile menu"
              >
                <Avatar
                  name={displayName}
                  src={profileImage}
                  size="md"
                  shape="circle"
                />

                <div className="text-left">
                  <p className="max-w-[180px] truncate text-sm font-semibold text-white">
                    {loading ? "Loading..." : displayName}
                  </p>
                  <p className="max-w-[180px] truncate text-xs text-zinc-400">
                    {email}
                  </p>
                </div>

                <svg
                  className={`h-4 w-4 text-zinc-400 transition ${
                    menuOpen ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              <div
                className={`absolute right-0 top-full z-50 mt-3 w-[min(92vw,20rem)] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl ring-1 ring-black/40 transition-all duration-200 ${
                  menuOpen
                    ? "pointer-events-auto translate-y-0 opacity-100"
                    : "pointer-events-none -translate-y-2 opacity-0"
                }`}
              >
                <div className="border-b border-white/10 bg-white/5 p-2">
                  <div className="flex items-center gap-3">
                    <Avatar
                      name={displayName}
                      src={profileImage}
                      size="md"
                      shape="circle"
                    />

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {loading ? "Loading..." : displayName}
                      </p>
                      <p className="truncate text-xs text-zinc-400">{email}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1 px-1 py-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/profile");
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-1 text-left text-sm font-medium text-white transition hover:bg-white/10"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-zinc-300">
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M10 2a4 4 0 100 8 4 4 0 000-8zM3 16a5 5 0 015-5h4a5 5 0 015 5v1H3v-1z" />
                      </svg>
                    </span>
                    <span>Profile settings</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/settings");
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-1 text-left text-sm font-medium text-white transition hover:bg-white/10"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-zinc-300">
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M11.49 3.17a1 1 0 00-1.98 0l-.12.95a1 1 0 01-.83.86l-.96.14a1 1 0 00-.56 1.7l.69.68a1 1 0 01.28.88l-.17.95a1 1 0 001.45 1.05l.86-.45a1 1 0 01.93 0l.86.45a1 1 0 001.45-1.05l-.17-.95a1 1 0 01.28-.88l.69-.68a1 1 0 00-.56-1.7l-.96-.14a1 1 0 01-.83-.86l-.12-.95zM10 13a3 3 0 100-6 3 3 0 000 6z"
                          clipRule="evenodd"
                        />
                        <path d="M4 11a6 6 0 1112 0 6 6 0 01-12 0z" />
                      </svg>
                    </span>
                    <span>Account settings</span>
                  </button>

                  <div className="my-1 h-px bg-white/10" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-1 text-left text-sm font-medium text-white transition hover:bg-white/10"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white">
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 4.75A1.75 1.75 0 014.75 3h5.5a.75.75 0 010 1.5h-5.5a.25.25 0 00-.25.25v10.5c0 .138.112.25.25.25h5.5a.75.75 0 010 1.5h-5.5A1.75 1.75 0 013 15.25V4.75zm9.22 2.47a.75.75 0 011.06 0l2.25 2.25a.75.75 0 010 1.06l-2.25 2.25a.75.75 0 11-1.06-1.06l.97-.97H8.75a.75.75 0 010-1.5h4.44l-.97-.97a.75.75 0 010-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    <span>Log out</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={onOpenLogin}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Log in
              </button>

              <button
                type="button"
                onClick={onOpenSignup}
                className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-600"
              >
                Sign up
              </button>
            </div>
          )}
        </div>
      </Container>
    </header>
  );
}

export default Header;
