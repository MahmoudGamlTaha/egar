import { useState } from 'react';
import { LoginPage } from './auth/LoginPage';
import { RegisterPage } from './auth/RegisterPage';
import { AppShell } from './dashboard/AppShell';
import { USERS_DB } from './data';

export default function App() {
  const [lang, setLang]   = useState("ar");
  const [user, setUser]   = useState(null);        // logged-in user object
  const [screen, setScreen] = useState("login");   // "login" | "register"
  const [regDone, setRegDone] = useState(false);   // show success banner on login

  function handleLogin(nid)  { 
    const user = USERS_DB[nid.trim()];
    if (user) {
      setUser(user); 
      setRegDone(false); 
    }
  }
  function handleLogout()  { setUser(null); setScreen("login"); }
  function handleRegDone() { setRegDone(true); setScreen("login"); }

  return (
    <>
      {user ? (
        <AppShell user={user} lang={lang} setLang={setLang} onLogout={handleLogout} />
      ) : screen === "register" ? (
        <RegisterPage lang={lang} setLang={setLang} goLogin={() => setScreen("login")} onDone={handleRegDone} />
      ) : (
        <LoginPage lang={lang} setLang={setLang} onLogin={handleLogin} onSwitch={() => { setRegDone(false); setScreen("register"); }} showBanner={regDone} />
      )}
    </>
  );
}
