import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { LandingPage } from './landing/LandingPage';
import { LoginPage } from './auth/LoginPage';
import { RegisterPage } from './auth/RegisterPage';
import { VerificationPage } from './verification/VerificationPage';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { AppShell } from './dashboard/AppShell';
import { USERS_DB } from './data';

export default function App() {
  const [lang, setLang]   = useState("ar");
  const [user, setUser]   = useState(null);        // logged-in user object
  const navigate = useNavigate();   // "login" | "register"
  const [regDone, setRegDone] = useState(false);   // show success banner on login

  function handleLogin(nid) {
    const user = USERS_DB[nid.trim()];
    if (user) {
      setUser(user);
      navigate('/dashboard/home');
    }
  }
  function handleLogout() {
    setUser(null);
    navigate('/login');
  }
  function handleRegDone() {
    setRegDone(true);
    navigate('/login');
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage lang={lang} setLang={setLang} />} />
      <Route path="/login" element={<LoginPage lang={lang} setLang={setLang} onLogin={handleLogin} showBanner={regDone} />} />
      <Route path="/register" element={<RegisterPage lang={lang} setLang={setLang} onDone={handleRegDone} />} />
      <Route path="/verify/:contractId" element={<VerificationPage lang={lang} setLang={setLang} />} />
      <Route 
        path="/dashboard/*" 
        element={
          <ProtectedRoute user={user}>
            <AppShell user={user} lang={lang} setLang={setLang} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
