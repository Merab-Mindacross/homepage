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

  // (Optional) Parallax effect for hero background image
  useEffect(() => {
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

    // Animate .scroll-up elements to move up, fade out, and scale down with a pronounced parallax effect
    gsap.utils.toArray<HTMLElement>(".scroll-up").forEach((el, i) => {
      gsap.to(el, {
        y: -350, // more pronounced upward movement
        opacity: 0,
        scale: 0.85, // scale down slightly
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top 70%",
          end: "bottom 10%",
          scrub: 1.2, // slower, more pronounced parallax
          scroller: ".scroll-area",
        },
      });
    });

    // Cleanup function: kill ScrollTriggers and cancel animation frame
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      if (typeof rafId === "number") {
        window.cancelAnimationFrame(rafId);
      }
      lenis.off("scroll", onLenisScroll);
    };
  }, []);

  return (
    <div className="app-root w-full scroll-area relative min-h-[200vh] bg-gradient-to-tr from-neutral-900 to-neutral-800">
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
          <h1 className="text-4xl font-bold text-gray-100 mb-4 text-left leading-tight scroll-up">KURZFRISTIGE VERSTÄRKUNG</h1>
          <h1 className="text-5xl font-bold text-gray-100 mb-4 text-left leading-tight scroll-up">LANGFRISTIGER EFFEKT.</h1>
          <p className="text-2xl font-medium text-gray-300 text-left scroll-up">Interim Management in der Schnittstelle von <span className="text-[#d6ba6d]">Qualität</span>, <span className="text-[#d6ba6d]">Prozessen</span> und <span className="text-[#d6ba6d]">Lieferanten</span>.</p>
        </div>
      </section>
      {/* Add extra content to enable scrolling */}
      <div className="h-[120vh]" />
    </div>
  );
}

export default App;
