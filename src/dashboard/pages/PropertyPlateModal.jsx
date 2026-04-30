import { useState, useRef } from 'react';
import { Ico } from '../../components/Icon';

/* ── Egyptian emblem image ─────────────────────────────────────── */
const EG_LOGO = '/eg-logo.png';

/* ── Design config ────────────────────────────────────────────── */
const SCHEMES = {
  classic: {
    bg: '#0D1B3E', accent: '#C9A84C', text: '#F5E6C0',
    sub: 'rgba(201,168,76,0.65)', divider: 'rgba(201,168,76,0.22)',
    labelAr: 'كلاسيكي — نيلي ذهبي', labelEn: 'Classic — Navy Gold',
  },
  royal: {
    bg: '#160A00', accent: '#FFD700', text: '#FFF8DC',
    sub: 'rgba(255,215,0,0.65)', divider: 'rgba(255,215,0,0.18)',
    labelAr: 'ملكي — أسود ذهبي', labelEn: 'Royal — Black Gold',
  },
  cream: {
    bg: '#F8F3EA', accent: '#7B5200', text: '#3D2800',
    sub: '#A0724A', divider: 'rgba(123,82,0,0.18)',
    labelAr: 'فاتح — كريمي ذهبي', labelEn: 'Light — Cream Gold',
  },
  official: {
    bg: '#FAFAFA', accent: '#CE1126', text: '#111111',
    sub: '#666666', divider: '#e0e0e0',
    labelAr: 'رسمي — أبيض أحمر', labelEn: 'Official — White Red',
  },
};

const FONTS = {
  cairo:   { family: "'Cairo', sans-serif",  labelAr: 'Cairo كايرو' },
  amiri:   { family: "'Amiri', serif",        labelAr: 'Amiri أميري' },
  tajawal: { family: "'Tajawal', sans-serif", labelAr: 'Tajawal تجوال' },
};

const TYPE_LABEL = {
  apartment: { ar: 'شقة',   en: 'Apartment' },
  villa:     { ar: 'فيلا',  en: 'Villa'      },
  office:    { ar: 'مكتب',  en: 'Office'     },
  shop:      { ar: 'محل',   en: 'Shop'       },
  warehouse: { ar: 'مستودع',en: 'Warehouse'  },
};

