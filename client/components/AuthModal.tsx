"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2 } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

type Mode = "login" | "request-access";
type PortalRole = "student" | "teacher";

const ROLE_OPTIONS: { value: PortalRole; label: string }[] = [
  { value: "student", label: "Student" },
  { value: "teacher", label: "Teacher / Principal" },
];

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [role, setRole] = useState<PortalRole>("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!open) return null;

  function resetFeedback() {
    setError(null);
    setSuccess(null);
  }

  function switchMode(next: Mode) {
    setMode(next);
    resetFeedback();
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    resetFeedback();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      if (typeof window !== "undefined" && data.token) {
        window.localStorage.setItem("alene_hs_token", data.token);
        window.localStorage.setItem("alene_hs_user", JSON.stringify(data.user));
      }

      onClose();
      router.push("/portal");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRequestAccess(e: FormEvent) {
    e.preventDefault();
    resetFeedback();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/request-access`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      setSuccess(
        data.message ||
          "Your request has been submitted to school administration for review."
      );
      setFullName("");
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-ink-400 transition hover:bg-slate-100 hover:text-ink-900"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-ink-900">
            {mode === "login" ? "Log in to Portal" : "Request Portal Access"}
          </h2>
          <p className="mt-1 text-sm text-ink-500">
            {mode === "login"
              ? "Sign in to access the Alene High School student & staff portal."
              : "Ask school administration to set up your portal account."}
          </p>
        </div>

        <div className="mb-6 flex rounded-lg border border-slate-200 bg-slate-50 p-1">
          <button
            className={`flex-1 rounded-md py-2 text-sm font-semibold transition ${
              mode === "login" ? "bg-brand-600 text-white" : "text-ink-500 hover:text-ink-900"
            }`}
            onClick={() => switchMode("login")}
          >
            Log In
          </button>
          <button
            className={`flex-1 rounded-md py-2 text-sm font-semibold transition ${
              mode === "request-access"
                ? "bg-brand-600 text-white"
                : "text-ink-500 hover:text-ink-900"
            }`}
            onClick={() => switchMode("request-access")}
          >
            Request Portal Access
          </button>
        </div>

        <form
          onSubmit={mode === "login" ? handleLogin : handleRequestAccess}
          className="space-y-4"
        >
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700">I am a</label>
            <div className="flex gap-2">
              {ROLE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setRole(option.value)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    role === option.value
                      ? "border-brand-600 bg-brand-50 text-brand-700"
                      : "border-slate-300 text-ink-600 hover:bg-slate-50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {mode === "request-access" && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder-ink-400 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                placeholder="Your full name"
              />
            </div>
          )}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder-ink-400 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              placeholder="you@example.com"
            />
          </div>
          {mode === "login" && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder-ink-400 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                placeholder="••••••••"
              />
            </div>
          )}

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 ring-1 ring-inset ring-red-200">
              {error}
            </p>
          )}
          {success && (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-600 ring-1 ring-inset ring-emerald-200">
              {success}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "login" ? "Log In" : "Submit Request"}
          </button>
        </form>
      </div>
    </div>
  );
}
