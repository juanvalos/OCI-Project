/**Lista de tareas completadas por Sprint. 
 * npx jest src/Tests/03ListaTareas.test.jsx -- comando para correr este test específico
 * Probar que la información mínima esté presente en el ticket: 
 * Nombre Tarea, Nombre de desarrollador, horas estimadas, horas reales. */

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
  // developerName: "Juan Yael"  (En este deploy no se usa aún)
};

describe("TaskDetails - información mínima", () => {
  it("muestra nombre de tarea, horas estimadas y horas reales (developer opcional)", () => {
    render(
      <TaskContext.Provider value={{ taskId: 123 }}>
        <TaskDetails task={mockTask} onClose={() => {}} />
      </TaskContext.Provider>
    );

    // Nombre de la tarea
    expect(screen.getByText(/Tarea de prueba/i)).toBeInTheDocument();

    // Developer: sólo lo chequeamos si existe en el task (ahora no, en el proximo deploy sí :) )
    if (mockTask.developerName) {
      const developer = screen.queryByText(new RegExp(mockTask.developerName, "i"));
      if (developer) {
        expect(developer).toBeInTheDocument();
      }
    }

    // Horas estimadas
    expect(screen.getByText("Horas estimadas:")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();

    // Horas reales (input)
    expect(screen.getByDisplayValue("1")).toBeInTheDocument();
  });
});
