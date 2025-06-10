import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../Contexts/UserContext";
import { useNavigate } from "react-router-dom";
import "../Assets/SettingUser.css";
import { FaUserCircle } from "react-icons/fa";
import { BsClipboardCheck } from "react-icons/bs";
import oracleLogo from '../Assets/fotos/Imagen1.png';
import { FiLogOut, FiArrowLeft } from "react-icons/fi";
import footerImage from '../Assets/fotos/footerLogin.png';



const SettingUser = () => {
  const [user, setUser] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [code, setCode] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");
  const navigate = useNavigate();
  const { userId, setUserId } = useContext(UserContext);

  const [twoFaVerified, setTwoFaVerified] = useState(false);
  const [backupCodes, setBackupCodes] = useState([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [is2faEnabled, setIs2faEnabled] = useState(false);

  useEffect(() => {
  fetch(`/profile/${userId}`)
    .then(res => res.json())
    .then(data => {
      setUser(data);
      setIs2faEnabled(data.twoFaEnabled === 1);  // ← use the correct property
    })
    .catch(console.error);
  }, [userId]);

  const handleLogout = () => {
    setUserId(0);
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };
    
  const enable2FA = async () => {
  const res = await fetch(`/2fa/setup/${userId}`, { method: "POST" });
  if (!res.ok) {
    setVerificationMessage("Failed to generate QR code.");
    return;
  }

  const { qrCodeUrl: otpUri } = await res.json();
  // Wrap that URI in a real QR-code generator URL:
  const httpQr = 
    `https://api.qrserver.com/v1/create-qr-code/?` +
    `data=${encodeURIComponent(otpUri)}` +
    `&size=200x200`;
    setQrCodeUrl(httpQr);
    setVerificationMessage("");
  };

const verify2FA = async () => {
  const res = await fetch(`/2fa/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, code })
  });

  if (res.ok) {
    setVerificationMessage("✅ 2FA verification successful!");
    setQrCodeUrl(null);
    setTwoFaVerified(true);
    setIs2faEnabled(true); // Mark as enabled
  } else {
    setVerificationMessage("❌ Invalid code. Try again.");
  }
};

  const generateBackupCodes = async () => {
  const res = await fetch(`/2fa/backup/generate/${userId}`, {
    method: "POST"
  });
  if (res.ok) {
    const codes = await res.json();  // should be an array of strings
    setBackupCodes(codes);
    setShowBackupCodes(true);
  } else {
    alert("Failed to generate backup codes");
  }
  };

  return (
    <div className="grid-container">
      {/* Header */}
      <div className="item1">
        <img src={oracleLogo} alt="Oracle Logo" className="logo" />
        <div className="header-buttons">
          <div className="button-wrapper">
            <button className="back-button" onClick={handleGoBack}>
              <FiArrowLeft className="back-icon" /> Go Back
            </button>
          </div>
          <div className="button-wrapper">
            <button className="logout-button" onClick={handleLogout}>
              <FiLogOut className="logout-icon" /> Log out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="item3">
        <div className="profile-container">
          <FaUserCircle className="profile-icon" />
          <h2>Profile</h2>
          {user && (
            <>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.mail}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>Modality:</strong> {user.modality}</p>
            </>
          )}
        </div>

      

      {/* 2FA Section */}

            <div className="two-factor-authentication">
              <div className="profile-container">
                <h3>Two-Factor Authentication</h3>

            {/* 1) If 2FA is OFF and we haven’t even generated a QR yet… */}
            {!is2faEnabled && !qrCodeUrl && (
              <button onClick={enable2FA} className="enable-2fa-button">
                Enable 2FA
              </button>
            )}

            {/* 2) If 2FA is ON (regardless of QR), show the “already enabled” note */}
            {is2faEnabled && (
              <p>✅ 2FA is already enabled for your account.</p>
            )}

            {/* 3) If we’ve generated a QR but not yet enabled, show the QR + verify UI */}
            {qrCodeUrl  && (
              <div className="qr-code-container">
                <img src={qrCodeUrl} alt="2FA QR Code" />
                <input
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  placeholder="Enter verification code"
                />
                <button onClick={verify2FA} className="verify-2fa-button">
                  Verify
                </button>
            
                {/* only after you verify, show Backup Codes */}
                {is2faEnabled && (
                  <button
                    onClick={generateBackupCodes}
                    className="backup-code-button"
                    style={{ marginLeft: 12 }}>
                    Backup Codes
                  </button>)} 
                  {verificationMessage && <p>{verificationMessage}</p>}
                </div>
            )}

            {/* 4) Finally, if backup codes have been fetched… */}
            {showBackupCodes && (
              <div className="backup-codes-list">
                <h4>Your Backup Codes</h4>
                <ul>
                  {backupCodes.map(c => <li key={c}>{c}</li>)}
                </ul>
                <p><em>Store these somewhere safe. Each can only be used once.</em></p>
              </div>
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

export default SettingUser;
