import type { JSX } from "react";
import Footer from "./components/Footer";

/**
 * Datenschutz page (German privacy policy)
 * @returns {JSX.Element} Datenschutz content
 */
export default function Datenschutz(): JSX.Element {
  return (
    <main className="min-h-screen flex flex-col justify-between bg-neutral-900 text-gray-100 px-4 py-0 mt-12">
      <div className="mx-auto mt-16 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-[#d6ba6d] mb-6">Datenschutzerklärung</h1>
        <p className="mb-4">Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Nachfolgend informieren wir Sie über die Erhebung, Verarbeitung und Nutzung Ihrer Daten im Rahmen dieser Website.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">1. Verantwortlicher</h2>
        <p className="mb-2">Merab Torodadze<br />Musterstraße 1<br />12345 Musterstadt<br />Deutschland</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">2. Erhebung und Verarbeitung von Daten</h2>
        <p className="mb-2">Beim Besuch dieser Website werden automatisch Informationen (z.B. IP-Adresse, Datum, Uhrzeit) erfasst. Diese Daten dienen ausschließlich statistischen Zwecken und werden nicht an Dritte weitergegeben.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">3. Ihre Rechte</h2>
        <p className="mb-2">Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung Ihrer Daten. Kontaktieren Sie uns hierzu unter info@merab-torodadze.de.</p>
        <p className="mt-6 text-xs text-gray-400">Dies ist eine Platzhalter-Datenschutzerklärung. Bitte ersetzen Sie die Angaben durch Ihre echten Datenschutzinformationen.</p>
      </div>
      <Footer />
    </main>
  );
} 