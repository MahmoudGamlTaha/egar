import { useState } from 'react';
import { T } from '../../translations';
import { Ico } from '../../components/Icon';

export function NewPropertyPage({ lang, onBack }) {
  const t = T[lang]; const ar = lang === "ar";
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    type: 'apt', bname: '', unit: '', floor: '', area: '', city: t.personal.cities[0],
    district: '', deed: '', address: '', natAddress: '', rent: '', status: 'available',
    ownerDocs: null,
  });

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function handleSave() {
    setSaving(true);
    setTimeout(() => { setSaving(false); setSaved(true); }, 1500);
  }

  if (saved) {
    return (
      <div className="anim" style={{ textAlign: 'center', padding: '40px 0' }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%', background: 'var(--gnbg)',
          border: '3px solid var(--gn)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 32, margin: '0 auto 20px',
        }}>✅</div>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>
          {ar ? 'تم حفظ العقار بنجاح' : 'Property Saved Successfully'}
        </h2>
        <p style={{ fontSize: 13, color: 'var(--t3)', marginBottom: 8 }}>
          {ar ? 'سيتم مراجعة المستندات ووثيقة الملكية خلال 24 ساعة' : 'Documents and ownership proof will be reviewed within 24 hours'}
        </p>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'var(--gnbg)', border: '1px solid rgba(5,150,105,.2)',
          borderRadius: 'var(--r2)', padding: '10px 16px', color: 'var(--gn)',
          fontSize: 12, fontWeight: 600, marginBottom: 24,
        }}>
          <Ico n="bell" s={13} />{ar ? 'في انتظار التحقق' : 'Pending Verification'}
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button className="btn-ol" onClick={onBack}>{ar ? 'العودة للعقارات' : 'Back to Properties'}</button>
          <button className="btn-tl" onClick={() => { setSaved(false); setForm({ type:'apt', bname:'', unit:'', floor:'', area:'', city:t.personal.cities[0], district:'', deed:'', address:'', natAddress:'', rent:'', status:'available', ownerDocs:null }); }}>
            <Ico n="plus" s={12} />{ar ? 'إضافة عقار آخر' : 'Add Another'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="anim" style={{ maxWidth: 860 }}>
      <div style={{ marginBottom: 14 }}>
        <button className="btn-ol" onClick={onBack}><Ico n={ar ? "chevR" : "chevL"} s={12} />{t.back}</button>
      </div>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>{ar ? "إضافة عقار جديد" : "Add New Property"}</h2>
      <p style={{ fontSize: 11, color: "var(--t4)", marginBottom: 18 }}>{ar ? "أكمل البيانات ثم اضغط حفظ" : "Complete the details then click save"}</p>

      <div className="card" style={{ marginBottom: 12 }}>
        <div className="card-head"><div className="card-title"><Ico n="properties" s={14} />{ar ? "بيانات العقار" : "Property Details"}</div></div>
        <div className="card-body">
          <div className="fgroup">
            <div className="frow"><label className="flabel">{t.property.type}</label>
              <select className="field-sel" value={form.type} onChange={e => set('type', e.target.value)}>
                {["apt", "villa", "office", "shop", "wh"].map(k => <option key={k} value={k}>{t.property[k]}</option>)}
              </select>
            </div>
            <div className="frow"><label className="flabel">{t.property.bname}</label><input className="finput" placeholder={ar ? "اسم المبنى" : "Building name"} value={form.bname} onChange={e => set('bname', e.target.value)} /></div>
            <div className="frow"><label className="flabel">{t.property.unit}</label><input className="finput" placeholder="4B" value={form.unit} onChange={e => set('unit', e.target.value)} /></div>
            <div className="frow"><label className="flabel">{t.property.floor}</label><input className="finput" type="number" placeholder="3" value={form.floor} onChange={e => set('floor', e.target.value)} /></div>
            <div className="frow"><label className="flabel">{t.property.area}</label><input className="finput" type="number" placeholder="120" value={form.area} onChange={e => set('area', e.target.value)} /></div>
            <div className="frow"><label className="flabel">{t.property.city}</label>
              <select className="field-sel" value={form.city} onChange={e => set('city', e.target.value)}>{t.personal.cities.map(c => <option key={c}>{c}</option>)}</select>
            </div>
            <div className="frow"><label className="flabel">{t.property.district}</label><input className="finput" placeholder={ar ? "المعادي، الزمالك..." : "Maadi, Zamalek..."} value={form.district} onChange={e => set('district', e.target.value)} /></div>
            <div className="frow"><label className="flabel">{t.property.deed}</label><input className="finput" placeholder="DOC-XXXXXX" value={form.deed} onChange={e => set('deed', e.target.value)} /></div>
            <div className="frow fspan"><label className="flabel">{t.property.address}</label><input className="finput" placeholder={ar ? "العنوان التفصيلي" : "Detailed address"} value={form.address} onChange={e => set('address', e.target.value)} /></div>
            <div className="frow fspan">
              <label className="flabel">{t.personal.natAddress}</label>
              <input className="finput" placeholder={t.personal.natAddressHint} maxLength={12} value={form.natAddress} onChange={e => set('natAddress', e.target.value)} />
            </div>
            <div className="frow"><label className="flabel">{t.property.rent}</label><input className="finput" type="number" placeholder="8500" value={form.rent} onChange={e => set('rent', e.target.value)} /></div>
            <div className="frow"><label className="flabel">{t.property.status}</label>
              <select className="field-sel" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="available">{t.property.avail}</option>
                <option value="occupied">{t.property.occ}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Ownership docs upload */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="card-head"><div className="card-title"><Ico n="upload" s={14} />{t.property.ownerDocs}</div></div>
        <div className="card-body">
          <label className="upload-zone" style={{ cursor: 'pointer' }}>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" multiple style={{ display: 'none' }}
              onChange={e => set('ownerDocs', e.target.files)} />
            <Ico n="upload" s={20} />
            <div style={{ fontSize: 12, color: "var(--t3)", marginTop: 6 }}>{t.property.ownerDocsHint}</div>
            <div style={{ fontSize: 10, color: "var(--t4)", marginTop: 3 }}>PDF · JPG · PNG — max 10MB</div>
          </label>
          {form.ownerDocs && form.ownerDocs.length > 0 && (
            <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {Array.from(form.ownerDocs).map((f, i) => (
                <span key={i} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  padding: '4px 10px', background: 'var(--tlbg)', border: '1px solid var(--tl)',
                  borderRadius: 'var(--r2)', fontSize: 11, fontWeight: 600, color: 'var(--tl)',
                }}>
                  <Ico n="file" s={10} />{f.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
        <button className="btn-ol" onClick={onBack}>{ar ? "إلغاء" : "Cancel"}</button>
        <button className="btn-tl" onClick={handleSave} disabled={saving || !form.bname || !form.deed}>
          {saving ? <><div className="spin" />{ar ? 'جارٍ الحفظ...' : 'Saving...'}</> : <><Ico n="check" s={12} />{ar ? "حفظ" : "Save"}</>}
        </button>
      </div>
    </div>
  );
}
