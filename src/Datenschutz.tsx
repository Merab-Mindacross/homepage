import type { JSX } from "react";
import Footer from "./components/Footer";

/**
 * Datenschutz page (German privacy policy)
 * @returns {JSX.Element} Datenschutz content
 */
export default function Datenschutz(): JSX.Element {
  return (
    <main className="min-h-screen flex flex-col justify-between bg-neutral-900 text-gray-100 px-4 py-0">
      <div className="mx-auto mt-16 max-w-2xl w-full mb-12">
        <h1 className="text-lg md:text-3xl font-bold text-[#d6ba6d] mb-6">Datenschutzerklärung</h1>
        <h2 className="text-xl font-semibold mt-6 mb-2">Allgemeine Hinweise</h2>
        <p className="mb-4">Der Schutz Ihrer persönlichen Daten ist uns wichtig. Auf dieser Website werden keine personenbezogenen Daten erhoben, gespeichert oder verarbeitet.</p>
        <ul className="mb-4 list-disc list-inside text-gray-100/90 pl-4">
          <li>kein Einsatz von Tracking-Tools</li>
          <li>keine Verwendung von Cookies</li>
          <li>keine Erfassung oder Analyse Ihres Nutzungsverhaltens</li>
          <li>keine Kontaktformulare oder Newsletter</li>
          <li>keine Einbindung externer Dienste wie Google Fonts, Google Analytics, YouTube, Social-Media-Plug-ins o. Ä.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">Server-Logfiles</h2>
        <p className="mb-2">Beim Aufruf der Website werden durch den Hosting-Anbieter automatisch Informationen in sogenannten Server-Logfiles gespeichert. Diese Daten umfassen z. B.:</p>
        <ul className="mb-4 list-disc list-inside text-gray-100/90 pl-4">
          <li>Browsertyp und -version</li>
          <li>verwendetes Betriebssystem</li>
          <li>Referrer-URL</li>
          <li>Hostname des zugreifenden Rechners</li>
          <li>Uhrzeit der Serveranfrage</li>
        </ul>
        <p className="mb-4">Diese Informationen dienen ausschließlich der technischen Überwachung und Betriebssicherheit der Website und lassen keinen Rückschluss auf Ihre Person zu. Sie werden nicht mit anderen Datenquellen zusammengeführt oder ausgewertet.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">Verantwortlicher im Sinne der DSGVO</h2>
        <p className="mb-2">Merab Torodadze<br />Werastr. 126<br />70190 Stuttgart<br />Deutschland</p>
        <p className="mb-2">Telefon: <a href="tel:+491777376989" className="hover:text-gray-100">+49 177 7376989</a><br />E-Mail: <a href="mailto:tedoradze.merab@web.de" className="hover:text-gray-100">tedoradze.merab@web.de</a></p>
        <h2 className="text-xl font-semibold mt-6 mb-2">Ihre Rechte</h2>
        <p className="mb-2">Da keine personenbezogenen Daten verarbeitet werden, entstehen Ihnen keine datenschutzrechtlichen Verpflichtungen. Grundsätzlich haben Sie aber das Recht auf:</p>
        <ul className="mb-4 list-disc list-inside text-gray-100/90 pl-4">
          <li>Auskunft (Art. 15 DSGVO)</li>
          <li>Berichtigung (Art. 16 DSGVO)</li>
          <li>Löschung (Art. 17 DSGVO)</li>
          <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
          <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
        </ul>
        <p className="mb-4">Eine Kontaktaufnahme diesbezüglich ist unter den oben genannten Kontaktdaten möglich.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">Hinweis</h2>
        <p className="mb-2">Diese Website dient ausschließlich zur allgemeinen Information und stellt keine geschäftsmäßige Datenverarbeitung im Sinne der DSGVO dar.</p>
      </div>
      <Footer />
    </main>
  );
} 