/*Cambio de estado de datos de tareas (nombre, dev, storyPoints, horas estimadas)
npx jest src/Tests/02EditarTareas.test.jsx -- comando para correr este test específico
para correr todos el comsando es npm run test:frontend*/

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TaskDetails from "../Components/TaskDetails";
import { TaskContext } from "../Contexts/TaskContext";

const mockTask = {
  name: "Actualizar base de datos",
  description: "Mejorar estructura del modelo",
  difficulty: "Media",
  priority: "Alta",
  state: "Sin empezar",
  expectedHours: 5,
  actualHours: 2,
  dueDate: "2025-05-05T00:00:00.000Z",
};

describe("TaskDetails - cambio de estado y horas reales", () => {
  beforeEach(() => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: true }) // estado
      .mockResolvedValueOnce({ ok: true }); // horas
    window.alert = jest.fn(); // evitar errores por alert
  });

  it("permite actualizar estado y horas reales de la tarea", async () => {
    const mockClose = jest.fn();

    render(
      <TaskContext.Provider value={{ taskId: 10 }}>
        <TaskDetails task={mockTask} onClose={mockClose} />
      </TaskContext.Provider>
    );

    const selectEstado = screen.getByDisplayValue("Sin empezar");
    const inputHoras = screen.getByDisplayValue("2");
    const btnActualizar = screen.getByText(/Actualizar Task/i);

    fireEvent.change(selectEstado, { target: { value: "En progreso" } });
    fireEvent.change(inputHoras, { target: { value: "4" } });
    fireEvent.click(btnActualizar);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenNthCalledWith(1,
        expect.stringContaining("/tasks/state/10?newState=En%20progreso"),
        expect.objectContaining({ method: "PUT" })
      );

      expect(global.fetch).toHaveBeenNthCalledWith(2,
        expect.stringContaining("/tasks/hours/10?actualHours=4"),
        expect.objectContaining({ method: "PUT" })
      );
    });

    expect(window.alert).toHaveBeenCalledWith("Tarea actualizada correctamente");
    expect(mockClose).toHaveBeenCalled();
  });
});
