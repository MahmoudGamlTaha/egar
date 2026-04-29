import { T } from '../translations';

export function Pill({ s, lang }) {
  const label = T[lang].status[s] || s;
  return <span className={`pill ${s}`}>{label}</span>;
}
