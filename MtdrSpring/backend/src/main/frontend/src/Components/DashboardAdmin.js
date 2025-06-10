import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../Contexts/UserContext";
import { SprintContext } from "../Contexts/SprintContext";
import { useNavigate } from "react-router-dom";
import "../Assets/css/DashboardAdmin.css";
import CreateSprint from "./CreateSprint";
import oracleLogo from '../Assets/fotos/Imagen1.png';
import footerImage from '../Assets/fotos/footerLogin.png';
import { FaUserCircle } from "react-icons/fa";
import { BsClipboardCheck } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { FaChartBar } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";

const DashboardAdmin = () => {
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
    <div className="grid-container">

      {/* Header */}
      <div className="item1">
        <img src={oracleLogo} alt="Oracle Logo" className="logo" />
        <button className="logout-button" onClick={handleLogout}>
          <FiLogOut className="logout-icon" /> Log out
        </button>

        <button className="action-button" onClick={() => navigate('/settingsUser')}>
          <IoMdSettings className="settings-icon" />
          Settings
        </button>
      </div>

      {/* Main content */}
      <div className="item3">

        <div className="left-section">
          {user && (
            <div className="profile-container">
              <FaUserCircle className="profile-icon" />
              <h2>Profile</h2>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.mail}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>Modality:</strong> {user.modality}</p>
            </div>
          )}
          
          <button className="create-sprint-button" onClick={() => setShowCreateSprint(true)}>
            + Create Sprint
          </button>
        </div>

        <div className="sprints-section">
          <h2 className="sprints-title">📅 Current Sprints</h2>
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

        <div className="productivity-section">
          <h2 className="productivity-title">📊 KPI's</h2>
          <button className="productivity-button" onClick={() => navigate("/sprintEffectiveness")}>
            <FaChartBar className="icon" /> Sprint Effectiveness
          </button>
          <button className="productivity-button" onClick={() => navigate("/sprintProductivity")}>
            <FaChartBar className="icon" /> Sprint Productivity
          </button>
          <button className="productivity-button" onClick={() => navigate("/totalHours")}>
            Hours per Sprint
          </button>
          <button className="productivity-button" onClick={() => navigate("/userHoursPerSprint")}>
            Dev Hours
          </button>
          <button className="productivity-button" onClick={() => navigate("/userCompletedTasks")}>
            Completed Tasks
          </button>
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

export default DashboardAdmin;
