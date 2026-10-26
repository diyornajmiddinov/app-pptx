/**
 * Draws one slide: the background layer picture (rendered once by the server) and, above it, every element
 * the browser can draw itself (text, simple shapes, lines, pictures, tables). The same component is used
 * for the big editable canvas and for the thumbnails.
 *
 * s = pixels per EMU. Text HTML is written through refs (not React children) so it can be edited in place.
 */
import { memo, useLayoutEffect, useRef, useState } from 'react';
import { api } from './api.js';
import { toHTML } from './textdom.js';
import { t } from './i18n.js';

export const hexA = (hex, a = 1) => {
  if (!hex) return 'transparent';
  if (a >= 1) return hex;
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

export function fillCss(fill) {
  if (!fill) return 'transparent';
  if (fill.gradient?.length) {
    const stops = fill.gradient.map((g) => `${hexA(g.color, g.alpha)} ${g.pos}%`).join(', ');
    return `linear-gradient(${(fill.angle ?? 0) + 90}deg, ${stops})`;
  }
  return hexA(fill.color, fill.alpha);
}

const ANCHOR = { t: 'flex-start', ctr: 'center', b: 'flex-end', just: 'flex-start', dist: 'space-between' };

/** The editable text of an element / table cell; registered in `roots` under `rootKey`. */
const TextRoot = memo(function TextRoot({ paragraphs, body, s, editing, rootKey, roots }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current; // the node this registration is for, even if the ref moves on
    if (roots) roots.set(rootKey, el);
    return () => { if (roots && roots.get(rootKey) === el) roots.delete(rootKey); };
  }, [roots, rootKey]);
  useLayoutEffect(() => {
    if (!editing && ref.current) ref.current.innerHTML = toHTML(paragraphs, s, body);
  }, [paragraphs, body, s, editing]);
  return <div ref={ref} className="ed-text" data-root={rootKey} spellCheck={false}
    style={{ whiteSpace: body?.wrap === false ? 'pre' : 'pre-wrap', overflowWrap: 'break-word', outline: 'none', minHeight: '1em' }} />;
});

function textBox(e, s, editing, roots, interactive) {
  const b = e.text.body || {};
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: ANCHOR[b.anchor] || 'flex-start',
      padding: `${(b.tIns ?? 45720) * s}px ${(b.rIns ?? 91440) * s}px ${(b.bIns ?? 45720) * s}px ${(b.lIns ?? 91440) * s}px` }}>
      <TextRoot paragraphs={e.text.paragraphs} body={b} s={s} editing={editing} rootKey={String(e.id)} roots={roots} />
      {interactive && e.emptyPh && !editing && (
        <span className="pointer-events-none absolute inset-0 grid place-items-center text-[13px] text-slate-400">{t('newText')}</span>
      )}
    </div>
  );
}

function Picture({ e, s, docId }) {
  const { l, t: top, r, b } = e.img.crop;
  const w = e.w * s, h = e.h * s;
  const iw = w / Math.max(0.01, 1 - l - r), ih = h / Math.max(0.01, 1 - top - b);
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: e.geom === 'ellipse' ? '50%' : 0 }}>
      <img src={api.mediaUrl(docId, e.img.src)} alt="" draggable={false}
        style={{ position: 'absolute', left: -l * iw, top: -top * ih, width: iw, height: ih, maxWidth: 'none', userSelect: 'none' }} />
    </div>
  );
}

function Line({ e, s }) {
  const w = Math.max(e.w * s, 1), h = Math.max(e.h * s, 1);
  const sw = Math.max(1, e.line.w * s);
  const [x1, y1, x2, y2] = [e.flipH ? w : 0, e.flipV ? h : 0, e.flipH ? 0 : w, e.flipV ? 0 : h];
  return (
    <svg width={w} height={h} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={hexA(e.line.color, e.line.alpha)} strokeWidth={sw} strokeDasharray={e.line.dash ? `${sw * 3} ${sw * 2}` : undefined} />
    </svg>
  );
}

