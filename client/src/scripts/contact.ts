export interface ContactPayload {
  from_name: string;
  from_email: string;
  subject: string;
  message: string;
}

const clean = (value?: string) => value?.trim().replace(/^['"]|['"]$/g, '') || undefined;

const config = {
  serviceId: clean(import.meta.env.VITE_EMAILJS_SERVICE_ID),
  templateId: clean(import.meta.env.VITE_EMAILJS_TEMPLATE_ID),
  publicKey: clean(import.meta.env.VITE_EMAILJS_PUBLIC_KEY),
  toEmail: clean(import.meta.env.VITE_CONTACT_TO_EMAIL) ?? 'kprathamesh2001@gmail.com',
};

export function validateContact(data: ContactPayload) {
  const errors: Partial<Record<keyof ContactPayload, string>> = {};
  const name = data.from_name?.trim() ?? '';
  const email = data.from_email?.trim() ?? '';
  const subject = data.subject?.trim() ?? '';
  const message = data.message?.trim() ?? '';

  if (name.length < 2) errors.from_name = name ? 'Name must be at least 2 characters' : 'Name is required';
  if (!email) errors.from_email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.from_email = 'Enter a valid email address';
  if (subject.length < 3) errors.subject = subject ? 'Subject must be at least 3 characters' : 'Subject is required';
  if (message.length < 10) errors.message = message ? 'Message must be at least 10 characters' : 'Message is required';
  return errors;
}

async function viaEmailJs(data: ContactPayload) {
  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: config.serviceId,
      template_id: config.templateId,
      user_id: config.publicKey,
      template_params: {
        ...data,
        to_email: config.toEmail,
        reply_to: data.from_email,
        submitted_at: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      },
    }),
  });
  if (!res.ok) throw new Error(`EmailJS ${res.status}: ${await res.text()}`);
}

async function viaFormSubmit(data: ContactPayload) {
  const res = await fetch(`https://formsubmit.co/ajax/${config.toEmail}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      name: data.from_name,
      email: data.from_email,
      _subject: `[Portfolio] ${data.subject}`,
      _replyto: data.from_email,
      _template: 'table',
      _captcha: 'false',
      message: data.message,
    }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || String(body.success) !== 'true') throw new Error(`FormSubmit: ${body.message ?? res.status}`);
}

export async function sendContact(data: ContactPayload): Promise<{ ok: boolean; message: string }> {
  const senders = [];
  if (config.serviceId && config.templateId && config.publicKey) senders.push(viaEmailJs);
  senders.push(viaFormSubmit);

  for (const send of senders) {
    try {
      await send(data);
      return { ok: true, message: "Thanks — your message is in my inbox. I'll get back to you soon." };
    } catch (error) {
      console.warn(error);
    }
  }

  const mailto = `mailto:${config.toEmail}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(
    `${data.message}\n\n— ${data.from_name} (${data.from_email})`,
  )}`;
  window.location.href = mailto;
  return { ok: false, message: `Couldn't send from the site, so I've opened your email app instead. You can also write to ${config.toEmail}.` };
}
