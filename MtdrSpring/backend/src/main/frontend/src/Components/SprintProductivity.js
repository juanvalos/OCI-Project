import React, { useContext, useEffect, useState } from "react";
import { SprintContext } from "../Contexts/SprintContext";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiLogOut } from "react-icons/fi";
import oracleLogo from '../Assets/fotos/Imagen1.png';
import footerImage from '../Assets/fotos/footerLogin.png';
import "../Assets/SprintProductivity.css";
import "../Assets/css/SprintsAdmin.css";

const SprintProductivity = () => {
  const { sprintId, setSprintId } = useContext(SprintContext);
  const [sprints, setSprints] = useState([]);
  const [productivity, setProductivity] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/sprints")
      .then((res) => res.json())
      .then(setSprints)
      .catch(console.error);
  }, []);

  const handleSprintChange = async (e) => {
    const id = e.target.value;
    setSprintId(id);
    try {
      const res = await fetch(`/sprint/${id}/productivity`);
      const data = await res.json();
      setProductivity(data);
    } catch (err) {
      console.error("Error obteniendo productividad:", err);
    }
  };

  const handleGoBack = () => navigate(-1);
  const handleLogout = () => {
    setSprintId(0);
    navigate("/");
  };

  return (
    <div className="grid-container">
      {/* Header */}
      <div className="item1">
        <img src={oracleLogo} alt="Oracle Logo" className="logo" />
        <div className="header-buttons">
          <button className="back-button" onClick={handleGoBack}>
            <FiArrowLeft className="back-icon" /> Go Back
          </button>
          <button className="logout-button" onClick={handleLogout}>
            <FiLogOut className="logout-icon" /> Log out
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="item3">
        <div className="profile-container">
          <h2>Seleccionar Sprint</h2>
          <select
            value={sprintId || ""}
            onChange={handleSprintChange}
            className="sprint-dropdown"
          >
            <option value="" disabled>
              Selecciona un sprint
            </option>
            {sprints.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="sprints-section">
          <h2 className="sprints-title">Productividad del Sprint</h2>
          <div className="sprints-container">
            {productivity ? (
              Object.entries(productivity).map(([user, value]) => (
                <div className="user-prod-card" key={user}>
                  <h3>{user}</h3>
                  <p>{value.toFixed(2)}%</p>
                </div>
              ))
            ) : (
              <p>No hay datos disponibles para este sprint.</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer-image">
        <img src={footerImage} alt="Footer" />
      </div>
      <div className="item5">
        <p>© 2025 Team 45. All rights reserved.</p>
      </div>
    </div>
  );
};

export default SprintProductivity;
