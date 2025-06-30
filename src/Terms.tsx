import type { JSX } from "react";
import Footer from "./components/Footer";

/**
 * Terms and Services (AGB & Nutzungsbedingungen) page in German
 * @returns {JSX.Element} Terms content
 */
export default function Terms(): JSX.Element {
  return (
    <main className="min-h-screen flex flex-col justify-between bg-neutral-900 text-gray-100 px-4 py-0 mt-12">
      <div className="mx-auto mt-16 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-[#d6ba6d] mb-6">AGB & Nutzungsbedingungen</h1>
        <p className="mb-4">Mit der Nutzung dieser Website erkennen Sie die folgenden Allgemeinen Geschäftsbedingungen (AGB) und Nutzungsbedingungen an.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">1. Geltungsbereich</h2>
        <p className="mb-2">Diese Bedingungen gelten für alle Nutzer dieser Website.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">2. Nutzung der Website</h2>
        <p className="mb-2">Die Inhalte dieser Website dürfen nicht ohne ausdrückliche Genehmigung weiterverwendet werden.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">3. Haftung</h2>
        <p className="mb-2">Wir übernehmen keine Haftung für die Richtigkeit und Vollständigkeit der bereitgestellten Informationen.</p>
        <p className="mt-6 text-xs text-gray-400">Dies ist ein Platzhalter für AGB & Nutzungsbedingungen. Bitte ersetzen Sie die Angaben durch Ihre echten rechtlichen Hinweise.</p>
      </div>
      <Footer />
    </main>
  );
} 