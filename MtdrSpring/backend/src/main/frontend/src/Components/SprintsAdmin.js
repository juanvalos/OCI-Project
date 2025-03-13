import React, { useContext, useEffect, useState } from "react";
import { SprintContext } from "../Contexts/SprintContext";
import { UserContext } from "../Contexts/UserContext";
import { useNavigate } from "react-router-dom";
import "../Assets/SprintsAdmin.css";
import { BsClipboardCheck } from "react-icons/bs";
import { FiLogOut, FiTrash2 } from "react-icons/fi";
import { FaTasks } from "react-icons/fa";

const SprintsAdmin = () => {
  const { sprintId, setSprintId } = useContext(SprintContext);
  const { userId, setUserId } = useContext(UserContext);
  const [sprint, setSprint] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSprintDetails = async () => {
      try {
        const response = await fetch(`/sprints/${sprintId}`);
        const data = await response.json();
        setSprint(data);
      } catch (error) {
        console.error("Error obteniendo detalles del sprint:", error);
      }
    };

    const fetchTasks = async () => {
      try {
        const response = await fetch(`/tasksbySprintId?sprintId=${sprintId}`);
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error obteniendo tareas del sprint:", error);
      }
    };

    fetchSprintDetails();
    fetchTasks();
  }, [sprintId]);

  const handleLogout = () => {
    setUserId(0);
    setSprintId(0);
    navigate("/");
  };

  const handleDeleteSprint = async () => {
    try {
      const response = await fetch(`/sprints/${sprintId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Sprint eliminado con éxito.");
        setShowConfirmDelete(false);
        navigate(-1);
      } else {
        alert("Error al eliminar el sprint.");
      }
    } catch (error) {
      console.error("Error eliminando el sprint:", error);
      alert("No se pudo eliminar el sprint.");
    }
  };

  return (
    <div className="sprint-admin-container">
      <div className="sprint-admin-header">
        <h1 className="sprint-admin-title">📌 Administración de Sprint</h1>
        <button className="logout-button" onClick={handleLogout}>
          <FiLogOut className="logout-icon" />
          Cerrar sesión
        </button>
      </div>

      <div className="sprint-admin-content">
        {sprint && (
          <div className="sprint-admin-info">
            <BsClipboardCheck className="sprint-icon" />
            <h2>{sprint.name}</h2>
            <p><strong>Descripción:</strong> {sprint.description}</p>
            <p><strong>Proyecto:</strong> {sprint.project}</p>
            <button className="close-button" onClick={() => setShowConfirmDelete(true)}>
              <FiTrash2 className="delete-icon" />
              Eliminar Sprint
            </button>
          </div>
        )}

        {/* Sección de tareas */}
        <div className="tasks-section">
          <h2 className="tasks-title">📝 Tareas del Sprint</h2>
          <div className="tasks-container">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <div key={task.id} className="task-card">
                  <FaTasks className="task-icon" />
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <p><strong>Estado:</strong> {task.state}</p>
                </div>
              ))
            ) : (
              <p className="no-tasks">No hay tareas para este sprint.</p>
            )}
          </div>
        </div>
      </div>

      {/* Pantalla emergente de confirmación */}
      {showConfirmDelete && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>¿Eliminar Sprint?</h2>
            <p>Esta acción no se puede deshacer.</p>
            <div className="buttons-container">
              <button className="close-button" onClick={() => setShowConfirmDelete(false)}>Cancelar</button>
              <button className="close-button" onClick={handleDeleteSprint}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SprintsAdmin;
