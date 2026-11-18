import { describe, it, expect } from "vitest";
import { daysUntil, formatRelative, getUpcoming } from "./upcoming";
import type { CalendarEvent, ProjectDeadline } from "./calendar";

const today = new Date(2026, 10, 17);

const phase = (id: number, dueDate: string, progress = 0): CalendarEvent => ({
    phaseId: id, phaseName: `Fase ${id}`, projectId: 1, projectTitle: "TFG",
    dueDate, progress, delayed: false,
});

describe("daysUntil / formatRelative", () => {
    it("cuenta los días hasta una fecha", () => {
        expect(daysUntil("2026-11-17", today)).toBe(0);
        expect(daysUntil("2026-11-23", today)).toBe(6);
        expect(daysUntil("2026-11-10", today)).toBe(-7);
    });

    it("formatea en lenguaje natural", () => {
        expect(formatRelative(0)).toBe("hoy");
        expect(formatRelative(1)).toBe("mañana");
        expect(formatRelative(6)).toBe("en 6 días");
        expect(formatRelative(-3)).toBe("hace 3 días");
    });
});

describe("getUpcoming", () => {
    it("excluye lo completado y ordena por fecha", () => {
        const items = getUpcoming(
            [phase(1, "2026-12-01"), phase(2, "2026-11-20"), phase(3, "2026-11-18", 100)],
            [],
            today
        );
        expect(items.map((i) => i.key)).toEqual(["f-2", "f-1"]);
    });

    it("mezcla fases y entregas de proyecto", () => {
        const d: ProjectDeadline = {
            projectId: 2, projectTitle: "Prácticas", endDate: "2026-11-19",
            progress: 10, delayed: false,
        };

        const items = getUpcoming([phase(1, "2026-11-25")], [d], today);
        expect(items[0].kind).toBe("project");
    });

    it("respeta el límite", () => {
        const many = [1, 2, 3, 4, 5].map((i) => phase(i, `2026-12-0${i}`));
        expect(getUpcoming(many, [], today, 3)).toHaveLength(3);
    });
});