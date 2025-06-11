// src/components/UserHoursPerSprint.js

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
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiLogOut } from "react-icons/fi";
import oracleLogo from '../Assets/fotos/Imagen1.png';
import footerImage from '../Assets/fotos/footerLogin.png';

// estilos de layout (header/footer, grid) y de panel
import "../Assets/SprintProductivity.css";
import "../Assets/css/SprintsAdmin.css";

const UserHoursPerSprint = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [developers, setDevelopers] = useState([]);
  const navigate = useNavigate();

  const PALETTE = [
    "#C74634", 
    "#D98324", 
    "#FFB400", 
    "#0D4715", 
    "#009688", 
    "#3B5998", 
    "#8A2BE2", 
    "#E91E63", 
    "#312D2A", 
    "#999999"  
  ];

  useEffect(() => {
    const fetchUserHours = async () => {
      try {
        const res = await fetch("/sprints/user-hours");
        const data = await res.json();

        const allDevs = new Set();
        data.forEach(entry => {
          Object.keys(entry).forEach(key => {
            if (key !== "name") allDevs.add(key);
          });
        });

        setDevelopers(Array.from(allDevs));
        setChartData(data);
      } catch (err) {
        console.error("Error obteniendo horas por usuario:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserHours();
  }, []);

  const handleGoBack = () => navigate(-1);
  const handleLogout = () => navigate("/");

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

      {/* Main content */}
      <div className="item3">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h1 className="dashboard-title">
              Horas trabajadas por developer en cada Sprint
            </h1>
          </div>

          <div className="dashboard-content">
            {loading ? (
              <p>Cargando...</p>
            ) : (
              <ResponsiveContainer width="100%" height={450}>
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  {developers.map((dev, i) => (
                    <Bar
                      key={dev}
                      dataKey={dev}
                      name={dev}
                      fill={PALETTE[i % PALETTE.length]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
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

export default UserHoursPerSprint;
