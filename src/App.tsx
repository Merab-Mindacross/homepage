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

  // Only show the logo intro on the main page
  const showLogoIntro = isMainPage;

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
    const yOffsets = isMobile ? [0, 0, 0] : [0,0,0]; // px, initial y offset for desktop
    const xOffsets = isMobile ? [0, 0,0] : [0, 0, 0]; // px, initial x offset for mobile
    const yMoveFactors = isMobile ? [-150, -80, -50] : [100, 60, 40]; 
    const xMoveFactors = isMobile ? [0, 0, 0] : [0, 0, 0]; 
    const scaleFactors = [1.3, 1.2, 1.1]; // scale for both
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
                <p ref={scrollUpRefs[2]} className="text-lg md:text-2xl font-medium text-gray-300 text-left scroll-up">Interim Management in der Schnittstelle von <span className="text-[#d6ba6d]">Qualität</span>, <span className="text-[#d6ba6d]">Prozessen</span> und <span className="text-[#d6ba6d]">Lieferanten</span>.</p>
        </div>
      </section>
            {isMobileViewport && (
              <div className="h-[200px]" />
            )}
      {/* Qualitätsmanagement */}
      <section
              id="quality"
        className="w-[60vw] min-h-[60vh] relative z-30 fixed top-0 left-0"
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
                  title="8D-Reports und nachhaltige Reklamationsbearbeitung"
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><g fill="none" stroke="#d6ba6d" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M9.854 32A15 15 0 0 1 9 27c0-8.284 6.716-15 15-15s15 6.716 15 15c0 1.753-.3 3.436-.853 5"/><path d="M34 38h6.078c1.215 0 2.397-.539 2.945-1.623C44.342 33.769 45 30.105 45 27c0-11.598-9.402-21-21-21S3 15.402 3 27c0 3.105.659 6.77 1.977 9.377C5.525 37.46 6.707 38 7.923 38H14"/><path d="M20.136 34.965a4 4 0 1 0 7.728 2.07a4 4 0 1 0-7.728-2.07m4.899-2.829l3.623-13.523"/></g></svg>}
                  />
                  <InfoCard
                  title="Einführung und Zertifizierung von Quality Gates"
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 16 16"><g fill="#d6ba6d"><path d="M12.5 16a3.5 3.5 0 1 0 0-7a3.5 3.5 0 0 0 0 7m.354-5.854l1.5 1.5a.5.5 0 0 1-.708.708L13 11.707V14.5a.5.5 0 0 1-1 0v-2.793l-.646.647a.5.5 0 0 1-.708-.708l1.5-1.5a.5.5 0 0 1 .708 0M11 5a3 3 0 1 1-6 0a3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4a2 2 0 0 0 0 4"/><path d="M8.256 14a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z"/></g></svg>}
                  />
          <InfoCard
                  title="Mitarbeiterschulungen"
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 16 16"><path fill="#d6ba6d" fill-rule="evenodd" d="M.573 4.1a.999.999 0 0 0 0 1.808l1.43.675v3.92c0 .742.241 1.57.944 2.08c.886.64 2.5 1.42 5.06 1.42s4.17-.785 5.06-1.42c.703-.508.944-1.33.944-2.08v-3.92l1-.473v4.39a.5.5 0 0 0 1 0V5a1 1 0 0 0-.572-.904l-5.72-2.7a4 4 0 0 0-3.42 0l-5.72 2.7zm2.43 6.4V7.05l3.29 1.56a4 4 0 0 0 3.42 0l3.29-1.56v3.45c0 .556-.18 1.01-.53 1.26c-.724.523-2.13 1.24-4.47 1.24s-3.75-.712-4.47-1.24c-.349-.252-.529-.709-.529-1.26zm3.72-8.2a2.99 2.99 0 0 1 2.56 0l5.72 2.7l-5.72 2.7a2.99 2.99 0 0 1-2.56 0L1.003 5z" clip-rule="evenodd"/></svg>}
          />
          <InfoCard
            title="Aufbau kompletter QM-Systeme"
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"><path fill="#d6ba6d" d="M20.05 4.433a5.247 5.247 0 0 0-6.95 2.844l-1.205 2.976a2.75 2.75 0 0 1-1.537 1.524l-2.987 1.18a5.247 5.247 0 0 0-2.903 6.925l1.252 2.957c.293.693.29 1.475-.01 2.164L4.435 27.95a5.247 5.247 0 0 0 2.844 6.95l2.976 1.205a2.75 2.75 0 0 1 1.524 1.537l1.18 2.987a5.247 5.247 0 0 0 6.925 2.903l2.957-1.252a2.75 2.75 0 0 1 2.164.01l2.947 1.276a5.247 5.247 0 0 0 6.95-2.844l1.205-2.976a2.75 2.75 0 0 1 1.537-1.524l2.987-1.18a5.247 5.247 0 0 0 2.902-6.925l-1.251-2.957a2.75 2.75 0 0 1 .01-2.164l1.276-2.947a5.247 5.247 0 0 0-2.844-6.95l-2.976-1.205a2.75 2.75 0 0 1-1.524-1.537l-1.18-2.987a5.247 5.247 0 0 0-6.925-2.903L25.161 5.72a2.75 2.75 0 0 1-2.164-.01zm-4.634 3.782a2.75 2.75 0 0 1 3.64-1.49l2.947 1.277a5.25 5.25 0 0 0 4.131.018l2.958-1.252a2.75 2.75 0 0 1 3.627 1.521l1.18 2.987a5.25 5.25 0 0 0 2.91 2.933l2.976 1.207a2.75 2.75 0 0 1 1.49 3.64l-1.277 2.946a5.25 5.25 0 0 0-.018 4.131l1.252 2.958a2.75 2.75 0 0 1-1.521 3.627l-2.987 1.18a5.25 5.25 0 0 0-2.933 2.91l-1.206 2.976a2.75 2.75 0 0 1-3.64 1.49l-2.947-1.278a5.25 5.25 0 0 0-4.131-.017l-2.958 1.252a2.75 2.75 0 0 1-3.627-1.521l-1.18-2.987a5.25 5.25 0 0 0-2.91-2.933l-2.976-1.206a2.75 2.75 0 0 1-1.49-3.64l1.277-2.947a5.25 5.25 0 0 0 .018-4.131L6.77 18.908a2.75 2.75 0 0 1 1.521-3.627l2.987-1.18a5.25 5.25 0 0 0 2.933-2.91zM31 24a3 3 0 0 1 3 3v1c0 3.943-3.719 8-10 8s-10-4.057-10-8v-1a3 3 0 0 1 3-3zm-7-13a5.5 5.5 0 1 1 0 11a5.5 5.5 0 0 1 0-11"/></svg>}
                  />
                  <InfoCard
                  title="Aufbau von Q-Runden"
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none" stroke="#d6ba6d" stroke-width="1"><path d="M10.861 3.363C11.368 2.454 11.621 2 12 2s.632.454 1.139 1.363l.13.235c.145.259.217.388.329.473s.252.117.532.18l.254.058c.984.222 1.476.334 1.593.71s-.218.769-.889 1.553l-.174.203c-.19.223-.285.334-.328.472s-.029.287 0 .584l.026.27c.102 1.047.152 1.57-.154 1.803s-.767.02-1.688-.404l-.239-.11c-.261-.12-.392-.18-.531-.18s-.27.06-.531.18l-.239.11c-.92.425-1.382.637-1.688.404s-.256-.756-.154-1.802l.026-.271c.029-.297.043-.446 0-.584s-.138-.25-.328-.472l-.174-.203c-.67-.784-1.006-1.177-.889-1.553s.609-.488 1.593-.71l.254-.058c.28-.063.42-.095.532-.18s.184-.214.328-.473zm8.569 4.319c.254-.455.38-.682.57-.682s.316.227.57.682l.065.117c.072.13.108.194.164.237s.126.058.266.09l.127.028c.492.112.738.167.796.356s-.109.384-.444.776l-.087.101c-.095.112-.143.168-.164.237s-.014.143 0 .292l.013.135c.05.523.076.785-.077.901s-.383.01-.844-.202l-.12-.055c-.13-.06-.196-.09-.265-.09c-.07 0-.135.03-.266.09l-.119.055c-.46.212-.69.318-.844.202c-.153-.116-.128-.378-.077-.901l.013-.135c.014-.15.022-.224 0-.292c-.021-.07-.069-.125-.164-.237l-.087-.101c-.335-.392-.503-.588-.444-.776s.304-.244.796-.356l.127-.028c.14-.032.21-.048.266-.09c.056-.043.092-.108.164-.237z"/><path stroke-linecap="round" d="M5 20.388h2.26c1.01 0 2.033.106 3.016.308a14.9 14.9 0 0 0 5.33.118c.868-.14 1.72-.355 2.492-.727c.696-.337 1.549-.81 2.122-1.341c.572-.53 1.168-1.397 1.59-2.075c.364-.582.188-1.295-.386-1.728a1.89 1.89 0 0 0-2.22 0l-1.807 1.365c-.7.53-1.465 1.017-2.376 1.162q-.165.026-.345.047m0 0l-.11.012m.11-.012a1 1 0 0 0 .427-.24a1.49 1.49 0 0 0 .126-2.134a1.9 1.9 0 0 0-.45-.367c-2.797-1.669-7.15-.398-9.779 1.467m9.676 1.274a.5.5 0 0 1-.11.012m0 0a9.3 9.3 0 0 1-1.814.004"/><rect width="3" height="8" x="2" y="14" rx="1.5"/></g></svg>}
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
                  title="Abläufe analysieren und Verschwendung eliminieren"
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none" stroke="#d6ba6d" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"><path d="m17.392 17.395l5.856 5.856m-14.25-12.75a1.5 1.5 0 1 0 3 0a1.5 1.5 0 0 0-3 0"/><path d="M9.224 4.7a1.33 1.33 0 0 1 2.548 0l.442 1.453a.994.994 0 0 0 1.174.681l1.472-.34a1.338 1.338 0 0 1 1.274 2.217L15.1 9.821a1 1 0 0 0 0 1.361l1.03 1.111a1.338 1.338 0 0 1-1.274 2.218l-1.472-.34a.994.994 0 0 0-1.174.68l-.438 1.45a1.33 1.33 0 0 1-2.548 0l-.443-1.454a.993.993 0 0 0-1.173-.68l-1.473.34a1.338 1.338 0 0 1-1.274-2.218l1.031-1.11a1 1 0 0 0 0-1.363L4.861 8.71a1.338 1.338 0 0 1 1.274-2.218l1.473.341a.993.993 0 0 0 1.173-.68z"/><path d="M.748 10.501a9.75 9.75 0 1 0 19.5 0a9.75 9.75 0 0 0-19.5 0"/></g></svg>}
                  />

                <InfoCard
                  title="Effizienz steigern durch klare Strukturen"
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 21 21"><g fill="none" fill-rule="evenodd" stroke="#d6ba6d" stroke-linecap="round" stroke-linejoin="round" transform="translate(2 2)" stroke-width="1"><circle cx="8.5" cy="8.5" r="8"/><path d="m10.5 9.5l-4 3v-5l4-3z"/></g></svg>}
                />
                <InfoCard
                  title="Analyse und Optimierung bestehender Prozesse"
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none" stroke="#d6ba6d" stroke-linecap="round" stroke-width="1"><path d="M14.423 4.71H9.728a4.705 4.705 0 0 0-4.705 4.706v4.695a4.705 4.705 0 0 0 4.705 4.705h4.695a4.705 4.705 0 0 0 4.705-4.705V9.416a4.705 4.705 0 0 0-4.705-4.706Z"/><path d="M13.314 8.044h-2.476a2.48 2.48 0 0 0-2.482 2.481v2.476a2.48 2.48 0 0 0 2.482 2.482h2.476a2.48 2.48 0 0 0 2.48-2.482v-2.476a2.48 2.48 0 0 0-2.48-2.481ZM22 8.74h-2.922m-14.005 0H2m20 6.51h-3.013m-13.823 0H2M15.26 22v-3.254m0-13.966V2M8.74 22v-3.285m0-13.904V2"/></g></svg>}
                />
          <InfoCard
                  title="Schnittstellen-Kommunikation und Stärkung der Ownership"
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 26 26"><g fill="#d6ba6d"><path d="M8.254 17.596a.5.5 0 0 1 .707-.707A5.5 5.5 0 0 0 18.35 13a.5.5 0 0 1 .999.001a6.5 6.5 0 0 1-11.096 4.596"/><path d="M16.131 15.416a.5.5 0 0 1-.555-.832l3-2a.5.5 0 1 1 .555.832z"/><path d="M21.266 15.723a.5.5 0 1 1-.832.554l-2-3a.5.5 0 0 1 .832-.554zm-3.912-7.518a.5.5 0 0 1-.708.707a5.5 5.5 0 0 0-9.389 3.89a.5.5 0 0 1-1-.001a6.5 6.5 0 0 1 11.097-4.596"/><path d="M9.476 10.385a.5.5 0 0 1 .555.832l-3 2a.5.5 0 1 1-.555-.832z"/><path d="M4.341 10.078a.5.5 0 1 1 .832-.554l2 3a.5.5 0 0 1-.832.554z"/><path fill-rule="evenodd" d="M13 24.5c6.351 0 11.5-5.149 11.5-11.5S19.351 1.5 13 1.5S1.5 6.649 1.5 13S6.649 24.5 13 24.5m0 1c6.904 0 12.5-5.596 12.5-12.5S19.904.5 13 .5S.5 6.096.5 13S6.096 25.5 13 25.5" clip-rule="evenodd"/></g></svg>}
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
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none" stroke="#d6ba6d" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"><path d="M13.544 10.456a4.37 4.37 0 0 0-6.176 0l-3.089 3.088a4.367 4.367 0 1 0 6.177 6.177L12 18.177"/><path d="M10.456 13.544a4.37 4.37 0 0 0 6.176 0l3.089-3.088a4.367 4.367 0 1 0-6.177-6.177L12 5.823"/></g></svg>}
                  />
                  <InfoCard
                  title="Durchlaufzeitoptimierung und Beseitigung von Bottlenecks"
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#d6ba6d" d="M11.5 19v-3.754q-1.379-.102-2.399-.999t-1.278-2.258q-1.587-.187-2.705-1.301T4 8v-.385q0-.666.475-1.14T5.615 6h2.039v-.385q0-.666.474-1.14Q8.603 4 9.27 4h5.462q.666 0 1.14.475q.475.474.475 1.14V6h2.039q.666 0 1.14.475T20 7.615V8q0 1.573-1.118 2.688t-2.705 1.3q-.258 1.362-1.278 2.259t-2.399 1V19h2.616q.212 0 .356.144t.144.357t-.144.356t-.356.143H8.885q-.213 0-.357-.144t-.143-.357t.143-.356t.357-.143zm-3.846-8.084V7H5.615q-.269 0-.442.173T5 7.616V8q0 1.123.762 1.953q.761.83 1.892.963m4.35 3.353q1.38 0 2.342-.965q.962-.964.962-2.343V5.616q0-.27-.174-.443Q14.962 5 14.692 5H9.308q-.27 0-.442.173q-.174.173-.174.443v5.346q0 1.378.966 2.343q.967.964 2.347.964m4.341-3.353q1.131-.133 1.893-.963Q19 9.123 19 8v-.385q0-.269-.173-.442T18.385 7h-2.039zM12 9.635"/></svg>}
                  />
                  <InfoCard
                  title="Unterstützung bei der (Wieder-)Herstellung der Lieferfähigkeit"
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="none" stroke="#d6ba6d" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19.4 12c.56 0 .84 0 1.054-.109a1 1 0 0 0 .437-.437C21 11.24 21 10.96 21 10.4V8.2c0-.56 0-.84-.109-1.054a1 1 0 0 0-.437-.437C20.24 6.6 19.96 6.6 19.4 6.6h-1.55a.9.9 0 0 1-.9-.9a2.7 2.7 0 1 0-5.4 0a.9.9 0 0 1-.9.9H9.1c-.56 0-.84 0-1.054.109a1 1 0 0 0-.437.437C7.5 7.36 7.5 7.64 7.5 8.2v2.2c0 .56 0 .84-.109 1.054a1 1 0 0 1-.437.437C6.74 12 6.46 12 5.9 12h-.2a2.7 2.7 0 1 0 0 5.4h.2c.56 0 .84 0 1.054.109a1 1 0 0 1 .437.437c.109.214.109.494.109 1.054v.4c0 .56 0 .84.109 1.054a1 1 0 0 0 .437.437C8.26 21 8.54 21 9.1 21h10.3c.56 0 .84 0 1.054-.109a1 1 0 0 0 .437-.437C21 20.24 21 19.96 21 19.4V19c0-.56 0-.84-.109-1.054a1 1 0 0 0-.437-.437c-.214-.109-.494-.109-1.054-.109h-.2a2.7 2.7 0 1 1 0-5.4z"/></svg>}
                  />
          <InfoCard
                  title="Eskalationsmanagement und Sofortmaßnahmen"
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#d6ba6d" fill-rule="evenodd" d="M5.823 14.177a2 2 0 1 1-1-1l2.354-2.354a2 2 0 1 1 3.646 0l2.354 2.354a2 2 0 0 1 1.646 0l3.354-3.354a2 2 0 1 1 1 1l-3.354 3.354a2 2 0 1 1-3.646 0l-2.354-2.354a2 2 0 0 1-1.646 0z"/></svg>}
          />
        </div>
              </div>
      </section>
      
      {/* Schulungen */}
      <section id="schulungen" className="backdrop-blur-md flex w-full h-auto min-h-[120vh] relative z-50 flex-col md:flex-row items-center justify-center py-12 md:py-24 bg-neutral-700/70">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-[#d6ba6d] mb-12 text-center">Schulungen</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SchulungCard
              title="Mitarbeiterschulungen inkl. Shopfloor-Kommunikation"
              category="Qualitätsmanagement"
              description="Reklamationsbearbeitung, 8D, Ishikawa, Kaizen, Kanban"
            />
            <SchulungCard
              title="Workshops und Schulungen für Teams und Schulungskräfte"
              category="Prozessmanagement"
              description="Effiziente Prozessoptimierung und Teamführung"
            />
            <SchulungCard
              title="Schulungen für Lieferanten und interne Schnittstellen"
              category="Lieferantenentwicklung"
              description="Partnerschaftliche Zusammenarbeit und Qualitätssicherung"
            />
            <SchulungCard
              title="Mitarbeitergespräche für Teams und Führungskräfte"
              category="Generelle Schulungen"
              description="Umgang mit schwierigen Kunden/Ansprechpartnern"
            />
            <SchulungCard
              title="Projektmanagement"
              category="Grundlagen"
              description="Strukturierte Projektplanung und -durchführung"
            />
            <SchulungCard
              title="Lean Six Sigma"
              category="Grundlagen"
              description="Methoden zur Prozessverbesserung und Qualitätssteigerung"
            />
            <SchulungCard
              title="NLP: Gesprächs- und Verhandlungsführung"
              category="Grundlagen"
              description="Effektive Kommunikation und Verhandlungstechniken"
            />
          </div>
        </div>
      </section>

            {/* cta section */}
            <section className="w-full min-h-[95vh] flex items-center justify-center bg-neutral-800/80 relative z-10 opacity-0" id="nos" ref={ctaRef}>
              <div className=" fixed bottom-[30vh] md:bottom-[200px] text-center flex flex-col items-center justify-center">
                <img
                  ref={logoRefStatic}
                  src="/Goldenes Dreieck mit Spiralensymbol.png"
                  alt="Goldenes Dreieck mit Spiralensymbol"
                  className="h-[200px] md:h-[400px] w-auto"
                />
                <h2 className="text-3xl md:text-5xl  mb-4 drop-shadow-2xl text-shadow-gold text-[#d6ba6d]">MINDACROSS</h2>
                <p className="text-sm md:text-m text-[#b89a5a]/90">KLARHEIT. STRUKTUR. HANDLUNGSKRAFT.</p>
                {/* CTA Button: Jetzt Kontakt aufnehmen */}
                <div className="mt-10">
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
