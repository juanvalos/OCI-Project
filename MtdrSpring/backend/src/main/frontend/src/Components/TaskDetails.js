import React, { useContext, useEffect, useState } from "react";
import { TaskContext } from "../Contexts/TaskContext";
import { useNavigate } from "react-router-dom";
import "../Assets/TaskDetails.css";

const TaskDetails = () => {
  const { taskId } = useContext(TaskContext);
  const [task, setTask] = useState(null);
  const [selectedState, setSelectedState] = useState("");
  const navigate = useNavigate(); 
  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await fetch(`/taskDetails/${taskId}`);
        if (!response.ok) throw new Error("Error obteniendo los detalles de la tarea");
        const data = await response.json();
        setTask(data);
        setSelectedState(data.state);
      } catch (error) {
        console.error("Error obteniendo la tarea:", error);
      }
    };

    fetchTaskDetails();
  }, [taskId]);

  const handleChangeState = async () => {
    if (!taskId) return;

    try {
      const response = await fetch(`/tasks/state/${taskId}?newState=${encodeURIComponent(selectedState)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Error al actualizar el estado");

      const updatedTask = await response.json();
      setTask(updatedTask);

      navigate(-1);

    } catch (error) {
      console.error("Error actualizando el estado:", error);
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Detalles de la Tarea</h2>
        {task ? (
          <>
            <p><strong>Nombre:</strong> {task.title}</p>
            <p><strong>Descripción:</strong> {task.description}</p>
            <p><strong>Dificultad:</strong> {task.difficulty}</p>
            <p><strong>Prioridad:</strong> {task.priority}</p>
            <p><strong>Estado:</strong> {task.state}</p>

            <label>Cambiar Estado:</label>
            <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
              <option value="Sin empezar">Sin empezar</option>
              <option value="En progreso">En progreso</option>
              <option value="Terminada">Terminada</option>
            </select>

            <button className="status-button" onClick={handleChangeState}>Actualizar Estado</button>
          </>
        ) : (
          <p>Cargando detalles...</p>
        )}

        <button className="close-button" onClick={handleClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default TaskDetails;