function Table({ e, s, editingCell, roots }) {
  const tb = e.table;
  const border = tb.border ? `${Math.max(1, tb.border.w * s)}px solid ${tb.border.color}` : 'none';
  return (
    <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
      <colgroup>{tb.cols.map((w, i) => <col key={i} style={{ width: w * s }} />)}</colgroup>
      <tbody>
        {tb.rows.map((row, ri) => (
          <tr key={ri} style={{ height: row.h * s }}>
            {row.cells.map((c, ci) => c && (
              <td key={ci} colSpan={c.span} rowSpan={c.rspan} data-cell={`${ri}:${ci}`}
                style={{ background: fillCss(c.fill), border, verticalAlign: { t: 'top', ctr: 'middle', b: 'bottom' }[c.anchor] || 'top',
                  padding: `${c.mar.marT * s}px ${c.mar.marR * s}px ${c.mar.marB * s}px ${c.mar.marL * s}px`, overflow: 'hidden' }}>
                <TextRoot paragraphs={c.paragraphs} body={{ wrap: true }} s={s} editing={editingCell === `${ri}:${ci}`}
                  rootKey={`${e.id}:${ri}:${ci}`} roots={roots} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export const Element = memo(function Element({ e, s, docId, editing, editingCell, roots, interactive }) {
  const style = {
    position: 'absolute', left: e.x * s, top: e.y * s, width: e.w * s, height: e.h * s,
    transform: e.rot ? `rotate(${e.rot}deg)` : undefined,
  };
  const flip = (e.flipH || e.flipV) && e.kind !== 'line' ? `scale(${e.flipH ? -1 : 1},${e.flipV ? -1 : 1})` : undefined;
  const line = e.line && e.kind !== 'line' ? `${Math.max(1, e.line.w * s)}px ${e.line.dash ? 'dashed' : 'solid'} ${hexA(e.line.color, e.line.alpha)}` : 'none';
  return (
    <div data-eid={e.id} style={style} className={interactive ? 'ed-el' : undefined}>
      {e.kind === 'line' && <Line e={e} s={s} />}
      {e.kind === 'picture' && <Picture e={e} s={s} docId={docId} />}
      {(e.kind === 'shape' || e.kind === 'text') && (
        <div style={{ position: 'absolute', inset: 0, background: fillCss(e.fill), border: line, boxSizing: 'border-box', transform: flip,
          borderRadius: e.geom === 'ellipse' ? '50%' : e.geom === 'roundRect' ? e.radius * s : 0 }} />
      )}
      {e.kind === 'picture' && e.line && <div style={{ position: 'absolute', inset: 0, border: line, borderRadius: e.geom === 'ellipse' ? '50%' : 0 }} />}
      {e.text && textBox(e, s, editing, roots, interactive)}
      {e.kind === 'table' && <Table e={e} s={s} editingCell={editingCell} roots={roots} />}
    </div>
  );
});

export default function SlideView({ slide, width, height, s, docId, interactive = false, editing = null, roots, overrides, children }) {
  const [layerOk, setLayerOk] = useState(true);
  const [loaded, setLoaded] = useState(false);
  useLayoutEffect(() => { setLayerOk(true); setLoaded(false); }, [slide.layer]); // new background picture
  return (
    <div className="ed-slide" style={{ position: 'relative', width: width * s, height: height * s, overflow: 'hidden', background: slide.bg || '#FFFFFF' }}>
      {layerOk && (
        <img key={slide.layer} src={api.layerUrl(docId, slide.layer)} alt="" draggable={false}
          onLoad={() => setLoaded(true)} onError={() => setLayerOk(false)}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: loaded ? 1 : 0, transition: 'opacity 150ms', pointerEvents: 'none' }} />
      )}
      {slide.elements.map((e) => {
        const o = overrides?.[e.id];
        return <Element key={e.id} e={o ? { ...e, ...o } : e} s={s} docId={docId} interactive={interactive} roots={roots}
          editing={editing?.id === e.id && !editing.cell} editingCell={editing?.id === e.id ? editing.cell : null} />;
      })}
      {interactive && !loaded && layerOk && (
        <span className="pointer-events-none absolute bottom-2 right-2 rounded bg-black/50 px-2 py-0.5 text-[11px] text-white">{t('layerLoading')}</span>
      )}
      {children}
    </div>
  );
}
