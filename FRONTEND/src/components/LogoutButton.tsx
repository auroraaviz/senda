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
      style={{ padding: "8px 16px", fontSize: "14px", cursor: "pointer" }}
    >
      Cerrar sesión
    </button>
  );
}