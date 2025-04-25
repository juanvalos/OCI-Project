import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../Contexts/UserContext';
import '../Assets/Login.css';

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
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            if (response.ok) {
                const user = await response.json();
                setUserId(user.id); // Guardar el ID del usuario en el contexto
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
        <div className='container'>
            <div className="login-container">
                <form onSubmit={handleLogin}>
                    <h2>Log In</h2>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className = "button-login" type="submit">Log In</button>
                </form>
            </div>
        </div>
        
    );
};

export default Login;