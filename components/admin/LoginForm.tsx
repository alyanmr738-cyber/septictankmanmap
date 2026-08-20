"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <form
      className="stm-login-form"
      onSubmit={async (event) => {
        event.preventDefault();
        setBusy(true);
        setError(null);
        try {
          const response = await fetch("/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password }),
          });
          if (!response.ok) {
            const data = (await response.json()) as { error?: string };
            setError(data.error ?? "Unable to sign in.");
            return;
          }
          router.push("/admin");
          router.refresh();
        } catch {
          setError("Unable to sign in.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <label htmlFor="admin-password">Admin password</label>
      <input
        id="admin-password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />
      <button type="submit" className="stm-btn stm-btn-primary" disabled={busy}>
        {busy ? "Signing in..." : "Sign in"}
      </button>
      {error ? <p className="stm-error">{error}</p> : null}
    </form>
  );
}
