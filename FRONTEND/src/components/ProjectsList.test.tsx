import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import ProjectsList from "@/components/ProjectsList";

// el boton de borrar usa el router de Next, que no existe en los test
vi.mock("@/components/DeleteProjectButton", () => ({
    default: () => null,
}));

type Props = ComponentProps<typeof ProjectsList>;

//4 tarjetas y cada boton d estado enseña su recuento
const projects: Props["projects"] = [
    {
    id: 1,
    title: "Tesis",
    size: "LARGE",
    startDate: "2026-01-10",
    endDate: "2026-12-01",
    progress: 40,
    status: "IN_PROGRESS",
  },
  {
    id: 2,
    title: "Informe",
    size: "SMALL",
    startDate: "2026-02-01",
    endDate: "2026-06-15",
    progress: 100,
    status: "COMPLETED",
  },
  {
    id: 3,
    title: "Prácticas",
    size: "MEDIUM",
    startDate: "2026-03-01",
    endDate: null,
    progress: 10,
    status: "DELAYED",
  },
  {
    id: 4,
    title: "Artículo",
    size: "SMALL",
    startDate: "2026-04-01",
    endDate: "2026-09-01",
    progress: 0,
    status: "PLANNED",
  },
];

//titulos de las tarjetas, en el orden en que aparecen en la pantalla
function visibleTitles(): (string | null)[] {
    return screen
    .getAllByRole("heading", { level:2 })
    .map((heading) => heading.textContent);
}

describe("ProjectsList", () => {
    it("muestra todos los proyectos y un contador por cada estado", () => {
        render(<ProjectsList projects={projects} />);

        expect(screen.getAllByRole("link")).toHaveLength(4);
        expect(screen.getByRole("button", { name: "Todos 4" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "En curso 1" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Completados 1" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Retrasados 1" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Planificados 1" })).toBeInTheDocument();
    });

    it("filtra por estado y vuelve a mostrar todo al pulsar Todos", async () => {
        const user = userEvent.setup();
        render(<ProjectsList projects={projects} />);

        await user.click(screen.getByRole("button", { name: "Retrasados 1" }));

        expect(visibleTitles()).toEqual(["Prácticas"]);
        expect(screen.getByRole("button", { name: "Retrasados 1" })).toHaveAttribute(
            "aria-pressed",
            "true"
        );

        await user.click(screen.getByRole("button", { name: "Todos 4" }));

        expect(screen.getAllByRole("link")).toHaveLength(4);
    });

    it("avisa cuando ningun proyecto tiene el estado elegido", async () => {
        const user = userEvent.setup();
        render(<ProjectsList projects={[projects[0]]} />);

        await user.click(screen.getByRole("button", { name: "Completados 0"}));
        
        expect(screen.getByText("No hay proyectos con este estado.")).toBeInTheDocument();
        expect(screen.queryAllByRole("link")).toHaveLength(0);
    });

    it("ordena por mayor progreso", async () => {
        const user = userEvent.setup();
        render(<ProjectsList projects={projects} />);
 
        await user.selectOptions(screen.getByRole("combobox", { name: /ordenar/i }), "progress");
        
        expect(visibleTitles()).toEqual(["Informe", "Tesis", "Prácticas", "Artículo"]);
  });
 
  it("ordena por titulo de la A a la Z", async () => {
        const user = userEvent.setup();
        render(<ProjectsList projects={projects} />);
 
        await user.selectOptions(screen.getByRole("combobox", { name: /ordenar/i }), "title");
 
        expect(visibleTitles()).toEqual(["Artículo", "Informe", "Prácticas", "Tesis"]);
  });
 
  it("ordena por entrega mas proxima y deja al final los proyectos sin fecha", async () => {
        const user = userEvent.setup();
        render(<ProjectsList projects={projects} />);
 
        await user.selectOptions(screen.getByRole("combobox", { name: /ordenar/i }), "endDate");
 
        expect(visibleTitles()).toEqual(["Informe", "Artículo", "Tesis", "Prácticas"]);
  });
});