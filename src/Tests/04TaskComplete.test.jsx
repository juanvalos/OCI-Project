/*Marcar una tarea como completada.
npx jest src/Tests/04TaskComplete.test.jsx -- comando para correr este test específico
para correr todos el comsando es npm run test:frontend*/



import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskDetails from "../Components/TaskDetails";
import { TaskContext } from "../Contexts/TaskContext";

// Mock de servidor MSW
const server = setupServer(
  rest.put("/tasks/state/:taskId", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.put("/tasks/hours/:taskId", (req, res, ctx) => {
    return res(ctx.status(200));
  })
);

beforeAll(() => {
  server.listen();
  window.alert = jest.fn(); 
  global.fetch = jest.fn((url, options) => {
    if (url.startsWith("/tasks/state/") || url.startsWith("/tasks/hours/")) {
      return Promise.resolve({
        ok: true,
        json: async () => ({}),
      });
    }
    return Promise.reject(new Error("Unknown API endpoint"));
  });
});

afterEach(() => {
  server.resetHandlers();
  global.fetch.mockClear(); 
});

afterAll(() => {
  server.close();
});

// Mock tarea
const mockTask = {
  name: "Tarea de prueba",
  description: "Descripción corta",
  difficulty: "Fácil",
  priority: "Media",
  state: "En progreso",
  expectedHours: 4,
  actualHours: 2,
  dueDate: "2025-05-01T00:00:00.000Z",
};

describe("TaskDetails - Marcar tarea como completada", () => {
  test("marca una tarea como completada y actualiza en BD", async () => {
    render(
      <TaskContext.Provider value={{ taskId: 1 }}>
        <TaskDetails task={mockTask} onClose={jest.fn()} />
      </TaskContext.Provider>
    );

    // Buscar el select directamente por role combobox
    const stateSelect = screen.getByRole("combobox");

    // Cambiar a terminada
    await userEvent.selectOptions(stateSelect, "Terminada");

    // Hacer click en "Actualizar Task"
    const actualizarButton = screen.getByRole("button", { name: /Actualizar Task/i });
    await userEvent.click(actualizarButton);

    // Esperar al alert
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Tarea actualizada correctamente");
    });
  });
});
