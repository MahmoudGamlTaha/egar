import { T } from '../translations';
import { Ico } from '../components/Icon';

export function AuthSide({ lang }) {
  const t = T[lang];
  const ar = lang === "ar";
  const feats = ar
    ? ["توثيق العقود رقمياً مع هيئة الشهر العقاري","تحصيل الإيجار عبر InstaPay وفوري","إدارة محفظتك العقارية بالكامل","متابعة الصيانة والنزاعات إلكترونياً"]
    : ["Digital contract notarization","Instant rent collection via InstaPay","Full portfolio management","Maintenance & dispute tracking"];
  return (
    <div className="auth-side">
      <div className="auth-side-grid"></div>
      <div className="auth-side-inner">
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
          <span className="lcard-icon" style={{fontSize:22, borderRadius:12, width:48, height:48}}>{ar ? "إ":"E"}</span>
          <div>
            <h1 style={{color:"#fff", fontSize:20, fontWeight:800}}>{t.app}</h1>
            <p style={{color:"rgba(255,255,255,.5)", fontSize:12, marginTop:2}}>{t.sub}</p>
          </div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {feats.map(f => (
            <div key={f} style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
              <Ico n="check" s={16} />
              <span style={{ color:"rgba(255,255,255,.7)", fontSize:13, lineHeight:1.5 }}>{f}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
