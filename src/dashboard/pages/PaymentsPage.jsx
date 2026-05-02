import { useState } from 'react';
import { T } from '../../translations';
import { Ico } from '../../components/Icon';
import { Pill } from '../../components/Pill';
import { PAYMENTS, CONTRACTS } from '../../data';

export function PaymentsPage({ lang }) {
  const t = T[lang]; const cur = t.cur; const ar = lang === "ar";
  const [payingId, setPayingId] = useState(null);
  const [paidIds, setPaidIds] = useState(new Set());

  /* ── Generate scheduled payments from active contracts ── */
  const activeContracts = CONTRACTS.filter(c => c.status === 'active');
  const scheduledPayments = [];
  let payIdx = 1;
  activeContracts.forEach(c => {
    const plan = c.paymentPlan || 'monthly';
    const monthsPerPeriod = { monthly: 1, quarterly: 3, semi: 6, yearly: 12 }[plan] || 1;
    const amountPerPeriod = c.rent * monthsPerPeriod;
    const s = new Date(c.start), e = new Date(c.end);
    let cur2 = new Date(s); let i = 1;
    while (cur2 < e) {
      const next = new Date(cur2); next.setMonth(next.getMonth() + monthsPerPeriod);
      const dueDate = new Date(cur2);
      const isPast = dueDate < new Date();
      const payId = `SCH-${c.id}-${i}`;
      const isPaid = paidIds.has(payId);
      scheduledPayments.push({
        id: payId,
        contract: c.id,
        tenant: c.tenant,
        property: c.property,
        plan: t.property[plan] || plan,
        periodNum: i,
        amount: amountPerPeriod,
        due: `${dueDate.getFullYear()}-${String(dueDate.getMonth()+1).padStart(2,'0')}-${String(dueDate.getDate()).padStart(2,'0')}`,
        status: isPaid ? 'paid' : isPast ? 'overdue' : 'pending',
      });
      cur2 = next; i++; payIdx++;
    }
  });

  /* Merge with existing PAYMENTS data */
  const allPayments = [...PAYMENTS, ...scheduledPayments];

  function handlePay(payId) {
    setPayingId(payId);
    setTimeout(() => { setPaidIds(prev => new Set([...prev, payId])); setPayingId(null); }, 1500);
  }

  const totalDue = allPayments.filter(p => p.status === 'pending' || p.status === 'overdue').reduce((s, p) => s + p.amount, 0);
  const totalPaid = allPayments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);

  return (
    <div className="anim">
      <div style={{ marginBottom: 14 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 2 }}>{t.nav.payments}</h2>
        <p style={{ fontSize: 11, color: 'var(--t4)' }}>{ar ? 'جدول سداد الإيجارات المستحقة' : 'Scheduled rent payments'}</p>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 6 }}>{ar ? 'إجمالي المستحق' : 'Total Due'}</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--am)' }}>{totalDue.toLocaleString()} <span style={{ fontSize: 11 }}>{cur}</span></div>
        </div>
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 6 }}>{ar ? 'المدفوع' : 'Paid'}</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--gn)' }}>{totalPaid.toLocaleString()} <span style={{ fontSize: 11 }}>{cur}</span></div>
        </div>
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 6 }}>{ar ? 'عدد العقود النشطة' : 'Active Contracts'}</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--tl)' }}>{activeContracts.length}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div className="card-title"><Ico n="payments" s={14} />{t.nav.payments}</div>
          <div style={{ display: "flex", gap: 7 }}>
            <div className="searchbox"><Ico n="search" s={13} /><input placeholder={t.tbl.search} /></div>
            <button className="btn-ol"><Ico n="download" s={12} />{t.tbl.export}</button>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>{t.tbl.id}</th><th>{t.tbl.property}</th><th>{ar ? 'خطة السداد' : 'Plan'}</th><th>{t.tbl.amount}</th><th>{t.tbl.due}</th><th>{t.tbl.status}</th><th>{t.tbl.action}</th></tr></thead>
            <tbody>
              {allPayments.map(r => (
                <tr key={r.id}>
                  <td><span className="mono" style={{ fontSize: 10 }}>{r.id}</span></td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 12 }}>{r.property || r.tenant}</div>
                    <div style={{ fontSize: 10, color: 'var(--t4)' }} className="mono">{r.contract}</div>
                  </td>
                  <td><span style={{
                    padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700,
                    background: 'var(--tlbg)', color: 'var(--tl)',
                  }}>{r.plan || '—'}</span></td>
                  <td style={{ fontWeight: 700, color: r.status === 'paid' ? 'var(--gn)' : r.status === 'overdue' ? 'var(--rd)' : 'var(--t1)' }}>
                    {r.amount.toLocaleString()} {cur}
                  </td>
                  <td className="mono">{r.due}</td>
                  <td><Pill s={r.status} lang={lang} /></td>
                  <td>
                    {r.status === 'paid' ? (
                      <span style={{ fontSize: 10, color: 'var(--gn)', fontWeight: 700 }}>✓</span>
                    ) : (
                      <button className="btn-tl" style={{ padding: '4px 12px', fontSize: 10, fontWeight: 700 }}
                        onClick={() => handlePay(r.id)} disabled={payingId === r.id}>
                        {payingId === r.id ? <><div className="spin" style={{ width: 10, height: 10 }} />{ar ? 'جارٍ الدفع...' : 'Paying...'}</> : (ar ? 'ادفع' : 'Pay')}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
