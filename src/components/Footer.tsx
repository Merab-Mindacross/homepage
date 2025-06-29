import type { JSX } from "react";

/**
 * Footer: Legal and social links for the website.
 * @returns {JSX.Element} Footer content
 */
export default function Footer(): JSX.Element {
  return (
    <footer className="w-full py-6 flex flex-col items-center justify-center bg-neutral-900/90 border-t border-neutral-700 mt-0">
      <nav className="flex flex-wrap gap-6 items-center justify-center text-sm">
        <a href="/impressum" className="text-gray-400 hover:text-[#d6ba6d] transition-colors" target="_blank" rel="noopener noreferrer">Impressum</a>
        <a href="/datenschutz" className="text-gray-400 hover:text-[#d6ba6d] transition-colors" target="_blank" rel="noopener noreferrer">Datenschutz</a>
        <a href="/terms" className="text-gray-400 hover:text-[#d6ba6d] transition-colors" target="_blank" rel="noopener noreferrer">AGB</a>
        <a href="/kontakt" className="text-gray-400 hover:text-[#d6ba6d] transition-colors" target="_blank" rel="noopener noreferrer">Kontakt</a>
        <a href="https://www.youtube.com/" className="text-gray-400 hover:text-[#d6ba6d] transition-colors flex items-center gap-1" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" className="inline-block align-text-bottom"><path d="M23.498 6.186a2.994 2.994 0 0 0-2.107-2.12C19.228 3.5 12 3.5 12 3.5s-7.228 0-9.391.566A2.994 2.994 0 0 0 .502 6.186C0 8.36 0 12 0 12s0 3.64.502 5.814a2.994 2.994 0 0 0 2.107 2.12C4.772 20.5 12 20.5 12 20.5s7.228 0 9.391-.566a2.994 2.994 0 0 0 2.107-2.12C24 15.64 24 12 24 12s0-3.64-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          YouTube
        </a>
      </nav>
    </footer>
  );
} 