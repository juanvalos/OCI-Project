import React, { useContext, useEffect, useState } from "react";
import { TaskContext } from "../Contexts/TaskContext";
import { useNavigate } from "react-router-dom";
import "../Assets/TaskDetails.css";

const TaskDetails = ({ task, onClose }) => {
  const { taskId } = useContext(TaskContext);
  const [selectedState, setSelectedState] = useState(task ? task.state : "");
  const navigate = useNavigate(); 

  useEffect(() => {
    if (task) {
      setSelectedState(task.state);
    }
  }, [task]);

  const handleChangeState = async () => {
    if (!taskId) return;
  
    try {
      const response = await fetch(`/tasks/state/${taskId}?newState=${encodeURIComponent(selectedState)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) throw new Error("Error al actualizar el estado");
  
      alert("Estado actualizado correctamente");
      onClose(); 
    } catch (error) {
      console.error("Error actualizando el estado:", error);
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

            <label>Cambiar Estado:</label>
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
          <button className="close-button" onClick={handleChangeState}>Actualizar Estado</button>
          <button className="close-button" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;