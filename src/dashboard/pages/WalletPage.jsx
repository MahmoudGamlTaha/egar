import { useState } from 'react';
import { T } from '../../translations';
import { Ico } from '../../components/Icon';

const MOCK_TXS = [
  { id:'TX-001', type:'in',  label:'إيجار شقة 4B — يناير',       labelEn:'Rent — Apt 4B — January',    amount:8500,  date:'2025-01-05', status:'paid' },
  { id:'TX-002', type:'out', label:'رسوم تسجيل عقد EJR-2025-0041', labelEn:'Contract Fee EJR-2025-0041', amount:450,   date:'2025-01-01', status:'paid' },
  { id:'TX-003', type:'in',  label:'إيجار شقة 4B — فبراير',        labelEn:'Rent — Apt 4B — February',   amount:8500,  date:'2025-02-05', status:'paid' },
  { id:'TX-004', type:'out', label:'رسوم المنصة — فبراير',          labelEn:'Platform Fee — February',    amount:85,    date:'2025-02-01', status:'paid' },
  { id:'TX-005', type:'in',  label:'إيجار شقة 4B — مارس',          labelEn:'Rent — Apt 4B — March',      amount:8500,  date:'2025-03-05', status:'paid' },
  { id:'TX-006', type:'out', label:'سحب إلى الحساب البنكي',         labelEn:'Withdrawal to Bank',         amount:15000, date:'2025-03-10', status:'paid' },
];

const BALANCE = 18415;

