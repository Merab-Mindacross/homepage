import { useRef, useEffect, type JSX } from "react";
import { gsap } from "gsap";
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
    const img = heroRef.current?.querySelector<HTMLImageElement>(".hero-bg-img");
    if (img) {
      gsap.to(img, {
        y: 60,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="app-root w-full">
      <section ref={heroRef} className="w-full min-h-screen flex items-center justify-center bg-gradient-to-tr from-neutral-900 to-neutral-800 w-full">
        <div className="flex flex-row items-center w-full max-w-5xl mx-auto px-4 py-12 gap-8">
          <img
            src="/src/assets/Goldenes Dreieck mit Spiralensymbol.png"
            alt="Goldenes Dreieck mit Spiralensymbol Logo"
            className="w-[500px] max-w-[40vw] h-auto rounded-2xl drop-shadow-xl bg-transparent"
          />
          <div className="flex flex-col items-start justify-center flex-1">
            <h1 className="text-4xl font-bold text-gray-100 mb-4 text-left leading-tight">KURZFRISTIGE VERSTÄRKUNG</h1>
            <h1 className="text-5xl font-bold text-gray-100 mb-4 text-left leading-tight">LANGFRISTIGER EFFEKT.</h1>
            <p className="text-2xl font-medium text-gray-300 text-left">Interim Management in der Schnittstelle von <span className="text-[#d6ba6d]">Qualität</span>, <span className="text-[#d6ba6d]">Prozessen</span> und <span className="text-[#d6ba6d]">Lieferanten</span>.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
