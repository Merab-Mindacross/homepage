import type { JSX } from "react";
import Footer from "./components/Footer";

/**
 * Impressum page (German legal disclosure)
 * @returns {JSX.Element} Impressum content
 */
export default function Impressum(): JSX.Element {
  return (
    <main className="min-h-screen flex flex-col justify-between bg-neutral-900 text-gray-100 px-4 py-0">
      <div className="mx-auto mt-16 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-[#d6ba6d] mb-6">Impressum</h1>
        <p className="mb-4 text-sm text-gray-100/60">Angaben gemäß § 5 TMG</p>
        <p className="mb-2">Merab Torodadze<br />Werastr. 126<br />70190 Stuttgart<br />Deutschland</p>
        <p className="mb-2">Telefon: <a href="tel:+491777376989" className=" hover:text-gray-100">+49 177 7376989</a><br /> E-Mail: <a href="mailto:tedoradze.merab@web.de" className=" hover:text-gray-100">tedoradze.merab@web.de</a></p>
        <p className="text-sm text-gray-400">Umsatzsteuer-ID: DE353696916</p>

        {/* <p className="mb-2">Umsatzsteuer-ID: DE123456789</p> */}
      </div>
      <Footer />
    </main>
  );
} 