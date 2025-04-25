import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../Contexts/UserContext";
import { SprintContext } from "../Contexts/SprintContext";
import { useNavigate } from "react-router-dom";
import "../Assets/DashboardUser.css";
import { FaUserCircle } from "react-icons/fa"; 
import { BsClipboardCheck } from "react-icons/bs"; 
import { FiLogOut } from "react-icons/fi"; // Icono de cerrar sesión

const DashboardUser = () => {
  const [user, setUser] = useState(null);
  const [sprints, setSprints] = useState([]);
  const navigate = useNavigate();
  const {setSprintId } = useContext(SprintContext);
  const { userId, setUserId } = useContext(UserContext);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const response = await fetch(`/profile/${userId}`);
      const data = await response.json();
      setUser(data);
    };

    const fetchSprints = async () => {
      const response = await fetch("/sprints");
      const data = await response.json();
      setSprints(data);
    };

    fetchUserProfile();
    fetchSprints();
  }, [userId]);

  const handleLogout = () => {
    setUserId(0);
    setSprintId(0);
    navigate("/"); // Redirige al home
  };

  const handleSprintClick = (sprintId) => {
    setSprintId(sprintId);
    navigate(`/sprintDetails`);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">📌 Oracle User Dashboard</h1>
          <button className="logout-button" onClick={handleLogout}>
            <FiLogOut className="logout-icon" />
              Cerrar sesión
          </button>
      </div>

      <div className="dashboard-content">
        {/* Sección de Perfil */}
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
        </div>
      </div>
    </div>
  );
};

export default DashboardUser;