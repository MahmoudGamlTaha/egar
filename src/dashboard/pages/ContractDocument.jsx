import { useRef } from 'react';
import { Ico } from '../../components/Icon';

/* ── helpers ── */
function pad2(n) { return String(n).padStart(2, '0'); }
function periodLabel(start, end, ar) {
  const ms = new Date(end) - new Date(start);
  const totalDays = Math.round(ms / 86400000);
  const totalMonths = Math.round(totalDays / 30.44);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  if (totalDays < 30) return ar ? `${totalDays} يوم` : `${totalDays} day${totalDays > 1 ? 's' : ''}`;
  if (years === 0) return ar ? `${months} شهر` : `${months} month${months > 1 ? 's' : ''}`;
  if (months === 0) return ar ? `${years} سنة` : `${years} year${years > 1 ? 's' : ''}`;
  return ar ? `${years} سنة و ${months} شهر` : `${years} yr${years > 1 ? 's' : ''} ${months} mo`;
}
function genPayments(start, end, rent) {
  const s = new Date(start), e = new Date(end);
  const rows = [];
  let cur = new Date(s);
  let i = 1;
  while (cur < e) {
    const next = new Date(cur); next.setMonth(next.getMonth() + 1);
    const due = new Date(cur); due.setDate(1);
    const deadline = new Date(due); deadline.setDate(5);
    const periodEnd = next < e ? next : e;
    rows.push({
      i,
      period: `${pad2(cur.getMonth() + 1)}/${cur.getFullYear()} — ${pad2(periodEnd.getMonth() + 1)}/${periodEnd.getFullYear()}`,
      dueAd: `${due.getFullYear()}-${pad2(due.getMonth() + 1)}-01`,
      deadline: `${deadline.getFullYear()}-${pad2(deadline.getMonth() + 1)}-05`,
      amount: rent,
    });
    cur = next;
    i++;
  }
  return rows;
}

/* ── reusable bilingual row ── */
function BRow({ arLabel, enLabel, value, wide }) {
  return (
    <div style={{ display: 'flex', borderBottom: '1px solid #e8e8e8', minHeight: 30 }}>
      <div style={{ width: '25%', padding: '6px 10px', background: '#f7f8fa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#444' }}>{arLabel}</span>
        <span style={{ fontSize: 9, color: '#999', direction: 'ltr' }}>{enLabel}</span>
      </div>
      <div style={{ width: '75%', padding: '6px 12px', fontSize: 11, fontWeight: 600, color: '#1a1a1a', direction: 'rtl', textAlign: 'right' }}>
        {value}
      </div>
    </div>
  );
}

