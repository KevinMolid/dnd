import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import Avatar from "../components/Avatar";

const ProfileSettingsPage = () => {
  const { user, appUser } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showImageUrlInput, setShowImageUrlInput] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setDisplayName(
      appUser?.displayName?.trim() || user?.displayName?.trim() || "",
    );
    setImageUrl(appUser?.imageUrl?.trim() || "");
    setShowImageUrlInput(!!appUser?.imageUrl?.trim());
  }, [appUser, user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user) {
      setError("You must be logged in.");
      return;
    }

    if (!displayName.trim()) {
      setError("Display name is required.");
      return;
    }

    setSaving(true);

    try {
      const userRef = doc(db, "users", user.uid);

      await setDoc(
        userRef,
        {
          uid: user.uid,
          email: user.email || "",
          displayName: displayName.trim(),
          imageUrl: imageUrl.trim() || "",
          updatedAt: new Date(),
        },
        { merge: true },
      );

      await updateProfile(user, {
        displayName: displayName.trim(),
      });

      setSuccess("Profile updated.");
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-red-300">
            You must be logged in to edit your profile.
          </div>

          <Link
            to="/"
            className="mt-4 inline-flex rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-zinc-400 transition hover:text-white"
          >
            ← Back home
          </Link>

          <p className="mt-6 mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
            Profile
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Profile settings
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
            Update how your name and profile image appear across the app.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]"
        >
          <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl sm:p-6">
            <h2 className="mb-5 text-xl font-semibold text-white">
              Profile details
            </h2>

            <div className="mb-6 rounded-3xl border border-white/10 bg-zinc-900/40 p-4 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => setShowImageUrlInput((prev) => !prev)}
                  aria-label="Toggle profile image URL input"
                  title="Change profile image"
                >
                  <Avatar
                    name={displayName || user.email || "User"}
                    src={imageUrl}
                    size="lg"
                    shape="circle"
                  />
                </button>

                <div className="min-w-0 flex-1">
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
                      placeholder="Your display name"
                      className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-zinc-400"
                      required
                    />
                  </div>
                </div>
              </div>

              {showImageUrlInput && (
                <div className="mt-4 border-t border-white/10 pt-4">
                  <label className="mb-1 block text-sm font-medium text-zinc-200">
                    Profile image URL
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/profile.jpg"
                    className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-3 py-2 text-white outline-none placeholder:text-zinc-500 focus:border-white/20"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-200">Email</label>
              <div className="rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-zinc-400">
                {user.email || "No email available"}
              </div>
            </div>

            {error && (
              <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                {success}
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="rounded-2xl border border-white/10 px-4 py-2 text-zinc-300 hover:bg-white/5"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-2xl bg-white px-4 py-2 font-medium text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </section>

          <aside className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl sm:p-6">
            <h2 className="mb-5 text-xl font-semibold text-white">Preview</h2>

            <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
              <div className="flex items-center gap-3">
                <Avatar
                  name={displayName || user.email || "User"}
                  src={imageUrl}
                  size="md"
                  shape="circle"
                />

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {displayName.trim() || "User"}
                  </p>
                  <p className="truncate text-xs text-zinc-400">
                    {user.email || ""}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
