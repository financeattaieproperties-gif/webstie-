import { useMemo, useState } from 'react';
import { X, CalendarDays, Phone, CheckCircle2 } from 'lucide-react';
import { submitVisitRequest } from '../../lib/dbService';

export interface VisitTarget {
  label: string;
  propertyId?: number;
  projectId?: number;
  projectUnitId?: number;
}

const KABUL_OFFSET = 4.5 * 60 * 60 * 1000;
const dateInKabul = () => new Date(Date.now() + KABUL_OFFSET).toISOString().slice(0, 10);
const isFriday = (date: string) => new Date(`${date}T12:00:00+04:30`).getDay() === 5;
const slots = Array.from({ length: 27 }, (_, index) => {
  const minutes = 7 * 60 + index * 30;
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
});

export function VisitRequestDialog({ target, onClose }: { target: VisitTarget; onClose: () => void }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState(dateInKabul());
  const [time, setTime] = useState('07:00');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [error, setError] = useState('');
  const friday = useMemo(() => isFriday(date), [date]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (friday) { setError('Friday is unavailable. Choose Saturday through Thursday.'); return; }
    setError(''); setStatus('sending');
    try {
      await submitVisitRequest({ name, phone, requestedAt: `${date}T${time}:00+04:30`, ...target });
      setStatus('success');
    } catch (err) { setError(err instanceof Error ? err.message : 'Could not request a visit.'); setStatus('idle'); }
  };

  return <div className="fixed inset-0 z-[110] bg-brand-navy/75 p-4 flex items-center justify-center" role="presentation" onMouseDown={onClose}>
    <div role="dialog" aria-modal="true" aria-labelledby="visit-title" onMouseDown={event => event.stopPropagation()} className="w-full max-w-lg rounded-2xl bg-white p-6 sm:p-8 shadow-brand-xl">
      <div className="flex items-start justify-between gap-4 mb-6"><div><p className="text-brand-gold text-xs font-bold uppercase tracking-wider">Request a visit</p><h2 id="visit-title" className="text-2xl font-bold text-brand-navy">Visit {target.label}</h2><p className="mt-1 text-sm text-neutral-500">We will confirm your requested time by phone.</p></div><button type="button" aria-label="Close visit form" onClick={onClose} className="p-2 text-neutral-500 hover:text-brand-navy"><X /></button></div>
      {status === 'success' ? <div className="py-10 text-center"><CheckCircle2 className="mx-auto text-status-available mb-4" size={42}/><h3 className="text-xl font-bold text-brand-navy">Visit requested</h3><p className="mt-2 text-neutral-600">Your requested time is pending confirmation. Our team will call you shortly.</p><button type="button" onClick={onClose} className="mt-6 px-5 py-3 rounded-xl bg-brand-navy text-white font-semibold">Close</button></div> : <form onSubmit={submit} className="space-y-4">
        <label className="block text-sm font-semibold text-brand-navy">Full name<input required minLength={2} value={name} onChange={event => setName(event.target.value)} className="mt-1.5 w-full rounded-xl border border-neutral-300 px-4 py-3" /></label>
        <label className="block text-sm font-semibold text-brand-navy">Afghan mobile number<input required type="tel" value={phone} onChange={event => setPhone(event.target.value)} placeholder="07XX XXX XXXX" className="mt-1.5 w-full rounded-xl border border-neutral-300 px-4 py-3" /></label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><label className="block text-sm font-semibold text-brand-navy">Date<input required min={dateInKabul()} type="date" value={date} onChange={event => setDate(event.target.value)} className="mt-1.5 w-full rounded-xl border border-neutral-300 px-4 py-3" /></label><label className="block text-sm font-semibold text-brand-navy">Time<select value={time} onChange={event => setTime(event.target.value)} className="mt-1.5 w-full rounded-xl border border-neutral-300 px-4 py-3">{slots.map(slot => <option key={slot}>{slot}</option>)}</select></label></div>
        <p className="flex gap-2 text-xs text-neutral-500"><CalendarDays size={15} className="shrink-0"/>Saturday–Thursday, 07:00–20:00 Afghanistan Time. Friday is closed.</p>
        {friday && <p className="text-sm text-red-600">Friday is closed. Select another date.</p>}{error && <p className="text-sm text-red-600">{error}</p>}<input name="website" className="hidden" tabIndex={-1} autoComplete="off" />
        <button disabled={status === 'sending' || friday} className="w-full rounded-xl bg-brand-gold px-5 py-3 font-bold text-white disabled:opacity-50"><Phone size={17} className="inline mr-2"/>{status === 'sending' ? 'Sending request…' : 'Request visit'}</button>
      </form>}
    </div>
  </div>;
}
