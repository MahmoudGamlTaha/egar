import { T } from '../../translations';
import { Ico } from '../../components/Icon';
import { Pill } from '../../components/Pill';

export function ContractApprovalModal({ contract, lang, onClose, onApprove, onReject }) {
  const t = T[lang];
  const ar = lang === "ar";

  if (!contract) return null;

  const isRes = contract.type === "residential";

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content anim" style={{ maxWidth: 560, padding: 0, overflow: 'hidden' }}>

        {/* ── Accent top bar ── */}
        <div style={{ height: 4, background: 'linear-gradient(90deg, var(--tl), var(--am))' }} />

        {/* ── Header ── */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--b1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 'var(--r2)', background: 'var(--tlbg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Ico n="contracts" s={16} />
                </div>
                <h2 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>
                  {ar ? "طلب موافقة على عقد إيجار" : "Rental Contract Approval Request"}
                </h2>
              </div>
              <div style={{ fontSize: 12, color: 'var(--t3)', marginRight: 46 }}>
                <span className="mono" style={{ fontWeight: 700, color: 'var(--tl)' }}>{contract.id}</span>
                <span style={{ margin: '0 6px' }}>•</span>
                <Pill s={contract.status} lang={lang} />
                <span style={{ margin: '0 6px' }}>•</span>
                <span className={`pill ${isRes ? "active" : "pending"}`} style={{ fontSize: 9 }}>
                  {isRes ? (ar ? "سكني" : "Residential") : (ar ? "تجاري" : "Commercial")}
                </span>
              </div>
            </div>
            <button onClick={onClose} className="btn-icon"><Ico n="x" s={16} /></button>
          </div>
        </div>

        {/* ── Body ── */}
        <div style={{ padding: '20px 24px' }}>

          {/* Parties section */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18,
          }}>
            {/* Landlord */}
            <div style={{
              background: 'var(--w1)', border: '1px solid var(--b1)', borderRadius: 'var(--r2)',
              padding: '12px 14px',
            }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
                {ar ? "المؤجر" : "Landlord"}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%', background: 'var(--tlbg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: 'var(--tl)', flexShrink: 0,
                }}>
                  {contract.landlord.charAt(0)}
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>{contract.landlord}</span>
              </div>
            </div>
            {/* Tenant */}
            <div style={{
              background: 'var(--w1)', border: '1px solid var(--b1)', borderRadius: 'var(--r2)',
              padding: '12px 14px',
            }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
                {ar ? "المستأجر" : "Tenant"}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%', background: 'rgba(8,145,178,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: '#0891B2', flexShrink: 0,
                }}>
                  {contract.tenant.charAt(0)}
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>{contract.tenant}</span>
              </div>
            </div>
          </div>

          {/* Property */}
          <div style={{
            background: 'var(--w1)', border: '1px solid var(--b1)', borderRadius: 'var(--r2)',
            padding: '12px 14px', marginBottom: 18,
          }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
              {ar ? "العقار" : "Property"}
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>{contract.property}</div>
            <div style={{ fontSize: 11, color: 'var(--t4)', marginTop: 2 }}>{contract.city}</div>
          </div>

          {/* Monthly rent — highlighted */}
          <div style={{
            background: 'linear-gradient(135deg, var(--tlbg), rgba(8,145,178,0.06))',
            border: '1px solid var(--tl)', borderRadius: 'var(--r2)',
            padding: '14px 16px', marginBottom: 12,
          }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--tl)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
              {ar ? "الإيجار الشهري" : "Monthly Rent"}
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--tl)' }}>
              {contract.rent.toLocaleString()} <span style={{ fontSize: 13, fontWeight: 600 }}>{t.cur}</span>
            </div>
          </div>

          {/* Period box — from → to + calculated duration */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(217,119,6,0.08), rgba(217,119,6,0.03))',
            border: '1px solid var(--am)', borderRadius: 'var(--r2)',
            padding: '14px 16px', marginBottom: 12,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--am)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {ar ? "فترة العقد" : "Contract Period"}
              </div>
              {(() => {
                const ms = new Date(contract.end) - new Date(contract.start);
                const totalDays = Math.round(ms / 86400000);
                const totalMonths = Math.round(totalDays / 30.44);
                const years = Math.floor(totalMonths / 12);
                const months = totalMonths % 12;
                let label = '';
                if (totalDays < 30) {
                  label = ar ? `${totalDays} يوم` : `${totalDays} day${totalDays !== 1 ? 's' : ''}`;
                } else if (years === 0) {
                  label = ar ? `${months} شهر` : `${months} month${months !== 1 ? 's' : ''}`;
                } else if (months === 0) {
                  label = ar ? `${years} سنة` : `${years} year${years !== 1 ? 's' : ''}`;
                } else {
                  label = ar ? `${years} سنة و ${months} شهر` : `${years} yr${years !== 1 ? 's' : ''} ${months} mo`;
                }
                return (
                  <span style={{
                    background: 'var(--am)', color: '#fff', borderRadius: 'var(--r2)',
                    padding: '3px 10px', fontSize: 11, fontWeight: 700,
                  }}>
                    {label}
                  </span>
                );
              })()}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              {/* From */}
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--t3)', marginBottom: 4 }}>{ar ? "من" : "From"}</div>
                <div style={{
                  background: 'var(--w0)', border: '1px solid var(--b1)', borderRadius: 'var(--r2)',
                  padding: '8px 12px', fontSize: 15, fontWeight: 700, color: 'var(--t1)',
                  fontFamily: 'monospace',
                }}>
                  {contract.start}
                </div>
              </div>
              {/* Arrow */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 44, height: 44, flexShrink: 0,
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', background: 'var(--am)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Ico n={ar ? "chevL" : "chevR"} s={14} />
                </div>
              </div>
              {/* To */}
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--t3)', marginBottom: 4 }}>{ar ? "إلى" : "To"}</div>
                <div style={{
                  background: 'var(--w0)', border: '1px solid var(--b1)', borderRadius: 'var(--r2)',
                  padding: '8px 12px', fontSize: 15, fontWeight: 700, color: 'var(--t1)',
                  fontFamily: 'monospace',
                }}>
                  {contract.end}
                </div>
              </div>
            </div>
          </div>

          {/* Deposit */}
          <div style={{
            background: 'var(--w1)', border: '1px solid var(--b1)', borderRadius: 'var(--r2)',
            padding: '12px 14px', marginBottom: 18,
          }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
              {ar ? "مبلغ التأمين" : "Deposit"}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)' }}>
              {contract.deposit.toLocaleString()} <span style={{ fontSize: 11, fontWeight: 500 }}>{t.cur}</span>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{
          padding: '16px 24px', borderTop: '1px solid var(--b1)',
          display: 'flex', justifyContent: 'flex-end', gap: 10, background: 'var(--w1)',
        }}>
          <button
            onClick={onReject}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '9px 20px', borderRadius: 'var(--r2)',
              border: '1.5px solid var(--rd)', background: 'rgba(220,38,38,0.06)',
              color: 'var(--rd)', fontSize: 13, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'inherit', transition: 'all .15s',
            }}
          >
            <Ico n="x" s={13} />
            {ar ? "رفض" : "Reject"}
          </button>
          <button
            onClick={onApprove}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '9px 20px', borderRadius: 'var(--r2)',
              border: 'none', background: 'var(--gn)',
              color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'inherit', transition: 'all .15s',
            }}
          >
            <Ico n="check" s={13} />
            {ar ? "موافقة" : "Approve"}
          </button>
        </div>
      </div>
    </div>
  );
}
