import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "../Assets/SprintProductivity.css";

const TotalHours = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSprints = async () => {
    try {
      const response = await fetch("/sprints/totalHours");
      const data = await response.json();

      const formattedData = Object.entries(data).map(([sprint, hours]) => ({
        sprint,
        hours,
      }));

      setChartData(formattedData);
    } catch (error) {
      console.error("Error obteniendo sprints:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSprints();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">📊 Horas totales trabajadas por Sprint</h1>
      </div>

      <div className="dashboard-content">
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sprint" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="hours" fill="#8884d8" name="Horas trabajadas" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default TotalHours;
