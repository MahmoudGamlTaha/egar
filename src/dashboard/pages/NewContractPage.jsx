import { useState, useRef } from 'react';
import { T } from '../../translations';
import { Ico } from '../../components/Icon';

import { useNavigate } from 'react-router-dom';

export function NewContractPage({ user, lang }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [creationMode, setCreationMode] = useState(null); // 'upload' or 'fill'
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);
  const t = T[lang];
  const ar = lang === "ar";

  if (submitted) {
    return (
      <div className="anim" style={{ textAlign: "center", padding: "40px 0" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--gnbg)", border: "3px solid var(--gn)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 20px" }}>✅</div>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>{ar ? "تم إرسال العقد" : "Contract Sent"}</h2>
        <p style={{ fontSize: 13, color: "var(--t3)", marginBottom: 24 }}>{ar ? "في انتظار موافقة المستأجر" : "Waiting for tenant approval"}</p>
        <button className="btn-tl" onClick={() => navigate('/dashboard/contracts')}>{ar ? "العودة للعقود" : "Back to Contracts"}</button>
      </div>
    );
  }

  if (!creationMode) {
    return (
      <div className="anim" style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center', paddingTop: 40 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>{ar ? "إنشاء عقد إيجار جديد" : "New Lease Contract"}</h2>
        <p style={{ fontSize: 13, color: "var(--t3)", marginBottom: 24 }}>{ar ? "اختر طريقة إنشاء العقد" : "Choose how to create the contract"}</p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <button className="btn-tl" onClick={() => setCreationMode('fill')}>
            <Ico n="edit" s={14} /> {ar ? "تعبئة البيانات يدوياً" : "Fill Manually"}
          </button>
          <button className="btn-ol" onClick={() => setCreationMode('upload')}>
            <Ico n="upload" s={14} /> {ar ? "رفع ملف العقد" : "Upload Contract File"}
          </button>
        </div>
      </div>
    );
  }

  if (creationMode === 'upload') {
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setUploadedFile(file);
      }
    };

    const handleDragOver = (e) => {
      e.preventDefault();
    };

    const handleDrop = (e) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) {
        setUploadedFile(file);
      }
    };

    return (
      <div className="anim" style={{ maxWidth: 500, margin: '0 auto', paddingTop: 40 }}>
        <div style={{ marginBottom:14 }}>
          <button className="btn-ol" onClick={() => setCreationMode(null)}><Ico n={ar?"chevR":"chevL"} s={12} />{t.back}</button>
        </div>
        <h2 style={{ fontSize:18, fontWeight:800, marginBottom:4 }}>{ar ? "رفع ملف العقد" : "Upload Contract File"}</h2>
        <p style={{ fontSize:11, color:"var(--t4)", marginBottom:18 }}>{ar ? "ارفع ملف PDF الخاص بالعقد" : "Upload the contract PDF file"}</p>
        <div className="card" onDragOver={handleDragOver} onDrop={handleDrop}>
          <div className="card-body" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="application/pdf" />
            {uploadedFile ? (
              <>
                <div style={{ marginBottom: 16 }}><Ico n="file" s={32} c="var(--tl)" /></div>
                <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{uploadedFile.name}</p>
                <button className="btn-ol" onClick={() => setUploadedFile(null)}>{ar ? "إزالة الملف" : "Remove File"}</button>
              </>
            ) : (
              <>
                <div style={{ marginBottom: 16 }}><Ico n="upload" s={32} c="var(--t3)" /></div>
                <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{ar ? "اسحب وأفلت الملف هنا" : "Drag & drop file here"}</p>
                <p style={{ fontSize: 12, color: "var(--t3)", marginBottom: 16 }}>{ar ? "أو" : "or"}</p>
                <button className="btn-ol" onClick={() => fileInputRef.current.click()}>{ar ? "اختر ملف" : "Browse file"}</button>
              </>
            )}
          </div>
        </div>
        <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop: 24 }}>
          <button className="btn-tl" onClick={() => setSubmitted(true)} disabled={!uploadedFile}><Ico n="check" s={12} />{ar?"إرسال للتوقيع":"Send for Signing"}</button>
        </div>
      </div>
    );
  }

  const stepLabels = [ar?"العقار":"Property", ar?"الأطراف":"Parties", ar?"الشروط":"Terms"];

  function Stepper() {
    return (
      <div className="stepper" style={{marginBottom: 24}}>
        {stepLabels.map((lbl, i) => {
          const state = i + 1 < step ? "done" : i + 1 === step ? "active" : "future";
          return (
            <div key={i} className="step">
              {i < stepLabels.length - 1 && <div className={`step-line ${i + 1 < step ? "done" : "future"}`} />}
              <div className={`step-dot ${state}`}>{state === "done" ? <Ico n="check" s={10} /> : i + 1}</div>
              <div className={`step-label ${state}`}>{lbl}</div>
            </div>
          );
        })}
      </div>
    );
  }
  return (
    <div className="anim" style={{ maxWidth:860 }}>
      <div style={{ marginBottom:14 }}>
        <button className="btn-ol" onClick={() => navigate(-1)}><Ico n={ar?"chevR":"chevL"} s={12} />{t.back}</button>
      </div>
      <h2 style={{ fontSize:18, fontWeight:800, marginBottom:4 }}>{ar ? "إنشاء عقد إيجار جديد" : "New Lease Contract"}</h2>
      <p style={{ fontSize:11, color:"var(--t4)", marginBottom:18 }}>{ar ? "أكمل البيانات ثم أرسل للتوقيع الرقمي" : "Complete details then send for digital signing"}</p>
      <Stepper />
      {step === 1 && (
        <div className="card anim" style={{ marginBottom:12 }}>
          <div className="card-head"><div className="card-title"><Ico n="properties" s={14} />{ar?"بيانات العقار":"Property Details"}</div></div>
          <div className="card-body">
            <div className="fgroup">
              <div className="frow"><label className="flabel">{ar?"نوع العقد":"Contract Type"}</label><select className="field-sel"><option>{ar?"سكني — شقة":"Residential"}</option><option>{ar?"سكني — فيلا":"Residential — Villa"}</option><option>{ar?"تجاري — مكتب":"Commercial — Office"}</option></select></div>
              <div className="frow"><label className="flabel">{ar?"المدينة":"City"}</label><select className="field-sel">{T[lang].personal.cities.map(c=><option key={c}>{c}</option>)}</select></div>
              <div className="frow fspan"><label className="flabel">{ar?"رقم الوحدة الوطني":"National Unit ID"}</label><input className="finput" placeholder="EG-CAI-0012-U44B" /></div>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }} className="anim">
          <div className="card">
            <div className="card-head"><div className="card-title"><Ico n="users" s={14} />{ar?"المستأجر":"Tenant"}</div></div>
            <div className="card-body" style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <div className="frow"><label className="flabel">{ar?"الاسم":"Name"}</label><input className="finput" /></div>
              <div className="frow"><label className="flabel">{ar?"رقم الهوية":"NID"}</label><input className="finput" placeholder="2XXXXXXXXXXX" /></div>
              <div className="frow"><label className="flabel">{ar?"الهاتف":"Phone"}</label><input className="finput" placeholder="01XXXXXXXXX" /></div>
            </div>
          </div>
          <div className="card">
            <div className="card-head"><div className="card-title"><Ico n="building" s={14} />{ar?"المؤجر":"Landlord"}</div></div>
            <div className="card-body" style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <div className="frow"><label className="flabel">{ar?"الاسم":"Name"}</label><input disabled className="finput" defaultValue={user.name} /></div>
              <div className="frow"><label className="flabel">{ar?"رقم الهوية":"NID"}</label><input disabled className="finput" defaultValue={user.nid} /></div>
              <div className="frow"><label className="flabel">{ar?"الهاتف":"Phone"}</label><input disabled className="finput" defaultValue={user.phone} /></div>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="card anim" style={{ marginBottom:16 }}>
          <div className="card-head"><div className="card-title"><Ico n="money" s={14} />{ar?"الشروط المالية":"Financial Terms"}</div></div>
          <div className="card-body">
            <div className="fgroup">
              <div className="frow"><label className="flabel">{ar?"الإيجار الشهري ج.م":"Monthly Rent EGP"}</label><input className="finput" type="number" placeholder="8500" /></div>
              <div className="frow"><label className="flabel">{ar?"مبلغ التأمين":"Deposit"}</label><input className="finput" type="number" placeholder="17000" /></div>
              <div className="frow"><label className="flabel">{ar?"تاريخ البداية":"Start Date"}</label><input className="finput" type="date" /></div>
              <div className="frow"><label className="flabel">{ar?"المدة":"Duration"}</label><select className="field-sel"><option>12 {ar?"شهراً":"mo"}</option><option>24 {ar?"شهراً":"mo"}</option><option>36 {ar?"شهراً":"mo"}</option></select></div>
              <div className="frow"><label className="flabel">{ar?"يوم السداد":"Pay Day"}</label><select className="field-sel"><option>{ar?"أول الشهر":"1st"}</option><option>{ar?"الخامس عشر":"15th"}</option></select></div>
              <div className="frow"><label className="flabel">{ar?"فترة الإشعار":"Notice Period"}</label><select className="field-sel"><option>30</option><option>60</option><option>90</option></select></div>
            </div>
          </div>
        </div>
      )}
      <div style={{ display:"flex", gap:8, justifyContent:"space-between", marginTop: 24 }}>
        <button className="btn-ol" onClick={() => step > 1 ? setStep(step - 1) : onBack()}>
          <Ico n={ar?"chevR":"chevL"} s={12} />{t.reg.back}
        </button>
        {step < 3 ? (
          <button className="btn-tl" onClick={() => setStep(step + 1)}>
            {t.reg.next} →
          </button>
        ) : (
          <button className="btn-tl" onClick={() => setSubmitted(true)}><Ico n="check" s={12} />{ar?"إرسال للتوقيع":"Send for Signing"}</button>
        )}
      </div>
    </div>
  );
}
