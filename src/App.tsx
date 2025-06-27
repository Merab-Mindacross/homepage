import { useRef, useEffect, type JSX, useState } from "react";
import { gsap } from "gsap";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./App.css";

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

  // State to control when to show the Qualitätsmanagement section
  const [showQM, setShowQM] = useState<boolean>(false);
  const qmTitleRef = useRef<HTMLHeadingElement>(null);
  const qmPointsRef = useRef<HTMLUListElement>(null);

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
        },
        onLeave: () => {
          // When logo animation is done, show QM section
          setShowQM(true);
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

  // Animate fade-in for QM section when it appears
  useEffect(() => {
    if (showQM) {
      if (qmTitleRef.current) {
        gsap.fromTo(qmTitleRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: "power2.out" });
      }
      if (qmPointsRef.current) {
        gsap.fromTo(qmPointsRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: "power2.out" });
      }
    }
  }, [showQM]);

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
      {/* Add extra content to enable scrolling */}
      <div className="h-[120vh]" />
      {/* Qualitätsmanagement Section: Fades in after logo animation */}
      {showQM && (
        <section className="w-full flex flex-col items-center justify-center py-32 bg-transparent">
          <h2 ref={qmTitleRef} className="text-4xl font-bold text-gray-100 mb-6 opacity-0">Qualitätsmanagement</h2>
          <ul ref={qmPointsRef} className="text-2xl text-gray-200 space-y-4 opacity-0">
            <li>• Prozessoptimierung und Effizienzsteigerung</li>
            <li>• Lieferantenentwicklung und -bewertung</li>
            <li>• Qualitätsaudits und Zertifizierungen</li>
            <li>• Fehler- und Reklamationsmanagement</li>
            <li>• Schulung und Sensibilisierung von Teams</li>
          </ul>
        </section>
      )}
    </div>
  );
}

export default App;
