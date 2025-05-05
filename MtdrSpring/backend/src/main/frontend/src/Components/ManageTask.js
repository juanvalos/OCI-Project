import React, { useContext, useEffect, useState } from "react";
import { TaskContext } from "../Contexts/TaskContext";
import "../Assets/ManageTask.css";

const ManageTask = ({ onClose }) => {
  const { taskId } = useContext(TaskContext);
  const [task, setTask] = useState(null);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await fetch(`/tasks/details/${taskId}`);
        if (!response.ok) throw new Error("Error obteniendo los detalles de la tarea");
        const data = await response.json();
        setTask(data);
      } catch (error) {
        console.error("Error obteniendo la tarea:", error);
      }
    };

    fetchTaskDetails();
  }, [taskId]);

  const handleDeleteTask = async () => {
    if (!task) return;
    try {
      const response = await fetch(`/tasks/${task.id}`, { method: "DELETE" });
      if (response.ok) {
        alert("Tarea eliminada con éxito.");
        onClose();
      } else {
        alert("Error al eliminar la tarea.");
      }
    } catch (error) {
      console.error("Error eliminando la tarea:", error);
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
            <p><strong>Horas reales:</strong> {task.actualHours}</p>
            <p><strong>Fecha de Entrega:</strong> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No especificada"}</p>
            <p><strong>Usuario Asignado:</strong> {task.assignedUserName}</p>
            
            <div className="buttons-container">
              <button className="close-button" onClick={onClose}>Cancelar</button>
              <button className="close-button" onClick={handleDeleteTask}>Eliminar Tarea</button>
            </div>
          </>
        ) : (
          <p>Cargando detalles...</p>
        )}
      </div>
    </div>
  );
};

export default ManageTask;
