import React, { useContext, useEffect, useState } from "react";
import { TaskContext } from "../Contexts/TaskContext";
import "../Assets/TaskDetails.css";

const TaskDetails = ({ task, onClose }) => {
  const { taskId } = useContext(TaskContext);
  const [selectedState, setSelectedState] = useState(task ? task.state : "");
  const [actualHours, setActualHours] = useState(task ? task.actualHours : 0);

  useEffect(() => {
    if (task) {
      setSelectedState(task.state);
      setActualHours(task.actualHours);
    }
  }, [task]);

  const handleChangeState = async () => {
    if (!taskId) return;

    try {
        const stateResponse = await fetch(`/tasks/state/${taskId}?newState=${encodeURIComponent(selectedState)}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
        });

        if (!stateResponse.ok) throw new Error("Error al actualizar el estado");

        const hoursResponse = await fetch(`/tasks/hours/${taskId}?actualHours=${encodeURIComponent(actualHours)}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
        });

        if (!hoursResponse.ok) throw new Error("Error al actualizar las horas reales");

        alert("Tarea actualizada correctamente");
        onClose();
    } catch (error) {
        console.error("Error actualizando la tarea:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Detalles de la Tarea</h2>
        {task ? (
          <>
            <p><strong>Nombre:</strong> {task.name}</p>
            <p><strong>Descripción:</strong> {task.description}</p>
            <p><strong>Dificultad:</strong> {task.difficulty}</p>
            <p><strong>Prioridad:</strong> {task.priority}</p>
            <p><strong>Estado:</strong> {task.state}</p>
            <p><strong>Horas estimadas:</strong> {task.expectedHours}</p>
            <p><strong>Fecha de Entrega:</strong> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No especificada"}</p>

            <p>
              <strong>Actualizar Horas reales:</strong>
              <input
                type="number"
                value={actualHours}
                onChange={(e) => setActualHours(e.target.value)}
                className="hours-input"
              />
            </p>

            <label>Actualizar Estado:</label>
            <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
              <option value="Sin empezar">Sin empezar</option>
              <option value="En progreso">En progreso</option>
              <option value="Terminada">Terminada</option>
            </select>
          </>
        ) : (
          <p>Cargando detalles...</p>
        )}
        <div className="modal-buttons">
          <button className="close-button" onClick={handleChangeState}>Actualizar Task</button>
          <button className="close-button" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;