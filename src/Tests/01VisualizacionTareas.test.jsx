//Visualización en tiempo real de tareas asignadas a cada usuario 
//npx jest src/Tests/01VisualizacionTareas.test.jsx -- comando para correr este test específico
//para correr todos el comsando es npm run test:frontend


import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DashboardUser from "../Components/DashboardUser";
import { UserContext } from "../Contexts/UserContext";
import { SprintContext } from "../Contexts/SprintContext";


const mockUserId = 1;
const mockSprints = [
  { id: 101, name: "Sprint 1", description: "Primer sprint del módulo" },
  { id: 102, name: "Sprint 2", description: "Segundo sprint" },
];

describe("DashboardUser - ver en tiempo real de tareas asignadas", () => {
  beforeEach(() => {
    global.alert = jest.fn();
    global.fetch = jest.fn((url) => {
      if (url.startsWith("/profile/")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              name: "Karime",
              mail: "karime@oracle.com",
              role: "Dev",
              modality: "Remoto",
            }),
        });
      }
      if (url === "/sprints") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockSprints),
        });
      }
    });
  });

  it("muestra sprints activos del usuario", async () => {
    render(
      <MemoryRouter>
        <UserContext.Provider value={{ userId: mockUserId, setUserId: jest.fn() }}>
          <SprintContext.Provider value={{ setSprintId: jest.fn() }}>
            <DashboardUser />
          </SprintContext.Provider>
        </UserContext.Provider>
      </MemoryRouter>
    );

    // Ver que los sprints sí se muestren 
    expect(await screen.findByText(/Sprint 1/i)).toBeInTheDocument();
    expect(await screen.findByText(/Primer sprint del módulo/i)).toBeInTheDocument();
    expect(await screen.findByText(/Sprint 2/i)).toBeInTheDocument();
  });
});
