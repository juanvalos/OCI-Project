import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../Contexts/UserContext";
import { SprintContext } from "../Contexts/SprintContext";
import { useNavigate } from "react-router-dom";
import "../Assets/css/DashboardUser.css";
import oracleLogo from '../Assets/fotos/Imagen1.png';
import footerImage from '../Assets/fotos/footerLogin.png';
import { FaUserCircle } from "react-icons/fa"; 
import { BsClipboardCheck } from "react-icons/bs"; 
import { FiLogOut } from "react-icons/fi"; 

const DashboardUser = () => {
  const [user, setUser] = useState(null);
  const [sprints, setSprints] = useState([]);
  const navigate = useNavigate();
  const { setSprintId } = useContext(SprintContext);
  const { userId, setUserId } = useContext(UserContext);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`/profile/${userId}`);
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    const fetchSprints = async () => {
      try {
        const response = await fetch("/sprints");
        const data = await response.json();
        setSprints(data);
      } catch (error) {
        console.error("Error fetching sprints:", error);
      }
    };

    if (userId !== 0) {
      fetchUserProfile();
      fetchSprints();
    }
  }, [userId]);

  const handleLogout = () => {
    setUserId(0);
    setSprintId(0);
    navigate("/");
  };

  const handleSprintClick = (sprintId) => {
    setSprintId(sprintId);
    navigate(`/sprintDetails`);
  };

  return (
    <div className="grid-container">

      {/* Header */}
      <div className="item1">
        <img src={oracleLogo} alt="Oracle Logo" className="logo" />
        <button className="logout-button" onClick={handleLogout}>
          <FiLogOut className="logout-icon" />
          Log out
        </button>
      </div>

      {/* Main contenido */}
      <div className="item3">
        {/* Perfil */}
        {user && (
          <div className="left-section">
            <div className="profile-section">
              <div className="profile-container">
                <FaUserCircle className="profile-icon" />
                <h2>Profile</h2>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.mail}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <p><strong>Modality:</strong> {user.modality}</p>
              </div>
            </div>
          </div>
        )}

        {/* Sprints */}
        <div className="sprints-section">
          <h2 className="sprints-title">📅 Current Sprints</h2>
          <div className="sprints-container">
            {sprints.length > 0 ? (
              sprints.map((sprint) => (
                <div 
                  key={sprint.id} 
                  className="sprint-card" 
                  onClick={() => handleSprintClick(sprint.id)}
                >
                  <BsClipboardCheck className="sprint-icon" />
                  <h3>{sprint.name}</h3>
                  <p>{sprint.description}</p>
                </div>
              ))
            ) : (
              <p>No sprints available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer image */}
      <div className="footer-image">
        <img src={footerImage} alt="Footer" />
      </div>

      {/* Footer */}
      <div className="item5">
        <p>© 2025 Team 45. All rights reserved.</p>
      </div>
    </div>
  );
};

export default DashboardUser;
