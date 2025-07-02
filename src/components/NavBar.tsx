import type { JSX } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

/**
 * NavBar: Fixed navigation bar with backdrop blur, logo, and section scroll links.
 * @returns {JSX.Element} Navigation bar
 */
export default function NavBar(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  // Track which section is active for highlight
  const [activeSection, setActiveSection] = useState<string>("");
  // Ref for the nav element to animate
  const navRef = useRef<HTMLElement>(null);
  // State for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  // State for burger button visibility (hide menu if button is hidden)
  const [burgerVisible, setBurgerVisible] = useState<boolean>(false);
  // Ref for mobile burger button for animation
  const mobileBurgerRef = useRef<HTMLButtonElement>(null);
  // Ref for mobile menu panel (for animation)
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Section navigation logic
  const sectionLinks = [
    { id: "quality", label: "Qualitätsmanagement" },
    { id: "prozess", label: "Prozessmanagement" },
    { id: "lieferanten", label: "Lieferantenaufbau" },
    { id: "about", label: "Über mich" },
    { id: "kontakt", label: "Kontakt", to: "/kontakt" },
  ];

  // Scroll to section handler with fixed offset for animation completion
  function handleSectionClick(id: string) {
    return (e: React.MouseEvent) => {
      e.preventDefault();
      // Define offsets for each section based on GSAP animation end points
      // These values are determined by the animation triggers in App.tsx
      // and should match the point where the title and info cards are fully visible
      const sectionOffsets: Record<string, number> = {
        quality: 400, // After title and cards fade in (title: 70%->60%, cards: 60%->50%)
        prozess: 300, // After title and cards fade in (title: 80%->70%, cards: 70%->60%)
        lieferanten: 300, // After title and cards fade in (title: 80%->70%, cards: 70%->60%)
        about: 0 // No offset for about section
      };
      const offset = sectionOffsets[id] ?? 0;
      const scrollToSection = () => {
        const el = document.getElementById(id);
        if (el) {
          // Calculate the top position and add the offset
          const rect = el.getBoundingClientRect();
          const scrollTop = window.scrollY + rect.top - offset;
          window.scrollTo({ top: scrollTop, behavior: "smooth" });
        }
      };
      if (location.pathname !== "/") {
        navigate("/", { replace: false });
        setTimeout(scrollToSection, 100);
      } else {
        scrollToSection();
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
        if (scrollY + 500 >= cur.top) return cur.id;
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
    { to: "/", label: "Start" },
  ];

  // Animate NavBar show/hide on main page scroll (after hero, hide with CTA)
  useEffect(() => {
    if (location.pathname !== "/") return;
    const navEl = navRef.current;
    if (!navEl) return;
    // Set initial state: hidden and moved up
    gsap.set(navEl, { y: -80, opacity: 0 });
    // Set initial state for mobile burger button (hidden and moved up)
    const burgerBtn = mobileBurgerRef.current;
    if (burgerBtn) {
      gsap.set(burgerBtn, { y: -60, opacity: 0 });
    }
    // Show after hero section (after scroll-up animation, ~300px)
    const showTrigger = ScrollTrigger.create({
      trigger: "section#quality", // after hero
      start: "top 500px", // when quality section is 100px from top
      end: "+=100", // fade in over 100px
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.to(navEl, {
          y: -80 + 80 * progress,
          opacity: progress,
          duration: 0.1,
          overwrite: "auto",
          ease: "power2.out"
        });
        // Animate burger button in sync
        if (burgerBtn) {
          gsap.to(burgerBtn, {
            y: -60 + 60 * progress,
            opacity: progress,
            duration: 0.1,
            overwrite: "auto",
            ease: "power2.out",
            onUpdate: () => {
              // Set burgerVisible state based on opacity
              const computedOpacity = gsap.getProperty(burgerBtn, "opacity");
              setBurgerVisible(typeof computedOpacity === "number" ? computedOpacity > 0.01 : false);
            }
          });
        }
      }
    });
    // Hide with CTA section (same timing as CTA fade out)
    const hideTrigger = ScrollTrigger.create({
      trigger: "#nos", // CTA section
      start: "top 70%", // match CTA fade out start
      end: "top 20%", // match CTA fade out end
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.to(navEl, {
          y: 80 * -progress,
          opacity: 1 - progress,
          duration: 0.1,
          overwrite: "auto",
          ease: "power2.out"
        });
        // Animate burger button out in sync
        if (burgerBtn) {
          gsap.to(burgerBtn, {
            y: 60 * -progress,
            opacity: 1 - progress,
            duration: 0.1,
            overwrite: "auto",
            ease: "power2.out",
            onUpdate: () => {
              const computedOpacity = gsap.getProperty(burgerBtn, "opacity");
              setBurgerVisible(typeof computedOpacity === "number" ? computedOpacity > 0.01 : false);
            }
          });
        }
      }
    });
    return () => {
      showTrigger.kill();
      hideTrigger.kill();
    };
  }, [location.pathname]);

  // Animate mobile menu panel in/out when burgerVisible changes
  useEffect(() => {
    const menuEl = mobileMenuRef.current;
    if (!menuEl) return;
    if (mobileMenuOpen && burgerVisible) {
      // Slide in from left
      gsap.fromTo(
        menuEl,
        { x: -64, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
      );
    } else {
      // Slide out further left and fade out, with a smoother ease and longer duration
      gsap.to(menuEl, { x: -200, opacity: 0, duration: 0.45, ease: "expo.inOut" });
    }
  }, [mobileMenuOpen, burgerVisible]);

  // Ensure burgerVisible is always true on non-home pages
  useEffect(() => {
    if (location.pathname !== "/") {
      setBurgerVisible(true);
    }
  }, [location.pathname]);

  // Responsive: show floating burger on mobile, full nav on desktop

  return (
    <>
      {/* Desktop NavBar */}
      <nav
        ref={navRef}
        className="fixed left-1/2 top-2 z-1000 hidden md:block"
        style={{ transform: "translateX(-50%)" }}
        aria-label="Hauptnavigation"
      >
        <div className="bg-neutral-900/70 backdrop-blur-md rounded-2xl shadow-2xl border border-[#d6ba6d]/30 px-8 py-3 flex flex-row items-center gap-6 min-w-[420px]  mx-auto justify-center">
          {/* Logo as home/hero link (only show if not on main route) */}
          {location.pathname !== "/" && (
            <a
              href="/"
              onClick={handleLogoClick}
              className="flex items-center mr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6ba6d] focus-visible:ring-offset-2 "
              aria-label="Zur Startseite scrollen"
            >
              <img
                src="/Goldenes Dreieck mit Spiralensymbol.png"
                alt="Logo"
                className="h-10 w-10 rounded-xl "
                style={{ minWidth: 40, minHeight: 40 }}
              />
            </a>
          )}
          
          {/* Section links */}
          {sectionLinks.map((link) => (
            link.to ? (
              <Link
                key={link.id}
                to={link.to}
                className={`text-base px-3 py-1 rounded transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6ba6d] focus-visible:ring-offset-2 hover:text-[#d6ba6d] ${location.pathname === link.to ? "text-[#d6ba6d]" : "text-gray-200"}`}
                aria-current={location.pathname === link.to ? "page" : undefined}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={handleSectionClick(link.id)}
                className={`text-base px-3 py-1 rounded transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6ba6d] focus-visible:ring-offset-2 hover:text-[#d6ba6d] min-w-[120px] ${activeSection === link.id ? "text-[#d6ba6d]" : "text-gray-200"}`}
                aria-current={activeSection === link.id ? "page" : undefined}
              >
                {link.label}
              </a>
            )
          ))}
        </div>
      </nav>
      {/* Mobile Burger Button and Menu (Top Left) */}
      <div className="md:hidden">
        {/* Top-left floating burger button with animation and perfect centering */}
        <button
          ref={mobileBurgerRef}
          type="button"
          aria-label={mobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="fixed top-4 left-4 z-[1100] w-12 h-12 rounded-full bg-neutral-900/60 border border-[#d6ba6d]/60 shadow-xl backdrop-blur-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#d6ba6d] transition-all"
          style={{ backdropFilter: "blur(16px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
        >
          {/* Burger or X SVG depending on menu state */}
          {mobileMenuOpen ? (
            // X (close) icon
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", margin: "auto" }}>
              <line x1="6" y1="6" x2="22" y2="22" stroke="#d6ba6d" strokeWidth="3" strokeLinecap="round" />
              <line x1="22" y1="6" x2="6" y2="22" stroke="#d6ba6d" strokeWidth="3" strokeLinecap="round" />
            </svg>
          ) : (
            // Burger icon
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", margin: "auto" }}>
              <rect y="5" width="28" height="3" rx="1.5" fill="#d6ba6d" />
              <rect y="12.5" width="28" height="3" rx="1.5" fill="#d6ba6d" />
              <rect y="20" width="28" height="3" rx="1.5" fill="#d6ba6d" />
            </svg>
          )}
        </button>
        {/* Expandable menu (top left, stick to left) */}
        {mobileMenuOpen && burgerVisible && (
          <div className="fixed inset-0 z-[1099] bg-black/10" onClick={() => setMobileMenuOpen(false)}>
            <nav
              ref={mobileMenuRef}
              className="fixed top-4 left-4 min-w-[160px] max-w-[80vw] bg-neutral-900/60 rounded-2xl shadow-xl border-r-1 border-b-1  border-[#d6ba6d]/60 p-3 pt-12 flex flex-col gap-2 backdrop-blur-xl"
              aria-label="Mobile Navigation"
              style={{ backdropFilter: "blur(16px)" }}
              onClick={(e) => e.stopPropagation()}
            >
              {sectionLinks.map((link) => (
                link.to && link.to.startsWith("/") ? (
                  // If the link has a 'to' property starting with '/', use <Link> for navigation
                  <Link
                    key={link.id}
                    to={link.to}
                    className={`text-base font-medium px-2 py-1 rounded transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6ba6d] focus-visible:ring-offset-2 hover:text-[#d6ba6d] ${location.pathname === link.to ? "text-[#d6ba6d]" : "text-gray-200"}`}
                    aria-current={location.pathname === link.to ? "page" : undefined}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ) : (
                  // Otherwise, use anchor for section scroll
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={(e) => {
                      handleSectionClick(link.id)(e);
                      setMobileMenuOpen(false);
                    }}
                    className={`text-base font-medium px-2 py-1 rounded transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6ba6d] focus-visible:ring-offset-2 hover:text-[#d6ba6d] ${activeSection === link.id ? "text-[#d6ba6d]" : "text-gray-200"}`}
                    aria-current={activeSection === link.id ? "page" : undefined}
                  >
                    {link.label}
                  </a>
                )
              ))}
              {location.pathname !== "/" && (
                <hr className="my-1 border-[#d6ba6d]/20" />
              )}
              {location.pathname !== "/" && navLinks.map((link) => ( 
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-base font-medium px-2 py-1 rounded transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6ba6d] focus-visible:ring-offset-2 hover:text-[#d6ba6d] ${location.pathname === link.to ? "text-[#d6ba6d]" : "text-gray-200"}`}
                  aria-current={location.pathname === link.to ? "page" : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </>
  );
} 