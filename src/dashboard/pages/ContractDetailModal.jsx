import { T } from '../../translations';
import { Ico } from '../../components/Icon';
import { Pill } from '../../components/Pill';

export function ContractDetailModal({ contract, lang, onClose }) {
  const t = T[lang];
  const ar = lang === "ar";

  if (!contract) return null;

  const rows = [
    [ar ? "رقم العقد" : "Contract ID", contract.id],
    [ar ? "النوع" : "Type", contract.type === "residential" ? (ar ? "سكني" : "Residential") : (ar ? "تجاري" : "Commercial")],
    [ar ? "المؤجر" : "Landlord", contract.landlord],
    [ar ? "المستأجر" : "Tenant", contract.tenant],
    [ar ? "العقار" : "Property", contract.property],
    [ar ? "المدينة" : "City", contract.city],
    [ar ? "الإيجار الشهري" : "Monthly Rent", `${contract.rent.toLocaleString()} ${t.cur}`],
    [ar ? "مبلغ التأمين" : "Deposit", `${contract.deposit.toLocaleString()} ${t.cur}`],
    [ar ? "تاريخ البدء" : "Start Date", contract.start],
    [ar ? "تاريخ الانتهاء" : "End Date", contract.end],
    [ar ? "الحالة" : "Status", <Pill s={contract.status} lang={lang} />],
  ];

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content anim" style={{ maxWidth: 520 }}>
        <div className="modal-header">
          <h2 style={{ fontSize: 16, fontWeight: 800 }}>{ar ? "تفاصيل العقد" : "Contract Details"}</h2>
          <button onClick={onClose} className="btn-icon"><Ico n="x" s={16} /></button>
        </div>
        <div className="modal-body">
          <div style={{ display: 'grid', gap: 0 }}>
            {rows.map(([label, value], i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 0',
                borderBottom: i < rows.length - 1 ? '1px solid var(--b1)' : 'none',
              }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--t3)' }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-ol" onClick={onClose}>{ar ? "إغلاق" : "Close"}</button>
        </div>
      </div>
    </div>
  );
}
