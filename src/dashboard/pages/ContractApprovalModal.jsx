import { useState } from 'react';
import { T } from '../../translations';
import { Ico } from '../../components/Icon';
import { Pill } from '../../components/Pill';

export function ContractApprovalModal({ contract, lang, onClose, onApprove, onReject, role }) {
  const t = T[lang];
  const w = t.wallet;
  const ar = lang === "ar";
  const isLandlord = role === 'landlord' || role === 'company';
  const [step, setStep] = useState('review'); // 'review' | 'payment' | 'schedule' | 'done'
  const [card, setCard] = useState({ num: '', expiry: '', cvv: '', name: '' });
  const [paying, setPaying] = useState(false);

  if (!contract) return null;

  const isRes = contract.type === "residential";
  const plan = contract.paymentPlan || 'monthly';
  const planLabel = t.property[plan] || plan;

  /* ── Fee calculation (1% of annual rent + 200 platform + 14% VAT) — landlord only ── */
  const contractFee  = Math.round(contract.rent * 12 * 0.01);
  const platformFee  = 200;
  const subtotal     = contractFee + platformFee;
  const taxFee       = Math.round(subtotal * 0.14);
  const totalFee     = subtotal + taxFee;

  /* ── Payment schedule generation — tenant only ── */
  function genSchedule() {
    const s = new Date(contract.start), e = new Date(contract.end);
    const rows = [];
    const monthsPerPeriod = { monthly: 1, quarterly: 3, semi: 6, yearly: 12 }[plan] || 1;
    const amountPerPeriod = contract.rent * monthsPerPeriod;
    let cur = new Date(s); let i = 1;
    while (cur < e) {
      const next = new Date(cur); next.setMonth(next.getMonth() + monthsPerPeriod);
      const periodEnd = next < e ? next : e;
      rows.push({
        i, period: `${cur.toLocaleDateString(ar?'ar-EG':'en-US',{year:'numeric',month:'short'})} → ${periodEnd.toLocaleDateString(ar?'ar-EG':'en-US',{year:'numeric',month:'short'})}`,
        due: `${cur.getFullYear()}-${String(cur.getMonth()+1).padStart(2,'0')}-${String(cur.getDate()).padStart(2,'0')}`,
        amount: amountPerPeriod,
      });
      cur = next; i++;
    }
    return rows;
  }
  const schedule = genSchedule();

  function handlePay() {
    setPaying(true);
    setTimeout(() => { setPaying(false); setStep('done'); setTimeout(() => onApprove(), 1800); }, 1800);
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content anim" style={{ maxWidth: 560, padding: 0, overflow: 'auto', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}>

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
        <div style={{ padding: '20px 24px', flex: 1, overflow: 'auto' }}>

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

        {/* ── Payment Step (Landlord pays fees) ── */}
        {step === 'payment' && isLandlord && (
          <div style={{ padding: '0 24px 4px', borderTop: '1px solid var(--b1)' }}>
            {/* Fees breakdown */}
            <div style={{ margin: '16px 0 12px', background: 'var(--w1)', border: '1px solid var(--b1)', borderRadius: 'var(--r2)', overflow: 'hidden' }}>
              <div style={{ padding: '8px 12px', background: 'linear-gradient(135deg,#1a4a6e,#0c2d48)', color: '#fff', fontSize: 11, fontWeight: 700 }}>
                {ar ? 'تفاصيل الرسوم' : 'Fee Breakdown'}
              </div>
              {[
                [w.contractFee, contractFee],
                [w.platformFee, platformFee],
                [w.taxFee,      taxFee],
              ].map(([label, val]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 12px', borderBottom: '1px solid var(--b1)', fontSize: 12 }}>
                  <span style={{ color: 'var(--t2)' }}>{label}</span>
                  <span style={{ fontWeight: 700 }}>{val.toLocaleString()} {t.cur}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 12px', background: 'var(--tlbg)', fontSize: 13, fontWeight: 800 }}>
                <span style={{ color: 'var(--tl)' }}>{w.total}</span>
                <span style={{ color: 'var(--tl)' }}>{totalFee.toLocaleString()} {t.cur}</span>
              </div>
            </div>
            {/* Card form */}
            <div style={{ display: 'grid', gap: 10, paddingBottom: 4 }}>
              <div>
                <label className="flabel">{w.cardNum}</label>
                <input className="finput" placeholder="1234 5678 9012 3456" maxLength={19}
                  value={card.num}
                  onChange={e => setCard({ ...card, num: e.target.value.replace(/\D/g,'').replace(/(.{4})/g,'$1 ').trim() })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label className="flabel">{w.expiry}</label>
                  <input className="finput" placeholder="MM/YY" maxLength={5} value={card.expiry} onChange={e => setCard({ ...card, expiry: e.target.value })} />
                </div>
                <div>
                  <label className="flabel">{w.cvv}</label>
                  <input className="finput" placeholder="123" maxLength={3} type="password" value={card.cvv} onChange={e => setCard({ ...card, cvv: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="flabel">{w.cardName}</label>
                <input className="finput" placeholder={ar ? 'الاسم كما على البطاقة' : 'Name as on card'} value={card.name} onChange={e => setCard({ ...card, name: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                {['VISA','MC','Meza'].map(b => (
                  <span key={b} style={{ padding: '2px 8px', border: '1px solid var(--b2)', borderRadius: 4, fontSize: 10, fontWeight: 800, color: 'var(--t2)', background: 'var(--w1)' }}>{b}</span>
                ))}
                <span style={{ fontSize: 9, color: 'var(--t4)', marginRight: 'auto' }}><Ico n="key" s={9} /> {ar ? 'دفع آمن' : 'Secure'}</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Schedule Step (Tenant sees payment schedule) ── */}
        {step === 'schedule' && !isLandlord && (
          <div style={{ padding: '0 24px 4px', borderTop: '1px solid var(--b1)' }}>
            <div style={{ margin: '16px 0 12px', background: 'var(--w1)', border: '1px solid var(--b1)', borderRadius: 'var(--r2)', padding: '12px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tl)' }}>{t.property.paymentPlan}: {planLabel}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)' }}>{schedule.length} {ar ? 'دفعة' : 'payments'}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--t3)', marginBottom: 8 }}>
                {ar ? `كل دفعة: ${contract.rent * ({monthly:1,quarterly:3,semi:6,yearly:12}[plan]||1)} ${t.cur}` : `Each payment: ${contract.rent * ({monthly:1,quarterly:3,semi:6,yearly:12}[plan]||1)} ${t.cur}`}
              </div>
            </div>
            <div style={{ maxHeight: 200, overflow: 'auto', borderRadius: 'var(--r2)', border: '1px solid var(--b1)' }}>
              <table style={{ fontSize: 11 }}>
                <thead>
                  <tr style={{ background: 'var(--w0)' }}>
                    <th style={{ padding: '6px 8px' }}>#</th>
                    <th style={{ padding: '6px 8px' }}>{ar ? 'الفترة' : 'Period'}</th>
                    <th style={{ padding: '6px 8px' }}>{ar ? 'تاريخ الاستحقاق' : 'Due Date'}</th>
                    <th style={{ padding: '6px 8px', textAlign: 'right' }}>{ar ? 'المبلغ' : 'Amount'}</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map(r => (
                    <tr key={r.i} style={{ borderBottom: '1px solid var(--b1)' }}>
                      <td style={{ padding: '5px 8px', fontWeight: 700 }}>{r.i}</td>
                      <td style={{ padding: '5px 8px' }}>{r.period}</td>
                      <td style={{ padding: '5px 8px', fontFamily: 'monospace' }}>{r.due}</td>
                      <td style={{ padding: '5px 8px', textAlign: 'right', fontWeight: 700, color: 'var(--tl)' }}>{r.amount.toLocaleString()} {t.cur}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 10, padding: '8px 12px', background: 'var(--am)', borderRadius: 'var(--r2)', color: '#fff', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Ico n="bell" s={12} />{ar ? 'سيتم إضافة جدول السداد لصفحة المدفوعات بعد القبول' : 'Payment schedule will be added to your Payments page after acceptance'}
            </div>
          </div>
        )}

        {/* ── Done Step ── */}
        {step === 'done' && (
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 10 }}>✅</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--gn)', marginBottom: 4 }}>{w.paySuccess}</div>
            <div style={{ fontSize: 12, color: 'var(--t3)' }}>{ar ? 'جارٍ تفعيل العقد...' : 'Activating contract...'}</div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}><div className="spin" style={{ borderColor: 'rgba(5,150,105,.3)', borderTopColor: 'var(--gn)' }} /></div>
          </div>
        )}

        {/* ── Footer ── */}
        {step !== 'done' && (
          <div style={{
            padding: '16px 24px', borderTop: '1px solid var(--b1)',
            display: 'flex', justifyContent: 'flex-end', gap: 10, background: 'var(--w1)',
            flexShrink: 0,
          }}>
            {step === 'review' && (
              <>
                <button onClick={onReject} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 20px',
                  borderRadius: 'var(--r2)', border: '1.5px solid var(--rd)', background: 'rgba(220,38,38,0.06)',
                  color: 'var(--rd)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  <Ico n="x" s={13} />{ar ? "رفض" : "Reject"}
                </button>
                {isLandlord ? (
                  <button onClick={() => setStep('payment')} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 20px',
                    borderRadius: 'var(--r2)', border: 'none', background: 'var(--gn)',
                    color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                  }}>
                    <Ico n="check" s={13} />{ar ? "موافقة ودفع الرسوم" : "Approve & Pay Fees"}
                  </button>
                ) : (
                  <button onClick={() => setStep('schedule')} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 20px',
                    borderRadius: 'var(--r2)', border: 'none', background: 'var(--gn)',
                    color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                  }}>
                    <Ico n="payments" s={13} />{ar ? "عرض جدول السداد" : "View Payment Schedule"}
                  </button>
                )}
              </>
            )}
            {step === 'schedule' && !isLandlord && (
              <>
                <button onClick={() => setStep('review')} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 20px',
                  borderRadius: 'var(--r2)', border: '1px solid var(--b2)', background: 'var(--w1)',
                  color: 'var(--t2)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  <Ico n={ar ? 'chevR' : 'chevL'} s={13} />{ar ? 'رجوع' : 'Back'}
                </button>
                <button onClick={() => { setStep('done'); setTimeout(() => onApprove(), 1800); }} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 20px',
                  borderRadius: 'var(--r2)', border: 'none', background: 'var(--gn)',
                  color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  <Ico n="check" s={13} />{ar ? "قبول العقد" : "Accept Contract"}
                </button>
              </>
            )}
            {step === 'payment' && isLandlord && (
              <>
                <button onClick={() => setStep('review')} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 20px',
                  borderRadius: 'var(--r2)', border: '1px solid var(--b2)', background: 'var(--w1)',
                  color: 'var(--t2)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  <Ico n={ar ? 'chevR' : 'chevL'} s={13} />{ar ? 'رجوع' : 'Back'}
                </button>
                <button onClick={handlePay}
                  disabled={paying || !card.num || !card.expiry || !card.cvv || !card.name}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 22px',
                    borderRadius: 'var(--r2)', border: 'none', background: '#1a4a6e',
                    color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                    opacity: (!card.num || !card.expiry || !card.cvv || !card.name) ? .5 : 1,
                  }}>
                  {paying ? <><div className="spin" />{w.paying}</> : <><Ico n="payments" s={13} />{w.payNow} — {totalFee.toLocaleString()} {t.cur}</>}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
