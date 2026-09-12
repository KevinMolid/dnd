import { FormEvent, useEffect, useState } from "react";

import { loginUser, registerUser } from "../auth";
import { useAuth } from "../context/AuthContext";

type LoginProps = {
  mode?: "login" | "signup";
  onSuccess?: () => void;
};

const inputClassName =
  "min-h-11 w-full rounded-lg border border-white/10 bg-zinc-900 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-zinc-600 hover:border-white/15 focus:border-white/25 focus:ring-2 focus:ring-white/10";

const Login = ({ mode = "login", onSuccess }: LoginProps) => {
  const { user } = useAuth();

  const isRegister = mode === "signup";

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user && onSuccess) {
      onSuccess();
    }
  }, [user, onSuccess]);

  useEffect(() => {
    setError("");
    setPasswordVisible(false);
  }, [mode]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      if (isRegister) {
        await registerUser(email, password, displayName.trim());
      } else {
        await loginUser(email, password);
      }

      onSuccess?.();
    } catch (err: any) {
      setError(err?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const autofillStyle = {
    WebkitBoxShadow: "0 0 0 1000px rgb(24 24 27) inset",
    WebkitTextFillColor: "rgb(244 244 245)",
    caretColor: "rgb(244 244 245)",
  } as const;

  return (
    <div>
      <div className="mb-5">
        <h3 className="text-2xl font-semibold tracking-tight text-white">
          {isRegister ? "Create your account" : "Welcome back"}
        </h3>

        <p className="mt-1.5 text-sm leading-6 text-zinc-400">
          {isRegister
            ? "Create a Lorebound account and get your first campaign started."
            : "Log in to continue to your campaigns and characters."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegister ? (
          <div className="space-y-2">
            <label
              htmlFor="displayName"
              className="text-sm font-medium text-zinc-300"
            >
              Display name
            </label>

            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-zinc-600">
                <i className="fa-regular fa-user text-sm" />
              </span>

              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Your name"
                autoComplete="name"
                required
                className={`${inputClassName} pl-10`}
                style={autofillStyle}
              />
            </div>
          </div>
        ) : null}

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-zinc-300">
            Email
          </label>

          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-zinc-600">
              <i className="fa-regular fa-envelope text-sm" />
            </span>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@email.com"
              autoComplete="email"
              required
              className={`${inputClassName} pl-10`}
              style={autofillStyle}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-zinc-300"
          >
            Password
          </label>

          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-zinc-600">
              <i className="fa-solid fa-lock text-sm" />
            </span>

            <input
              id="password"
              type={passwordVisible ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={
                isRegister ? "Create a password" : "Enter your password"
              }
              autoComplete={isRegister ? "new-password" : "current-password"}
              required
              className={`${inputClassName} pl-10 pr-11`}
              style={autofillStyle}
            />

            <button
              type="button"
              onClick={() => setPasswordVisible((current) => !current)}
              aria-label={passwordVisible ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-zinc-600 transition hover:text-zinc-300 focus-visible:outline-none focus-visible:text-white"
            >
              <i
                className={`fa-regular ${
                  passwordVisible ? "fa-eye-slash" : "fa-eye"
                }`}
              />
            </button>
          </div>
        </div>

        {error ? (
          <div className="rounded-lg border border-rose-500/20 bg-rose-500/[0.08] px-3.5 py-3 text-sm leading-5 text-rose-300">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="min-h-11 w-full rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting
            ? isRegister
              ? "Creating account..."
              : "Logging in..."
            : isRegister
              ? "Create account"
              : "Log in"}
        </button>
      </form>
    </div>
  );
};

export default Login;
