"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
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
  const dialogRef = useRef<HTMLDivElement>(null);
  // Kept in a ref so a new onClose identity from the parent doesn't re-run
  // the effect below (which would steal focus on every parent render).
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Close on Escape, keep focus inside the dialog, and lock page scroll.
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusable = () =>
      Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          "button:not([disabled]), input:not([disabled]), a[href]"
        ) ?? []
      );
    dialogRef.current?.querySelector<HTMLInputElement>("input")?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [open]);

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
        className="absolute inset-0 animate-fade-in bg-ink-950/60"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-lg border-t-4 border-crimson-600 bg-white p-6 shadow-card sm:p-8"
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute right-4 top-4 rounded-md p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-900"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <p className="eyebrow">Alene portal</p>
          <h2 id="auth-modal-title" className="mt-3 text-xl font-bold text-ink-900">
            {mode === "login" ? "Log in to Portal" : "Request Portal Access"}
          </h2>
          <p className="mt-1 text-sm text-ink-500">
            {mode === "login"
              ? "Sign in to access the Alene High School student & staff portal."
              : "Ask school administration to set up your portal account."}
          </p>
        </div>

        <div className="mb-6 flex rounded-md border border-ink-200 bg-ink-50 p-1" role="group" aria-label="Portal action">
          <button
            type="button"
            className={`flex-1 rounded py-2 text-sm font-semibold transition ${
              mode === "login" ? "bg-brand-600 text-white" : "text-ink-500 hover:text-ink-900"
            }`}
            aria-pressed={mode === "login"}
            onClick={() => switchMode("login")}
          >
            Log In
          </button>
          <button
            type="button"
            className={`flex-1 rounded py-2 text-sm font-semibold transition ${
              mode === "request-access"
                ? "bg-brand-600 text-white"
                : "text-ink-500 hover:text-ink-900"
            }`}
            aria-pressed={mode === "request-access"}
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
            <p id="auth-role-label" className="form-label">I am a</p>
            <div className="flex gap-2" role="group" aria-labelledby="auth-role-label">
              {ROLE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setRole(option.value)}
                  aria-pressed={role === option.value}
                  className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium transition ${
                    role === option.value
                      ? "border-brand-600 bg-brand-50 text-brand-700"
                      : "border-ink-300 text-ink-600 hover:bg-ink-50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {mode === "request-access" && (
            <div>
              <label htmlFor="auth-full-name" className="form-label">
                Full Name
              </label>
              <input
                id="auth-full-name"
                autoComplete="name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input-field"
                placeholder="Your full name"
              />
            </div>
          )}
          <div>
            <label htmlFor="auth-email" className="form-label">Email</label>
            <input
              id="auth-email"
              autoComplete="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="you@example.com"
            />
          </div>
          {mode === "login" && (
            <div>
              <label htmlFor="auth-password" className="form-label">Password</label>
              <input
                id="auth-password"
                autoComplete="current-password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
              />
            </div>
          )}

          {error && (
            <p role="alert" className="alert-error">
              {error}
            </p>
          )}
          {success && (
            <p role="status" className="alert-success">
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
