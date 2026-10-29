/** Number, money and date formatting for the panel (Uzbek, Tashkent time). */
const TZ = 'Asia/Tashkent';

export const num = (v) => (v ?? 0).toLocaleString('ru-RU').replace(/,/g, ' ');
export const som = (v) => `${num(v)} so'm`;
export const signed = (v) => `${v > 0 ? '+' : v < 0 ? '−' : ''}${num(Math.abs(v))}`;

const toDate = (v) => (typeof v === 'number' ? new Date(v * 1000) : new Date(v));
const fmt = (o) => new Intl.DateTimeFormat('ru-RU', { timeZone: TZ, ...o });
export const dateTime = (v) => (v ? fmt({ day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(toDate(v)) : '—');
export const date = (v) => (v ? fmt({ day: '2-digit', month: '2-digit', year: 'numeric' }).format(toDate(v)) : '—');
export const shortDay = (iso) => fmt({ day: 'numeric', month: 'short' }).format(new Date(`${iso}T12:00:00+05:00`));

export function ago(v) {
  if (!v) return '—';
  const s = Math.max(0, (Date.now() - toDate(v).getTime()) / 1000);
  if (s < 60) return 'hozirgina';
  if (s < 3600) return `${Math.floor(s / 60)} daq oldin`;
  if (s < 86400) return `${Math.floor(s / 3600)} soat oldin`;
  if (s < 86400 * 30) return `${Math.floor(s / 86400)} kun oldin`;
  return date(v);
}

export const bytes = (b) => {
  if (b == null) return '—';
  const u = ['B', 'KB', 'MB', 'GB', 'TB']; let i = 0; let v = b;
  while (v >= 1024 && i < u.length - 1) { v /= 1024; i += 1; }
  return `${v.toFixed(v < 10 && i ? 1 : 0)} ${u[i]}`;
};

export const duration = (s) => {
  const d = Math.floor(s / 86400); const h = Math.floor((s % 86400) / 3600); const m = Math.floor((s % 3600) / 60);
  return d ? `${d} kun ${h} soat` : h ? `${h} soat ${m} daq` : `${m} daq`;
};

export const fullName = (u) => [u?.first_name, u?.last_name].filter(Boolean).join(' ') || '—';
export const LANGS = { uz: "O'zbekcha", ru: 'Русский', en: 'English', '—': 'Tanlanmagan' };

export const KINDS = {
  generate: 'Taqdimot yaratish', restyle: 'Shablon almashtirish', admin: 'Admin tuzatishi',
  'topup:card': "Karta orqali to'lov", 'topup:payme': "Payme to'lovi", 'topup:click': "Click to'lovi",
  'refund:generate': 'Qaytarildi (yaratish)', 'refund:restyle': 'Qaytarildi (shablon)', 'refund:payme': 'Payme bekor qilindi',
  promo: 'Promokod (sayt)', referral: 'Taklif bonusi (sayt)',
};
export const kindName = (k) => KINDS[k] || k;

export const ORDER_STATES = {
  new: ['Kutilmoqda', ''], review: ['Tekshiruvda', 'warn'], paid: ["To'langan", 'good'],
  rejected: ['Rad etilgan', 'bad'], cancelled: ['Bekor qilingan', 'bad'],
};
export const PROVIDERS = { card: 'Karta', payme: 'Payme', click: 'Click' };
