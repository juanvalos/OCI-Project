//npx jest src/Tests/03ListaTareas.test.jsx -- comando para correr este test específico
//para correr todos el comsando es npm run test:frontend

import React from "react";
import { render, screen } from "@testing-library/react";
import TaskDetails from "../Components/TaskDetails";
import { TaskContext } from "../Contexts/TaskContext";

const mockTask = {
  name: "Tarea de prueba",
  description: "Descripción corta",
  difficulty: "Fácil",
  priority: "Baja",
  state: "Sin empezar",
  expectedHours: 4,
  actualHours: 1,
  dueDate: "2025-05-01T00:00:00.000Z",
};

describe("TaskDetails - información mínima", () => {
  it("muestra nombre, descripción, dificultad, prioridad y estado", () => {
    render(
      <TaskContext.Provider value={{ taskId: 123 }}>
        <TaskDetails task={mockTask} onClose={() => {}} />
      </TaskContext.Provider>
    );

    expect(screen.getByText(/Tarea de prueba/i)).toBeInTheDocument();
    expect(screen.getByText(/Descripción corta/i)).toBeInTheDocument();
    expect(screen.getByText(/Fácil/i)).toBeInTheDocument();
    expect(screen.getByText(/Baja/i)).toBeInTheDocument();
    expect(screen.getByText(/Sin empezar/i)).toBeInTheDocument();
  });
});
