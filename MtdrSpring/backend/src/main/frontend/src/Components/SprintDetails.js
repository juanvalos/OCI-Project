import React, { useContext, useEffect, useState } from "react";
import { SprintContext } from "../Contexts/SprintContext";
import { UserContext } from "../Contexts/UserContext";
import { TaskContext } from "../Contexts/TaskContext";
import { useNavigate } from "react-router-dom";
import "../Assets/SprintDetails.css";
import { BsClipboardCheck } from "react-icons/bs";
import { FaTasks } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi"; // Icono de cerrar sesión
import TaskDetails from "./TaskDetails";

const SprintDetails = () => {
  const { sprintId, setSprintId } = useContext(SprintContext);
  const { userId, setUserId } = useContext(UserContext);
  const { setTaskId } = useContext(TaskContext);
  const [sprint, setSprint] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null); // Agregar estado para la tarea seleccionada
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSprintDetails = async () => {
      const response = await fetch(`/sprints/${sprintId}`);
      const data = await response.json();
      setSprint(data);
    };

    fetchSprintDetails();
    fetchTasks();

  }, [userId, sprintId]);

  const fetchTasks = async () => {
    const response = await fetch(`/tasksUserSprint?oracleUserId=${userId}&sprintId=${sprintId}`);
    const data = await response.json();
    setTasks(data);
  };
  
  const handleLogout = () => {
    setUserId(0);
    setSprintId(0);
    navigate("/");
  };

  const handleTaskClick = (task) => {
    setTaskId(task.id);
    setSelectedTask(task); // Establecer la tarea seleccionada
    setShowTaskModal(true);
  };

  return (
    <div className="sprint-container">
      <div className="sprint-header">
        <h1 className="sprint-title">📌 Sprint Details</h1>
        <button className="logout-button" onClick={handleLogout}>
          <FiLogOut className="logout-icon" />
          Cerrar sesión
        </button>
      </div>

      <div className="sprint-content">
        {sprint && (
          <div className="sprint-info">
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
          </div>
        )}

        <div className="tasks-section">
          <h2 className="tasks-title">📝 Tasks</h2>
          <div className="tasks-container">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <button key={task.id} className="task-card" onClick={() => handleTaskClick(task)}>
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
      </div>

      {showTaskModal && <TaskDetails task={selectedTask} onClose={() => { setShowTaskModal(false); fetchTasks(); }} />}
    </div>
  );
};

export default SprintDetails;