import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Create from '../pages/Create.jsx';
import Legal from '../pages/Legal.jsx';
import Login from '../pages/Login.jsx';
import { ME, fakeFetch, renderUz } from './helpers.jsx';

afterEach(() => { vi.unstubAllGlobals(); localStorage.clear(); });

describe('Login', () => {
  it('sends the code, then signs in with the invite code kept from ?ref=', async () => {
    localStorage.setItem('ref', 'abc123');
    const calls = fakeFetch({ 'POST /login': [200, { login_id: 'L'.repeat(24), ttl: 300 }], 'POST /verify': [200, { ok: true }] });
    const done = vi.fn();
    renderUz(<Login onSignedIn={done} />);
    fireEvent.change(screen.getByPlaceholderText('@username'), { target: { value: '@vali' } });
    fireEvent.click(screen.getByRole('button', { name: 'Kod yuborish' }));
    const code = await screen.findByPlaceholderText('••••••');
    await act(async () => { fireEvent.change(code, { target: { value: '12 34 56' } }); }); // 6 digits: sent at once
    await waitFor(() => expect(done).toHaveBeenCalled());
    expect(calls.find((c) => c.key === 'POST /verify').body).toEqual({ login_id: 'L'.repeat(24), code: '123456', ref: 'abc123' });
    expect(localStorage.getItem('ref')).toBeNull();
  });

  it('shows why the code was not sent', async () => {
    fakeFetch({ 'POST /login': [404, { detail: 'notFound' }] });
    renderUz(<Login onSignedIn={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText('@username'), { target: { value: 'nobody' } });
    fireEvent.click(screen.getByRole('button', { name: 'Kod yuborish' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('foydalanuvchi topilmadi');
  });
});

describe('Create', () => {
  const noJobs = { 'GET /jobs': [200, { jobs: [] }] };

  it('low balance: no create button, a top-up one instead', async () => {
    fakeFetch(noJobs);
    renderUz(<Create me={{ ...ME, balance: 1000 }} refreshMe={() => {}} go={() => {}} />);
    expect(screen.queryByRole('button', { name: /Taqdimot yaratish ·/ })).toBeNull();
    expect(screen.getByRole('button', { name: "To'ldirish" })).toBeTruthy();
  });

  it('outline: made, edited, sent with the deck', async () => {
    const outline = Array.from({ length: 10 }, (_, i) => ({ type: i === 1 ? 'intro' : 'cards', title: `S${i}` }));
    const calls = fakeFetch({ ...noJobs, 'POST /outline': [200, { slides: outline }], 'POST /generate': [202, { job: 1, ahead: 0 }] });
    renderUz(<Create me={ME} refreshMe={() => {}} go={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText(/Soliq islohotlari/), { target: { value: 'Quyosh energiyasi' } });
    fireEvent.click(screen.getByRole('button', { name: /rejani ko'rish/ }));
    const first = await screen.findByDisplayValue('S0');
    fireEvent.change(first, { target: { value: 'Mening sarlavham' } });
    expect(screen.getByDisplayValue('S1')).toBeDisabled(); // intro: fixed title
    fireEvent.click(screen.getByRole('button', { name: /Taqdimot yaratish · 5\u00a0000 so'm/ }));
    await screen.findByText(/Qabul qilindi/);
    const body = calls.find((c) => c.key === 'POST /generate').body;
    expect(body.outline[0]).toBe('Mening sarlavham');
    expect(body.outline).toHaveLength(10);
    expect(body.topic).toBe('Quyosh energiyasi');
  });

  it('the first-deck price is shown when it is lower', () => {
    fakeFetch(noJobs);
    renderUz(<Create me={{ ...ME, prices: { ...ME.prices, now: 0 } }} refreshMe={() => {}} go={() => {}} />);
    expect(screen.getByText('Birinchi taqdimot: Bepul')).toBeTruthy();
  });
});

describe('Legal', () => {
  it('empty provider details are visible blanks, not invented', () => {
    renderUz(<Legal doc="oferta" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Ommaviy oferta');
    expect(screen.getAllByText('______').length).toBeGreaterThan(3);
  });
});
