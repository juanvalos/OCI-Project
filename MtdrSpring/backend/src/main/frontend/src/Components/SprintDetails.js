import React, { useContext, useEffect, useState } from "react";
import { SprintContext } from "../Contexts/SprintContext";
import { UserContext } from "../Contexts/UserContext";
import { TaskContext } from "../Contexts/TaskContext";
import { useNavigate } from "react-router-dom";
import "../Assets/css/SprintDetails.css";
import oracleLogo from '../Assets/fotos/Imagen1.png';
import footerImage from '../Assets/fotos/footerLogin.png';
import { BsClipboardCheck, BsClipboard2CheckFill } from "react-icons/bs";
import { FiLogOut, FiArrowLeft } from "react-icons/fi";
import TaskDetails from "./TaskDetails";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SprintDetails = () => {
  const { sprintId, setSprintId } = useContext(SprintContext);
  const { userId, setUserId } = useContext(UserContext);
  const { setTaskId } = useContext(TaskContext);
  const [sprint, setSprint] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const navigate = useNavigate();

  const fetchSprintDetails = async () => {
    const response = await fetch(`/sprints/${sprintId}`);
    const data = await response.json();
    setSprint(data);
  };

  const fetchTasks = async () => {
    const response = await fetch(`/tasksUserSprint?oracleUserId=${userId}&sprintId=${sprintId}`);
    const data = await response.json();
    setTasks(data);
  };

  useEffect(() => {
    if (userId !== 0 && sprintId !== 0) {
      fetchSprintDetails();
      fetchTasks();
    }
  }, [userId, sprintId]);

  const handleLogout = () => {
    setUserId(0);
    setSprintId(0);
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleTaskClick = (task) => {
    setTaskId(task.id);
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const getStatusColor = (state) => {
    switch (state) {
      case "Terminada":
        return "#0D4715";
      case "En progreso":
        return "#D98324";
      default:
        return "#000000";
    }
  };

  // Datos para el gráfico (solo tareas del usuario)
  const total = tasks.length;
  const terminadas = tasks.filter(t => t.state === "Terminada").length;
  const enProgreso = tasks.filter(t => t.state === "En progreso").length;
  const sinEmpezar = total - terminadas - enProgreso;

  const dataChart = [
    { name: "Terminadas", value: terminadas },
    { name: "En progreso", value: enProgreso },
    { name: "Sin empezar", value: sinEmpezar },
  ];

  const COLORS = ["#0D4715", "#D98324", "#999"];

  return (
    <div className="grid-container">
      {/* Header */}
      <div className="item1">
        <img src={oracleLogo} alt="Oracle Logo" className="logo" />
        <div className="header-buttons">
          <div className="button-wrapper">
            <button className="back-button" onClick={handleGoBack}>
              <FiArrowLeft className="back-icon" /> Go Back
            </button>
          </div>
          <div className="button-wrapper">
            <button className="logout-button" onClick={handleLogout}>
              <FiLogOut className="logout-icon" /> Log out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="item3">
        {sprint && (
          <div className="sprint-info">
            <BsClipboardCheck className="sprint-icon" />
            <h2>{sprint.name}</h2>
            <p><strong>Description:</strong> {sprint.description}</p>
            <p><strong>Project:</strong> {sprint.project}</p>
            <p><strong>Due Date:</strong> {sprint.dueDate ? new Date(sprint.dueDate).toLocaleDateString() : "Not specified"}</p>
          </div>
        )}

        <div className="tasks-section">
          <h2 className="sprints-title">📝 My Tasks</h2>
          <div className="sprints-container">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <div key={task.id} className="sprint-card" onClick={() => handleTaskClick(task)}>
                  <BsClipboard2CheckFill className="sprint-icon" />
                  <h3>{task.name}</h3>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span style={{ color: getStatusColor(task.state) }}>{task.state}</span>
                  </p>
                </div>
              ))
            ) : (
              <p className="no-tasks">No tasks available for this sprint.</p>
            )}
          </div>
        </div>

        <div className="chart-section">
          <h2 className="sprints-title">📊 My Progress</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={dataChart} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                {dataChart.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="footer-image">
        <img src={footerImage} alt="Footer" />
      </div>

      <div className="item5">
        <p>© 2025 Team 45. All rights reserved.</p>
      </div>

      {showTaskModal && (
        <TaskDetails
          task={selectedTask}
          onClose={() => {
            setShowTaskModal(false);
            fetchTasks();
          }}
        />
      )}
    </div>
  );
};

export default SprintDetails;
