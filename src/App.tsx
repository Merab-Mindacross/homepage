import { useRef, useEffect, type JSX } from "react";
import { gsap } from "gsap";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Impressum from "./Impressum";
import Datenschutz from "./Datenschutz";
import Kontakt from "./Kontakt";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import LogoIntro from "./components/LogoIntro";
import { InfoCard } from "./components/InfoCard";
import { SchulungCard } from "./components/SchulungCard";
gsap.registerPlugin(ScrollTrigger);
const viewportWidth = window.innerWidth;
const isMobileViewport = viewportWidth <= 768;
/**
 * App component: Only a hero section with parallax-ready background image.
 * Headline: Kurzfristige Verstärkung mit langfristigem Effekt.
 * Subheadline: Interim Management in der Schnittstelle von Qualität, Prozessen und Lieferanten.
 */
function App(): JSX.Element {
  const location = useLocation();
  // Only run animation logic on main page
  const isMainPage = location.pathname === "/";

  const heroRef = useRef<HTMLElement>(null);

  // Refs for scroll-up elements
  const scrollUpRefs = [useRef<HTMLHeadingElement>(null), useRef<HTMLHeadingElement>(null), useRef<HTMLParagraphElement>(null), useRef<HTMLDivElement>(null)];
  // Ref for the logo image
  const logoRef = useRef<HTMLImageElement>(null);
  const logoRefStatic = useRef<HTMLImageElement>(null);
  // Ref for the next section (e.g., Prozessmanagement)
  const prozessRef = useRef<HTMLElement>(null);

  // Refs for Prozessmanagement section
  const prozessTitleRef = useRef<HTMLHeadingElement>(null);
  const prozessCardsRef = useRef<HTMLDivElement>(null);

  // Refs for Lieferantenaufbau section
  const lieferantenRef = useRef<HTMLElement>(null);
  const lieferantenTitleRef = useRef<HTMLHeadingElement>(null);
  const lieferantenCardsRef = useRef<HTMLDivElement>(null);

  // Ref for the CTA button in the NOS section
  const ctaRef = useRef<HTMLAnchorElement>(null);

  // Only show the logo intro on the main page
  const showLogoIntro = isMainPage;

  // Scroll to section handlers for hero section links
  function handleQualitaetClick(e: React.MouseEvent) {
    e.preventDefault();
    const sectionOffsets: Record<string, number> = {
      quality: 400, // After title and cards fade in
      prozess: 300, // After title and cards fade in  
      lieferanten: 300, // After title and cards fade in
    };
    const offset = sectionOffsets["quality"] ?? 0;
    const scrollToSection = () => {
      const el = document.getElementById("quality");
      if (el) {
        const rect = el.getBoundingClientRect();
        const scrollTop = window.scrollY + rect.top - offset;
        window.scrollTo({ top: scrollTop, behavior: "smooth" });
      }
    };
    scrollToSection();
  }

  function handleProzessenClick(e: React.MouseEvent) {
    e.preventDefault();
    const sectionOffsets: Record<string, number> = {
      quality: 400,
      prozess: 300,
      lieferanten: 300,
    };
    const offset = sectionOffsets["prozess"] ?? 0;
    const scrollToSection = () => {
      const el = document.getElementById("prozess");
      if (el) {
        // For relative positioned sections, use offsetTop
        const scrollTop = el.offsetTop - offset;
        window.scrollTo({ top: scrollTop, behavior: "smooth" });
      }
    };
    scrollToSection();
  }

  function handleLieferantenClick(e: React.MouseEvent) {
    e.preventDefault();
    const sectionOffsets: Record<string, number> = {
      quality: 400,
      prozess: 300,
      lieferanten: 300,
    };
    const offset = sectionOffsets["lieferanten"] ?? 0;
    const scrollToSection = () => {
      const el = document.getElementById("lieferanten");
      if (el) {
        // For relative positioned sections, use offsetTop
        const scrollTop = el.offsetTop - offset;
        window.scrollTo({ top: scrollTop, behavior: "smooth" });
      }
    };
    scrollToSection();
  }

  function handleSchulungenClick(e: React.MouseEvent) {
    e.preventDefault();
    const sectionOffsets: Record<string, number> = {
      quality: 400,
      prozess: 300,
      lieferanten: 300,
      schulungen: 0,
    };
    const offset = sectionOffsets["schulungen"] ?? 0;
    const scrollToSection = () => {
      const el = document.getElementById("schulungen");
      if (el) {
        // For relative positioned sections, use offsetTop
        const scrollTop = el.offsetTop - offset;
        window.scrollTo({ top: scrollTop, behavior: "smooth" });
      }
    };
    scrollToSection();
  }

  // (Optional) Parallax effect for hero background image
  useEffect(() => {
    if (!isMainPage) return;
    // Apply the same gradient background to the body for consistent overscroll appearance
    const body = document.body;
    const prevClass = body.className;
    body.classList.add("bg-gradient-to-tr", "from-neutral-900", "to-neutral-800");

    /**
     * Initialize Lenis smooth scrolling and set up animation frame loop.
     * Ensures cleanup on component unmount.
     */
    const lenis = new Lenis();
    let rafId: number | undefined;

    /**
     * Animation frame callback for Lenis smooth scroll.
     * @param time - The current time in milliseconds
     */
    function raf(time: number): void {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    }

    rafId = window.requestAnimationFrame(raf);

    /**
     * Sync GSAP's ScrollTrigger with Lenis scroll events.
     * Ensures ScrollTrigger updates on every Lenis scroll.
     */
    function onLenisScroll(): void {
      ScrollTrigger.update();
    }
    lenis.on("scroll", onLenisScroll);

    /**
     * Animate scroll-up elements: each scrolls up at a different pace and fades out as it moves up.
     * Uses GSAP and ScrollTrigger for scroll-based animation.
     */
    const elements = scrollUpRefs.map((ref) => ref.current);
    // Animation parameters for each element
    // Responsive yOffsets for mobile/desktop
    const isMobile = window.innerWidth <= 768;
    // For mobile, animate in x direction (left), for desktop in y (up)
    const yOffsets = isMobile ? [0, 0, 0, 0] : [0,0,0,0]; // px, initial y offset for desktop
    const xOffsets = isMobile ? [0, 0, 0, 0] : [0, 0, 0, 0]; // px, initial x offset for mobile
    const yMoveFactors = isMobile ? [-150, -80, -50, -30] : [100, 60, 40, 25]; 
    const xMoveFactors = isMobile ? [0, 0, 0, 0] : [0, 0, 0, 0]; 
    const scaleFactors = [1.3, 1.2, 1.1, 1.05]; // scale for both
    const fadeStart = 0; 
    const fadeEnd = isMobile ? 0.4 : 0.5; 
    const triggers: ScrollTrigger[] = [];

    elements.forEach((el, i) => {
      if (!el) return;
      // Set initial position
      // gsap.set(el, { y: yOffsets[i], x: xOffsets[i], opacity: 1 });
      // Animate on scroll
      const trigger = ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top -1%",
        end: "+=300",
        scrub: true,
        onUpdate: (self) => {
          // Progress: 0 (start) to 1 (end)
          const progress = self.progress;
          // For mobile: move left (x), for desktop: move up (y)
          const y = yOffsets[i] - yMoveFactors[i] * progress;
          const x = xOffsets[i] - xMoveFactors[i] * progress;
          // Calculate the scale based on scaleFactors and progress
          const scale = 1 + (scaleFactors[i] - 1) * progress;
          // Fade out between fadeStart and fadeEnd
          let opacity = 1;
          if (progress > fadeStart) {
            opacity = 1 - (progress - fadeStart) / (fadeEnd - fadeStart);
            if (opacity < 0) opacity = 0;
          }
          if (isMobile) {
            gsap.to(el, { x, y: 0, opacity, scale, overwrite: "auto", duration: 0.1, ease: "power2.out" });
          } else {
            gsap.to(el, { y, x: 0, opacity, scale, overwrite: "auto", duration: 0.1, ease: "sine.inOut" });
          }
        },
      });
      triggers.push(trigger);
    });

    /**
     * Animate logo: scale down and rotate after hero section scroll-up animations are over.
     * The logo remains vertically centered and pressed to the left.
     */
    const logoEl = logoRef.current;
    if (logoEl && elements[3]) {
      // Set initial state: vertically centered, left-aligned
      gsap.set(logoEl, { scale: 1, rotate: 0, x: 0, y: 0 });
      // Animate after last scroll-up element (the button)
      const lastScrollUpEnd = {
        trigger: elements[3],
        start: "top 30%", // matches the end of the last scroll-up animation
        end: "+=100", // over 100px scroll
        scrub: true,
        onUpdate: (self: ScrollTrigger) => {
          const progress = self.progress;
          // Scale from 1 to 0.6, rotate from 0 to -30deg
          const scale = 1 - 0.4 * progress;
          const rotate = -60 * progress;
          gsap.to(logoEl, {
            scale,
            rotate,
            
            overwrite: "auto",
            duration: 0.1,
            ease: "sine.out"
          });
        }
      };
      if(isMobileViewport) {
        lastScrollUpEnd.onUpdate = (self) => {
          const progress = self.progress;
          // Scale from 1 to 0.6, rotate from 0 to -30deg
          // const y = -50 * progress;
          const scale = 1 - 0.4 * progress;
          const rotate = -60 * progress;
          gsap.to(logoEl, {
            // y,
            scale,
            rotate,
            overwrite: "auto",
            duration: 0.1,
            ease: "sine.out"
          });
        }
      }

      const logoTrigger = ScrollTrigger.create(lastScrollUpEnd);
      triggers.push(logoTrigger);
    }

    // Cleanup function: kill ScrollTriggers and cancel animation frame
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      if (typeof rafId === "number") {
        window.cancelAnimationFrame(rafId);
      }
      lenis.off("scroll", onLenisScroll);
      // Restore previous body class
      body.className = prevClass;
      // Cleanup: kill triggers
      triggers.forEach((trigger) => trigger.kill());
    };
  }, [isMainPage]);

  // Set --vh variable for mobile viewport height compensation
  useEffect(() => {
    function setViewportHeightVar() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    setViewportHeightVar();
    window.addEventListener('resize', setViewportHeightVar);
    window.addEventListener('orientationchange', setViewportHeightVar);
    return () => {
      window.removeEventListener('resize', setViewportHeightVar);
      window.removeEventListener('orientationchange', setViewportHeightVar);
    };
  }, []);

  // Robust vertical centering for logo: ensures correct position on load, resize, and before GSAP animation
  useEffect(() => {
    const logoEl = logoRef.current;
    if (!logoEl) return;
    // Handler to center the logo: horizontally centered and near the top on mobile, vertically centered on desktop.
    function handlePositioning(): void {
      if (!logoEl) return; // Defensive: check again in case of race condition
      const logoWidth = logoEl.offsetWidth;
        const logoHeight = logoEl.offsetHeight;
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        const vh = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--vh')) || (window.innerHeight * 0.01);
        const top = 2 * vh; // 2vh
        gsap.set(logoEl, {
          position: "fixed",
          top,
          left: (window.innerWidth - logoWidth) / 2,
          x: 0,
          y: 0,
        });
      } else {
        const top = (window.innerHeight - logoHeight) / 2;
        gsap.set(logoEl, {
          position: "fixed",
          top,
          left: 0,
          x: 0,
          y: 0,
        });
      }
    }
    // Run on mount, image load, and every resize/orientationchange
      if (logoEl.complete) {
        handlePositioning();
      } else {
        logoEl.addEventListener("load", handlePositioning);
      }
      window.addEventListener("resize", handlePositioning);
    window.addEventListener("orientationchange", handlePositioning);
      // Cleanup listeners on unmount
      return () => {
        logoEl.removeEventListener("load", handlePositioning);
        window.removeEventListener("resize", handlePositioning);
      window.removeEventListener("orientationchange", handlePositioning);
      };
  }, [logoRef, isMainPage]);

  const qualityRef = useRef<HTMLElement>(null);
  const infoCardsRef = useRef<HTMLDivElement>(null);
  const qualityTitleRef = useRef<HTMLHeadingElement>(null);

  

  // Animation für InfoCards und Titel
  useEffect(() => {
    const infoCardsEl = infoCardsRef.current;
    const titleEl = qualityTitleRef.current;
    const sectionEl = qualityRef.current;

    if (!infoCardsEl || !titleEl || !sectionEl) return;

    // 1. Titel: Fade in (bevor die Karten erscheinen)
    gsap.set(titleEl, { opacity: 0 });
    ScrollTrigger.create({
      trigger: sectionEl,
      start: "top 70%", // Titel beginnt zu erscheinen, wenn Section 60% vom Viewport erreicht
      end: "top 60%",   // Titel ist voll sichtbar
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.to(titleEl, { opacity: progress, duration: 0.1, overwrite: "auto" });
      }
    });

    // 2. InfoCards: Fade in (erst nach Titel fully visible)
    gsap.set(infoCardsEl, { opacity: 0, y: 0 });
    ScrollTrigger.create({
      trigger: sectionEl,
      start: "top 60%", // Karten beginnen zu erscheinen, wenn Titel voll sichtbar
      end: "top 58%",   // Karten sind voll sichtbar
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const opacity = progress;
        gsap.to(infoCardsEl, { opacity, duration: 0.1, overwrite: "auto" });
      }
    });

    // 3. InfoCards: Fade out (nachdem sie voll sichtbar waren)
    ScrollTrigger.create({
      trigger: sectionEl,
      start: "top 30%", // Karten beginnen zu verschwinden
      end: "top 20%",  // Karten sind komplett weg
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const opacity = 1 - progress;
        gsap.to(infoCardsEl, { opacity, duration: 0.1, overwrite: "auto" });
      }
    });

    // 4. Titel: Fade out (erst nach Karten fade out)
    ScrollTrigger.create({
      trigger: sectionEl,
      start: "top 20%", // Titel beginnt zu verschwinden, wenn Karten weg sind
      end: "top 10%",   // Titel ist komplett weg
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const opacity = 1 - progress;
        gsap.to(titleEl, { opacity, duration: 0.1, overwrite: "auto" });
      }
    });

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isMainPage]);

  // Animate triangle logo rotation between QUALITÄTSMANAGEMENT and PROZESSMANAGEMENT
  useEffect(() => {
    const logoEl = logoRef.current;
    const qualitaetEl = qualityRef.current;
    const prozessEl = prozessRef.current;
    if (!logoEl || !qualitaetEl || !prozessEl) return;

    // --- CONTINUOUS ROTATION LOGIC ---
    // 1. Determine the base rotation from the previous animation (e.g., -30deg at the end of QUALITÄTSMANAGEMENT fade out)
    //    If you have a previous ScrollTrigger that rotates the logo, set its end value here.
    //    For this example, let's assume the logo is at -30deg after the previous animation.
    const baseRotation = -60; // Adjust this value to match the end rotation of the previous animation

    // 2. ScrollTrigger for rotating the logo by an additional -60deg (for a total of -90deg)
    const rotationTrigger = ScrollTrigger.create({
      trigger: prozessEl,
      start: "top bottom", // Start when Prozessmanagement section enters viewport
      end: "top 80%",      // End when Prozessmanagement section reaches 80% of viewport
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        // Continue rotation from baseRotation, add -60deg over the scroll
        const rotate = baseRotation + (-120 * progress);
        gsap.to(logoEl, { rotate, duration: 0.1, overwrite: "auto", ease: "power2.out" });
      }
    });

    return () => {
      rotationTrigger.kill();
    };
  }, [isMainPage]);


  // Animation für PROZESSMANAGEMENT Titel und InfoCards (analog zu QUALITÄTSMANAGEMENT)
  useEffect(() => {
    const titleEl = prozessTitleRef.current;
    const cardsEl = prozessCardsRef.current;
    const sectionEl = prozessRef.current;
    if (!titleEl || !cardsEl || !sectionEl) return;

    // 1. Titel: Fade in
    gsap.set(titleEl, { opacity: 0 });
    ScrollTrigger.create({
      trigger: sectionEl,
      start: "top 80%",
      end: "top 70%",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.to(titleEl, { opacity: progress, duration: 0.1, overwrite: "auto" });
      }
    });

    // 2. InfoCards: Fade in
    gsap.set(cardsEl, { opacity: 0 });
    ScrollTrigger.create({
      trigger: sectionEl,
      start: "top 70%",
      end: "top 68%",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.to(cardsEl, { opacity: progress, duration: 0.1, overwrite: "auto" });
      }
    });

    // 3. InfoCards: Fade out
    ScrollTrigger.create({
      trigger: sectionEl,
      start: "top 30%",
      end: "top 20%",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.to(cardsEl, { opacity: 1 - progress, duration: 0.1, overwrite: "auto" });
      }
    });

    // 4. Titel: Fade out
    ScrollTrigger.create({
      trigger: sectionEl,
      start: "top 20%",
      end: "top 10%",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.to(titleEl, { opacity: 1 - progress, duration: 0.1, overwrite: "auto" });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isMainPage]);

  // Animate triangle logo rotation between Prozessmanagement and Lieferantenaufbau
  useEffect(() => {
    const logoEl = logoRef.current;
    const prozessEl = prozessRef.current;
    const lieferantenEl = lieferantenRef.current;
    if (!logoEl || !prozessEl || !lieferantenEl) return;

    // Set base rotation to match the end of previous rotation (e.g., -150deg)
    const baseRotation = -180;
    // Rotate by additional -60deg between these sections
    const rotationTrigger = ScrollTrigger.create({
      trigger: lieferantenEl,
      start: "top bottom",
      end: "top 80%",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const rotate = baseRotation + (-120 * progress);
        gsap.to(logoEl, { rotate, duration: 0.1, overwrite: "auto", ease: "power2.out" });
      }
    });
    return () => {
      rotationTrigger.kill();
    };
  }, [isMainPage]);

  // Animation für LIEFERANTENAUFBAU Titel und InfoCards (analog zu vorherigen Sections)
  useEffect(() => {
    const titleEl = lieferantenTitleRef.current;
    const cardsEl = lieferantenCardsRef.current;
    const sectionEl = lieferantenRef.current;
    if (!titleEl || !cardsEl || !sectionEl) return;

    // 1. Titel: Fade in
    gsap.set(titleEl, { opacity: 0 });
    ScrollTrigger.create({
      trigger: sectionEl,
      start: "top 80%",
      end: "top 70%",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.to(titleEl, { opacity: progress, duration: 0.1, overwrite: "auto" });
      }
    });
    // 2. InfoCards: Fade in
    gsap.set(cardsEl, { opacity: 0 });
    ScrollTrigger.create({
      trigger: sectionEl,
      start: "top 70%",
      end: "top 68%",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.to(cardsEl, { opacity: progress, duration: 0.1, overwrite: "auto" });
      }
    });
    // 3. InfoCards: Fade out
    ScrollTrigger.create({
      trigger: sectionEl,
      start: "top 10%",
      end: "top top",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.to(cardsEl, { opacity: 1 - progress, duration: 0.1, overwrite: "auto" });
      }
    });
    // 4. Titel: Fade out
    ScrollTrigger.create({
      trigger: sectionEl,
      start: "top -10%",
      end: "top -20%",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.to(titleEl, { opacity: 1 - progress, duration: 0.1, overwrite: "auto" });
      }
    });
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isMainPage]);

  // Animate logo when CTA button reaches center of viewport
  useEffect(() => {
    const logoEl = logoRef.current;
    const ctaEl = ctaRef.current;
    if (!logoEl || !ctaEl) return;

    /**
     * ScrollTrigger: When CTA button reaches center, move logo to center, scale to 500px height, rotate to 0deg
     */
    const trigger = ScrollTrigger.create({
      trigger: ctaEl,
      start: "top 90%",
      end: "+=10",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const opacity = 1 - progress;
        // Move logo to center of viewport
        gsap.to(logoEl, {
          opacity,
          overwrite: "auto",
          duration: 0.1,
          ease: "linear"
        });
      }
    });
    return () => {
      trigger.kill();
    };
  }, [isMainPage]);

  useEffect(() => {
    const ctaEl = ctaRef.current;
    if ( !ctaEl) return;

    const trigger = ScrollTrigger.create({
      trigger: ctaEl,
      start: "top 70%",
      end: "top 20%",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.to(ctaEl, {
          opacity: 0 + progress,
          overwrite: "auto",
          duration: 0.1,
          ease: "power2.out"
        });
      }
    });
    return () => {
      trigger.kill();
    };
  }, [isMainPage]);

  return (
    <>
      {/* LogoIntro overlay: covers the app on main page load, animates and unmounts itself */}
      {showLogoIntro && <LogoIntro />}
      <NavBar />
      <Routes>
        <Route path="/" element={
          <div className="app-root w-full scroll-area relative min-h-[300vh] bg-gradient-to-tr from-neutral-900 to-neutral-800 overflow-hidden">
      {/* Fixed Logo */}
      <img
        ref={logoRef}
              src="/logo_Merab_centered.png"
        alt="Goldenes Dreieck mit Spiralensymbol Logo"
              className="fixed  w-[60vw] md:w-[35vw] h-auto rounded-2xl drop-shadow-xl bg-transparent z-20 pointer-events-none"
        style={{ zIndex: 20 }}
      />
      {/* Scrollable Content */}
            <section ref={heroRef} className="m-4 w-100vw md:ml-[35vw] min-h-screen flex items-end md:items-center justify-start ">
              <div className="flex flex-col items-start justify-center flex-1 w-full py-8 mb-20">
          {/* Animated scroll-up elements with refs */}
                <h1 ref={scrollUpRefs[0]} className="text-xl md:text-4xl font-bold text-gray-100 text-left leading-tight scroll-up">KURZFRISTIGE VERSTÄRKUNG.</h1>
                <h1 ref={scrollUpRefs[1]} className="text-3xl md:text-6xl font-bold text-gray-100 text-left leading-tight scroll-up">LANGFRISTIGER EFFEKT.</h1>
                <p ref={scrollUpRefs[2]} className="text-lg md:text-2xl font-medium text-gray-300 text-left scroll-up">Interim Management & <button onClick={handleSchulungenClick} className="text-[#d6ba6d] hover:text-[#e7c97a] transition-colors duration-200 cursor-pointer underline">Schulungen</button> an der Schnittstelle von <button onClick={handleQualitaetClick} className="text-[#d6ba6d] hover:text-[#e7c97a] transition-colors duration-200 cursor-pointer underline">Qualität</button>, <button onClick={handleProzessenClick} className="text-[#d6ba6d] hover:text-[#e7c97a] transition-colors duration-200 cursor-pointer underline">Prozessen</button> und <button onClick={handleLieferantenClick} className="text-[#d6ba6d] hover:text-[#e7c97a] transition-colors duration-200 cursor-pointer underline">Lieferanten</button>.</p>
                <div className="mt-8 scroll-up" ref={scrollUpRefs[3]}>
                  <a
                    href="/kontakt"
                    className="inline-block px-8 py-4 rounded-full bg-[#d6ba6d] text-neutral-900 font-bold text-lg shadow-lg hover:bg-[#e7c97a] focus:outline-none focus:ring-2 focus:ring-[#d6ba6d] focus:ring-offset-2 transition-colors duration-200"
                    aria-label="Kontaktaufnahme"
                  >
                    Kontaktaufnahme
                  </a>
                </div>
        </div>
      </section>
            {isMobileViewport && (
              <div className="h-[200px]" />
            )}
      {/* Qualitätsmanagement */}
      <section
              id="quality"
        className="w-[60vw] min-h-[60vh] relative z-30 fixed top-0 left-0 pointer-events-none"
        ref={qualityRef}
      >
              <div className="fixed w-full top-[calc(60vw-20px)] md:top-[calc(50vh+10vw)] md:w-[calc(35vw)] flex items-center justify-center" ref={qualityTitleRef}>
        <h1
                  
                  className="font-regular text-xl text-[#d6ba6d] drop-shadow-2xl pointer-events-none select-none fade-in"
        >
          QUALITÄTSMANAGEMENT
        </h1>
              </div>
              
        <div className="h-[500px]" />
              {/* Elegant, non-card layout for quality topics */}
              <div className="fixed right-0 top-[calc(60vw-50px)] md:top-0 w-full md:w-3/5 md:min-h-[100vh] flex flex-col md:gap-12 justify-center md:pr-24 pt-12 pointer-events-none" ref={infoCardsRef}>
                <p className="text-gray-300 text-sm md:text-2xl font-medium text-left scroll-up px-4 pt-4">Klare Strukturen, sichere Prozesse, zertifizierte Ergebnisse</p>
                <div className="flex flex-col items-start gap-4 md:gap-6 m-6">
                 <InfoCard
                  title="Reklamationsmanagement - 8D-Reporting"
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="none" stroke="#d6ba6d" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1" d="m16 8l2 2l4-4M2 8h10m4 8l2 2l4-4M2 16h10"/></svg>}/>
                  <InfoCard
                  title="Einführung / Optimierung von Quality Gates"
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#d6ba6d" d="M4.384 15.885q-.213 0-.356-.144t-.143-.356v-6.77q0-.212.144-.356t.356-.143t.356.143t.144.357v6.769q0 .212-.144.356t-.357.144m2.837 1.692q-.338 0-.568-.233q-.23-.234-.23-.578V9.462q0-1.266.893-2.153q.892-.886 2.146-.886h5.077q1.265 0 2.152.886q.886.887.886 2.152v7.305q0 .344-.23.578t-.568.233zm12.394-1.693q-.213 0-.356-.143t-.144-.356v-6.77q0-.212.144-.356q.144-.143.357-.143t.356.143t.144.357v6.769q0 .212-.144.356t-.357.144m-12.192.692H11.5V12.5h-1.192q-.213 0-.356-.144t-.144-.357t.144-.356t.356-.143H11.5V7.423H9.461q-.84 0-1.44.599q-.598.599-.598 1.44zm5.077 0h4.077V9.461q0-.84-.599-1.44q-.599-.598-1.44-.598H12.5V11.5h1.192q.213 0 .356.144t.144.357t-.144.356t-.356.143H12.5z"/></svg>}/>
        
          <InfoCard
            title="Aufbau QM-Systeme"
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><path fill="#d6ba6d" d="M213.293 19.46L29.691 120.34h37.375l133.489-73.346l-15.819 73.346h18.41l11.584-53.701l13.688 53.7h18.574l-19.447-76.294l202.941 76.295h51.147zM25 138.34v30h462v-30zm32 48v30h62v-30zm144 0v46h30v-46zm48 0v46h19.273L279 221.613V186.34zm190 0v141.707a24.6 24.6 0 0 1 9-1.707c3.166 0 6.2.61 9 1.707V186.34zm-238 64v242h30v-242zm247 94c-3.973 0-7 3.027-7 7s3.027 7 7 7s7-3.027 7-7s-3.027-7-7-7m-20.393 21.365l-16.421 24.635h21.63l9.743-14.613c-6.118-1.384-11.417-5.04-14.952-10.022m40.786 0c-3.535 4.981-8.834 8.638-14.952 10.022l9.743 14.613h21.63zM409 408.34v30h78v-30zm-226 24.5l-60.4 45.3l10.8 14.4l49.6-37.2zm66 0v22.5l49.6 37.2l10.8-14.4z"/></svg>}/>
                  <InfoCard
                  title="Shopfloor-Kommunikation, Q-Runden, interne Audits, FMEA"
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 21 21"><g fill="none" fill-rule="evenodd"><path stroke="#d6ba6d" stroke-linecap="round" stroke-linejoin="round" d="M11 16.517c4.418 0 8-3.026 8-6.758S15.418 3 11 3S3 6.026 3 9.759c0 1.457.546 2.807 1.475 3.91L3.5 18.25l3.916-2.447a9.2 9.2 0 0 0 3.584.714" stroke-width="1"/><path fill="#d6ba6d" d="M10.999 11c.5 0 1-.5 1-1s-.5-1-1-1S10 9.5 10 10s.499 1 .999 1m-4 0c.5 0 1-.5 1-1s-.5-1-1-1S6 9.5 6 10s.499 1 .999 1m8 0c.5 0 1.001-.5 1.001-1s-.5-1-1-1s-1 .5-1 1s.5 1 1 1"/></g></svg>}
                  />
                  
                </div>
                
        </div>
        {/* Ende Info-Box */}
      </section>
            <div className="h-[200px]" />
      {/* Neue Section: PROZESSMANAGEMENT als animierter Bereich */}
      <section
              id="prozess"
        ref={prozessRef}
        className="w-full min-h-[100vh] relative z-10 bg-transparent"
      >
              <div className="fixed w-full top-[calc(60vw-20px)] md:top-[calc(50vh+10vw)] md:w-[calc(35vw)] flex items-center justify-center" ref={prozessTitleRef}>
                <h1 className="font-regular text-xl text-[#d6ba6d] drop-shadow-2xl pointer-events-none select-none fade-in">
          PROZESSMANAGEMENT
        </h1>
              </div>
              <div className="h-[500px]" />
              {/* Elegant, non-card layout for prozess topics */}
              <div className="fixed right-0 top-[calc(60vw-50px)] md:top-0 w-full md:w-3/5 md:min-h-[100vh] flex flex-col md:gap-12 justify-center md:pr-24 pt-12 pointer-events-none" ref={prozessCardsRef}>
                <p className="text-gray-300 text-sm md:text-2xl font-medium text-left scroll-up px-4 pt-4">Effizienz braucht Klarheit. Prozesse brauchen Haltung</p>
                <div className="flex flex-col items-start gap-4 md:gap-6 m-6">
              <InfoCard
                  title="Optimieren, Modellieren & Implementieren von Geschäftsprozessen"
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none" stroke="#d6ba6d" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"><path d="m17.392 17.395l5.856 5.856m-14.25-12.75a1.5 1.5 0 1 0 3 0a1.5 1.5 0 0 0-3 0"/><path d="M9.224 4.7a1.33 1.33 0 0 1 2.548 0l.442 1.453a.994.994 0 0 0 1.174.681l1.472-.34a1.338 1.338 0 0 1 1.274 2.217L15.1 9.821a1 1 0 0 0 0 1.361l1.03 1.111a1.338 1.338 0 0 1-1.274 2.218l-1.472-.34a.994.994 0 0 0-1.174.68l-.438 1.45a1.33 1.33 0 0 1-2.548 0l-.443-1.454a.993.993 0 0 0-1.173-.68l-1.473.34a1.338 1.338 0 0 1-1.274-2.218l1.031-1.11a1 1 0 0 0 0-1.363L4.861 8.71a1.338 1.338 0 0 1 1.274-2.218l1.473.341a.993.993 0 0 0 1.173-.68z"/><path d="M.748 10.501a9.75 9.75 0 1 0 19.5 0a9.75 9.75 0 0 0-19.5 0"/></g></svg>}
                  />

                <InfoCard
                  title="Effizienz steigern durch klare Strukturen"
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 21 21"><g fill="none" fill-rule="evenodd" stroke="#d6ba6d" stroke-linecap="round" stroke-linejoin="round" transform="translate(2 2)" stroke-width="1"><circle cx="8.5" cy="8.5" r="8"/><path d="m10.5 9.5l-4 3v-5l4-3z"/></g></svg>}
                />
                <InfoCard
                  title="Analyse und Optimierung bestehender Prozesse"
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="none" stroke="#d6ba6d" stroke-linecap="round" stroke-width="1" d="M17 5v15m-5-9v9m-5-6v6"/></svg>}
                />
          <InfoCard
                  title="Schnittstellen-Kommunikation und Stärkung der Ownership"
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="none" stroke="#d6ba6d" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M14 7h3a1 1 0 0 1 0 10h-3m-4 0H7A1 1 0 0 1 7 7h3m-2 5h8"/></svg>}
          />
        </div>
              </div>
      </section>
      
      {/* Neue Section: LIEFERANTENAUFBAU als animierter Bereich */}
      <section
              id="lieferanten"
        ref={lieferantenRef}
        className="w-full min-h-[100vh] relative z-10 bg-transparent"
      >
              <div className="fixed w-full top-[calc(60vw-20px)] md:top-[calc(50vh+10vw)] md:w-[calc(35vw)] flex items-center justify-center" ref={lieferantenTitleRef}>
                <h1 className="font-regular text-xl text-[#d6ba6d] drop-shadow-2xl pointer-events-none select-none fade-in">
          LIEFERANTENMANAGEMENT
        </h1>
              </div>
              <div className="h-[500px]" />
              {/* Elegant, non-card layout for lieferanten topics */}
              <div className="fixed right-0 top-[calc(60vw-50px)] md:top-0 w-full md:w-3/5 md:min-h-[100vh] flex flex-col md:gap-12 justify-center md:pr-24 pt-12 pointer-events-none" ref={lieferantenCardsRef}>
                <p className="text-gray-300 text-sm md:text-2xl font-medium text-left scroll-up px-4 pt-4">Lieferfähigkeit sichern, Partnerschaften stärken, Qualität garantieren</p>
                {/* Lieferantensuche */}
                <div className="flex flex-col items-start gap-4 md:gap-6 m-6">
                  <InfoCard
                  title="Lieferantenauswahl und -qualifizierung (APQP, VDA, PPAP)"
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none" stroke="#d6ba6d" stroke-width="1"><path stroke-linecap="round" d="M9 4.46A9.8 9.8 0 0 1 12 4c4.182 0 7.028 2.5 8.725 4.704C21.575 9.81 22 10.361 22 12c0 1.64-.425 2.191-1.275 3.296C19.028 17.5 16.182 20 12 20s-7.028-2.5-8.725-4.704C2.425 14.192 2 13.639 2 12c0-1.64.425-2.191 1.275-3.296A14.5 14.5 0 0 1 5 6.821"/><path d="M15 12a3 3 0 1 1-6 0a3 3 0 0 1 6 0Z"/></g></svg>}
                  />
                  <InfoCard
                  title="Durchlaufzeitoptimierung und Beseitigung von Bottlenecks"
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="none" stroke="#d6ba6d" stroke-width="1" d="m12 12l-2.958 2.929c-2.922 2.894-4.383 4.341-3.974 5.59q.052.16.13.312C5.8 22 7.867 22 12 22s6.2 0 6.802-1.17q.078-.15.13-.311c.41-1.249-1.052-2.696-3.974-5.59zm0 0l2.958-2.929c2.922-2.894 4.383-4.341 3.974-5.59a2 2 0 0 0-.13-.312C18.2 2 16.133 2 12 2S5.8 2 5.198 3.17q-.078.15-.13.311c-.41 1.249 1.052 2.696 3.974 5.59z"/></svg>}
                  />
                  <InfoCard
                  title="Unterstützung bei der (Wieder-)Herstellung der Lieferfähigkeit"
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#d6ba6d" d="M8.53 10.53a.75.75 0 1 1-1.06-1.06l4-4a.75.75 0 0 1 1.06 0l4 4a.75.75 0 1 1-1.06 1.06l-2.72-2.72v9.69a.75.75 0 0 1-1.5 0V7.81z"/></svg>} />
          <InfoCard
                  title="Eskalationsmanagement und Sofortmaßnahmen"
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="none" stroke="#d6ba6d" d="M10.13 14.3h1.37v4.462c0 .418 0 .774.027 1.029c.014.128.039.279.1.414a.67.67 0 0 0 .462.392a.67.67 0 0 0 .584-.162a1.4 1.4 0 0 0 .264-.334c.132-.22.281-.543.457-.922l.014-.029l2.73-5.9l.018-.037c.281-.607.516-1.114.638-1.527c.126-.43.168-.881-.095-1.294c-.263-.412-.691-.563-1.134-.629c-.426-.063-.985-.063-1.654-.063H12.5V5.238c0-.418 0-.774-.027-1.029a1.4 1.4 0 0 0-.1-.414a.67.67 0 0 0-.462-.392a.66.66 0 0 0-.584.162a1.4 1.4 0 0 0-.264.334c-.132.22-.281.543-.457.922l-.014.029l-2.73 5.9l-.018.037c-.281.607-.516 1.114-.638 1.527c-.126.43-.169.881.095 1.294c.263.412.691.563 1.134.629c.426.063.985.063 1.654.063z" stroke-width="1"/></svg>}/>
        </div>
              </div>
      </section>
      
      {/* Schulungen */}
      <section id="schulungen" className="backdrop-blur-md flex w-full h-auto min-h-[120vh] relative z-50 flex-col items-center justify-center py-12 md:py-32 bg-neutral-700/70">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-[#d6ba6d] mb-12 text-center">Schulungen</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
            <SchulungCard
              title="Mitarbeiterschulungen inkl. Shopfloor-Kommunikation"
              category="Qualitätsmanagement"
              description="Reklamationsbearbeitung, 8D, Ishikawa, Kaizen, Kanban"
              className="px-2"
            />
            <SchulungCard
              title="Workshops und Schulungen für Teams und Schulungskräfte"
              category="Prozessmanagement"
              description="Effiziente Prozessoptimierung und Teamführung"
              className="px-2"
            />
            <SchulungCard
              title="Schulungen für Lieferanten und interne Schnittstellen"
              category="Lieferantenentwicklung"
              description="Partnerschaftliche Zusammenarbeit und Qualitätssicherung"
              className="px-2"
            />
            <SchulungCard
              title="Mitarbeitergespräche für Teams und Führungskräfte"
              category="Generelle Schulungen"
              description="Umgang mit schwierigen Kunden/Ansprechpartnern"
              className="px-2"
            />
            <SchulungCard
              title="Projektmanagement"
              category="Grundlagen"
              description="Strukturierte Projektplanung und -durchführung"
              className="px-2"
            />
            <SchulungCard
              title="Lean Six Sigma"
              category="Grundlagen"
              description="Methoden zur Prozessverbesserung und Qualitätssteigerung"
              className="px-2"
            />
            <SchulungCard
              title="NLP: Gesprächs- und Verhandlungsführung"
              category="Grundlagen"
              description="Effektive Kommunikation und Verhandlungstechniken"
              className="px-2"
            />
          </div>
        </div>
            </section>

            {/* cta section */}
            <section className="w-full min-h-[95vh] flex items-center justify-center bg-neutral-800/80 relative z-10 opacity-0" id="nos" ref={ctaRef}>
              <div className=" fixed bottom-[30vh] md:bottom-[200px] text-center flex flex-col items-center justify-center pointer-events-none">
                <img
                  ref={logoRefStatic}
                  src="/Goldenes Dreieck mit Spiralensymbol.png"
                  alt="Goldenes Dreieck mit Spiralensymbol"
                  className="h-[200px] md:h-[400px] w-auto"
                />
                <h2 className="text-3xl md:text-5xl  mb-4 drop-shadow-2xl text-shadow-gold text-[#d6ba6d]">MINDACROSS</h2>
                <p className="text-sm md:text-m text-[#b89a5a]/90">KLARHEIT. STRUKTUR. HANDLUNGSKRAFT.</p>
                {/* CTA Button: Jetzt Kontakt aufnehmen */}
                <div className="mt-10 pointer-events-auto">
                  <a
                    ref={ctaRef}
                    href="/kontakt"
                    className="inline-block px-8 py-4 rounded-full bg-[#d6ba6d] text-neutral-900 font-bold md:text-lg shadow-lg hover:bg-[#e7c97a] focus:outline-none focus:ring-2 focus:ring-[#d6ba6d] focus:ring-offset-2 transition-colors duration-200"
                    aria-label="Jetzt Kontakt aufnehmen"
                  >
                    Jetzt Kontakt aufnehmen
                  </a>
                </div>
              </div>
            </section>

            {/* Footer with legal and social links */}
            <Footer />
          </div>
        } />
        <Route path="/impressum" element={<Impressum />} />
        <Route path="/datenschutz" element={<Datenschutz />} />
        <Route path="/kontakt" element={<Kontakt />} />
      </Routes>
    </>
  );
}

export default App;