/* ── Main component ────────────────────────────────────────────── */
export function PropertyPlateModal({ property, user, lang, onClose }) {
  const ar = lang === 'ar';
  const [schemeKey, setSchemeKey] = useState('classic');
  const [fontKey, setFontKey]     = useState('cairo');
  const [showLandlord, setShowLandlord] = useState(true);
  const [borderStyle, setBorderStyle]   = useState('ornate');
  const plateRef = useRef(null);

  const s  = SCHEMES[schemeKey];
  const ff = FONTS[fontKey].family;
  const qrColor    = s.accent.replace('#', '');
  const qrBgColor  = s.bg.replace('#', '');
  const qrValue    = `${window.location.origin}/verify/${property.id}`;
  const qrSrc      = `https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(qrValue)}&color=${qrColor}&bgcolor=${qrBgColor}&qzone=1`;

  /* border variants */
  const borders = {
    ornate: {
      border: `3px double ${s.accent}`,
      boxShadow: `0 0 0 7px ${s.bg}, 0 0 0 10px ${s.accent}`,
      padding: 30,
    },
    double: {
      border: `2px solid ${s.accent}`,
      outline: `5px solid ${s.accent}33`,
      outlineOffset: '5px',
      padding: 26,
    },
    minimal: {
      border: `1px solid ${s.accent}66`,
      padding: 22,
    },
  };
  const borderCss = borders[borderStyle];

  /* corner ornaments for ornate border */
  const CORNERS = [
    { top: 10, left: 10 },
    { top: 10, right: 10 },
    { bottom: 10, left: 10 },
    { bottom: 10, right: 10 },
  ];

  /* print handler */
  const handlePrint = () => {
    if (!plateRef.current) return;
    const win = window.open('', '_blank');
    win.document.write(`
      <html><head><title>Plate — ${property.id}</title>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Amiri:wght@400;700&family=Tajawal:wght@400;600;700&display=swap" rel="stylesheet"/>
      <style>*{box-sizing:border-box;margin:0;padding:0}
        body{background:#ddd;display:flex;justify-content:center;align-items:center;min-height:100vh;padding:20px}
        @media print{body{background:none;padding:0}@page{size:A5 landscape;margin:8mm}}
        img{display:block}
      </style></head>
      <body>${plateRef.current.outerHTML}</body>
      <script>setTimeout(()=>{window.print();},600);</script></html>
    `);
    win.document.close();
  };

  /* rows of details shown on the plate */
  const floorLabel = property.floor === 0 ? (ar ? 'أرضي' : 'Ground') : String(property.floor);
  const typeLabel  = (TYPE_LABEL[property.type] || {})[ar ? 'ar' : 'en'] || property.type;
  const detailRows = [
    [ar ? 'الرقم الوطني للوحدة' : 'National Unit ID', property.nationalId || property.id, true],
    [ar ? 'المحافظة'            : 'Governorate',      property.city,     false],
    [ar ? 'الحي / المنطقة'     : 'District',          property.district, false],
    [ar ? 'اسم المبنى'          : 'Building',          property.building, false],
    [ar ? 'رقم الوحدة'          : 'Unit No.',          property.unit,     false],
    [ar ? 'الدور'               : 'Floor',             floorLabel,        false],
    [ar ? 'المساحة'             : 'Area',              `${property.area} م²`, false],
    [ar ? 'النوع'               : 'Type',              typeLabel,         false],
  ];

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content anim" style={{ maxWidth: 920, width: '96vw', maxHeight: '94vh', overflowY: 'auto', padding: 20 }}>

        {/* Header */}
        <div className="modal-header" style={{ marginBottom: 18 }}>
          <h2 style={{ fontSize: 15, fontWeight: 800 }}>
            {ar ? 'مُصمِّم لوحة العقار' : 'Property Plate Designer'}
          </h2>
          <button className="btn-icon" onClick={onClose}><Ico n="x" s={16} /></button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 230px', gap: 22, alignItems: 'start' }}>

          {/* ── PLATE PREVIEW ── */}
          <div>
            <div
              ref={plateRef}
              dir="rtl"
              style={{
                background: s.bg,
                borderRadius: 10,
                fontFamily: ff,
                position: 'relative',
                ...borderCss,
              }}
            >
              {/* Corner ornaments (ornate only) */}
              {borderStyle === 'ornate' && CORNERS.map((pos, i) => (
                <div key={i} style={{
                  position: 'absolute', width: 22, height: 22, ...pos,
                  borderTop:    pos.top    !== undefined ? `2px solid ${s.accent}` : 'none',
                  borderBottom: pos.bottom !== undefined ? `2px solid ${s.accent}` : 'none',
                  borderLeft:   pos.left   !== undefined ? `2px solid ${s.accent}` : 'none',
                  borderRight:  pos.right  !== undefined ? `2px solid ${s.accent}` : 'none',
                }}/>
              ))}

              {/* ── Eagle + Title ── */}
              <div style={{ textAlign: 'center', marginBottom: 14 }}>
                <img src={EG_LOGO} alt="Egypt Emblem" style={{ width: 80, height: 'auto', objectFit: 'contain' }} />
                <div style={{ color: s.accent, fontSize: 15, fontWeight: 800, letterSpacing: 2, marginTop: 2 }}>
                  جمهورية مصر العربية
                </div>
                <div style={{ color: s.sub, fontSize: 10, marginTop: 1 }}>Arab Republic of Egypt</div>
                {/* Egyptian flag stripe bar */}
                <div style={{ display: 'flex', height: 4, borderRadius: 2, overflow: 'hidden', width: '55%', margin: '10px auto 0' }}>
                  <div style={{ flex: 1, background: '#CE1126' }}/>
                  <div style={{ flex: 1, background: 'white', opacity: 0.8 }}/>
                  <div style={{ flex: 1, background: '#000000', opacity: 0.85 }}/>
                </div>
              </div>

              {/* ── Card title ── */}
              <div style={{ textAlign: 'center', marginBottom: 18 }}>
                <div style={{ color: s.text, fontSize: 16, fontWeight: 800, letterSpacing: 1 }}>
                  بطاقة العنوان الوطني للوحدة العقارية
                </div>
                <div style={{ color: s.sub, fontSize: 10, marginTop: 2 }}>
                  National Property Unit Address Card
                </div>
              </div>

              {/* ── Details grid ── */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 24px', marginBottom: 18 }}>
                {detailRows.map(([label, value, highlight]) => (
                  <div key={label} style={{
                    borderBottom: `1px solid ${s.divider}`, paddingBottom: 8,
                    gridColumn: highlight ? '1 / -1' : undefined,
                  }}>
                    <div style={{ color: s.sub, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 }}>
                      {label}
                    </div>
                    <div style={{ color: highlight ? s.accent : s.text, fontSize: highlight ? 15 : 13, fontWeight: highlight ? 800 : 700, letterSpacing: highlight ? 1 : 0 }}>
                      {value}
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Bottom: Landlord + QR ── */}
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: 14, borderTop: `1px solid ${s.divider}` }}>
                <div>
                  {showLandlord && (
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ color: s.sub, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', marginBottom: 3 }}>
                        {ar ? 'اسم المالك' : 'Landlord Name'}
                      </div>
                      <div style={{ color: s.accent, fontSize: 17, fontWeight: 800 }}>
                        {user?.name || '—'}
                      </div>
                    </div>
                  )}
                  <div style={{ color: s.sub, fontSize: 9 }}>
                    {ar ? 'تاريخ الإصدار:' : 'Issue Date:'}{' '}
                    {new Date().toLocaleDateString(ar ? 'ar-EG' : 'en-GB')}
                  </div>
                  {/* Mini flag */}
                  <div style={{ display: 'flex', width: 36, height: 5, borderRadius: 1, overflow: 'hidden', marginTop: 8 }}>
                    <div style={{ flex: 1, background: '#CE1126' }}/>
                    <div style={{ flex: 1, background: 'white', opacity: 0.9 }}/>
                    <div style={{ flex: 1, background: '#000' }}/>
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <img
                    src={qrSrc}
                    alt="QR Code"
                    width={108}
                    height={108}
                    style={{ borderRadius: 6, border: `2px solid ${s.accent}55`, display: 'block' }}
                  />
                  <div style={{ color: s.sub, fontSize: 9, marginTop: 5, fontWeight: 600 }}>
                    {ar ? 'امسح للتحقق' : 'Scan to Verify'}
                  </div>
                </div>
              </div>
            </div>

            {/* Print button */}
            <button
              className="btn-tl"
              onClick={handlePrint}
              style={{ width: '100%', justifyContent: 'center', marginTop: 12, padding: '10px' }}
            >
              <Ico n="print" s={13} />
              {ar ? 'طباعة / تنزيل اللوحة' : 'Print / Download Plate'}
            </button>
          </div>

          {/* ── DESIGN OPTIONS ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Color scheme */}
            <div>
              <div className="flabel" style={{ marginBottom: 8 }}>{ar ? 'نظام الألوان' : 'Color Scheme'}</div>
              {Object.entries(SCHEMES).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setSchemeKey(key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 9, width: '100%',
                    padding: '7px 10px', marginBottom: 5,
                    border: `2px solid ${schemeKey === key ? 'var(--tl)' : 'var(--b1)'}`,
                    borderRadius: 8,
                    background: schemeKey === key ? 'var(--tlbg)' : 'transparent',
                    cursor: 'pointer', fontSize: 11, fontFamily: 'inherit',
                    fontWeight: schemeKey === key ? 700 : 500, color: 'var(--t1)',
                    textAlign: 'start',
                  }}
                >
                  <div style={{ width: 20, height: 20, borderRadius: 4, background: val.bg, border: `2px solid ${val.accent}`, flexShrink: 0 }}/>
                  {ar ? val.labelAr : val.labelEn}
                </button>
              ))}
            </div>

            {/* Font */}
            <div>
              <div className="flabel" style={{ marginBottom: 8 }}>{ar ? 'الخط' : 'Font'}</div>
              {Object.entries(FONTS).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setFontKey(key)}
                  style={{
                    display: 'block', width: '100%', padding: '8px 10px', marginBottom: 5,
                    border: `2px solid ${fontKey === key ? 'var(--tl)' : 'var(--b1)'}`,
                    borderRadius: 8,
                    background: fontKey === key ? 'var(--tlbg)' : 'transparent',
                    cursor: 'pointer', fontSize: 14, fontFamily: val.family,
                    fontWeight: fontKey === key ? 700 : 400, color: 'var(--t1)',
                    textAlign: ar ? 'right' : 'left',
                  }}
                >
                  {val.labelAr}
                </button>
              ))}
            </div>

            {/* Border style */}
            <div>
              <div className="flabel" style={{ marginBottom: 8 }}>{ar ? 'نمط الإطار' : 'Border Style'}</div>
              {[
                ['ornate',  ar ? 'فاخر + أركان' : 'Ornate + Corners'],
                ['double',  ar ? 'مزدوج'        : 'Double Line'      ],
                ['minimal', ar ? 'بسيط'          : 'Minimal'          ],
              ].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setBorderStyle(key)}
                  style={{
                    display: 'block', width: '100%', padding: '7px 10px', marginBottom: 5,
                    border: `2px solid ${borderStyle === key ? 'var(--tl)' : 'var(--b1)'}`,
                    borderRadius: 8,
                    background: borderStyle === key ? 'var(--tlbg)' : 'transparent',
                    cursor: 'pointer', fontSize: 11, fontFamily: 'inherit',
                    fontWeight: borderStyle === key ? 700 : 500, color: 'var(--t1)',
                    textAlign: ar ? 'right' : 'left',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Landlord toggle */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', border: '1px solid var(--b1)', borderRadius: 8, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={showLandlord}
                onChange={e => setShowLandlord(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: 'var(--tl)', cursor: 'pointer' }}
              />
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--t1)' }}>
                {ar ? 'إظهار اسم المالك' : 'Show Landlord Name'}
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
