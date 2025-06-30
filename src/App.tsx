import { useRef, useEffect, type JSX } from "react";
import { gsap } from "gsap";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./App.css";
import { InfoCard } from "./components/InfoCard";
import { Routes, Route, useLocation } from "react-router-dom";
import Impressum from "./Impressum";
import Datenschutz from "./Datenschutz";
import Terms from "./Terms";
import Kontakt from "./Kontakt";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

gsap.registerPlugin(ScrollTrigger);

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
  const scrollUpRefs = [useRef<HTMLHeadingElement>(null), useRef<HTMLHeadingElement>(null), useRef<HTMLParagraphElement>(null)];
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
    const yOffsets = [0, 0, 20]; // px, initial offset for each element
    const yMoveFactors = [100, 60 , 40]; // px, how much each element moves up
    const yScaleFactors = [1.3, 1.2, 1.1]; // px, how much each element scales up
    const fadeStart = 0; 
    const fadeEnd = 0.5; 
    const triggers: ScrollTrigger[] = [];

    elements.forEach((el, i) => {
      if (!el) return;
      // Set initial position
      gsap.set(el, { y: yOffsets[i], opacity: 1 });
      // Animate on scroll
      const trigger = ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top -1%", 
        end: "+=300",   
        scrub: true,
        onUpdate: (self) => {
          // Progress: 0 (start) to 1 (end)
          const progress = self.progress;
          // Move up at different rates
          const y = yOffsets[i] - yMoveFactors[i] * progress;
          // Calculate the scale based on yScaleFactors and progress
          const scale = 1 + (yScaleFactors[i] - 1) * progress;
          // const scale = yScaleFactors[i] * progress;
          // Fade out between fadeStart and fadeEnd
          let opacity = 1;
          if (progress > fadeStart) {
            opacity = 1 - (progress - fadeStart) / (fadeEnd - fadeStart);
            if (opacity < 0) opacity = 0;
          }
          gsap.to(el, { y, opacity, scale, overwrite: "auto", duration: 0.1, ease: "power2.out" });
        },
      });
      triggers.push(trigger);
    });

    /**
     * Animate logo: scale down and rotate after hero section scroll-up animations are over.
     * The logo remains vertically centered and pressed to the left.
     */
    const logoEl = logoRef.current;
    if (logoEl && elements[2]) {
      // Set initial state: vertically centered, left-aligned
      gsap.set(logoEl, { scale: 1, rotate: 0, x: 0, y: 0 });
      // Animate after last scroll-up element
      const lastScrollUpEnd = {
        trigger: elements[2],
        start: "top 30%", // matches the end of the last scroll-up animation
        end: "+=100", // over 100px scroll
        scrub: true,
        onUpdate: (self: ScrollTrigger) => {
          const progress = self.progress;
          // Scale from 1 to 0.6, rotate from 0 to -30deg
          const scale = 1 - 0.4 * progress;
          const rotate = -60 * progress;
          // Move logo further to the left (e.g., -40px at full progress)
          const x = -100 * progress;
          // Keep logo vertically centered: top 50% minus half its height
          // Since it's fixed with top-1/2 and -translate-y-1/2, y should remain 0
          const y = -50 * progress;
          gsap.to(logoEl, {
            scale,
            rotate,
            x,
            y,
            overwrite: "auto",
            duration: 0.1,
            ease: "sine.out"
          });
        }
      };
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

  // Robust vertical centering for logo: ensures correct position on load, resize, and before GSAP animation
  useEffect(() => {
    const logoEl = logoRef.current;
    if (logoEl) {
      /**
       * Handler to center the logo vertically in the viewport using GSAP.
       * Ensures pixel-perfect positioning regardless of image load timing.
       */
      const handlePositioning = (): void => {
        const viewportHeight = window.innerHeight;
        const logoHeight = logoEl.offsetHeight;
        const top = (viewportHeight - logoHeight) / 2;
        gsap.set(logoEl, {
          position: "fixed",
          top,
          left: "3rem", // Tailwind's left-12
          x: 0,
          y: 0,
        });
      };
      // If already loaded (from cache), run immediately
      if (logoEl.complete) {
        handlePositioning();
      } else {
        logoEl.addEventListener("load", handlePositioning);
      }
      // Recalculate on window resize
      window.addEventListener("resize", handlePositioning);
      // Cleanup listeners on unmount
      return () => {
        logoEl.removeEventListener("load", handlePositioning);
        window.removeEventListener("resize", handlePositioning);
      };
    }
    return undefined;
  }, [isMainPage]);

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
      end: "top 50%",   // Karten sind voll sichtbar
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
      end: "top 60%",
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
      end: "top 60%",
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
      start: "top 80%",
      end: "+=200",
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
      <NavBar />
      <Routes>
        <Route path="/" element={
          <div className="app-root w-full scroll-area relative min-h-[300vh] bg-gradient-to-tr from-neutral-900 to-neutral-800">
            {/* Fixed Logo */}
            <img
              ref={logoRef}
              src="/src/assets/logo_Merab_centered.png"
              alt="Goldenes Dreieck mit Spiralensymbol Logo"
              className="fixed left-12 w-[600px] h-auto rounded-2xl drop-shadow-xl bg-transparent z-20 pointer-events-none"
              style={{ zIndex: 20 }}
            />
            {/* Scrollable Content */}
            <section ref={heroRef} className="w-[50vw] ml-[40vw] min-h-screen flex items-center justify-center">
              <div className="flex flex-col items-start justify-center flex-1 max-w-3xl mx-auto px-4 py-8">
                {/* Animated scroll-up elements with refs */}
                <h1 ref={scrollUpRefs[0]} className="text-4xl font-bold text-gray-100 text-left leading-tight scroll-up">KURZFRISTIGE VERSTÄRKUNG</h1>
                <h1 ref={scrollUpRefs[1]} className="text-5xl font-bold text-gray-100 text-left leading-tight scroll-up">LANGFRISTIGER EFFEKT.</h1>
                <p ref={scrollUpRefs[2]} className="text-2xl font-medium text-gray-300 text-left scroll-up">Interim Management in der Schnittstelle von <span className="text-[#d6ba6d]">Qualität</span>, <span className="text-[#d6ba6d]">Prozessen</span> und <span className="text-[#d6ba6d]">Lieferanten</span>.</p>
              </div>
            </section>
            {/* Qualitätsmanagement */}
            <section
              id="quality"
              className="w-[60vw] min-h-[60vh] relative z-30 fixed top-0 left-0"
              ref={qualityRef}
            >
              <div className="fixed left-16 top-[calc(50vh+120px)] w-[360px] flex items-center justify-center" ref={qualityTitleRef}>
                <h1
                  
                  className="font-regular text-xl text-[#d6ba6d] drop-shadow-2xl pointer-events-none select-none fade-in"
                >
                  QUALITÄTSMANAGEMENT
                </h1>
              </div>
              
              <div className="h-[500px]" />
              {/* Elegant, non-card layout for quality topics */}
              <div className="fixed right-0 top-0 w-3/5 min-h-[100vh] flex flex-col gap-12 justify-center pr-24 pt-12" ref={infoCardsRef}>
                {/* Interne Qualität */}
                <div className="flex flex-row items-start gap-6">
                  <span className="w-14 h-14 flex items-center justify-center rounded-full bg-[#d6ba6d]/10">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <circle cx="12" cy="12" r="3.5" stroke="#d6ba6d" strokeWidth="2" />
                      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="#d6ba6d" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </span>
                  <div>
                    <h2 className="text-2xl font-regular text-[#d6ba6d] tracking-tight mb-2">Interne Qualität</h2>
                    <ul className="list-disc list-inside text-gray-100 text-lg leading-relaxed space-y-2 pl-2">
                      <li>Kontinuierliche Verbesserungsprozesse</li>
                      <li>Interne Audits</li>
                      <li>Mitarbeiterschulungen</li>
                    </ul>
                  </div>
                </div>
                {/* Kundenqualität */}
                <div className="flex flex-row items-start gap-6">
                  <span className="w-14 h-14 flex items-center justify-center rounded-full bg-[#d6ba6d]/10">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M7 15l-2 2a2 2 0 002.83 2.83l2-2" stroke="#d6ba6d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M17 15l2 2a2 2 0 01-2.83 2.83l-2-2" stroke="#d6ba6d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 13l4 4 4-4" stroke="#d6ba6d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 17V7" stroke="#d6ba6d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <div>
                    <h2 className="text-2xl font-regular text-[#d6ba6d] tracking-tight mb-2">Kundenqualität</h2>
                    <ul className="list-disc list-inside text-gray-100 text-lg leading-relaxed space-y-2 pl-2">
                      <li>Erfüllung von Kundenanforderungen</li>
                      <li>Lieferzuverlässigkeit</li>
                      <li>Serviceorientierung</li>
                    </ul>
                  </div>
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
              <div className="fixed left-16 top-[calc(50vh+120px)] w-[360px] flex items-center justify-center" ref={prozessTitleRef}>
                <h1 className="font-regular text-xl text-[#d6ba6d] drop-shadow-2xl pointer-events-none select-none fade-in">
                  PROZESSMANAGEMENT
                </h1>
              </div>
              <div className="h-[500px]" />
              {/* Elegant, non-card layout for prozess topics */}
              <div className="fixed right-0 top-0 w-3/5 min-h-[100vh] flex flex-col gap-12 justify-center pr-24 pt-12" ref={prozessCardsRef}>
                {/* Prozessoptimierung */}
                <div className="flex flex-row items-start gap-6">
                  <span className="w-14 h-14 flex items-center justify-center rounded-full bg-[#d6ba6d]/10">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <rect x="4" y="4" width="16" height="16" rx="4" stroke="#d6ba6d" strokeWidth="2" />
                      <path d="M8 12h8M12 8v8" stroke="#d6ba6d" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </span>
                  <div>
                    <h2 className="text-2xl font-regular text-[#d6ba6d] tracking-tight mb-2">Prozessoptimierung</h2>
                    <ul className="list-disc list-inside text-gray-100 text-lg leading-relaxed space-y-2 pl-2">
                      <li>Ablaufanalysen</li>
                      <li>Effizienzsteigerung</li>
                      <li>Digitalisierung von Prozessen</li>
                    </ul>
                  </div>
                </div>
                {/* Lieferantenmanagement */}
                <div className="flex flex-row items-start gap-6">
                  <span className="w-14 h-14 flex items-center justify-center rounded-full bg-[#d6ba6d]/10">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <circle cx="12" cy="12" r="7" stroke="#d6ba6d" strokeWidth="2" />
                      <path d="M8 12h8" stroke="#d6ba6d" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </span>
                  <div>
                    <h2 className="text-2xl font-regular text-[#d6ba6d] tracking-tight mb-2">Lieferantenmanagement</h2>
                    <ul className="list-disc list-inside text-gray-100 text-lg leading-relaxed space-y-2 pl-2">
                      <li>Lieferantenauswahl</li>
                      <li>Entwicklung & Bewertung</li>
                      <li>Risikomanagement</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Neue Section: LIEFERANTENAUFBAU als animierter Bereich */}
            <section
              id="lieferanten"
              ref={lieferantenRef}
              className="w-full min-h-[100vh] relative z-10 bg-transparent"
            >
              <div className="fixed left-16 top-[calc(50vh+120px)] w-[360px] flex items-center justify-center" ref={lieferantenTitleRef}>
                <h1 className="font-regular text-xl text-[#d6ba6d] drop-shadow-2xl pointer-events-none select-none fade-in">
                  LIEFERANTENAUFBAU
                </h1>
              </div>
              <div className="h-[500px]" />
              {/* Elegant, non-card layout for lieferanten topics */}
              <div className="fixed right-0 top-0 w-3/5 min-h-[100vh] flex flex-col gap-12 justify-center pr-24 pt-12" ref={lieferantenCardsRef}>
                {/* Lieferantensuche */}
                <div className="flex flex-row items-start gap-6">
                  <span className="w-14 h-14 flex items-center justify-center rounded-full bg-[#d6ba6d]/10">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" stroke="#d6ba6d" strokeWidth="2" />
                      <path d="M8 12h8" stroke="#d6ba6d" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </span>
                  <div>
                    <h2 className="text-2xl font-regular text-[#d6ba6d] tracking-tight mb-2">Lieferantensuche</h2>
                    <ul className="list-disc list-inside text-gray-100 text-lg leading-relaxed space-y-2 pl-2">
                      <li>Marktrecherche</li>
                      <li>Anfrage- und Angebotsmanagement</li>
                      <li>Erstqualifizierung</li>
                    </ul>
                  </div>
                </div>
                {/* Lieferantenentwicklung */}
                <div className="flex flex-row items-start gap-6">
                  <span className="w-14 h-14 flex items-center justify-center rounded-full bg-[#d6ba6d]/10">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <rect x="6" y="6" width="12" height="12" rx="3" stroke="#d6ba6d" strokeWidth="2" />
                      <path d="M12 9v6M9 12h6" stroke="#d6ba6d" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </span>
                  <div>
                    <h2 className="text-2xl font-regular text-[#d6ba6d] tracking-tight mb-2">Lieferantenentwicklung</h2>
                    <ul className="list-disc list-inside text-gray-100 text-lg leading-relaxed space-y-2 pl-2">
                      <li>Auditierung</li>
                      <li>Qualitätssteigerung</li>
                      <li>Partnerschaftsaufbau</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Persönliche "Me"-Seite für Merab */}
            <section id="about" className="backdrop-blur-md flex w-full min-h-[120vh] relative z-50  flex items-center justify-center py-24 bg-neutral-700/70 relative">
              <img
                src="/src/assets/PhotoshopVorschau_Bild.png"
                alt="Merab Torodadze Portrait"
                /* z-50 ensures this image is above the logo (z-20) and other content */
                className="w-auto h-[120vh] object-cover absolute top-0 -left-26 z-50"
                style={{ minWidth: "260px", maxWidth: "100%" }}
              />
              {/* Bild links, groß */}
              <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl mx-auto gap-12 bg-neutral-700/70 rounded-3xl shadow-2xl p-8 border border-[#d6ba6d]/30 max-w-[800px] ml-[40vw]">
                
                {/* Info rechts */}
                <div className="flex-1 flex flex-col justify-center items-start gap-6 px-2 ">
                  <h1 className="text-5xl font-extrabold text-[#d6ba6d] drop-shadow-gold mb-2">Merab Torodadze</h1>
                  <h2 className="text-2xl font-semibold text-gray-200 mb-4">Interim Manager</h2>
                  <p className="text-lg text-gray-300 max-w-xl mb-4">
                    Ich unterstütze Unternehmen als Interim Manager an der Schnittstelle von Qualität, Prozessen und Lieferanten. Mit langjähriger Erfahrung, analytischem Denken und Hands-on-Mentalität bringe ich kurzfristige Verstärkung mit langfristigem Effekt.
                  </p>
                  <div className="flex flex-col gap-2 mt-4">
                    <div className="flex items-center gap-3">
                      <svg width="24" height="24" fill="none" stroke="#d6ba6d" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/><path d="M16 2v4H8V2"/><path d="M12 18h.01"/></svg>
                      <a href="mailto:merab@PhotoshopVorschau_Bild.png" className="text-[#d6ba6d] text-lg font-medium hover:underline">merab@PhotoshopVorschau_Bild.png</a>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg width="24" height="24" fill="none" stroke="#d6ba6d" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92V19a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3 5.18 2 2 0 0 1 5 3h2.09a2 2 0 0 1 2 1.72c.13.81.36 1.6.68 2.34a2 2 0 0 1-.45 2.11l-.27.27a16 16 0 0 0 6.29 6.29l.27-.27a2 2 0 0 1 2.11-.45c.74.32 1.53.55 2.34.68A2 2 0 0 1 21 16.91z"/></svg>
                      <a href="tel:+491234567890" className="text-[#d6ba6d] text-lg font-medium hover:underline">+49 123 4567890</a>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* cta section */}
            <section className="w-full min-h-[95vh] flex items-center justify-center bg-neutral-800/80 relative z-10 opacity-0" id="nos" ref={ctaRef}>
              <div className=" fixed bottom-[200px] text-center flex flex-col items-center justify-center">
                <img
                  ref={logoRefStatic}
                  src="/src/assets/Goldenes Dreieck mit Spiralensymbol.png"
                  alt="Goldenes Dreieck mit Spiralensymbol"
                  className="h-[300px] w-auto"
                />
                <h2 className="text-5xl  mb-4 drop-shadow-2xl text-shadow-gold text-[#d6ba6d]">MINDACROSS</h2>
                <p className="text-m text-[#b89a5a]/90">KLARHEIT. STRUKTUR. HANDLUNGSKRAFT.</p>
                {/* CTA Button: Jetzt Kontakt aufnehmen */}
                <div className="mt-10">
                  <a
                    ref={ctaRef}
                    href="/kontakt"
                    className="inline-block px-8 py-4 rounded-full bg-[#d6ba6d] text-neutral-900 font-bold text-lg shadow-lg hover:bg-[#e7c97a] focus:outline-none focus:ring-2 focus:ring-[#d6ba6d] focus:ring-offset-2 transition-colors duration-200"
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
        <Route path="/terms" element={<Terms />} />
        <Route path="/kontakt" element={<Kontakt />} />
      </Routes>
    </>
  );
}

export default App;
