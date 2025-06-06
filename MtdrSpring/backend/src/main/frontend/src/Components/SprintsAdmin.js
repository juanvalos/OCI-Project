import React, { useContext, useEffect, useState } from "react";
import { SprintContext } from "../Contexts/SprintContext";
import { UserContext } from "../Contexts/UserContext";
import { TaskContext } from "../Contexts/TaskContext";
import { useNavigate } from "react-router-dom";
import "../Assets/css/SprintsAdmin.css";
import oracleLogo from '../Assets/fotos/Imagen1.png';
import footerImage from '../Assets/fotos/footerLogin.png';
import { BsClipboardCheck, BsClipboard2CheckFill } from "react-icons/bs";
import { FiLogOut, FiArrowLeft, FiTrash2 } from "react-icons/fi";
import ManageTask from "./ManageTask";
import CreateTask from "./CreateTask";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SprintsAdmin = () => {
  const { sprintId, setSprintId } = useContext(SprintContext);
  const { setUserId } = useContext(UserContext);
  const { setTaskId } = useContext(TaskContext);
  const [sprint, setSprint] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showManageTask, setShowManageTask] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const navigate = useNavigate();

  const fetchSprintDetails = async () => {
    const response = await fetch(`/sprints/${sprintId}`);
    const data = await response.json();
    setSprint(data);
  };

  const fetchTasks = async () => {
    const response = await fetch(`/tasksbySprintId?sprintId=${sprintId}`);
    const data = await response.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchSprintDetails();
    fetchTasks();
  }, [sprintId]);

  const handleLogout = () => {
    setUserId(0);
    setSprintId(0);
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleDeleteSprint = async () => {
    const response = await fetch(`/sprints/${sprintId}`, { method: "DELETE" });
    if (response.ok) {
      alert("Sprint eliminado con éxito.");
      navigate(-1);
    } else {
      alert("Error al eliminar el sprint.");
    }
  };

  const handleTaskClick = (taskId) => {
    setTaskId(taskId);
    setShowManageTask(true);
  };

  const getStatusColor = (state) => {
    switch (state) {
      case "Terminada": return "#0D4715";
      case "En progreso": return "#D98324";
      default: return "#000000";
    }
  };

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

      <div className="item3">
        <div className="left-column">
          {sprint && (
            <>
              <div className="sprint-info">
                <BsClipboardCheck className="sprint-icon" />
                <h2>{sprint.name}</h2>
                <p><strong>Description:</strong> {sprint.description}</p>
                <p><strong>Project:</strong> {sprint.project}</p>
                <p><strong>Due Date:</strong> {sprint.dueDate ? new Date(sprint.dueDate).toLocaleDateString() : "Not specified"}</p>
              </div>

              <div className="sprint-buttons">
                <button className="delete-button" onClick={handleDeleteSprint}>
                  <FiTrash2 className="delete-icon" /> Delete Sprint
                </button>

                <button className="add-task-button" onClick={() => setShowCreateTask(true)}>
                  + Add Task
                </button>
              </div>
            </>
          )}
        </div>

        <div className="tasks-section">
          <h2 className="sprints-title">📝 Sprint Tasks</h2>
          <div className="sprints-container">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <div key={task.id} className="sprint-card" onClick={() => handleTaskClick(task.id)}>
                  <BsClipboard2CheckFill className="sprint-icon" />
                  <h3>{task.name}</h3>
                  <p><strong>Status:</strong> <span style={{ color: getStatusColor(task.state) }}>{task.state}</span></p>
                </div>
              ))
            ) : (
              <p className="no-tasks">No tasks for this sprint.</p>
            )}
          </div>
        </div>

        <div className="chart-section">
          <h2 className="sprints-title">📊 Sprint Status</h2>
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

      {showCreateTask && <CreateTask onClose={() => { setShowCreateTask(false); fetchTasks(); }} />}
      {showManageTask && <ManageTask onClose={() => { setShowManageTask(false); fetchTasks(); }} />}
    </div>
  );
};

export default SprintsAdmin;
