import type { JSX } from "react";
import Footer from "./components/Footer";

/**
 * Impressum page (German legal disclosure)
 * @returns {JSX.Element} Impressum content
 */
export default function Impressum(): JSX.Element {
  return (
    <main className="min-h-screen bg-neutral-900 text-gray-100 flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full bg-neutral-800/90 rounded-2xl shadow-2xl border border-[#d6ba6d]/40 p-8">
        <h1 className="text-3xl font-bold text-[#d6ba6d] mb-6">Impressum</h1>
        <p className="mb-4">Angaben gemäß § 5 TMG</p>
        <p className="mb-2">Merab Torodadze<br />Musterstraße 1<br />12345 Musterstadt<br />Deutschland</p>
        <p className="mb-2">Telefon: +49 123 4567890<br />E-Mail: info@merab-torodadze.de</p>
        <p className="mb-2">Umsatzsteuer-ID: DE123456789</p>
        <p className="mt-6 text-xs text-gray-400">Dies ist ein Platzhalter-Impressum. Bitte ersetzen Sie die Angaben durch Ihre echten Kontaktdaten und rechtlichen Hinweise.</p>
      </div>
      <Footer />
    </main>
  );
} 