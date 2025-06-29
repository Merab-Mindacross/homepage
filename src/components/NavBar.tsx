import type { JSX } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

/**
 * NavBar: Fixed navigation bar with backdrop blur, logo, and section scroll links.
 * @returns {JSX.Element} Navigation bar
 */
export default function NavBar(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  // Track which section is active for highlight
  const [activeSection, setActiveSection] = useState<string>("");

  // Section navigation logic
  const sectionLinks = [
    { id: "quality", label: "Qualitätsmanagement" },
    { id: "prozess", label: "Prozessmanagement" },
    { id: "lieferanten", label: "Lieferantenaufbau" },
    { id: "about", label: "Über mich" },
  ];

  // Scroll to section handler
  function handleSectionClick(id: string) {
    return (e: React.MouseEvent) => {
      e.preventDefault();
      if (location.pathname !== "/") {
        navigate("/", { replace: false });
        // Wait for navigation, then scroll
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    };
  }

  // Scroll to top/hero handler
  function handleLogoClick(e: React.MouseEvent) {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/", { replace: false });
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // Highlight active section as user scrolls
  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection("");
      return;
    }
    function onScroll() {
      const scrollY = window.scrollY;
      const offsets = sectionLinks.map((s) => {
        const el = document.getElementById(s.id);
        return el ? { id: s.id, top: el.getBoundingClientRect().top + window.scrollY } : null;
      }).filter(Boolean) as { id: string; top: number }[];
      const current = offsets.reduce((acc, cur) => {
        if (scrollY + 120 >= cur.top) return cur.id;
        return acc;
      }, "");
      setActiveSection(current);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname]);

  // Other nav links
  const navLinks = [
    { to: "/kontakt", label: "Kontakt" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-neutral-900/70 border-b border-[#d6ba6d]/20 shadow-lg"
      aria-label="Hauptnavigation"
    >
      <div className="max-w-6xl mx-auto px-4 py-2 flex flex-row items-center gap-6">
        {/* Logo as home/hero link */}
        <a
          href="/"
          onClick={handleLogoClick}
          className="flex items-center mr-2 focus:outline-none focus:ring-2 focus:ring-[#d6ba6d] focus:ring-offset-2"
          aria-label="Zur Startseite scrollen"
        >
          <img
            src="/src/assets/Goldenes Dreieck mit Spiralensymbol.png"
            alt="Logo"
            className="h-10 w-10 rounded-xl bg-white/10 shadow"
            style={{ minWidth: 40, minHeight: 40 }}
          />
        </a>
        {/* Section links */}
        {sectionLinks.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            onClick={handleSectionClick(link.id)}
            className={`text-base px-3 py-1 rounded transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#d6ba6d] focus:ring-offset-2 hover:text-[#d6ba6d] ${activeSection === link.id ? "text-[#d6ba6d]" : "text-gray-200"}`}
            aria-current={activeSection === link.id ? "page" : undefined}
          >
            {link.label}
          </a>
        ))}
        <span className="flex-1" />
        {/* Other nav links */}
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`text-base px-3 py-1 rounded transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#d6ba6d] focus:ring-offset-2 hover:text-[#d6ba6d] ${location.pathname === link.to ? "text-[#d6ba6d]" : "text-gray-200"}`}
            aria-current={location.pathname === link.to ? "page" : undefined}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
} 