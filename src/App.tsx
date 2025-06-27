import { useRef, useEffect, type JSX } from "react";
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

  return (
    <div className="app-root w-full scroll-area relative min-h-[800vh] bg-gradient-to-tr from-neutral-900 to-neutral-800">
      {/* Fixed Logo */}
      <img
        src="/src/assets/Goldenes Dreieck mit Spiralensymbol.png"
        alt="Goldenes Dreieck mit Spiralensymbol Logo"
        className="fixed top-1/2 left-12 -translate-y-1/2 w-[500px] max-w-[30vw] h-auto rounded-2xl drop-shadow-xl bg-transparent z-20 pointer-events-none"
        style={{ zIndex: 20 }}
      />
      {/* Scrollable Content */}
      <section className="w-[50vw] ml-[40vw] min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-start justify-center flex-1 max-w-3xl mx-auto px-4 py-32">
          {/* Animated scroll-up elements with refs */}
          <h1 ref={scrollUpRefs[0]} className="text-4xl font-bold text-gray-100 text-left leading-tight scroll-up">KURZFRISTIGE VERSTÄRKUNG</h1>
          <h1 ref={scrollUpRefs[1]} className="text-5xl font-bold text-gray-100 text-left leading-tight scroll-up">LANGFRISTIGER EFFEKT.</h1>
          <p ref={scrollUpRefs[2]} className="text-2xl font-medium text-gray-300 text-left scroll-up">Interim Management in der Schnittstelle von <span className="text-[#d6ba6d]">Qualität</span>, <span className="text-[#d6ba6d]">Prozessen</span> und <span className="text-[#d6ba6d]">Lieferanten</span>.</p>
        </div>
      </section>
      {/* Add extra content to enable scrolling */}
      <div className="h-[120vh]" />
    </div>
  );
}

export default App;
