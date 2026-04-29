import { T } from '../../translations';
import { Ico } from '../../components/Icon';

export function NewPropertyPage({ lang, onBack }) {
  const t = T[lang]; const ar = lang === "ar";
  return (
    <div className="anim" style={{ maxWidth:860 }}>
      <div style={{ marginBottom:14 }}>
        <button className="btn-ol" onClick={onBack}><Ico n={ar?"chevR":"chevL"} s={12} />{t.back}</button>
      </div>
      <h2 style={{ fontSize:18, fontWeight:800, marginBottom:4 }}>{ar ? "إضافة عقار جديد" : "Add New Property"}</h2>
      <p style={{ fontSize:11, color:"var(--t4)", marginBottom:18 }}>{ar ? "أكمل البيانات ثم اضغط حفظ" : "Complete the details then click save"}</p>
      <div className="card">
        <div className="card-head"><div className="card-title"><Ico n="properties" s={14} />{ar?"بيانات العقار":"Property Details"}</div></div>
        <div className="card-body">
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
      </div>
      <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:16 }}>
        <button className="btn-ol" onClick={onBack}>{ar?"إلغاء":"Cancel"}</button>
        <button className="btn-tl"><Ico n="check" s={12} />{ar?"حفظ":"Save"}</button>
      </div>
    </div>
  );
}
