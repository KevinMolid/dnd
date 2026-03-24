import { FormEvent, useState } from "react";
import { loginUser, registerUser } from "../auth";

import logo from "/images/logo3.png";

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (isRegister) {
        await registerUser(email, password, displayName);
      } else {
        await loginUser(email, password);
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center sm:mb-10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">
              Tabletop Campaign Hub
            </p>

            <div className="flex justify-center items-center">
              <img src={logo} alt="rphub logo" className="w-14 mr-2" />
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                rphub
              </h1>
            </div>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-zinc-400 sm:text-base">
              Run the campaign. Reveal the world.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-sm sm:p-7">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white sm:text-2xl">
                {isRegister ? "Create account" : "Welcome back"}
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                {isRegister
                  ? "Create your account to start or join a campaign."
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
                    required={isRegister}
                  />
                </div>
              )}

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-zinc-200"
                >
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
                  autoComplete={
                    isRegister ? "new-password" : "current-password"
                  }
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
                className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? isRegister
                    ? "Creating account..."
                    : "Logging in..."
                  : isRegister
                    ? "Create account"
                    : "Login"}
              </button>
            </form>

            <div className="mt-6 border-t border-white/10 pt-6 text-center">
              <p className="text-sm text-zinc-400">
                {isRegister ? "Already have an account?" : "Need an account?"}
              </p>

              <button
                type="button"
                onClick={() => {
                  setIsRegister((prev) => !prev);
                  setError("");
                }}
                className="mt-2 text-sm font-medium text-white underline underline-offset-4 transition hover:text-zinc-300"
              >
                {isRegister ? "Log in instead" : "Create an account"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
