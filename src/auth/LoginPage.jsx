import { useState } from 'react';
import { Link } from 'react-router-dom';
import { T } from '../translations';
import { Ico } from '../components/Icon';
import { AuthSide } from './AuthSide';

export function LoginPage({ onLogin, onSwitch, lang, setLang, showBanner }) {
  const t = T[lang].login;
  const [nid, setNid] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleLogin(e) {
    e.preventDefault();
    if (!nid) return setError('errId');
    if (!pw) return setError('errPw');
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin(nid);
    }, 800);
  }

  return (
    <div className={`auth-page ${lang}`} dir={T[lang].dir}>
      <AuthSide lang={lang} />
      <div className="auth-form-wrap anim">
      <div className="auth-card">
        <div className="lcard-top">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
            <div className="lcard-logo">
              <span className="lcard-icon">{lang === 'ar' ? 'إ' : 'E'}</span>
              <div>
                <h2 className="lcard-name">{T[lang].app}</h2>
                <p className="lcard-sub">{T[lang].sub}</p>
              </div>
            </div>
            <button className="lang-btn" onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}>
              <Ico n="globe" s={14} /> {lang === 'ar' ? 'English' : 'العربية'}
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin}>
          <div className="lcard-body">
            {showBanner && <div className="banner anim"><Ico n="check" s={16}/> {T[lang].regBanner}</div>}
            <h3 style={{fontSize:18, fontWeight:700, marginBottom:4}}>{t.h}</h3>
            <div className="hint-box">
              <Ico n="key" s={20} />
              <span>{t.hint}</span>
            </div>
            <div className="field">
              <label className="field-label" htmlFor="nid">{t.nid}</label>
              <input id="nid" type="text" className={`field-input ${error === 'errId' ? 'bad' : ''}`} value={nid} onChange={e => setNid(e.target.value)} />
              {error === 'errId' && <p className="err-msg"><Ico n="x" s={14}/> {t.errId}</p>}
            </div>
            <div className="field">
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <label className="field-label" htmlFor="pw">{t.pw}</label>
                <a className="lnk" style={{fontSize:11}}>{t.forgot}</a>
              </div>
              <input id="pw" type="password" className={`field-input ${error === 'errPw' ? 'bad' : ''}`} value={pw} onChange={e => setPw(e.target.value)} />
              {error === 'errPw' && <p className="err-msg"><Ico n="x" s={14}/> {t.errPw}</p>}
            </div>
            {error === 'errWrong' && <p className="err-msg anim" style={{justifyContent:'center'}}>{t.errWrong}</p>}
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading && <div className="spin"></div>}
              {loading ? t.loading : t.btn}
            </button>
          </div>
        </form>

        <div className="lcard-foot">
          {t.noAcc} <Link to="/register" className="lnk">{t.reg}</Link>
        </div>
      </div>
    </div>
    </div>
  );
}
