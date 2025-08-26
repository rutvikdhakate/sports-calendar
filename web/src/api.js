const API_BASE = 'http://localhost:4000';

export async function fetchEvents({ from, to, sports }) {
  const params = new URLSearchParams();
  if (from) params.set('from', from);
  if (to) params.set('to', to);
  if (sports?.length) params.set('sports', sports.join(','));
  const res = await fetch(`${API_BASE}/api/events?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to load events');
  return res.json();
}