export function formatDate(
    iso: string | null | undefined,
    emptyText = "Sin fecha"
): string {
    if (!iso) return emptyText;
    return new Date(`${iso.slice(0, 10)}T00:00:00`).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}