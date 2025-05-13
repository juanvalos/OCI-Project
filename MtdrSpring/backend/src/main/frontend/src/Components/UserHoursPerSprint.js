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

const UserHoursPerSprint = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [developers, setDevelopers] = useState([]);

  const fetchUserHours = async () => {
    try {
      const response = await fetch("/sprints/user-hours");
      const data = await response.json();

      const allDevs = new Set();
      data.forEach((entry) => {
        Object.keys(entry).forEach((key) => {
          if (key !== "name") {
            allDevs.add(key);
          }
        });
      });

      setDevelopers(Array.from(allDevs));
      setChartData(data);
    } catch (error) {
      console.error("Error obteniendo horas por usuario:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserHours();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">👩‍💻 Horas trabajadas por developer en cada Sprint</h1>
      </div>

      <div className="dashboard-content">
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <ResponsiveContainer width="100%" height={450}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {developers.map((dev, index) => (
                <Bar
                  key={dev}
                  dataKey={dev}
                  fill={`hsl(${(index * 60) % 360}, 70%, 60%)`}
                  name={dev}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default UserHoursPerSprint;
