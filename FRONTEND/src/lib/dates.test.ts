import { describe, it, expect } from "vitest";
import { formatDate } from "./dates";

describe("formatDate", () => {
    it("formatea yyyy-MM-dd en formato legible", () => {
        expect(formatDate("2026-11-09")).toMatch(/^9 nov\.? 2026$/);
    });

    it("devuelve 'Sin fecha' si no hay fecha", () => {
        expect(formatDate(null)).toBe("Sin fecha");
        expect(formatDate(undefined)).toBe("Sin fecha");
    });

    it("permite personalizar el texto sin fecha", () => {
        expect(formatDate(null, "Sin fecha límite")).toBe("Sin fecha límite");
    });
});