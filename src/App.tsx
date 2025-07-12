import { useRef, useEffect, useState, type JSX } from "react";
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

const viewportWidth: number = window.innerWidth;
const isMobileViewport: boolean = viewportWidth <= 768;
const sliderHeight: number = 500;

/**
 * App component: Only a hero section with parallax-ready background image.
 * Headline: Kurzfristige Verstärkung mit langfristigem Effekt.
 * Subheadline: Interim Management in der Schnittstelle von Qualität, Prozessen und Lieferanten.
 *
 * The yellow knob in the hero section moves upwards as the user scrolls down, using GSAP + ScrollTrigger.
 *
 * @returns {JSX.Element} Main app content
 */
function App(): JSX.Element {
  const location = useLocation();
  const heroRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const [knobProgress, setKnobProgress] = useState<number>(0); // 0 = bottom, 1 = top

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number): number => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    let rafId: number;
    function raf(time: number): void {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Animate the knob and update dot progress
  useEffect(() => {
    const knob = knobRef.current;
    const hero = heroRef.current;
    if (!knob || !hero) return;

    gsap.set(knob, { y: 0, rotation: 0 });

    // Animate knob position
    const st = ScrollTrigger.create({
      trigger: hero,
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        // self.progress: 0 (start, knob at bottom) to 1 (end, knob at top)
        setKnobProgress(self.progress);
        gsap.set(knob, { y: -sliderHeight * self.progress });
      },
    });

    return () => {
      st.kill();
    };
  }, []);

  return (
    <div className="h-[500vh]">
      {/* Hero section */}
      <div className="h-[100vh] w-full flex items-center justify-center fixed top-0 left-0 bg-[#333333]" ref={heroRef}>
        {/* Slider */}
        <div className={`w-[300px] h-[${sliderHeight}px] flex items-center justify-center relative`}>
          {/* Dots on left side */}
          <div className="absolute left-[120px] top-0 h-full flex flex-col justify-between z-0" style={{ width: "8px", paddingLeft: "2px" }}>
            {Array.from({ length: 24 }).map((_, i) => {
              // Calculate the progress threshold for this dot (0 = bottom, 1 = top)
              const dotThreshold = 1 - i / 23;
              const isLit = knobProgress >= dotThreshold;
              return (
                <div
                  key={`dot-left-${i}`}
                  className={`w-[4px] h-[4px] rounded-full mb-0.5 dot-left-${i} ${isLit ? "bg-white opacity-100 shadow-[0_0_8px_2px_#fff]" : "bg-gray-300 opacity-60"}`}
                  style={{ marginBottom: i === 23 ? 0 : "2px" }}
                  aria-hidden="true"
                />
              );
            })}
          </div>
          
          {/* Knob */}
          <div
            ref={knobRef}
            className="w-[60px] h-[60px] bg-[#d6ba6d] rounded-full shadow-lg cursor-pointer z-10"
            style={{
              boxShadow: "0 4px 20px rgba(214, 186, 109, 0.3)",
            }}
          />
          
          {/* Dots on right side */}
          <div className="absolute right-[120px] top-0 h-full flex flex-col justify-between z-0" style={{ width: "8px", paddingRight: "2px" }}>
            {Array.from({ length: 24 }).map((_, i) => {
              // Calculate the progress threshold for this dot (0 = bottom, 1 = top)
              const dotThreshold = 1 - i / 23;
              const isLit = knobProgress >= dotThreshold;
              return (
                <div
                  key={`dot-right-${i}`}
                  className={`w-[4px] h-[4px] rounded-full mb-0.5 dot-right-${i} ${isLit ? "bg-white opacity-100 shadow-[0_0_8px_2px_#fff]" : "bg-gray-300 opacity-60"}`}
                  style={{ marginBottom: i === 23 ? 0 : "2px" }}
                  aria-hidden="true"
                />
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Schulungen Section */}
      <div className="h-[100vh] w-full flex items-center justify-center bg-neutral-900">
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
      </div>
    </div>
  );
}

export default App;
