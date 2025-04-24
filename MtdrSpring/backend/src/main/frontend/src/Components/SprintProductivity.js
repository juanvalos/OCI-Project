import React, { useContext, useEffect, useState } from "react";
import { SprintContext } from "../Contexts/SprintContext";
import "../Assets/SprintProductivity.css";

const SprintProductivity = () => {
  const { sprintId, setSprintId } = useContext(SprintContext);
  const [sprints, setSprints] = useState([]);
  const [productivity, setProductivity] = useState(null);

  useEffect(() => {
    const fetchSprints = async () => {
      try {
        const response = await fetch("/sprints");
        const data = await response.json();
        setSprints(data);
      } catch (error) {
        console.error("Error obteniendo sprints:", error);
      }
    };

    fetchSprints();
  }, []);

  const handleSprintChange = async (event) => {
    const selectedSprintId = event.target.value;
    setSprintId(selectedSprintId);

    try {
      const response = await fetch(`/sprint/${selectedSprintId}/productivity`);
      const data = await response.json();
      setProductivity(data);
    } catch (error) {
      console.error("Error obteniendo productividad:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">📊 Sprint Productivity</h1>
      </div>

      <div className="dashboard-content">
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
            {sprints.map((sprint) => (
              <option key={sprint.id} value={sprint.id}>
                {sprint.name}
              </option>
            ))}
          </select>
        </div>

        <div className="sprints-section">
          <h2 className="sprints-title">📈 Productividad del Sprint</h2>
          <div className="sprints-container">
            {productivity ? (
              Object.entries(productivity).map(([userName, value]) => (
                <div className="user-prod-card" key={userName}>
                  <h3>{userName}</h3>
                  <p>{value.toFixed(2)}%</p>
                </div>
              ))
            ) : (
              <p>No hay datos disponibles para este sprint.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SprintProductivity;
