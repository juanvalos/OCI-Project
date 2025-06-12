import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../Contexts/UserContext';
import '../Assets/css/Login.css';
import oracleLogo from '../Assets/fotos/Imagen1.png';
import footerImage from '../Assets/fotos/footerLogin.png';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { setUserId } = useContext(UserContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const user = await response.json();
                setUserId(user.id);
                if (user.permits === 0) {
                    navigate('/dashboard-user', { state: { user } });
                } else if (user.permits === 1) {
                    navigate('/dashboard-admin', { state: { user } });
                }
            } else {
                alert('Invalid credentials');
            }
        } catch (error) {
            alert('Error logging in');
        }
    };

    return (
        <div className="grid-container">
            {/* Header */}
            <div className="item1">
                <img src={oracleLogo} alt="Oracle Logo" className="logo" />
            </div>

            {/* Formulario */}
            <div className="item3">
                <form onSubmit={handleLogin} className="login-form">
                    <h2>Welcome to</h2>
                    <p>TaskFlow</p>
                    <input
                        type="text"
                        placeholder="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">Login</button>
                </form>
            </div>

            <div className="footer-image">
                <img src={footerImage} alt="Footer" />
            </div>

            {/* footer */}
            <div className="item5">
                <p>©2025 Team 45. All rights reserved.</p>
            </div>
        </div>
    );
};

export default Login;