/* ── section block ── */
function Section({ num, arTitle, enTitle, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '8px 12px', background: 'linear-gradient(135deg, #1a4a6e 0%, #0c2d48 100%)',
        color: '#fff', borderRadius: '4px 4px 0 0',
      }}>
        <span style={{ fontSize: 11, fontWeight: 800 }}>
          {num}. {enTitle}
        </span>
        <span style={{ fontSize: 12, fontWeight: 800 }}>
          {num}. {arTitle}
        </span>
      </div>
      <div style={{ border: '1px solid #d0d5dd', borderTop: 'none', borderRadius: '0 0 4px 4px', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}

/* ── terms article ── */
function Article({ num, arTitle, enTitle, arBody, enBody }) {
  return (
    <div style={{ marginBottom: 12, pageBreakInside: 'avoid' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '6px 12px', background: '#f0f4f8', borderBottom: '1px solid #d0d5dd',
      }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#1a4a6e' }}>Article {num}: {enTitle}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#1a4a6e' }}>المادة {num}: {arTitle}</span>
      </div>
      <div style={{ padding: '8px 12px', display: 'flex', gap: 20 }}>
        <p style={{ flex: 1, fontSize: 9.5, color: '#333', direction: 'ltr', textAlign: 'left', lineHeight: 1.6, margin: 0 }}>{enBody}</p>
        <div style={{ width: 1, background: '#e0e0e0', flexShrink: 0 }} />
        <p style={{ flex: 1, fontSize: 10, color: '#333', direction: 'rtl', textAlign: 'right', lineHeight: 1.7, margin: 0 }}>{arBody}</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════ */
export function ContractDocument({ contract, lang, onClose }) {
  const ar = lang === 'ar';
  const docRef = useRef(null);
  const c = contract;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=72x72&data=${encodeURIComponent(c.id)}&color=1a4a6e&bgcolor=ffffff&qzone=1`;
  const payments = genPayments(c.start, c.end, c.rent);
  const totalAnnual = c.rent * 12;
  const typeAr = c.type === 'residential' ? 'سكني' : 'تجاري';
  const typeEn = c.type === 'residential' ? 'Residential' : 'Commercial';
  const propTypeAr = { apartment: 'شقة', villa: 'فيلا', office: 'مكتب', shop: 'محل', warehouse: 'مستودع' }[c.propertyType] || c.propertyType;
  const propTypeEn = { apartment: 'Apartment', villa: 'Villa', office: 'Office', shop: 'Shop', warehouse: 'Warehouse' }[c.propertyType] || c.propertyType;

  function handlePrint() {
    const content = docRef.current;
    if (!content) return;
    const win = window.open('', '_blank', 'width=900,height=800');
    win.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8" />
        <title>Contract ${c.id}</title>
        <style>
          @page { size: A4; margin: 0; }
          * { box-sizing: border-box; }
          body { margin: 0; padding: 0; background: #fff; font-family: 'Traditional Arabic', Arial, sans-serif; }
          .doc-page { position: relative; width: 210mm; min-height: 297mm; margin: 0 auto; background: #fff; padding: 18mm 20mm; page-break-after: always; }
          .doc-page:last-child { page-break-after: auto; }
          .doc-watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%) rotate(-35deg); font-size: 52px; font-weight: 900; color: rgba(26,74,110,.04); pointer-events: none; white-space: nowrap; letter-spacing: 8px; user-select: none; }
          .doc-page-footer { position: absolute; bottom: 12mm; left: 0; right: 0; text-align: center; font-size: 9px; color: #999; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #e0e0e0; padding: 5px 8px; font-size: 9.5px; }
          img { max-width: 100%; }
        </style>
      </head>
      <body>
        ${content.innerHTML}
      </body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 600);
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content anim" style={{ maxWidth: 900, padding: 0, overflow: 'hidden', maxHeight: '95vh', display: 'flex', flexDirection: 'column' }}>

        {/* ── Toolbar ── */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '10px 16px', background: '#1a4a6e', color: '#fff', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Ico n="contracts" s={14} />
            <span style={{ fontWeight: 700, fontSize: 13 }}>
              {ar ? 'مستند العقد' : 'Contract Document'} — {c.id}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handlePrint} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '6px 14px', borderRadius: 4, border: '1px solid rgba(255,255,255,.3)',
              background: 'rgba(255,255,255,.1)', color: '#fff', fontSize: 11,
              fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            }}>
              <Ico n="print" s={12} />{ar ? 'طباعة / PDF' : 'Print / PDF'}
            </button>
            <button onClick={onClose} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '6px 14px', borderRadius: 4, border: '1px solid rgba(255,255,255,.3)',
              background: 'rgba(255,255,255,.1)', color: '#fff', fontSize: 11,
              fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            }}>
              <Ico n="x" s={12} />{ar ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>

        {/* ── Document scrollable area ── */}
        <div ref={docRef} className="contract-doc" style={{ flex: 1, overflow: 'auto', background: '#e8ecf1', padding: 20 }}>

          {/* ══════════ PAGE 1 ══════════ */}
          <div className="doc-page">

            {/* Watermark */}
            <div className="doc-watermark">
              <span>{ar ? 'وثيقة رسمية' : 'OFFICIAL DOCUMENT'}</span>
            </div>

            {/* ── Header ── */}
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              {/* Emblem */}
              <img src="/eg-logo.png" alt="" style={{ width: 56, height: 56, marginBottom: 6 }} />
              <div style={{ fontSize: 20, fontWeight: 900, color: '#1a4a6e', letterSpacing: 1 }}>
                {typeAr === 'سكني' ? 'عقد إيجار سكني' : 'عقد إيجار تجاري'}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0c2d48', direction: 'ltr' }}>
                {typeEn} Lease Contract
              </div>
              <div style={{ fontSize: 9, color: '#666', marginTop: 4, maxWidth: 500, margin: '4px auto 0' }}>
                {ar
                  ? 'صادر بموجب قانون الإيجار المصري رقم 49 لسنة 1977 وتعديلاته — منظمة من شركة الإيجار المصري'
                  : 'Issued under Egyptian Rental Law No. 49 of 1977 and amendments — Regulated by Egyptian Rental Company'}
              </div>
              <div style={{ width: '100%', height: 2, background: 'linear-gradient(90deg, transparent, #1a4a6e, transparent)', marginTop: 10 }} />
            </div>

            {/* ── 1. Contract Data ── */}
            <Section num={1} arTitle="بيانات العقد" enTitle="Contract Data">
              <BRow arLabel="رقم العقد" enLabel="Contract No." value={c.id} />
              <BRow arLabel="نوع العقد" enLabel="Contract Type" value={`${typeAr} / ${typeEn}`} />
              <BRow arLabel="تاريخ العقد" enLabel="Contract Date" value={`${c.start} → ${c.end}`} />
              <BRow arLabel="مدة العقد" enLabel="Duration" value={periodLabel(c.start, c.end, true) + ' / ' + periodLabel(c.start, c.end, false)} />
              <BRow arLabel="موقع العقد" enLabel="Location" value={`${c.district} — ${c.city}`} />
            </Section>

            {/* ── 2. Lessor Data ── */}
            <Section num={2} arTitle="بيانات المؤجر" enTitle="Lessor Data">
              <BRow arLabel="اسم المؤجر" enLabel="Lessor Name" value={c.landlord} />
              <BRow arLabel="الرقم القومي" enLabel="National ID" value={c.landlordNid} />
              <BRow arLabel="رقم الهاتف" enLabel="Phone" value={c.landlordPhone} />
            </Section>

            {/* ── 3. Lessor Representative ── */}
            <Section num={3} arTitle="ممثل المؤجر" enTitle="Lessor Representative">
              <BRow arLabel="الاسم" enLabel="Name" value={c.broker} />
              <BRow arLabel="رقم الترخيص" enLabel="License No." value={c.brokerLicense} />
            </Section>

            {/* ── 4. Tenant Data ── */}
            <Section num={4} arTitle="بيانات المستأجر" enTitle="Tenant Data">
              <BRow arLabel="اسم المستأجر" enLabel="Tenant Name" value={c.tenant} />
              <BRow arLabel="الرقم القومي" enLabel="National ID" value={c.tenantNid} />
              <BRow arLabel="رقم الهاتف" enLabel="Phone" value={c.tenantPhone} />
            </Section>

            {/* ── 5. Ownership Document ── */}
            <Section num={5} arTitle="سند الملكية" enTitle="Ownership Document">
              <BRow arLabel="رقم السجل العقاري" enLabel="Deed No." value={c.ownershipDoc} />
            </Section>

            {/* ── 6. Property Data ── */}
            <Section num={6} arTitle="بيانات العقار" enTitle="Property Data">
              <BRow arLabel="وصف العقار" enLabel="Property" value={c.property} />
              <BRow arLabel="نوع العقار" enLabel="Property Type" value={`${propTypeAr} / ${propTypeEn}`} />
              <BRow arLabel="المساحة" enLabel="Area" value={`${c.propertyArea} م² / ${c.propertyArea} m²`} />
              <BRow arLabel="الدور" enLabel="Floor" value={c.propertyFloor === 0 ? 'أرضي / Ground' : `${c.propertyFloor}`} />
              <BRow arLabel="رقم الوحدة" enLabel="Unit No." value={c.propertyUnit} />
              <BRow arLabel="الحي" enLabel="District" value={c.district} />
              <BRow arLabel="المدينة" enLabel="City" value={c.city} />
            </Section>

            {/* ── 7. Financial Data ── */}
            <Section num={7} arTitle="البيانات المالية" enTitle="Financial Data">
              <BRow arLabel="الإيجار الشهري" enLabel="Monthly Rent" value={`${c.rent.toLocaleString()} ج.م / EGP ${c.rent.toLocaleString()}`} />
              <BRow arLabel="الإيجار السنوي" enLabel="Annual Rent" value={`${totalAnnual.toLocaleString()} ج.م / EGP ${totalAnnual.toLocaleString()}`} />
              <BRow arLabel="مبلغ التأمين" enLabel="Deposit" value={`${c.deposit.toLocaleString()} ج.م / EGP ${c.deposit.toLocaleString()}`} />
            </Section>

            {/* Page 1 footer */}
            <div className="doc-page-footer">(1)</div>
          </div>

          {/* ══════════ PAGE 2 ══════════ */}
          <div className="doc-page">

            <div className="doc-watermark">
              <span>{ar ? 'وثيقة رسمية' : 'OFFICIAL DOCUMENT'}</span>
            </div>

            {/* ── 8. Payment Schedule ── */}
            <Section num={8} arTitle="جدول السداد" enTitle="Payment Schedule">
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 9.5 }}>
                <thead>
                  <tr style={{ background: '#1a4a6e', color: '#fff' }}>
                    <th style={{ padding: '6px 8px', fontWeight: 700, textAlign: 'center' }}>#</th>
                    <th style={{ padding: '6px 8px', fontWeight: 700, textAlign: 'center' }}>Rental Period / فترة الإيجار</th>
                    <th style={{ padding: '6px 8px', fontWeight: 700, textAlign: 'center' }}>Due Date (AD) / تاريخ الاستحقاق</th>
                    <th style={{ padding: '6px 8px', fontWeight: 700, textAlign: 'center' }}>Deadline / الموعد النهائي</th>
                    <th style={{ padding: '6px 8px', fontWeight: 700, textAlign: 'center' }}>Amount / المبلغ (ج.م)</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p, idx) => (
                    <tr key={idx} style={{ background: idx % 2 === 0 ? '#fff' : '#f7f8fa' }}>
                      <td style={{ padding: '5px 8px', textAlign: 'center', borderBottom: '1px solid #e8e8e8' }}>{p.i}</td>
                      <td style={{ padding: '5px 8px', textAlign: 'center', borderBottom: '1px solid #e8e8e8', direction: 'ltr' }}>{p.period}</td>
                      <td style={{ padding: '5px 8px', textAlign: 'center', borderBottom: '1px solid #e8e8e8', direction: 'ltr' }}>{p.dueAd}</td>
                      <td style={{ padding: '5px 8px', textAlign: 'center', borderBottom: '1px solid #e8e8e8', direction: 'ltr' }}>{p.deadline}</td>
                      <td style={{ padding: '5px 8px', textAlign: 'center', borderBottom: '1px solid #e8e8e8', fontWeight: 700 }}>{p.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr style={{ background: '#e8f0f8', fontWeight: 800 }}>
                    <td colSpan={4} style={{ padding: '6px 8px', textAlign: 'center', borderTop: '2px solid #1a4a6e' }}>الإجمالي / Total</td>
                    <td style={{ padding: '6px 8px', textAlign: 'center', borderTop: '2px solid #1a4a6e', color: '#1a4a6e' }}>{totalAnnual.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </Section>

            {/* ── 9. Terms & Conditions ── */}
            <Section num={9} arTitle="الشروط والأحكام" enTitle="Terms & Conditions">
              <Article num={1} arTitle="مدة العقد" enTitle="Contract Duration"
                arBody="يُبرم هذا العقد لمدة محددة تبدأ من تاريخ بداية العقد وتنتهي في تاريخ انتهائه المحدد أعلاه، ويلتزم الطرفان بالمدة المتفق عليها ما لم يتم التجديد أو الإلغاء وفقًا للشروط المنصوص عليها في هذا العقد."
                enBody="This contract is executed for a fixed term commencing on the start date and ending on the end date specified above. Both parties are bound by the agreed term unless renewed or terminated in accordance with the provisions herein."
              />
              <Article num={2} arTitle="الإيجار والسداد" enTitle="Rent & Payment"
                arBody="يلتزم المستأجر بسداد الإيجار الشهري المحدد في البيانات المالية أعلاه في موعد أقصاه اليوم الخامس من كل شهر ميلادي. في حالة التأخير عن السداد، يحق للمؤجر تطبيق غرامة تأخير بنسبة 5% من قيمة الإيجار الشهري عن كل شهر تأخير."
                enBody="The Tenant shall pay the monthly rent specified in the Financial Data above no later than the 5th day of each Gregorian month. In case of late payment, the Lessor may apply a late fee of 5% of the monthly rent for each month of delay."
              />
              <Article num={3} arTitle="استخدام العين المؤجرة" enTitle="Use of Premises"
                arBody="يلتزم المستأجر باستخدام العين المؤجرة للغرض المحدد في هذا العقد فقط، ولا يجوز له تغيير طبيعة الاستخدام أو إجراء تعديلات هيكلية دون موافقة كتابية مسبقة من المؤجر."
                enBody="The Tenant shall use the leased premises solely for the purpose specified in this contract and may not change the nature of use or make structural modifications without prior written consent from the Lessor."
              />
              <Article num={4} arTitle="الصيانة والإصلاح" enTitle="Maintenance & Repair"
                arBody="يتحمل المؤجر صيانة الهيكل الأساسي للعين المؤجرة، بينما يتحمل المستأجر صيانة التجهيزات الداخلية والمرافق. يلتزم المستأجر بإبلاغ المؤجر عن أي أعطال هيكلية فور اكتشافها."
                enBody="The Lessor shall maintain the structural integrity of the premises, while the Tenant shall maintain interior fixtures and utilities. The Tenant must notify the Lessor of any structural defects immediately upon discovery."
              />
              <Article num={5} arTitle="التأمين" enTitle="Security Deposit"
                arBody="أودع المستأجر مبلغ التأمين المحدد أعلاه لدى المؤجر كضمان لتنفيذ التزاماته. يُرد مبلغ التأمين للمستأجر عند انتهاء العقد بعد التحقق من سلامة العين المؤجرة وسداد جميع المستحقات."
                enBody="The Tenant has deposited the security deposit specified above with the Lessor as guarantee for fulfilling obligations. The deposit shall be refunded to the Tenant upon contract expiry after verifying the premises condition and settlement of all dues."
              />
              <Article num={6} arTitle="إنهاء العقد" enTitle="Termination"
                arBody="يجوز لأي من الطرفين إنهاء العقد بإشعار كتابي قبل 30 يومًا على الأقل من تاريخ الإنهاء المطلوب. في حالة الإنهاء المباط من المستأجر، يحق للمؤجر خصم شهر إيجار من التأمين."
                enBody="Either party may terminate the contract with at least 30 days' written notice prior to the desired termination date. In case of early termination by the Tenant, the Lessor may deduct one month's rent from the deposit."
              />
              <Article num={7} arTitle="التنازل عن العقد" enTitle="Assignment"
                arBody="لا يجوز للمستأجر التنازل عن العقد أو تأجير العين من الباط دون موافقة كتابية مسبقة من المؤجر. أي تنازل دون موافقة يُعد مخالفة عقدية تستوجب الإنهاء."
                enBody="The Tenant may not assign the contract or sublease the premises without prior written consent from the Lessor. Any assignment without consent constitutes a breach warranting termination."
              />
              <Article num={8} arTitle="حل النزاعات" enTitle="Dispute Resolution"
                arBody="في حالة نشوء أي نزاع بشأن هذا العقد، يلتزم الطرفان بمحاولة الحل الودي أولًا. في حالة تعذر ذلك، يُحال النزاع إلى المحكمة المختصة في نطاق موقع العين المؤجرة."
                enBody="In case of any dispute arising from this contract, both parties shall first attempt amicable resolution. Failing that, the dispute shall be referred to the competent court within the jurisdiction of the leased premises."
              />
            </Section>

            {/* ── Signatures ── */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', marginTop: 20,
              pageBreakInside: 'avoid',
            }}>
              <div style={{ textAlign: 'center', width: '40%' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#1a4a6e', marginBottom: 40 }}>Lessor Signature / توقيع المؤجر</div>
                <div style={{ borderTop: '1px solid #333', width: '80%', margin: '0 auto' }} />
                <div style={{ fontSize: 9, color: '#666', marginTop: 4 }}>{c.landlord}</div>
              </div>
              <div style={{ textAlign: 'center', width: '20%' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#1a4a6e', marginBottom: 40 }}>Broker / الوسيط</div>
                <div style={{ borderTop: '1px solid #333', width: '80%', margin: '0 auto' }} />
                <div style={{ fontSize: 9, color: '#666', marginTop: 4 }}>{c.broker}</div>
              </div>
              <div style={{ textAlign: 'center', width: '40%' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#1a4a6e', marginBottom: 40 }}>Tenant Signature / توقيع المستأجر</div>
                <div style={{ borderTop: '1px solid #333', width: '80%', margin: '0 auto' }} />
                <div style={{ fontSize: 9, color: '#666', marginTop: 4 }}>{c.tenant}</div>
              </div>
            </div>

            {/* QR + stamp area */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
              marginTop: 24, padding: '12px 0', borderTop: '2px dashed #ccc',
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 9, color: '#999', marginBottom: 4 }}>QR Code / رمز الاستجابة</div>
                <img src={qrSrc} alt="QR" width={72} height={72} style={{ borderRadius: 4, border: '1px solid #ddd' }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: 90, height: 90, borderRadius: '50%', border: '2px solid #1a4a6e',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#1a4a6e', fontSize: 9, fontWeight: 700,
                  transform: 'rotate(-15deg)', opacity: 0.3,
                }}>
                  {ar ? 'ختم رسمي' : 'OFFICIAL STAMP'}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 9, color: '#999', marginBottom: 4 }}>Contract ID / رقم العقد</div>
                <div style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 800, color: '#1a4a6e' }}>{c.id}</div>
              </div>
            </div>

            <div className="doc-page-footer">(2)</div>
          </div>

        </div>{/* end scrollable */}
      </div>
    </div>
  );
}
