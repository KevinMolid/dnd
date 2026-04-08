import { FormEvent, useEffect, useState } from "react";
import { loginUser, registerUser } from "../auth";
import { useAuth } from "../context/AuthContext";

type LoginProps = {
  mode?: "login" | "signup";
  onSuccess?: () => void;
};

const Login = ({ mode = "login", onSuccess }: LoginProps) => {
  const { user } = useAuth();

  const isRegister = mode === "signup";

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user && onSuccess) {
      onSuccess();
    }
  }, [user, onSuccess]);

  useEffect(() => {
    setError("");
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
      setError(err?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="text-zinc-100 mx-10 mb-10">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white sm:text-2xl">
          {isRegister ? "Create account" : "Welcome back"}
        </h2>

        <p className="mt-2 text-sm text-zinc-400">
          {isRegister
            ? "Create your account to start shaping your campaign world."
            : "Log in to continue to your campaigns."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegister && (
          <div className="space-y-2">
            <label
              htmlFor="displayName"
              className="text-sm font-medium text-zinc-200"
            >
              Display name
            </label>

            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your name"
              className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-zinc-400"
              autoComplete="name"
              required={isRegister}
            />
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-zinc-200">
            Email
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@email.com"
            className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-zinc-400"
            autoComplete="email"
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-zinc-200"
          >
            Password
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={
              isRegister ? "Create a password" : "Enter your password"
            }
            className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-zinc-400"
            autoComplete={isRegister ? "new-password" : "current-password"}
            required
          />
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
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
