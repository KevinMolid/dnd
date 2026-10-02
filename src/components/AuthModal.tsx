import { useEffect, useState, type ReactNode } from "react";

import logo from "/images/Lorebound.png";

import { loginWithGoogle, resetPassword } from "../auth";

type AuthModalMode = "login" | "signup";

type AuthModalProps = {
  open: boolean;
  title: string;
  mode: AuthModalMode;
  onClose: () => void;
  onSwitchMode: (mode: AuthModalMode) => void;
  children: ReactNode;
};

const getAuthErrorMessage = (error: unknown) => {
  if (!(error instanceof Error)) {
    return "Something went wrong. Please try again.";
  }

  const message = error.message;

  if (message.includes("auth/popup-closed-by-user")) {
    return "Google sign-in was cancelled.";
  }

  if (message.includes("auth/popup-blocked")) {
    return "The Google sign-in popup was blocked by your browser.";
  }

  if (message.includes("auth/account-exists-with-different-credential")) {
    return "An account with this email already exists using another sign-in method.";
  }

  if (message.includes("auth/invalid-email")) {
    return "Enter a valid email address.";
  }

  if (message.includes("auth/too-many-requests")) {
    return "Too many attempts. Please wait a moment and try again.";
  }

  return message || "Something went wrong. Please try again.";
};

const AuthModal = ({
  open,
  title,
  mode,
  onClose,
  onSwitchMode,
  children,
}: AuthModalProps) => {
  const [googleBusy, setGoogleBusy] = useState(false);
  const [actionError, setActionError] = useState("");

  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetBusy, setResetBusy] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (forgotPasswordOpen) {
          setForgotPasswordOpen(false);
          setActionError("");
          setResetSent(false);
          return;
        }

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
  }, [open, onClose, forgotPasswordOpen]);

  useEffect(() => {
    if (!open) {
      setGoogleBusy(false);
      setActionError("");
      setForgotPasswordOpen(false);
      setResetEmail("");
      setResetBusy(false);
      setResetSent(false);
    }
  }, [open]);

  useEffect(() => {
    setActionError("");
    setForgotPasswordOpen(false);
    setResetSent(false);
  }, [mode]);

  if (!open) {
    return null;
  }

  const isLogin = mode === "login";

  const handleGoogleLogin = async () => {
    try {
      setGoogleBusy(true);
      setActionError("");

      await loginWithGoogle();

      onClose();
    } catch (error) {
      console.error("Google sign-in failed:", error);
      setActionError(getAuthErrorMessage(error));
    } finally {
      setGoogleBusy(false);
    }
  };

  const handlePasswordReset = async () => {
    try {
      setResetBusy(true);
      setActionError("");
      setResetSent(false);

      await resetPassword(resetEmail);

      setResetSent(true);
    } catch (error) {
      console.error("Password reset failed:", error);
      setActionError(getAuthErrorMessage(error));
    } finally {
      setResetBusy(false);
    }
  };

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
            {forgotPasswordOpen ? "Reset password" : title}
          </h2>

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

            {!forgotPasswordOpen ? (
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
            ) : null}
          </div>

          <div className="px-5 py-5 sm:px-6 sm:py-6">
            {forgotPasswordOpen ? (
              <div>
                <div className="mb-5">
                  <h3 className="text-lg font-semibold text-white">
                    Reset password
                  </h3>

                  <p className="mt-1.5 text-sm leading-6 text-zinc-400">
                    Enter the email address connected to your Lorebound account.
                    We will send you a link to choose a new password.
                  </p>
                </div>

                {resetSent ? (
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.08] p-4">
                    <div className="flex items-start gap-3">
                      <i className="fa-solid fa-envelope-circle-check mt-0.5 text-emerald-300" />

                      <div>
                        <div className="text-sm font-semibold text-emerald-200">
                          Check your email
                        </div>

                        <p className="mt-1 text-xs leading-5 text-emerald-100/70">
                          If the address can receive a password reset email, the
                          reset link has been sent.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-semibold text-zinc-300">
                        Email
                      </span>

                      <input
                        type="email"
                        autoComplete="email"
                        value={resetEmail}
                        onChange={(event) => setResetEmail(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" && !resetBusy) {
                            void handlePasswordReset();
                          }
                        }}
                        placeholder="you@example.com"
                        className="h-11 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-white/25 focus:bg-white/[0.055]"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => void handlePasswordReset()}
                      disabled={resetBusy}
                      className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {resetBusy ? (
                        <i className="fa-solid fa-spinner fa-spin" />
                      ) : (
                        <i className="fa-solid fa-paper-plane text-xs" />
                      )}

                      {resetBusy ? "Sending…" : "Send reset link"}
                    </button>
                  </>
                )}

                {actionError ? (
                  <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/[0.08] px-3 py-2.5 text-sm text-red-300">
                    {actionError}
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={() => {
                    setForgotPasswordOpen(false);
                    setActionError("");
                    setResetSent(false);
                  }}
                  className="mt-4 min-h-10 w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-white/[0.07] hover:text-white"
                >
                  <i className="fa-solid fa-arrow-left mr-2 text-xs" />
                  Back to login
                </button>
              </div>
            ) : (
              <>
                {children}

                {isLogin ? (
                  <div className="mt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setForgotPasswordOpen(true);
                        setActionError("");
                        setResetSent(false);
                      }}
                      className="text-xs font-medium text-zinc-400 transition hover:text-white"
                    >
                      Forgot password?
                    </button>
                  </div>
                ) : null}

                <div className="my-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/[0.08]" />
                  <span className="text-[11px] uppercase tracking-[0.12em] text-zinc-600">
                    or
                  </span>
                  <div className="h-px flex-1 bg-white/[0.08]" />
                </div>

                <button
                  type="button"
                  onClick={() => void handleGoogleLogin()}
                  disabled={googleBusy}
                  className="flex min-h-11 w-full items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-zinc-200 transition hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {googleBusy ? (
                    <i className="fa-solid fa-spinner fa-spin" />
                  ) : (
                    <i className="fa-brands fa-google text-base" />
                  )}

                  {googleBusy
                    ? "Connecting to Google…"
                    : isLogin
                      ? "Continue with Google"
                      : "Sign up with Google"}
                </button>

                {actionError ? (
                  <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/[0.08] px-3 py-2.5 text-sm text-red-300">
                    {actionError}
                  </div>
                ) : null}
              </>
            )}
          </div>

          {!forgotPasswordOpen ? (
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
          ) : null}
        </section>
      </div>
    </div>
  );
};

export default AuthModal;
