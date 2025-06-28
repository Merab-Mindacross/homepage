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
    const yOffsets = [0, 40, 80]; // px, initial offset for each element
    const yMoveFactors = [120, 180, 240]; // px, how much each element moves up
    const fadeStart = 0.2; // Start fading after 20% scroll
    const fadeEnd = 0.8; // Fully faded at 80% scroll
    const triggers: ScrollTrigger[] = [];

    elements.forEach((el, i) => {
      if (!el) return;
      // Set initial position
      gsap.set(el, { y: yOffsets[i], opacity: 1 });
      // Animate on scroll
      const trigger = ScrollTrigger.create({
        trigger: el,
        start: "top 80%", // when element top hits 80% viewport
        end: "top 10%",   // when element top hits 10% viewport
        scrub: true,
        onUpdate: (self) => {
          // Progress: 0 (start) to 1 (end)
          const progress = self.progress;
          // Move up at different rates
          const y = yOffsets[i] - yMoveFactors[i] * progress;
          // Fade out between fadeStart and fadeEnd
          let opacity = 1;
          if (progress > fadeStart) {
            opacity = 1.5 - (progress - fadeStart) / (fadeEnd - fadeStart);
            if (opacity < 0) opacity = 0;
          }
          gsap.to(el, { y, opacity, overwrite: "auto", duration: 0.1, ease: "linear" });
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
        start: "top center", // matches the end of the last scroll-up animation
        end: "+=400", // over 400px scroll
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
      end: "top top",      // End when Prozessmanagement section reaches top
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
  useEffect(() => {
    const prozessEl = prozessRef.current;
    if (prozessEl) {
      ScrollTrigger.create({
        trigger: prozessEl,
        start: "top top",
        end: "bottom center",
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.to(prozessEl, { opacity: 1 - progress , duration: 0.1, overwrite: "auto" });
        }
      });
    }
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
        <div className="flex flex-col items-start justify-center flex-1 max-w-3xl mx-auto px-4 py-32">
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
      {/* Neue Section: PROZESSMANAGEMENT als Platzhalter */}
      <section
        ref={prozessRef}
        className="w-full min-h-[100vh] relative z-10 bg-transparent"
      >
        <div className="h-[200px]" />
        <h1 className="fixed text-5xl font-bold text-[#d6ba6d] ml-[calc(3rem+280px)] mt-12">PROZESSMANAGEMENT</h1>
        <div className="h-[500px]" />
        <div className="flex flex-row gap-8 w-auto items-stretch z-40">
          <InfoCard
            title="Prozessoptimierung"
            icon={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="#d6ba6d" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            }
            points={[
              "Kontinuierliche Verbesserungsprozesse",
              "Interne Audits",
              "Mitarbeiterschulungen"
            ]}
          />
          <InfoCard
            title="Prozessoptimierung"
            icon={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="#d6ba6d" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            }
            points={[
              "Kontinuierliche Verbesserungsprozesse",
              "Interne Audits",
              "Mitarbeiterschulungen"
            ]}
          />  
        </div>

      </section>
     
     
      <div className="h-[120vh]" />
    </div>
  );
}

export default App;
