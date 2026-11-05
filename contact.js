// Vercel serverless function: form data ko n8n webhook par bhejta hai.
// Vercel > Project Settings > Environment Variables me N8N_WEBHOOK_URL set karein.
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  const url = process.env.N8N_WEBHOOK_URL;
  if (!url) return res.status(500).json({ ok: false, error: 'N8N_WEBHOOK_URL not set' });
  try {
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(req.body) });
    return res.status(r.ok ? 200 : 502).json({ ok: r.ok });
  } catch {
    return res.status(502).json({ ok: false });
  }
};
