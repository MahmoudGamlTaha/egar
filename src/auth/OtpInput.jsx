import { useRef } from 'react';

export function OtpInput({ value, onChange }) {
  const refs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  const digits = Array.from({ length: 6 }, (_, i) => value[i] || "");

  function handleChange(i, e) {
    const v = e.target.value.replace(/\D/g, "");
    if (!v) {
      const next = [...digits]; next[i] = "";
      onChange(next.join(""));
      if (i > 0) refs[i - 1].current?.focus();
      return;
    }
    const next = [...digits]; next[i] = v.slice(-1);
    onChange(next.join(""));
    if (i < 5) refs[i + 1].current?.focus();
  }

  function handleKey(i, e) {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs[i - 1].current?.focus();
  }

  return (
    <div className="otp-row">
      {refs.map((r, i) => (
        <input key={i} ref={r}
          className={`otp-box${digits[i] ? " filled" : ""}`}
          maxLength={1} value={digits[i]}
          onChange={e => handleChange(i, e)}
          onKeyDown={e => handleKey(i, e)}
          inputMode="numeric"
        />
      ))}
    </div>
  );
}
