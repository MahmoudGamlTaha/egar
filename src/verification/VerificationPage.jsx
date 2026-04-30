import { useParams } from 'react-router-dom';
import { T } from '../translations';
import { Ico } from '../components/Icon';
import { CONTRACTS } from '../data';
import { Pill } from '../components/Pill';

export function VerificationPage({ lang, setLang }) {
  const { contractId } = useParams();
  const t = T[lang];
  const ar = lang === 'ar';

  const contract = CONTRACTS.find(c => c.id === contractId);

  const renderDetail = (label, value) => (
    <div className="detail-item">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value}</span>
    </div>
  );

  return (
    <div className={`verification-page ${lang}`} dir={t.dir}>
      <header className="landing-header">
        <div className="landing-logo">
          <span className="landing-icon">إ</span>
          <h1>{t.app}</h1>
        </div>
        <button className="lang-btn" onClick={() => setLang(ar ? 'en' : 'ar')}>
          <Ico n="globe" s={14} /> {ar ? 'English' : 'العربية'}
        </button>
      </header>

      <main className="verification-main">
        {contract ? (
          <div className="verification-card">
            <div className="verification-header">
              <Ico n="checkCircle" s={48} style={{ color: 'var(--gn)' }} />
              <h2>{ar ? 'عقد موثق' : 'Verified Contract'}</h2>
            </div>
            <div className="details-grid">
              {renderDetail(t.tbl.id, contract.id)}
              {renderDetail(t.tbl.property, contract.property)}
              {renderDetail(t.tbl.tenant, contract.tenant)}
              {renderDetail(t.tbl.rent, `${contract.rent.toLocaleString()} ${t.cur}`)}
              {renderDetail(t.tbl.start, contract.start_date)}
              {renderDetail(t.tbl.end, contract.end_date)}
              <div className="detail-item">
                <span className="detail-label">{t.tbl.status}</span>
                <Pill s={contract.status} lang={lang} />
              </div>
            </div>
          </div>
        ) : (
          <div className="verification-card not-found">
            <Ico n="xCircle" s={48} style={{ color: 'var(--rd)' }} />
            <h2>{ar ? 'العقد غير موجود' : 'Contract Not Found'}</h2>
            <p>{ar ? 'الرقم المرجعي للعقد غير صحيح أو تم حذفه.' : 'The contract reference number is invalid or has been deleted.'}</p>
          </div>
        )}
      </main>
    </div>
  );
}
