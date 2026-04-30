import { useParams, useNavigate } from 'react-router-dom';
import { T } from '../../translations';
import { Ico } from '../../components/Icon';
import { Pill } from '../../components/Pill';
import { PROPS, CONTRACTS } from '../../data';

export function PropertyHistoryPage({ lang }) {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const t = T[lang];
  const ar = lang === "ar";

  const property = PROPS.find(p => p.id === propertyId);
  const history = CONTRACTS.filter(c => c.propertyId === propertyId);

  if (!property) {
    return (
      <div className="anim" style={{ textAlign: 'center', padding: 40 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--rd)' }}>{ar ? 'العقار غير موجود' : 'Property Not Found'}</h2>
        <button className="btn-tl" style={{ marginTop: 16 }} onClick={() => navigate(-1)}>{ar ? 'العودة' : 'Go Back'}</button>
      </div>
    );
  }

  const totalRent = history.reduce((sum, c) => sum + c.rent, 0);
  const activeContracts = history.filter(c => c.status === 'active').length;
  const pendingContracts = history.filter(c => c.status === 'pending').length;

  return (
    <div className="anim">
      <div style={{ marginBottom: 14 }}>
        <button className="btn-ol" onClick={() => navigate(-1)}><Ico n={ar ? "chevR" : "chevL"} s={12} />{t.back}</button>
      </div>

      {/* Property info card */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-head">
          <div className="card-title"><Ico n="building" s={14} />{ar ? 'بيانات العقار' : 'Property Info'}</div>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', marginBottom: 3 }}>{ar ? 'اسم المبنى' : 'Building'}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>{property.building}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', marginBottom: 3 }}>{ar ? 'الوحدة' : 'Unit'}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>{property.unit} — {ar ? 'الدور' : 'Floor'} {property.floor === 0 ? (ar ? 'أرضي' : 'Ground') : property.floor}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', marginBottom: 3 }}>{ar ? 'المنطقة' : 'District'}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>{property.district} — {property.city}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="metrics-grid" style={{ marginBottom: 16 }}>
        <div className="metric tl">
          <div className="metric-icon tl"><Ico n="contracts" s={16} /></div>
          <div className="metric-label">{ar ? 'إجمالي العقود' : 'Total Contracts'}</div>
          <div className="metric-value">{history.length}</div>
        </div>
        <div className="metric gn">
          <div className="metric-icon gn"><Ico n="check" s={16} /></div>
          <div className="metric-label">{ar ? 'عقود نشطة' : 'Active'}</div>
          <div className="metric-value">{activeContracts}</div>
        </div>
        <div className="metric am">
          <div className="metric-icon am"><Ico n="bell" s={16} /></div>
          <div className="metric-label">{ar ? 'بانتظار الموافقة' : 'Pending'}</div>
          <div className="metric-value">{pendingContracts}</div>
        </div>
        <div className="metric bl">
          <div className="metric-icon bl"><Ico n="money" s={16} /></div>
          <div className="metric-label">{ar ? 'إجمالي الإيجارات' : 'Total Rent'}</div>
          <div className="metric-value">{totalRent.toLocaleString()} {t.cur}</div>
        </div>
      </div>

      {/* Rental history timeline */}
      <div className="card">
        <div className="card-head">
          <div className="card-title"><Ico n="reports" s={14} />{ar ? 'سجل الإيجارات' : 'Rental History'}</div>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 30, color: 'var(--t3)', fontSize: 13 }}>
              {ar ? 'لا توجد عقود مسجلة لهذا العقار' : 'No contracts recorded for this property'}
            </div>
          ) : (
            <div className="timeline">
              {history
                .sort((a, b) => b.start.localeCompare(a.start))
                .map((c, i) => (
                  <div key={c.id} className="timeline-item">
                    <div className="timeline-dot-wrap">
                      <div className={`timeline-dot ${c.status}`} />
                      {i < history.length - 1 && <div className="timeline-line" />}
                    </div>
                    <div className="timeline-content">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <div>
                          <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--t1)' }}>{c.id}</span>
                          <Pill s={c.status} lang={lang} />
                        </div>
                        <span style={{ fontSize: 11, color: 'var(--t4)' }}>{c.start} → {c.end}</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        <div>
                          <span style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 600 }}>{ar ? 'المستأجر:' : 'Tenant:'}</span>
                          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--t1)', marginLeft: 4 }}>{c.tenant}</span>
                        </div>
                        <div>
                          <span style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 600 }}>{ar ? 'المؤجر:' : 'Landlord:'}</span>
                          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--t1)', marginLeft: 4 }}>{c.landlord}</span>
                        </div>
                        <div>
                          <span style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 600 }}>{ar ? 'الإيجار:' : 'Rent:'}</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tl)', marginLeft: 4 }}>{c.rent.toLocaleString()} {t.cur}</span>
                        </div>
                        <div>
                          <span style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 600 }}>{ar ? 'التأمين:' : 'Deposit:'}</span>
                          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--t1)', marginLeft: 4 }}>{c.deposit.toLocaleString()} {t.cur}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
