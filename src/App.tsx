import {  useEffect, useRef, type JSX } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./App.css";
import {  useLocation } from "react-router-dom";
import Lenis from "lenis";
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
  const heroRef = useRef<HTMLDivElement>(null);
  // Lenis Smooth Scroll initialisieren
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2, // smoothes Scrollen
      easing: (t: number): number => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="h-[500vh]">
      {/* Hero section */}
      <div className="h-[100vh] w-full flex items-center justify-center fixed top-0 left-0 " ref={heroRef}>
        <div className="w-[300px] h-[500px] bg-red-500 flex items-center justify-center">
          <div className="w-[100px] h-[100px] bg-blue-500">
            <p>Hello</p>
          </div>
        </div>
      </div>
    </div>
  );
}
      

export default App;
