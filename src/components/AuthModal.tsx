import type { ReactNode } from "react";
import { useEffect } from "react";

import logo from "/images/Lorebound.png";

type AuthModalMode = "login" | "signup";

type AuthModalProps = {
  open: boolean;
  title: string;
  mode: AuthModalMode;
  onClose: () => void;
  onSwitchMode: (mode: AuthModalMode) => void;
  children: ReactNode;
};

const AuthModal = ({
  open,
  title,
  mode,
  onClose,
  onSwitchMode,
  children,
}: AuthModalProps) => {
  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const isLogin = mode === "login";

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto bg-black/75 p-4 backdrop-blur-[6px] sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="flex min-h-full items-start justify-center py-4 sm:items-center sm:py-6"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            onClose();
          }
        }}
      >
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
          className="w-full max-w-[520px] overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl shadow-black/70"
        >
          <h2 id="auth-modal-title" className="sr-only">
            {title}
          </h2>

          {/* =====================================================
            BRAND / MODE
        ===================================================== */}

          <div className="border-b border-white/[0.08] px-5 pb-4 pt-5 sm:px-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <img
                  src={logo}
                  alt=""
                  className="h-20 w-20 shrink-0 object-contain"
                />

                <div className="min-w-0">
                  <p
                    className="text-[28px] font-medium leading-none tracking-[-0.035em] text-zinc-100"
                    style={{
                      fontFamily: 'Georgia, "Times New Roman", Times, serif',
                    }}
                  >
                    Lorebound
                  </p>

                  <p className="mt-1.5 text-xs text-zinc-500">
                    CAMPAIGNS · CHARACTERS · STORIES
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-zinc-400 transition hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                <i className="fa-solid fa-xmark text-base" />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 rounded-xl border border-white/10 bg-black/20 p-1">
              <button
                type="button"
                onClick={() => onSwitchMode("login")}
                className={`min-h-10 rounded-lg px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 ${
                  isLogin
                    ? "bg-white/[0.10] text-white shadow-sm"
                    : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
                }`}
              >
                Log in
              </button>

              <button
                type="button"
                onClick={() => onSwitchMode("signup")}
                className={`min-h-10 rounded-lg px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 ${
                  !isLogin
                    ? "bg-white/[0.10] text-white shadow-sm"
                    : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
                }`}
              >
                Sign up
              </button>
            </div>
          </div>

          {/* =====================================================
            FORM CONTENT
        ===================================================== */}

          <div className="px-5 py-5 sm:px-6 sm:py-6">{children}</div>

          {/* =====================================================
            SECONDARY MODE SWITCH
        ===================================================== */}

          <div className="px-5 pb-5 sm:px-6 sm:pb-6">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-white/[0.08]" />

              <span className="text-xs text-zinc-600">
                {isLogin ? "New to Lorebound?" : "Already have an account?"}
              </span>

              <div className="h-px flex-1 bg-white/[0.08]" />
            </div>

            <button
              type="button"
              onClick={() => onSwitchMode(isLogin ? "signup" : "login")}
              className="mt-3 min-h-11 w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-zinc-200 transition hover:bg-white/[0.07] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25"
            >
              {isLogin ? "Create an account" : "Log in instead"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AuthModal;
