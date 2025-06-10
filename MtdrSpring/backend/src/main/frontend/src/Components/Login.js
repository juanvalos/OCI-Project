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
    const [twoFaRequired, setTwoFaRequired] = useState(false);
    const [tempUser, setTempUser]         = useState(null);
    const [twoFaCode, setTwoFaCode]       = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            if (response.status==200){
                const user = await response.json();
                setUserId(user.id);
                if (user.permits === 0){
                    navigate('/dashboard-user', { state: { user } });
                } else if (user.permits === 1) {
                    navigate('/dashboard-admin', { state: { user } });
                } else {
                    alert("Invalid user credentials");
                }
            } else if (response.status === 206) {
                const user = await response.json();       // contains id + permits etc.
                setTempUser(user);
                setTwoFaRequired(true);
            } else {
                alert("Invalid Credentials");
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('Login failed. Please try again.');
        }
    }

    // 3. handleVerify
    const handleVerify2FA = async e => {
    e.preventDefault();
    const res = await fetch("/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        userId: tempUser.id,
        code: twoFaCode
        })
    });
    if (res.ok) {
        // now treat as a successful login:
        setUserId(tempUser.id);
        navigate(tempUser.permits===0 ? "/dashboard-user" : "/dashboard-admin");
    } else {
        alert("Invalid 2FA code");
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
                <form onSubmit={twoFaRequired ? handleVerify2FA : handleLogin} className="login-form">
                    <h2>Welcome to</h2>
                    <p>TaskFlow</p>
                    {!twoFaRequired &&(
                        <>
                            <label htmlFor="username">Username:</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            </>)}
                        {twoFaRequired && (
                        <>
                            <label htmlFor="twoFaCode">2FA Code:</label>
                            <input
                                type="text"
                                placeholder='Enter your 2FA code'
                                value={twoFaCode}
                                onChange={(e) => setTwoFaCode(e.target.value)}
                            />
                        </>
                    )}
                    <button type="submit" className="login-button">
                        {twoFaRequired ? "Verify 2FA" : "Login"}
                    </button>
                </form>
            </div>

            <div className="footer-image">
                <img src={footerImage} alt="Footer" />
            </div>

            {/* footer */}
            <div className="item5">
                <p>© 2025 Team 45. All rights reserved.</p>
            </div>
        </div>
    );
};


export default Login;
