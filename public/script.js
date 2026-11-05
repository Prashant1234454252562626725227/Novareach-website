// Forms /api/contact par POST hote hain (Vercel function), jo n8n webhook ko forward karta hai.
// Seedha n8n use karna ho to yahan webhook URL daal dein (lekin URL public ho jayega).
const ENDPOINT = '/api/contact';

const btn = document.querySelector('.menu-btn');
const nav = document.getElementById('nav');
btn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  btn.setAttribute('aria-expanded', open);
});
nav.addEventListener('click', e => { if (e.target.tagName === 'A') { nav.classList.remove('open'); btn.setAttribute('aria-expanded', false); } });
document.getElementById('year').textContent = new Date().getFullYear();
const dateInput = document.querySelector('input[type=date]');
if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];

document.querySelectorAll('form[data-type]').forEach(form => {
  const status = form.querySelector('.status');
  const show = (text, cls) => { status.textContent = text; status.className = 'status ' + cls; };

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    if (data.company) return; // honeypot: bots ke liye
    if (!data.name.trim()) return show('Please enter your name.', 'err');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return show('Enter a valid email address.', 'err');
    if (form.dataset.type === 'contact' && !data.message.trim()) return show('Please write a short message.', 'err');
    if (form.dataset.type === 'meeting' && !data.date) return show('Please choose a date.', 'err');

    delete data.company;
    const payload = { type: form.dataset.type, ...data, source: 'novareach-website', submittedAt: new Date().toISOString() };
    const submit = form.querySelector('button[type=submit]');
    submit.disabled = true; show('Sending...', '');
    try {
      const res = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error();
      form.reset();
      show(form.dataset.type === 'meeting' ? 'Meeting request sent. We will confirm by email.' : 'Thank you! We will reply within one working day.', 'ok');
    } catch {
      show('Could not send. Please email hello@novareach.in.', 'err');
    }
    submit.disabled = false;
  });
});
