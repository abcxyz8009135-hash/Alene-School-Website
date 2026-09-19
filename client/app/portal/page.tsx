"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Loader2 } from "lucide-react";

interface PortalUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

const ROLE_LABELS: Record<string, string> = {
  student: "Student",
  teacher: "Teacher / Principal",
  admin: "Admin",
};

export default function PortalPage() {
  const router = useRouter();
  const [user, setUser] = useState<PortalUser | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = window.localStorage.getItem("alene_hs_token");
    const raw = window.localStorage.getItem("alene_hs_user");

    if (!token || !raw) {
      router.replace("/");
      return;
    }

    try {
      setUser(JSON.parse(raw) as PortalUser);
    } catch {
      router.replace("/");
      return;
    }
    setChecking(false);
  }, [router]);

  if (checking) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <section className="container-page flex min-h-[60vh] items-center justify-center py-16">
      <div className="card flex max-w-md flex-col items-center gap-3 px-8 py-12 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-200">
          <GraduationCap className="h-6 w-6" />
        </span>
        <h1 className="text-2xl font-bold text-ink-900">Welcome, {user?.fullName}</h1>
        <p className="text-sm text-ink-500">
          You&apos;re signed in as a {user ? ROLE_LABELS[user.role] ?? user.role : ""}. Portal
          features for your role are on the way.
        </p>
      </div>
    </section>
  );
}
