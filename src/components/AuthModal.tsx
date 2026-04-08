import { useEffect, type ReactNode } from "react";

type AuthModalMode = "login" | "signup";

type AuthModalProps = {
  open: boolean;
  title: string;
  mode: AuthModalMode;
  onClose: () => void;
  onSwitchMode: (mode: AuthModalMode) => void;
  children: ReactNode;
};

function AuthModal({
  open,
  title,
  mode,
  onClose,
  onSwitchMode,
  children,
}: AuthModalProps) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal backdrop"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl">
        <div className="border-b border-white/10 bg-white/5 px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-lg font-bold text-white">{title}</p>
              <p className="mt-1 text-sm text-zinc-400">
                Enter Worldshaper and start shaping your campaign.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 p-2 text-zinc-300 transition hover:bg-white/10 hover:text-white"
              aria-label="Close auth modal"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M4.22 4.22a.75.75 0 011.06 0L10 8.94l4.72-4.72a.75.75 0 111.06 1.06L11.06 10l4.72 4.72a.75.75 0 11-1.06 1.06L10 11.06l-4.72 4.72a.75.75 0 01-1.06-1.06L8.94 10 4.22 5.28a.75.75 0 010-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <div className="mt-4 flex rounded-2xl border border-white/10 bg-black/20 p-1">
            <button
              type="button"
              onClick={() => onSwitchMode("login")}
              className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                mode === "login"
                  ? "bg-white text-zinc-950"
                  : "text-zinc-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              Log in
            </button>

            <button
              type="button"
              onClick={() => onSwitchMode("signup")}
              className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                mode === "signup"
                  ? "bg-white text-zinc-950"
                  : "text-zinc-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              Sign up
            </button>
          </div>
        </div>

        <div className="max-h-[75vh] overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

export default AuthModal;
