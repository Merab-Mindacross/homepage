import { useRef, useEffect, type JSX, type ReactNode } from "react";
import { gsap } from "gsap";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./App.css";
import { InfoCard, type CardProps } from "./components/InfoCard";

gsap.registerPlugin(ScrollTrigger);

/**
 * App component: Only a hero section with parallax-ready background image.
 * Headline: Kurzfristige Verstärkung mit langfristigem Effekt.
 * Subheadline: Interim Management in der Schnittstelle von Qualität, Prozessen und Lieferanten.
 */
function App(): JSX.Element {
  const heroRef = useRef<HTMLElement>(null);

  // Refs for scroll-up elements
  const scrollUpRefs = [useRef<HTMLHeadingElement>(null), useRef<HTMLHeadingElement>(null), useRef<HTMLParagraphElement>(null)];
  // Ref for the logo image
  const logoRef = useRef<HTMLImageElement>(null);

  // Ref for the next section (e.g., Prozessmanagement)
  const prozessRef = useRef<HTMLElement>(null);

  // Refs for Prozessmanagement section
  const prozessTitleRef = useRef<HTMLHeadingElement>(null);
  const prozessCardsRef = useRef<HTMLDivElement>(null);

  // Refs for Lieferantenaufbau section
  const lieferantenRef = useRef<HTMLElement>(null);
  const lieferantenTitleRef = useRef<HTMLHeadingElement>(null);
  const lieferantenCardsRef = useRef<HTMLDivElement>(null);

  // (Optional) Parallax effect for hero background image
  useEffect(() => {
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
          gsap.to(el, { y, opacity, scale, overwrite: "auto", duration: 0.1, ease: "linear" });
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
        end: "+=300", // over 400px scroll
        scrub: true,
        onUpdate: (self: ScrollTrigger) => {
          const progress = self.progress;
          // Scale from 1 to 0.6, rotate from 0 to -30deg
          const scale = 1 - 0.4 * progress;
          const rotate = -30 * progress;
          // Move logo further to the left (e.g., -40px at full progress)
          const x = -100 * progress;
          // Keep logo vertically centered: top 50% minus half its height
          // Since it's fixed with top-1/2 and -translate-y-1/2, y should remain 0
          const y = -200 * progress;
          gsap.to(logoEl, {
            scale,
            rotate,
            x,
            y,
            overwrite: "auto",
            duration: 0.1,
            ease: "linear"
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
  }, []);

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
  }, []);

  const qualityRef = useRef<HTMLElement>(null);
  const infoCardsRef = useRef<HTMLDivElement>(null);
  const qualityTitleRef = useRef<HTMLHeadingElement>(null);

  // Fade in QUALITÄTSMANAGEMENT
  useEffect(() => {
    const qualityEl = document.querySelector<HTMLElement>(".fade-in");
    if (qualityEl && qualityRef.current) {
      gsap.set(qualityEl, { opacity: 0 });
      ScrollTrigger.create({
        trigger: qualityRef.current,
        start: "top 40%",
        end: "top 10%",
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.to(qualityEl, {
            opacity: progress,
            duration: 0.1,
            ease: "linear"
          });
        }
      });
    }
  }, []);

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
      start: "top 60%", // Titel beginnt zu erscheinen, wenn Section 60% vom Viewport erreicht
      end: "top 0%",   // Titel ist voll sichtbar
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.to(titleEl, { opacity: progress, duration: 0.1, overwrite: "auto" });
      }
    });

    // 2. InfoCards: Fade in (erst nach Titel fully visible)
    gsap.set(infoCardsEl, { opacity: 0, y: 50 });
    ScrollTrigger.create({
      trigger: sectionEl,
      start: "top 0%", // Karten beginnen zu erscheinen, wenn Titel voll sichtbar
      end: "top -40%",   // Karten sind voll sichtbar
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
      start: "top -90%", // Karten beginnen zu verschwinden
      end: "top -110%",  // Karten sind komplett weg
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
      start: "top -110%", // Titel beginnt zu verschwinden, wenn Karten weg sind
      end: "top -130%",   // Titel ist komplett weg
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
  }, []);

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
    const baseRotation = -30; // Adjust this value to match the end rotation of the previous animation

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
        gsap.to(logoEl, { rotate, duration: 0.1, overwrite: "auto" });
      }
    });

    return () => {
      rotationTrigger.kill();
    };
  }, []);


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
      end: "top center",
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
      start: "top center",
      end: "top 20%",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.to(cardsEl, { opacity: progress, duration: 0.1, overwrite: "auto" });
      }
    });

    // 3. InfoCards: Fade out
    ScrollTrigger.create({
      trigger: sectionEl,
      start: "top -40%",
      end: "top -60%",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.to(cardsEl, { opacity: 1 - progress, duration: 0.1, overwrite: "auto" });
      }
    });

    // 4. Titel: Fade out
    ScrollTrigger.create({
      trigger: sectionEl,
      start: "top -60%",
      end: "top -80%",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.to(titleEl, { opacity: 1 - progress, duration: 0.1, overwrite: "auto" });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // Animate triangle logo rotation between Prozessmanagement and Lieferantenaufbau
  useEffect(() => {
    const logoEl = logoRef.current;
    const prozessEl = prozessRef.current;
    const lieferantenEl = lieferantenRef.current;
    if (!logoEl || !prozessEl || !lieferantenEl) return;

    // Set base rotation to match the end of previous rotation (e.g., -150deg)
    const baseRotation = -150;
    // Rotate by additional -60deg between these sections
    const rotationTrigger = ScrollTrigger.create({
      trigger: lieferantenEl,
      start: "top bottom",
      end: "top 80%",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const rotate = baseRotation + (-120 * progress);
        gsap.to(logoEl, { rotate, duration: 0.1, overwrite: "auto" });
      }
    });
    return () => {
      rotationTrigger.kill();
    };
  }, []);

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
      end: "top center",
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
      start: "top center",
      end: "top 20%",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.to(cardsEl, { opacity: progress, duration: 0.1, overwrite: "auto" });
      }
    });
    // 3. InfoCards: Fade out
    ScrollTrigger.create({
      trigger: sectionEl,
      start: "top -40%",
      end: "top -60%",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.to(cardsEl, { opacity: 1 - progress, duration: 0.1, overwrite: "auto" });
      }
    });
    // 4. Titel: Fade out
    ScrollTrigger.create({
      trigger: sectionEl,
      start: "top -60%",
      end: "top -80%",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.to(titleEl, { opacity: 1 - progress, duration: 0.1, overwrite: "auto" });
      }
    });
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="app-root w-full scroll-area relative min-h-[800vh] bg-gradient-to-tr from-neutral-900 to-neutral-800">
      {/* Fixed Logo */}
      <img
        ref={logoRef}
        src="/src/assets/Goldenes Dreieck mit Spiralensymbol.png"
        alt="Goldenes Dreieck mit Spiralensymbol Logo"
        className="fixed left-12 w-[500px] max-w-[30vw] h-auto rounded-2xl drop-shadow-xl bg-transparent z-20 pointer-events-none"
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
        className="w-[60vw] min-h-[60vh] relative z-30 fixed top-0 left-0"
        ref={qualityRef}
      >
        <h1
          ref={qualityTitleRef}
          className="fixed left-[calc(3rem+280px)] top-[190px] font-bold text-5xl text-[#d6ba6d] drop-shadow-2xl pointer-events-none select-none fade-in"
        >
          QUALITÄTSMANAGEMENT
        </h1>
        <div className="h-[500px]" />
        {/*
          InfoCards-Container ist jetzt fixed, unterhalb des Titels positioniert.
          Die Position (top) ist so gewählt, dass die Karten unter dem Titel erscheinen.
          Die ml- und w-Styles bleiben für das Layout erhalten.
        */}
        <div
          ref={infoCardsRef}
          className="fixed left-[calc(3rem+280px)] top-[270px] flex flex-row gap-8 w-auto items-stretch z-40"
          style={{ maxWidth: "calc(100vw - 3rem - 280px - 2rem)" }}
        >
          <InfoCard
            title="Interne Qualität"
            icon={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <circle cx="12" cy="12" r="3.5" stroke="#d6ba6d" strokeWidth="2" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="#d6ba6d" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            }
            points={[
              "Kontinuierliche Verbesserungsprozesse",
              "Interne Audits",
              "Mitarbeiterschulungen"
            ]}
            className="max-w-[600px] min-w-[220px]"
          />
          <InfoCard
            title="Kundenqualität"
            icon={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M7 15l-2 2a2 2 0 002.83 2.83l2-2" stroke="#d6ba6d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 15l2 2a2 2 0 01-2.83 2.83l-2-2" stroke="#d6ba6d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 13l4 4 4-4" stroke="#d6ba6d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 17V7" stroke="#d6ba6d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
            points={[
              "Erfüllung von Kundenanforderungen",
              "Lieferzuverlässigkeit",
              "Serviceorientierung"
            ]}
            className="max-w-[600px] min-w-[220px]"
          />
        </div>
        {/* Ende Info-Box */}
      </section>
      <div className="h-[1500px]" />
      {/* Neue Section: PROZESSMANAGEMENT als animierter Bereich */}
      <section
        ref={prozessRef}
        className="w-full min-h-[100vh] relative z-10 bg-transparent"
      >
        <div className="h-[200px]" />
        <h1
          ref={prozessTitleRef}
          className="fixed left-[calc(3rem+280px)] top-[170px] text-5xl font-bold text-[#d6ba6d] drop-shadow-2xl pointer-events-none select-none z-50"
        >
          PROZESSMANAGEMENT
        </h1>
        <div
          ref={prozessCardsRef}
          className="fixed left-[calc(3rem+280px)] top-[270px] flex flex-row gap-8 w-auto items-stretch z-40"
          style={{ maxWidth: "calc(100vw - 3rem - 280px - 2rem)" }}
        >
          <InfoCard
            title="Prozessoptimierung"
            icon={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect x="4" y="4" width="16" height="16" rx="4" stroke="#d6ba6d" strokeWidth="2" />
                <path d="M8 12h8M12 8v8" stroke="#d6ba6d" strokeWidth="2" strokeLinecap="round" />
              </svg>
            }
            points={[
              "Ablaufanalysen",
              "Effizienzsteigerung",
              "Digitalisierung von Prozessen"
            ]}
            className="max-w-[600px] min-w-[220px]"
          />
          <InfoCard
            title="Lieferantenmanagement"
            icon={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <circle cx="12" cy="12" r="7" stroke="#d6ba6d" strokeWidth="2" />
                <path d="M8 12h8" stroke="#d6ba6d" strokeWidth="2" strokeLinecap="round" />
              </svg>
            }
            points={[
              "Lieferantenauswahl",
              "Entwicklung & Bewertung",
              "Risikomanagement"
            ]}
            className="max-w-[600px] min-w-[220px]"
          />
        </div>
        <div className="h-[500px]" />
      </section>
      <div className="h-[800px]" />
      
      {/* Neue Section: LIEFERANTENAUFBAU als animierter Bereich */}
      <section
        ref={lieferantenRef}
        className="w-full min-h-[100vh] relative z-10 bg-transparent"
      >
        <div className="h-[200px]" />
        <h1
          ref={lieferantenTitleRef}
          className="fixed left-[calc(3rem+280px)] top-[180px] text-5xl font-bold text-[#d6ba6d] drop-shadow-2xl pointer-events-none select-none z-50"
        >
          LIEFERANTENAUFBAU
        </h1>
        <div
          ref={lieferantenCardsRef}
          className="fixed left-[calc(3rem+280px)] top-[270px] flex flex-row gap-8 w-auto items-stretch z-40"
          style={{ maxWidth: "calc(100vw - 3rem - 280px - 2rem)" }}
        >
          <InfoCard
            title="Lieferantensuche"
            icon={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" stroke="#d6ba6d" strokeWidth="2" />
                <path d="M8 12h8" stroke="#d6ba6d" strokeWidth="2" strokeLinecap="round" />
              </svg>
            }
            points={[
              "Marktrecherche",
              "Anfrage- und Angebotsmanagement",
              "Erstqualifizierung"
            ]}
            className="max-w-[600px] min-w-[220px]"
          />
          <InfoCard
            title="Lieferantenentwicklung"
            icon={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect x="6" y="6" width="12" height="12" rx="3" stroke="#d6ba6d" strokeWidth="2" />
                <path d="M12 9v6M9 12h6" stroke="#d6ba6d" strokeWidth="2" strokeLinecap="round" />
              </svg>
            }
            points={[
              "Auditierung",
              "Qualitätssteigerung",
              "Partnerschaftsaufbau"
            ]}
            className="max-w-[600px] min-w-[220px]"
          />
        </div>
        <div className="h-[500px]" />
      </section>
      
      
      <div className="h-[300px]" />
      {/* Persönliche "Me"-Seite für Merab */}
      <section className="backdrop-blur-md flex w-full min-h-[120vh] relative z-50  flex items-center justify-center py-24 bg-neutral-700/70 relative">
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

      {/* NOS Placeholder Section */}
      <section className="w-full min-h-[100vh] flex items-center justify-center bg-neutral-800/80 relative z-10" id="nos">
        <div className="text-center">
          <div className="h-[500px]"></div>
          <h2 className="text-5xl font-regular mb-4 drop-shadow-2xl text-shadow-gold text-[#d6ba6d]">MINDACROSS</h2>
          <p className="text-m text-[#d6ba6d]/70">KLARHEIT. STRUKTUR. HANDLUNGSKRAFT</p>
          {/* CTA Button: Jetzt Kontakt aufnehmen */}
          <div className="mt-10">
            <a
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
      <footer className="w-full py-6 flex flex-col items-center justify-center bg-neutral-900/90 border-t border-neutral-700 mt-0">
        <nav className="flex flex-wrap gap-6 items-center justify-center text-sm">
          <a href="/impressum" className="text-gray-400 hover:text-[#d6ba6d] transition-colors" target="_blank" rel="noopener noreferrer">Impressum</a>
          <a href="/datenschutz" className="text-gray-400 hover:text-[#d6ba6d] transition-colors" target="_blank" rel="noopener noreferrer">Datenschutz</a>
          <a href="/terms" className="text-gray-400 hover:text-[#d6ba6d] transition-colors" target="_blank" rel="noopener noreferrer">Terms &amp; Services</a>
          <a href="/kontakt" className="text-gray-400 hover:text-[#d6ba6d] transition-colors" target="_blank" rel="noopener noreferrer">Kontakt</a>
          <a href="https://www.youtube.com/" className="text-gray-400 hover:text-[#d6ba6d] transition-colors flex items-center gap-1" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" className="inline-block align-text-bottom"><path d="M23.498 6.186a2.994 2.994 0 0 0-2.107-2.12C19.228 3.5 12 3.5 12 3.5s-7.228 0-9.391.566A2.994 2.994 0 0 0 .502 6.186C0 8.36 0 12 0 12s0 3.64.502 5.814a2.994 2.994 0 0 0 2.107 2.12C4.772 20.5 12 20.5 12 20.5s7.228 0 9.391-.566a2.994 2.994 0 0 0 2.107-2.12C24 15.64 24 12 24 12s0-3.64-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            YouTube
          </a>
          <a href="https://www.linkedin.com/" className="text-gray-400 hover:text-[#d6ba6d] transition-colors flex items-center gap-1" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" className="inline-block align-text-bottom"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.27c-.966 0-1.75-.79-1.75-1.76 0-.97.784-1.76 1.75-1.76s1.75.79 1.75 1.76c0 .97-.784 1.76-1.75 1.76zm15.5 11.27h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.76 1.379-1.561 2.838-1.561 3.036 0 3.6 2.001 3.6 4.601v5.593z"/></svg>
            LinkedIn
          </a>
        </nav>
        <div className="text-xs text-gray-500 mt-2">&copy; {new Date().getFullYear()} Merab Torodadze. All rights reserved.</div>
      </footer>
    </div>
  );
}

export default App;
