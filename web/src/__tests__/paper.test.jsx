import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Paper, { STANDARD } from '../pages/Paper.jsx';
import { ME, fakeFetch, renderUz } from './helpers.jsx';

afterEach(() => { vi.unstubAllGlobals(); localStorage.clear(); });

const empty = { 'GET /jobs': [200, { jobs: [] }], 'GET /papers': [200, { papers: [] }] };

describe('Paper', () => {
  it('sends the topic, the title page and the layout, and remembers the title page', async () => {
    const calls = fakeFetch({ ...empty, 'POST /paper': [202, { job: 1, ahead: 0 }] });
    renderUz(<Paper me={ME} refreshMe={() => {}} go={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText(/inflyatsiya va uni/), { target: { value: 'Raqamli iqtisodiyot' } });
    fireEvent.change(screen.getByPlaceholderText(/Toshkent davlat iqtisodiyot/), { target: { value: 'TDIU' } });
    fireEvent.change(screen.getByPlaceholderText('Aliyev Vali'), { target: { value: 'Karimova Nodira' } });
    fireEvent.click(screen.getByRole('radio', { name: 'Mustaqil ish' }));
    // the layout options are folded by default (no accessible name while hidden)
    fireEvent.click(screen.getAllByRole('radio', { hidden: true }).find((r) => r.textContent === '12'));
    fireEvent.click(screen.getByRole('button', { name: /Yozish · 7\u00a0000 so'm/ }));
    await screen.findByText(/Qabul qilindi/);
    const body = calls.find((c) => c.key === 'POST /paper').body;
    expect(body).toMatchObject({ topic: 'Raqamli iqtisodiyot', university: 'TDIU', student: 'Karimova Nodira', doc_type: 'mustaqil', pages: 15 });
    expect(body.format).toEqual({ ...STANDARD, font_size: 12 });
    expect(JSON.parse(localStorage.getItem('paperTitlePage'))).toMatchObject({ university: 'TDIU', format: { font_size: 12 } });
  });

  it('the plan is made, edited and sent with the order', async () => {
    const chapters = [{ title: 'Nazariya', sections: ['A', 'B'] }, { title: 'Amaliyot', sections: ['C', 'D'] }];
    const calls = fakeFetch({ ...empty, 'POST /paper/outline': [200, { chapters }], 'POST /paper': [202, { job: 1, ahead: 0 }] });
    renderUz(<Paper me={ME} refreshMe={() => {}} go={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText(/inflyatsiya va uni/), { target: { value: 'Inflyatsiya' } });
    fireEvent.click(screen.getByRole('button', { name: /rejani ko'rish/ }));
    fireEvent.change(await screen.findByDisplayValue('Nazariya'), { target: { value: 'Nazariy asoslar' } });
    fireEvent.click(screen.getByRole('button', { name: /Yozish ·/ }));
    await screen.findByText(/Qabul qilindi/);
    expect(calls.find((c) => c.key === 'POST /paper').body.outline[0]).toEqual({ title: 'Nazariy asoslar', sections: ['A', 'B'] });
  });

  it('lists the papers with Word and PDF downloads; low balance shows top-up', async () => {
    fakeFetch({ ...empty, 'GET /papers': [200, { papers: [{ id: 3, topic: 'Soliqlar', pages: 14, has_pdf: true, doc_type: 'referat', created: 1730000000 }] }] });
    renderUz(<Paper me={{ ...ME, balance: 100 }} refreshMe={() => {}} go={() => {}} />);
    expect(await screen.findByText('Soliqlar')).toBeTruthy();
    expect(screen.getByText(/14 bet/)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Word' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'PDF' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: /Yozish ·/ })).toBeNull();
    await act(async () => {});
    await waitFor(() => expect(screen.getByRole('button', { name: "To'ldirish" })).toBeTruthy());
  });
});
