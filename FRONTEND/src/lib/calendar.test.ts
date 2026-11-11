import { describe, it, expect } from "vitest";
import { getCalendarEvents, buildMonthGrid, toISODate } from "./calendar";
import type { Project } from "./api";

function project(phases: Partial<Project["phases"][number]>[]): Project {
  return {
    id: 1,
    title: "TFG",
    size: "LARGE",
    startDate: null,
    endDate: null,
    progress: 0,
    phases: phases.map((p, i) => ({
      id: i + 1,
      name: `Fase ${i + 1}`,
      orderNumber: i + 1,
      progress: 0,
      weight: 1,
      dueDate: null,
      ...p,
    })),
  };
}

const today = new Date(2026, 10, 10); 

describe("getCalendarEvents", () => {
  it("ignora las fases sin fecha límite", () => {
    const events = getCalendarEvents([project([{ dueDate: null }])], today);
    expect(events).toHaveLength(0);
  });

  it("marca como retrasada una fase vencida con progreso menor de 100", () => {
    const events = getCalendarEvents(
      [project([{ dueDate: "2026-11-01", progress: 40 }])],
      today
    );
    expect(events[0].delayed).toBe(true);
  });

  it("no marca como retrasada una fase vencida al 100%", () => {
    const events = getCalendarEvents(
      [project([{ dueDate: "2026-11-01", progress: 100 }])],
      today
    );
    expect(events[0].delayed).toBe(false);
  });

  it("no marca como retrasada una fase que vence hoy", () => {
    const events = getCalendarEvents(
      [project([{ dueDate: "2026-11-10", progress: 0 }])],
      today
    );
    expect(events[0].delayed).toBe(false);
  });

  it("junta las fases de varios proyectos", () => {
    const a = project([{ dueDate: "2026-11-20" }]);
    const b = { ...project([{ dueDate: "2026-11-25" }]), id: 2, title: "Prácticas" };
    expect(getCalendarEvents([a, b], today)).toHaveLength(2);
  });
});

describe("buildMonthGrid", () => {
  it("noviembre de 2026 empieza en domingo: 6 celdas vacías antes del día 1", () => {
    const cells = buildMonthGrid(2026, 10);
    expect(cells.slice(0, 6).every((c) => c === null)).toBe(true);
    expect(cells[6]).toBe("2026-11-01");
  });

  it("siempre devuelve un número de celdas múltiplo de 7", () => {
    for (let m = 0; m < 12; m++) {
      expect(buildMonthGrid(2026, m).length % 7).toBe(0);
    }
  });
});

describe("toISODate", () => {
  it("formatea con ceros a la izquierda", () => {
    expect(toISODate(new Date(2026, 0, 5))).toBe("2026-01-05");
  });
});