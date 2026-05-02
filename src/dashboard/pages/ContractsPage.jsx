import { useState } from 'react';
import { T } from '../../translations';
import { Ico } from '../../components/Icon';
import { Pill } from '../../components/Pill';
import { CONTRACTS } from '../../data';
import { ContractApprovalModal } from './ContractApprovalModal';
import { ContractDetailModal } from './ContractDetailModal';
import { ContractDocument } from './ContractDocument';
import { useNavigate } from 'react-router-dom';

export function ContractsPage({ lang, role }) {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState(CONTRACTS);
  const [selectedContract, setSelectedContract] = useState(null);
  const [detailContract, setDetailContract] = useState(null);
  const [docContract, setDocContract] = useState(null);
  const t = T[lang]; const cur = t.cur; const ar = lang === "ar";

  function handleRowClick(r) {
    if (r.status === 'pending') {
      setSelectedContract(r);
    } else {
      setDetailContract(r);
    }
  }

  return (
    <div className="anim">
      <div style={{ marginBottom:14 }}>
        <h2 style={{ fontSize:18, fontWeight:800, marginBottom:2 }}>{t.nav.contracts}</h2>
        <p style={{ fontSize:11, color:"var(--t4)" }}>{ar ? "إدارة جميع العقود المسجلة" : "Manage all registered contracts"}</p>
      </div>
      <div className="card">
        <div className="card-head">
          <div className="card-title"><Ico n="contracts" s={14} />{t.nav.contracts} <span style={{ fontWeight:400, fontSize:11, color:"var(--t4)" }}>({contracts.length})</span></div>
          <div style={{ display:"flex", gap:7, flexWrap:"wrap", alignItems:"center" }}>
            <div className="searchbox"><Ico n="search" s={13} /><input placeholder={t.tbl.search} /></div>
            <button className="btn-ol btn-sm"><Ico n="filter" s={12} />{t.tbl.filter}</button>
            <button className="btn-ol"><Ico n="download" s={12} />{t.tbl.export}</button>
            <button className="btn-tl" onClick={() => navigate('/dashboard/contracts/new')}><Ico n="plus" s={12} />{t.tbl.new}</button>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>{t.tbl.id}</th><th>{t.tbl.type}</th><th>{t.tbl.property}</th><th>{t.tbl.tenant}</th><th>{t.tbl.rent}</th><th>{t.tbl.start}</th><th>{t.tbl.end}</th><th>{t.tbl.deposit}</th><th>{t.tbl.status}</th><th>{t.tbl.action}</th></tr></thead>
            <tbody>
              {contracts.map(r => (
                <tr key={r.id} onClick={() => handleRowClick(r)} style={{ cursor: 'pointer' }}>
                  <td><span className="mono">{r.id}</span></td>
                  <td><span className={`pill ${r.type === "residential" ? "active" : "pending"}`} style={{ fontSize:9 }}>{r.type === "residential" ? (ar?"سكني":"Res.") : (ar?"تجاري":"Com.")}</span></td>
                  <td><div style={{ fontWeight:500, fontSize:12 }}>{r.property}</div><div style={{ fontSize:10, color:"var(--t4)" }}>{r.city}</div></td>
                  <td style={{ fontSize:12 }}>{r.tenant}</td>
                  <td style={{ fontWeight:700, color:"var(--tl)" }}>{r.rent.toLocaleString()} {cur}</td>
                  <td className="mono">{r.start}</td>
                  <td className="mono">{r.end}</td>
                  <td style={{ fontSize:12 }}>{r.deposit.toLocaleString()} {cur}</td>
                  <td><Pill s={r.status} lang={lang} /></td>
                  <td>
                    <div style={{ display:"flex", gap:2 }}>
                      <button className="btn-icon" onClick={e => { e.stopPropagation(); handleRowClick(r); }}><Ico n="eye" s={12} /></button>
                      <button className="btn-icon" onClick={e => e.stopPropagation()}><Ico n="edit" s={12} /></button>
                      {r.status === 'active' && <button className="btn-icon" onClick={e => { e.stopPropagation(); setDocContract(r); }} title={ar ? 'مستند العقد' : 'Contract Document'} style={{ color: 'var(--tl)' }}><Ico n="file" s={12} /></button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selectedContract && (
        <ContractApprovalModal
          contract={selectedContract}
          lang={lang}
          role={role}
          onClose={() => setSelectedContract(null)}
          onApprove={() => {
            setContracts(contracts.map(c => c.id === selectedContract.id ? { ...c, status: 'active' } : c));
            setSelectedContract(null);
          }}
          onReject={() => {
            setContracts(contracts.map(c => c.id === selectedContract.id ? { ...c, status: 'terminated' } : c));
            setSelectedContract(null);
          }}
        />
      )}
      {detailContract && (
        <ContractDetailModal 
          contract={detailContract} 
          lang={lang} 
          onClose={() => setDetailContract(null)}
          onViewDoc={c => { setDetailContract(null); setDocContract(c); }}
        />
      )}
      {docContract && (
        <ContractDocument
          contract={docContract}
          lang={lang}
          onClose={() => setDocContract(null)}
        />
      )}
    </div>
  );
}
