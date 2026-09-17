import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Container from "./Container";
import Avatar from "./Avatar";
import logo from "/images/Lorebound.png";
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
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const displayName =
    appUser?.displayName?.trim() ||
    user?.displayName?.trim() ||
    user?.email ||
    "User";

  const email = user?.email || "";
  const profileImage = appUser?.imageUrl?.trim() || "";

  const handleLogout = async () => {
    try {
      await logout();
      setMenuOpen(false);
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const goToProfile = () => {
    setMenuOpen(false);
    navigate("/profile");
  };

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
        triggerRef.current?.focus();
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
    <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/95 text-white backdrop-blur-xl">
      <Container>
        <div className="flex min-h-[64px] items-center justify-between gap-2 sm:min-h-[80px] sm:gap-4">
          {/* =====================================================
              BRAND
          ===================================================== */}

          <Link
            to="/"
            aria-label="Lorebound home"
            className="flex min-w-0 items-center gap-2 sm:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
          >
            <img
              src={logo}
              alt=""
              className="h-14 w-14 shrink-0 object-contain sm:h-16 sm:w-16"
            />

            <span
              className="text-[22px] font-medium leading-none tracking-[-0.035em] text-zinc-100 sm:text-[30px]"
              style={{
                fontFamily: 'Georgia, "Times New Roman", Times, serif',
              }}
            >
              Lorebound
            </span>
          </Link>

          {/* =====================================================
              USER AREA
          ===================================================== */}

          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                ref={triggerRef}
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-2 py-1.5 ..."
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                aria-label="Open account menu"
              >
                <Avatar
                  name={displayName}
                  src={profileImage}
                  size="sm"
                  shape="circle"
                />

                <span className="hidden max-w-[180px] truncate text-sm font-semibold text-zinc-100 sm:block">
                  {loading ? "Loading..." : displayName}
                </span>

                <i
                  className={`fa-solid fa-chevron-down ml-0.5 text-[10px] text-zinc-500 transition-transform ${
                    menuOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              <div
                role="menu"
                aria-label="Account menu"
                className={`absolute right-0 top-full z-50 mt-2 w-[min(92vw,18rem)] overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-2xl shadow-black/60 ring-1 ring-black/40 transition-all duration-150 ${
                  menuOpen
                    ? "pointer-events-auto translate-y-0 opacity-100"
                    : "pointer-events-none -translate-y-1 opacity-0"
                }`}
              >
                <div className="border-b border-white/[0.08] px-4 py-3">
                  <div className="flex min-w-0 items-center gap-3">
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

                      {email ? (
                        <p className="mt-0.5 truncate text-xs text-zinc-500">
                          {email}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="p-1.5">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={goToProfile}
                    className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-zinc-200 transition hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25"
                  >
                    <i className="fa-regular fa-user w-4 text-center text-zinc-500" />
                    <span>Profile settings</span>
                  </button>

                  <div className="my-1 h-px bg-white/[0.08]" />

                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-zinc-300 transition hover:bg-rose-500/[0.07] hover:text-rose-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25"
                  >
                    <i className="fa-solid fa-arrow-right-from-bracket w-4 text-center text-zinc-500" />
                    <span>Log out</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenLogin}
                className="min-h-10 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                Log in
              </button>

              <button
                type="button"
                onClick={onOpenSignup}
                className="min-h-10 rounded-lg border border-white/15 bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
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
