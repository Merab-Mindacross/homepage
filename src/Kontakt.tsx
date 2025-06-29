import type { JSX } from "react";

/**
 * Kontakt page (German contact page)
 * @returns {JSX.Element} Kontakt content
 */
export default function Kontakt(): JSX.Element {
  return (
    <main className="min-h-screen bg-neutral-900 text-gray-100 flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-xl w-full bg-neutral-800/90 rounded-2xl shadow-2xl border border-[#d6ba6d]/40 p-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-[#d6ba6d] mb-6">Kontakt</h1>
        <p className="mb-4 text-lg">Sie können mich gerne per E-Mail oder Telefon erreichen:</p>
        <div className="flex flex-col gap-4 items-center">
          <div className="flex items-center gap-3">
            <svg width="24" height="24" fill="none" stroke="#d6ba6d" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/><path d="M16 2v4H8V2"/><path d="M12 18h.01"/></svg>
            <a href="mailto:Tedoradze.merab@web.de" className="text-[#d6ba6d] text-lg font-medium hover:underline">Tedoradze.merab@web.de</a>
          </div>
          <div className="flex items-center gap-3">
            <svg width="24" height="24" fill="none" stroke="#d6ba6d" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92V19a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3 5.18 2 2 0 0 1 5 3h2.09a2 2 0 0 1 2 1.72c.13.81.36 1.6.68 2.34a2 2 0 0 1-.45 2.11l-.27.27a16 16 0 0 0 6.29 6.29l.27-.27a2 2 0 0 1 2.11-.45c.74.32 1.53.55 2.34.68A2 2 0 0 1 21 16.91z"/></svg>
            <a href="tel:+491777376989" className="text-[#d6ba6d] text-lg font-medium hover:underline">+49 177 7376989</a>
          </div>
        </div>
      </div>
    </main>
  );
} 