import React, { useContext, useEffect, useState } from "react";
import { SprintContext } from "../Contexts/SprintContext";
import { UserContext } from "../Contexts/UserContext";
import { TaskContext } from "../Contexts/TaskContext";
import { useNavigate } from "react-router-dom";
import "../Assets/SprintsAdmin.css";
import { BsClipboardCheck } from "react-icons/bs";
import { FiLogOut, FiTrash2 } from "react-icons/fi";
import { FaTasks } from "react-icons/fa";
import ManageTask from "./ManageTask";
import CreateTask from "./CreateTask";

const SprintsAdmin = () => {
  const { sprintId, setSprintId } = useContext(SprintContext);
  const { setUserId } = useContext(UserContext);
  const { setTaskId } = useContext(TaskContext);
  const [sprint, setSprint] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showManageTask, setShowManageTask] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);

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
    fetchSprintDetails();
    fetchTasks();
  }, [sprintId]);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`/tasksbySprintId?sprintId=${sprintId}`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error obteniendo tareas del sprint:", error);
    }
  };
  
  const handleLogout = () => {
    setUserId(0);
    setSprintId(0);
    navigate("/");
  };

  const handleDeleteSprint = async () => {
    try {
      const response = await fetch(`/sprints/${sprintId}`, { method: "DELETE" });

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

  const handleTaskClick = (taskId) => {
    setTaskId(taskId);
    setShowManageTask(true);
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
            <p>
              <strong>Fecha de Entrega:</strong>{" "}
              {sprint.dueDate
                ? new Date(sprint.dueDate).toLocaleDateString()
                : "No especificada"}
            </p>
            <button className="close-button" onClick={() => handleDeleteSprint()}>
              <FiTrash2 className="delete-icon" />
               Eliminar Sprint
            </button>
            <button className="close-button">
               Generar Reporte
            </button>
          </div>
        )}

        {/* Sección de tareas */}
        <div className="tasks-sectionn">
          <div className="tasks-section">
            <h2 className="tasks-title">📝 Tareas del Sprint</h2>
            <div className="tasks-container">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <button key={task.id} className="task-card" onClick={() => handleTaskClick(task.id)}>
                    <FaTasks className="task-icon" />
                    <h3>{task.name}</h3>
                    <p><strong>Estado:</strong> {task.state}</p>
                  </button>
                ))
              ) : (
                <p className="no-tasks">No hay tareas para este sprint.</p>
              )}
            </div>  
          </div>
            <button className="close-button" onClick={() => setShowCreateTask(true)}> + Agregar Task</button>
          <div>
        </div>
        
            
    </div>
    
    </div>
    {showCreateTask && <CreateTask onClose={() => { setShowCreateTask(false); fetchTasks(); }} />}
    {showManageTask && <ManageTask onClose={() => {setShowManageTask(false); fetchTasks();}} />}
    </div>
  );
};

export default SprintsAdmin;