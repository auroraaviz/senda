"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const router = useRouter();

    async function handleLogout() {
        await fetch("http://localhost:8080/auth/logout", {
            method: "POST",
            credentials: "include",
        });
        router.push("/login");
        router.refresh();
    }

    return (
    <button
      onClick={handleLogout}
      className="rounded-full border border-border px-6 py-3 text-base font-semibold text-ink-soft transition-colors hover:bg-surface hover:text-ink"
    >
      Cerrar sesión
    </button>
  );
}