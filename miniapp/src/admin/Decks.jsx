import { useState } from 'react';
import { api, fileUrl } from './api.js';
import { dateTime, LANGS, num } from './format.js';
import { ErrorBox, Icon, Loading, Pager, useDebounced, useLoad } from './ui.jsx';

/** The .pptx is drawn again from the saved content (a few seconds), so the link names what it does. */
export const DeckDownload = ({ id }) => (
  <a className="btn sm" href={fileUrl(`/decks/${id}/download`)} download title="Taqdimotni .pptx qilib yuklab olish">
    <Icon name="download" /> .pptx
  </a>
);

export default function Decks({ openUser }) {
  const [q, setQ] = useState('');
  const [tpl, setTpl] = useState('');
  const [page, setPage] = useState(1);
  const size = 25;
  const dq = useDebounced(q);
  const { data, error, reload } = useLoad(() => api.decks({ q: dq, template_id: tpl, page, size }), [dq, tpl, page]);

  return (
    <div className="card">
      <div className="card-h">
        <input className="input search" placeholder="Mavzu yoki Telegram ID" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} aria-label="Qidirish" />
        <select className="select" value={tpl} onChange={(e) => { setTpl(e.target.value); setPage(1); }} aria-label="Shablon">
          <option value="">Barcha shablonlar</option>
          {data?.templates.map((t) => <option key={t.id} value={t.id}>{t.id}. {t.name}</option>)}
        </select>
        {data && <span className="hint">{num(data.total)} ta</span>}
      </div>
      {error && !data ? <ErrorBox error={error} retry={reload} /> : !data ? <Loading /> : (
        <>
          <div className="table-wrap"><table className="cards">
            <thead><tr><th>Mavzu</th><th>Foydalanuvchi</th><th>Shablon</th><th className="r">Slayd</th><th>Til</th><th>Yaratilgan</th><th /></tr></thead>
            <tbody>{data.items.map((d) => (
              <tr key={d.id}>
                <td className="ellipsis full" title={d.topic}><b>{d.topic}</b></td>
                <td data-label="Foydalanuvchi"><a href="#" className="who" onClick={(e) => { e.preventDefault(); openUser(d.user_id); }}>{d.first_name || '—'}<small>{d.user_id}</small></a></td>
                <td data-label="Shablon">{d.template_id}. {d.template}</td>
                <td className="r num" data-label="Slayd">{d.slides}</td>
                <td data-label="Til">{LANGS[d.language] || d.language || '—'}</td>
                <td data-label="Yaratilgan">{dateTime(d.created)}{d.updated !== d.created && <div style={{ color: 'var(--muted)', fontSize: 12 }}>yangilangan {dateTime(d.updated)}</div>}</td>
                <td className="r"><DeckDownload id={d.id} /></td>
              </tr>))}</tbody>
          </table></div>
          {!data.items.length && <div className="empty">Taqdimot topilmadi</div>}
          <Pager page={page} size={size} total={data.total} onPage={setPage} />
        </>
      )}
    </div>
  );
}
