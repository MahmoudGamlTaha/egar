import { useState } from 'react';
import { Link } from 'react-router-dom';
import { T } from '../translations';
import { Ico } from '../components/Icon';
import { AuthSide } from './AuthSide';
import { OtpInput } from './OtpInput';

export function RegisterPage({ lang, setLang, goLogin, onDone }) {
  const t  = T[lang];
  const ar = lang === "ar";
  const [regType, setRegType] = useState(null);   // "tenant" | "landlord"
  const [step, setStep]       = useState(0);       // 0=pick, 1..n=form, last=otp
  const [hasMulti, setHasMulti] = useState(null);
  const [otp, setOtp]         = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpOk, setOtpOk]     = useState(false);
  const [otpErr, setOtpErr]   = useState("");
  const [cd, setCd]           = useState(0);
  const [verifying, setVerifying] = useState(false);

  const isLandlord    = regType === "landlord";
  const stepLabels    = isLandlord ? t.reg.stepsL : t.reg.stepsT;
  const totalContent  = isLandlord ? 3 : 1;       // content steps (excl otp)
  const isOtpStep     = step === totalContent + 1;
  const stepperIndex  = step - 1;                  // 0-based for stepper

  function sendOtp() {
    setOtpSent(true); setOtp(""); setOtpErr(""); setCd(59);
    const iv = setInterval(() => setCd(c => { if (c <= 1) { clearInterval(iv); return 0; } return c - 1; }), 1000);
  }

  function goNext() {
    if (step === 0) { if (!regType) return; setStep(1); return; }
    if (step === totalContent) { setStep(totalContent + 1); setTimeout(sendOtp, 300); return; }
    setStep(s => s + 1);
  }

  function goBack() {
    if (step === 0) { goLogin(); return; }
    if (isOtpStep) { setOtpSent(false); setOtp(""); setOtpErr(""); }
    setStep(s => s - 1);
  }

  function verify() {
    setVerifying(true); setOtpErr("");
    setTimeout(() => {
      if (otp === "123456") {
        setOtpOk(true);
        setTimeout(() => onDone(), 2800);
      } else {
        setOtpErr(t.otp.wrong);
        setVerifying(false);
      }
    }, 900);
  }

  // ── Stepper ──
  function Stepper() {
    return (
      <div className="stepper">
        {stepLabels.map((lbl, i) => {
          const state = i < stepperIndex ? "done" : i === stepperIndex ? "active" : "future";
          return (
            <div key={i} className="step">
              {i < stepLabels.length - 1 && <div className={`step-line ${i < stepperIndex ? "done" : "future"}`} />}
              <div className={`step-dot ${state}`}>{state === "done" ? <Ico n="check" s={10} /> : i + 1}</div>
              <div className={`step-label ${state}`}>{lbl}</div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`auth-page ${lang}`} dir={t.dir} style={{ minHeight:"100vh", overflowY:"auto" }}>
      <AuthSide lang={lang} />
      <div className="auth-form-wrap">
        <div className="auth-card anim" style={{ maxWidth:500 }}>

          {/* top */}
          <div className="reg-top">
            <div>
              <div style={{ fontSize:17, fontWeight:800, color:"var(--t1)" }}>{t.reg.h}</div>
              <div style={{ fontSize:12, color:"var(--t3)", marginTop:1 }}>{t.app}</div>
            </div>
            <button className="lang-btn" onClick={() => setLang(l => l === "ar" ? "en" : "ar")}>
              <Ico n="globe" s={12} />{ar ? "English" : "عربي"}
            </button>
          </div>

          {/* stepper (only when type is chosen and past step 0) */}
          {regType && step > 0 && <Stepper />}

          {/* body */}
          <div className="reg-body">

            {/* STEP 0 — type pick */}
            {step === 0 && (
              <div className="anim">
                <p style={{ fontSize:13, color:"var(--t3)", marginBottom:12 }}>{t.reg.pick}</p>
                <div className="type-grid">
                  {["tenant", "landlord"].map(tp => (
                    <div key={tp} className={`type-card${regType === tp ? " on" : ""}`} onClick={() => setRegType(tp)}>
                      <div className="type-card-icon">{tp === "tenant" ? "🏠" : "🏗"}</div>
                      <div className="type-card-title">{t.reg[tp]}</div>
                      <div className="type-card-desc">{t.reg[`${tp}D`]}</div>
                    </div>
                  ))}
                </div>
                <div className="notice info"><Ico n="bell" s={13} />{t.reg.companyNote}</div>
              </div>
            )}

            {/* STEP 1 — personal */}
            {step === 1 && (
              <div className="anim">
                <div className="fgroup">
                  <div className="frow"><label className="flabel">{t.personal.name}</label><input className="finput" placeholder={ar?"الاسم الرباعي":"Full name"} /></div>
                  <div className="frow"><label className="flabel">{t.personal.nid}</label><input className="finput" placeholder="2XXXXXXXXXXX" /></div>
                  <div className="frow"><label className="flabel">{t.personal.dob}</label><input className="finput" type="date" /></div>
                  <div className="frow"><label className="flabel">{t.personal.gender}</label>
                    <select className="field-sel"><option value="">{ar?"اختر":"Select"}</option><option value="m">{t.personal.male}</option><option value="f">{t.personal.female}</option></select>
                  </div>
                  <div className="frow"><label className="flabel">{t.personal.phone}</label><input className="finput" placeholder="01XXXXXXXXX" /></div>
                  <div className="frow"><label className="flabel">{t.personal.email}</label><input className="finput" type="email" placeholder="user@mail.com" /></div>
                  <div className="frow fspan"><label className="flabel">{t.personal.address}</label><input className="finput" placeholder={ar?"رقم، شارع، حي":"Number, Street, District"} /></div>
                  <div className="frow"><label className="flabel">{t.personal.city}</label>
                    <select className="field-sel">{t.personal.cities.map(c => <option key={c}>{c}</option>)}</select>
                  </div>
                  <div className="frow"><label className="flabel">{t.personal.pw}</label><input className="finput" type="password" placeholder="••••••••" /></div>
                  <div className="frow"><label className="flabel">{t.personal.pw2}</label><input className="finput" type="password" placeholder="••••••••" /></div>
                </div>
              </div>
            )}

            {/* STEP 2 — property (landlord only) */}
            {step === 2 && isLandlord && (
              <div className="anim">
                <p style={{ fontSize:12, fontWeight:700, color:"var(--tl)", marginBottom:12 }}>{t.property.h}</p>
                <div className="fgroup">
                  <div className="frow"><label className="flabel">{t.property.type}</label>
                    <select className="field-sel">
                      {["apt","villa","office","shop","wh"].map(k => <option key={k}>{t.property[k]}</option>)}
                    </select>
                  </div>
                  <div className="frow"><label className="flabel">{t.property.bname}</label><input className="finput" placeholder={ar?"اسم المبنى":"Building name"} /></div>
                  <div className="frow"><label className="flabel">{t.property.unit}</label><input className="finput" placeholder="4B" /></div>
                  <div className="frow"><label className="flabel">{t.property.floor}</label><input className="finput" type="number" placeholder="3" /></div>
                  <div className="frow"><label className="flabel">{t.property.area}</label><input className="finput" type="number" placeholder="120" /></div>
                  <div className="frow"><label className="flabel">{t.property.city}</label>
                    <select className="field-sel">{t.personal.cities.map(c => <option key={c}>{c}</option>)}</select>
                  </div>
                  <div className="frow"><label className="flabel">{t.property.district}</label><input className="finput" placeholder={ar?"المعادي، الزمالك...":"Maadi, Zamalek..."} /></div>
                  <div className="frow"><label className="flabel">{t.property.deed}</label><input className="finput" placeholder="DOC-XXXXXX" /></div>
                  <div className="frow fspan"><label className="flabel">{t.property.address}</label><input className="finput" placeholder={ar?"العنوان التفصيلي":"Detailed address"} /></div>
                  <div className="frow"><label className="flabel">{t.property.rent}</label><input className="finput" type="number" placeholder="8500" /></div>
                  <div className="frow"><label className="flabel">{t.property.status}</label>
                    <select className="field-sel"><option value="available">{t.property.avail}</option><option value="occupied">{t.property.occ}</option></select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 — multiple/licensing (landlord only) */}
            {step === 3 && isLandlord && (
              <div className="anim">
                <p style={{ fontSize:13, fontWeight:700, color:"var(--t2)", marginBottom:12 }}>{t.multiple.h}</p>
                <div className="radio-group">
                  {[["yes", t.multiple.yes], ["no", t.multiple.no]].map(([v, lbl]) => (
                    <div key={v} className={`radio-opt${hasMulti === v ? " on" : ""}`} onClick={() => setHasMulti(v)}>
                      <div className="radio-circle">{hasMulti === v && <div className="radio-dot" />}</div>
                      <div className="radio-text">{lbl}</div>
                    </div>
                  ))}
                </div>
                {hasMulti === "yes" && (
                  <div className="fgroup anim">
                    <div className="frow"><label className="flabel">{t.multiple.num}</label><input className="finput" type="number" placeholder="5" /></div>
                    <div className="frow"><label className="flabel">{t.multiple.rega}</label><input className="finput" placeholder="REGA-XXXXXX" /></div>
                    <div className="frow"><label className="flabel">{t.multiple.tax}</label><input className="finput" placeholder="XXXXXXXXX" /></div>
                    <div className="frow"><label className="flabel">{t.multiple.actType}</label>
                      <select className="field-sel"><option value="ind">{t.multiple.ind}</option><option value="com">{t.multiple.com}</option></select>
                    </div>
                    <div className="frow fspan">
                      <label className="flabel">{t.multiple.docs}</label>
                      <div className="upload-zone"><Ico n="upload" s={20} /><div style={{ fontSize:12, color:"var(--t3)", marginTop:6 }}>{t.multiple.upload}</div><div style={{ fontSize:10, color:"var(--t4)", marginTop:3 }}>PDF · JPG · PNG — max 10MB</div></div>
                    </div>
                  </div>
                )}
                <div className="notice warn"><Ico n="bell" s={13} />{t.multiple.note}</div>
              </div>
            )}

            {/* OTP STEP */}
            {isOtpStep && (
              <div className="anim" style={{ textAlign:"center", padding:"10px 0" }}>
                {otpOk ? (
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:14, padding:"10px 0" }}>
                    <div style={{ width:72, height:72, borderRadius:"50%", background:"var(--gnbg)", border:"3px solid var(--gn)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:32 }}>✅</div>
                    <div style={{ fontSize:18, fontWeight:800, color:"var(--t1)" }}>{t.success.h}</div>
                    <div style={{ fontSize:13, color:"var(--t3)", lineHeight:1.6 }}>{t.success.body}</div>
                    <div style={{ display:"flex", alignItems:"center", gap:8, background:"var(--gnbg)", border:"1px solid rgba(5,150,105,.2)", borderRadius:"var(--r2)", padding:"10px 16px", color:"var(--gn)", fontSize:12, fontWeight:600 }}>
                      <div className="spin" style={{ borderColor:"rgba(5,150,105,.3)", borderTopColor:"var(--gn)" }} />
                      {t.otp.done}
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ fontSize:34, marginBottom:8 }}>📱</div>
                    <div style={{ fontSize:15, fontWeight:700, color:"var(--t1)", marginBottom:5 }}>{t.otp.h}</div>
                    <div style={{ fontSize:12, color:"var(--t3)" }}>{t.otp.sent}</div>
                    <div style={{ fontSize:14, fontWeight:700, color:"var(--tl)", margin:"4px 0 14px" }}>01XXXXXXXXX</div>
                    <div style={{ fontSize:12, color:"var(--t3)", marginBottom:2 }}>{t.otp.enter}</div>
                    <OtpInput value={otp} onChange={v => { setOtp(v); setOtpErr(""); }} />
                    {otpErr && <div style={{ fontSize:12, color:"var(--rd)", marginBottom:8 }}>{otpErr}</div>}
                    <div className="notice info" style={{ textAlign:"start" }}><Ico n="key" s={13} />{t.otp.hint}</div>
                    <div style={{ fontSize:12, color:"var(--t3)" }}>
                      {cd > 0 ? <>{t.otp.resendIn} <strong>{cd}</strong> {t.otp.sec}</> : <span className="lnk" onClick={sendOtp}>{t.otp.resend}</span>}
                    </div>
                  </>
                )}
              </div>
            )}

          </div>{/* /reg-body */}

          {/* footer buttons (hide after success) */}
          {!otpOk && (
            <div className="reg-foot">
              <button className="btn-ol" onClick={goBack}>
                <Ico n={ar ? "chevR" : "chevL"} s={12} />{t.reg.back}
              </button>
              {isOtpStep
                ? <button className="btn-tl" onClick={verify} disabled={otp.length < 6 || verifying}>
                    {verifying ? <><div className="spin" />{t.otp.verifying}</> : t.otp.verify}
                  </button>
                : <button className="btn-tl" onClick={goNext} disabled={step === 0 && !regType}>
                    {t.reg.next} →
                  </button>
              }
            </div>
          )}

          <div className="lcard-foot">{t.reg.have}{" "}<Link to="/login" className="lnk">{t.reg.login}</Link></div>
        </div>
      </div>
    </div>
  );
}
