// lib/api.ts
export async function getFeed() {
  const res = await fetch('/api/feed', { cache: 'no-store' });
  if (!res.ok) throw new Error('Erro ao buscar feed');
  return res.json();
}