export function WalletPage({ lang }) {
  const t = T[lang];
  const w = t.wallet;
  const ar = lang === 'ar';
  const [showTopup, setShowTopup] = useState(false);
  const [topupAmt, setTopupAmt] = useState('');
  const [card, setCard] = useState({ num: '', expiry: '', cvv: '', name: '' });
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  function handlePay() {
    setPaying(true);
    setTimeout(() => { setPaying(false); setPaid(true); setTimeout(() => { setPaid(false); setShowTopup(false); setCard({ num:'', expiry:'', cvv:'', name:'' }); setTopupAmt(''); }, 2000); }, 1800);
  }

  const totalIn  = MOCK_TXS.filter(tx => tx.type === 'in').reduce((s, tx) => s + tx.amount, 0);
  const totalOut = MOCK_TXS.filter(tx => tx.type === 'out').reduce((s, tx) => s + tx.amount, 0);

  return (
    <div className="anim">
      <div style={{ marginBottom: 14 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 2 }}>{w.title}</h2>
        <p style={{ fontSize: 11, color: 'var(--t4)' }}>{ar ? 'إدارة رصيدك ومعاملاتك المالية' : 'Manage your balance and financial transactions'}</p>
      </div>

      {/* ── Balance + Stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
        {/* Balance card */}
        <div style={{
          background: 'linear-gradient(135deg, #1a4a6e 0%, #0c2d48 100%)',
          borderRadius: 'var(--r3)', padding: '20px 22px', color: '#fff', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,.05)' }} />
          <div style={{ position: 'absolute', bottom: -30, left: -10, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,.04)' }} />
          <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.6)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{w.balance}</div>
          <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1 }}>
            {BALANCE.toLocaleString()} <span style={{ fontSize: 14, fontWeight: 600, opacity: .7 }}>{t.cur}</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button onClick={() => setShowTopup(true)} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '7px 16px', borderRadius: 'var(--r2)', border: 'none',
              background: '#fff', color: '#1a4a6e', fontSize: 11, fontWeight: 800, cursor: 'pointer',
            }}>
              <Ico n="plus" s={11} />{w.topup}
            </button>
            <button style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '7px 16px', borderRadius: 'var(--r2)', border: '1px solid rgba(255,255,255,.3)',
              background: 'transparent', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer',
            }}>
              <Ico n="download" s={11} />{w.withdraw}
            </button>
          </div>
        </div>
        {/* Total in */}
        <div className="card" style={{ padding: '18px 16px' }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--gn)', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 6 }}>{w.in}</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--gn)' }}>+{totalIn.toLocaleString()}</div>
          <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 4 }}>{t.cur}</div>
        </div>
        {/* Total out */}
        <div className="card" style={{ padding: '18px 16px' }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--rd)', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 6 }}>{w.out}</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--rd)' }}>-{totalOut.toLocaleString()}</div>
          <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 4 }}>{t.cur}</div>
        </div>
      </div>

      {/* ── Transaction History ── */}
      <div className="card">
        <div className="card-head">
          <div className="card-title"><Ico n="payments" s={14} />{w.txHistory}</div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t.tbl.id}</th>
                <th>{ar ? 'البيان' : 'Description'}</th>
                <th>{ar ? 'التاريخ' : 'Date'}</th>
                <th>{ar ? 'النوع' : 'Type'}</th>
                <th>{t.tbl.amount}</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_TXS.map(tx => (
                <tr key={tx.id}>
                  <td><span className="mono">{tx.id}</span></td>
                  <td style={{ fontSize: 12 }}>{ar ? tx.label : tx.labelEn}</td>
                  <td className="mono">{tx.date}</td>
                  <td>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700,
                      background: tx.type === 'in' ? 'var(--gnbg)' : 'rgba(220,38,38,.08)',
                      color: tx.type === 'in' ? 'var(--gn)' : 'var(--rd)',
                    }}>
                      {tx.type === 'in' ? '+' : '-'} {tx.type === 'in' ? w.in : w.out}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700, color: tx.type === 'in' ? 'var(--gn)' : 'var(--rd)' }}>
                    {tx.type === 'in' ? '+' : '-'}{tx.amount.toLocaleString()} {t.cur}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Top Up Modal ── */}
      {showTopup && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowTopup(false)}>
          <div className="modal-content anim" style={{ maxWidth: 420, padding: 0, overflow: 'hidden' }}>
            <div style={{ height: 4, background: 'linear-gradient(90deg, #1a4a6e, #0891B2)' }} />
            <div className="modal-header">
              <h2 style={{ fontSize: 15, fontWeight: 800 }}>{w.topup}</h2>
              <button className="btn-icon" onClick={() => setShowTopup(false)}><Ico n="x" s={15} /></button>
            </div>
            <div className="modal-body">
              {paid ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: 48, marginBottom: 10 }}>✅</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--gn)' }}>{w.paySuccess}</div>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: 12 }}>
                  {/* Amount */}
                  <div>
                    <label className="flabel">{ar ? 'المبلغ' : 'Amount'} ({t.cur})</label>
                    <input className="finput" type="number" placeholder="1000" value={topupAmt} onChange={e => setTopupAmt(e.target.value)} />
                  </div>
                  {/* Card number */}
                  <div>
                    <label className="flabel">{w.cardNum}</label>
                    <input className="finput" placeholder="1234 5678 9012 3456" maxLength={19}
                      value={card.num}
                      onChange={e => setCard({ ...card, num: e.target.value.replace(/\D/g,'').replace(/(.{4})/g,'$1 ').trim() })} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <label className="flabel">{w.expiry}</label>
                      <input className="finput" placeholder="MM/YY" maxLength={5}
                        value={card.expiry}
                        onChange={e => setCard({ ...card, expiry: e.target.value })} />
                    </div>
                    <div>
                      <label className="flabel">{w.cvv}</label>
                      <input className="finput" placeholder="123" maxLength={3} type="password"
                        value={card.cvv}
                        onChange={e => setCard({ ...card, cvv: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="flabel">{w.cardName}</label>
                    <input className="finput" placeholder={ar ? 'الاسم كما على البطاقة' : 'Name as on card'}
                      value={card.name}
                      onChange={e => setCard({ ...card, name: e.target.value })} />
                  </div>
                  {/* Card icons row */}
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '8px 0', borderTop: '1px solid var(--b1)' }}>
                    {['VISA', 'MC', 'Meza'].map(brand => (
                      <span key={brand} style={{
                        padding: '3px 10px', borderRadius: 4, border: '1px solid var(--b2)',
                        fontSize: 10, fontWeight: 800, color: 'var(--t2)', background: 'var(--w1)',
                      }}>{brand}</span>
                    ))}
                    <span style={{ fontSize: 10, color: 'var(--t4)', marginRight: 'auto' }}>
                      <Ico n="key" s={10} /> {ar ? 'مدفوعات آمنة' : 'Secure payment'}
                    </span>
                  </div>
                </div>
              )}
            </div>
            {!paid && (
              <div className="modal-footer">
                <button className="btn-ol" onClick={() => setShowTopup(false)}>{ar ? 'إلغاء' : 'Cancel'}</button>
                <button className="btn-tl" onClick={handlePay}
                  disabled={paying || !topupAmt || !card.num || !card.expiry || !card.cvv || !card.name}
                  style={{ background: '#1a4a6e', minWidth: 110 }}>
                  {paying ? <><div className="spin" />{w.paying}</> : <><Ico n="payments" s={12} />{w.payNow} {topupAmt ? `${Number(topupAmt).toLocaleString()} ${t.cur}` : ''}</>}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
