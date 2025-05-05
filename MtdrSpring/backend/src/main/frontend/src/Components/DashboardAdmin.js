import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../Contexts/UserContext";
import { SprintContext } from "../Contexts/SprintContext";
import { useNavigate } from "react-router-dom";
import "../Assets/DashboardAdmin.css";
import CreateSprint from "./CreateSprint";
import { FaUserCircle } from "react-icons/fa";
import { BsClipboardCheck } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { FaChartBar } from "react-icons/fa";

const DashboardUser = () => {
  const [user, setUser] = useState(null);
  const [sprints, setSprints] = useState([]);
  const [showCreateSprint, setShowCreateSprint] = useState(false);
  const navigate = useNavigate();
  const { setSprintId } = useContext(SprintContext);
  const { userId, setUserId } = useContext(UserContext);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const response = await fetch(`/profile/${userId}`);
      const data = await response.json();
      setUser(data);
    };

    fetchUserProfile();
    fetchSprints();
  }, [userId]);

  const fetchSprints = async () => {
    const response = await fetch("/sprints");
    const data = await response.json();
    setSprints(data);
  };
  
  const handleLogout = () => {
    setUserId(0);
    setSprintId(0);
    navigate("/");
  };

  const handleSprintClick = (sprintId) => {
    setSprintId(sprintId);
    navigate(`/sprintsAdmin`);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">📌 Oracle Manager Dashboard</h1>
        <button className="logout-button" onClick={handleLogout}>
          <FiLogOut className="logout-icon" />
          Cerrar sesión
        </button>
      </div>

      <div className="dashboard-content">
        {user && (
          <div className="profile-container">
            <FaUserCircle className="profile-icon" />
            <h2>Perfil</h2>
            <p><strong>Nombre:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.mail}</p>
            <p><strong>Rol:</strong> {user.role}</p>
            <p><strong>Modalidad:</strong> {user.modality}</p>
          </div>
        )}

        {/* Sección de Sprints */}
        <div className="sprints-section">
          <h2 className="sprints-title">📅 Sprints Activos</h2>
          <div className="sprints-container">
            {sprints.map((sprint) => (
              <div
                key={sprint.id}
                className="sprint-card"
                onClick={() => handleSprintClick(sprint.id)}
              >
                <BsClipboardCheck className="sprint-icon" />
                <h3>{sprint.name}</h3>
                <p>{sprint.description}</p>
              </div>
            ))}
          </div>
          <button className="create-sprint-button" onClick={() => setShowCreateSprint(true)}>
            + Crear Sprint
          </button>
        </div>

        <div className="productivity-section">
          <h2 className="productivity-title">📊 KPI's</h2>
          <button className="productivity-button" onClick={() => navigate("/sprintEffectiveness")}>
            <FaChartBar className="icon" /> Efectividad por sprint
          </button>
          <button
            className="productivity-button"
            onClick={() => navigate("/sprintProductivity")}
          >
            <FaChartBar className="icon" /> Productividad por Sprint
          </button>
          <button
            className="productivity-button" onClick={() => navigate("/totalHours")}> Hrs trabajadas por sprint
          </button>
          <button
            className="productivity-button" onClick={() => navigate("/userHoursPerSprint")}> Hrs trabajadas por dev
          </button>
          <button
            className="productivity-button" onClick={() => navigate("/userCompletedTasks")}> Task completadas por dev
          </button>
        </div>
      </div>

    {showCreateSprint && (
      <CreateSprint
        onClose={() => setShowCreateSprint(false)}
        onCreate={() => {
          setShowCreateSprint(false);
          fetchSprints();
        }}
      />
    )}

    </div>
  );
};

export default DashboardUser;
