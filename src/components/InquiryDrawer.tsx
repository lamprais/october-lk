import { useEffect, useState } from 'react';

export default function InquiryDrawer() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [scope, setScope] = useState('Web Engineering & Booking');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const onOpen = () => {
      setSubmitted(false);
      setOpen(true);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    window.addEventListener('open-inquiry-drawer', onOpen);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('open-inquiry-drawer', onOpen);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex justify-end bg-black/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Project Inquiry"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div className="relative flex h-full w-full max-w-lg flex-col justify-between border-l border-white/15 bg-[#0A0A0B] p-8 sm:p-10">
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div>
              <p className="text-[11px] font-medium tracking-[0.2em] text-neutral-400 uppercase">
                Start a Project
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#F5F5F3]">
                October Digital Agency
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="border border-white/15 px-3 py-1.5 text-xs tracking-widest text-neutral-300 uppercase transition hover:border-white/40 hover:text-white"
            >
              Close
            </button>
          </div>

          {submitted ? (
            <div className="mt-12 border border-white/10 bg-white/[0.03] p-6">
              <p className="text-xs font-semibold tracking-[0.2em] text-[var(--ambient-accent)] uppercase">
                Brief Received
              </p>
              <p className="mt-3 text-lg font-medium text-[#F5F5F3]">
                Thank you, {name || 'there'}.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                Your inquiry regarding <span className="text-neutral-200">{scope}</span> is ready.
                You can also reach our Colombo studio directly at{' '}
                <a href="mailto:info@october.lk" className="underline underline-offset-4">
                  info@october.lk
                </a>{' '}
                or{' '}
                <a href="tel:+94778892555" className="underline underline-offset-4">
                  +94 77 889 2555
                </a>
                .
              </p>
              <a
                href={`mailto:info@october.lk?subject=${encodeURIComponent(`Project Inquiry: ${scope}`)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`}
                className="mt-6 inline-flex items-center border border-white/20 px-5 py-3 text-xs font-semibold tracking-[0.15em] text-white uppercase transition hover:bg-white hover:text-black"
              >
                Open in Mail Client
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="block text-[11px] font-medium tracking-[0.16em] text-neutral-400 uppercase">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ayesha Perera"
                  className="mt-2 w-full border border-white/15 bg-white/[0.02] px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-white/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium tracking-[0.16em] text-neutral-400 uppercase">
                  Work Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ayesha@property.lk"
                  className="mt-2 w-full border border-white/15 bg-white/[0.02] px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-white/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium tracking-[0.16em] text-neutral-400 uppercase">
                  Primary Focus
                </label>
                <select
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                  className="mt-2 w-full border border-white/15 bg-[#0A0A0B] px-4 py-3 text-sm text-white focus:border-white/50 focus:outline-none"
                >
                  <option>Web Engineering &amp; Booking</option>
                  <option>Brand Identity &amp; Art Direction</option>
                  <option>Technical SEO, GEO &amp; Growth</option>
                  <option>POS / PMS Data Pipelines</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium tracking-[0.16em] text-neutral-400 uppercase">
                  Project Notes
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Timeline, property or brand goals, and key integrations..."
                  className="mt-2 w-full border border-white/15 bg-white/[0.02] px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-white/50 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#F5F5F3] px-6 py-3.5 text-xs font-semibold tracking-[0.18em] text-[#0A0A0B] uppercase transition hover:bg-white"
              >
                Send Inquiry
              </button>
            </form>
          )}
        </div>

        <div className="border-t border-white/10 pt-5 text-xs text-neutral-500">
          <div className="flex items-center justify-between">
            <a href="mailto:info@october.lk" className="hover:text-white">
              info@october.lk
            </a>
            <a href="tel:+94778892555" className="hover:text-white">
              +94 77 889 2555
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
