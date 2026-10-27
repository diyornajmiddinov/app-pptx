/**
 * Column chart for one daily series (new users, decks, revenue). One series, so no legend: the card title names it.
 * Thin columns (<= 24px) with a 4px rounded top and a square base on one baseline, recessive grid, hover tooltip
 * on the whole day band.
 */
import { useEffect, useRef, useState } from 'react';
import { shortDay } from './format.js';

const H = 200;
const PAD = { l: 44, r: 8, t: 10, b: 24 };

/** Four equal steps from 0, each a round number (whole numbers for counts: 0 2 4 6 8, not 0 2.5 5 7.5 10). */
function niceMax(v) {
  const raw = Math.max(1, v / 4);
  const p = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].map((m) => m * p).find((s) => s >= raw && Number.isInteger(s));
  return step * 4;
}

const short = (v) => (v >= 1e6 ? `${+(v / 1e6).toFixed(1)}M` : v >= 1e3 ? `${+(v / 1e3).toFixed(1)}k` : `${v}`);

export default function ColumnChart({ data, valueKey, format = (v) => v, label }) {
  const ref = useRef(null);
  const [w, setW] = useState(600);
  const [hover, setHover] = useState(null);
  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setW(Math.max(200, e.contentRect.width)));
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  const values = data.map((d) => d[valueKey]);
  const max = niceMax(Math.max(0, ...values));
  const iw = w - PAD.l - PAD.r; const ih = H - PAD.t - PAD.b;
  const band = iw / data.length;
  const bw = Math.min(24, Math.max(2, band * 0.62));
  const y = (v) => PAD.t + ih - (v / max) * ih;
  const ticks = [0, 1, 2, 3, 4].map((i) => (max / 4) * i);
  const every = Math.ceil(data.length / Math.max(2, Math.floor(iw / 64)));

  const col = (d, i) => {
    const v = d[valueKey]; if (!v) return null;
    const x = PAD.l + i * band + (band - bw) / 2; const top = y(v); const base = PAD.t + ih; const r = Math.min(4, bw / 2, base - top);
    return <path key={d.day} className={`bar ${hover != null && hover !== i ? 'dim' : ''}`}
      d={`M${x},${base} V${top + r} Q${x},${top} ${x + r},${top} H${x + bw - r} Q${x + bw},${top} ${x + bw},${top + r} V${base} Z`} />;
  };

  return (
    <div className="chart" ref={ref} onPointerLeave={() => setHover(null)}>
      <svg height={H} role="img" aria-label={label}>
        {ticks.map((t) => (
          <g key={t}>
            <line className={t ? 'gridline' : 'baseline'} x1={PAD.l} x2={w - PAD.r} y1={y(t)} y2={y(t)} />
            <text className="tick num" x={PAD.l - 8} y={y(t) + 4} textAnchor="end">{short(t)}</text>
          </g>
        ))}
        {data.map(col)}
        {data.map((d, i) => (i % every === 0 || i === data.length - 1) && (
          <text key={d.day} className="tick" x={PAD.l + i * band + band / 2} y={H - 6} textAnchor="middle">{shortDay(d.day)}</text>
        ))}
        {data.map((d, i) => (
          <rect key={d.day} x={PAD.l + i * band} y={PAD.t} width={band} height={ih} fill="transparent"
            onPointerEnter={() => setHover(i)} onPointerDown={() => setHover(i)} />
        ))}
      </svg>
      {hover != null && (
        <div className="tooltip" style={{ left: Math.min(w - 60, Math.max(60, PAD.l + hover * band + band / 2)), top: y(values[hover]) }}>
          {shortDay(data[hover].day)}<b className="num">{format(values[hover])}</b>
        </div>
      )}
    </div>
  );
}

/** Horizontal ranking (template popularity, languages): value as text at the end, never color alone. */
export function HBars({ items, max }) {
  const top = max ?? Math.max(1, ...items.map((i) => i.n));
  return (
    <div>
      {items.map((i) => (
        <div className="hbar" key={i.key}>
          <span className="hbar-name" title={i.name}>{i.name}</span>
          <div className="hbar-track"><div className="hbar-fill" style={{ width: `${(i.n / top) * 100}%` }} /></div>
          <span className="num r" style={{ textAlign: 'right' }}>{i.n}</span>
        </div>
      ))}
    </div>
  );
}
