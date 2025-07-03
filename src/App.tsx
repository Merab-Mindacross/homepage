import { useEffect, useRef, useState, type JSX } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./App.css";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";
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
          {/* Dots on right side */}
          <div className="absolute right-[120px] top-0 h-full flex flex-col justify-between z-0" style={{ width: "8px", paddingRight: "2px" }}>
            {Array.from({ length: 24 }).map((_, i) => {
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
          {/* Track */}
          <div className="w-[30px] h-full bg-[#171717] rounded-sm overflow-hidden relative flex items-center justify-center">
            
            {/* Track shadow */}
            <div className="w-[25px] absolute -z-0  h-full bg-[#171717] translate-x-[3px] translate-y-[2px] rounded-sm shadow-lg shadow-md shadow-black" />
          </div>
          {/*
            Knob: Moves upwards as you scroll down the hero section.
            Strictly typed, with error checking and robust GSAP animation.
          */}
          <div
            className="w-[80px] h-[50px]   absolute top-[100%] left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-2xl shadow-lg shadow-black"
            ref={knobRef}
            aria-label="Scroll knob"
            tabIndex={0}
          >
            {/* Knob image */}
            <img src="/knob.png" alt="Knob" className="w-full h-full" />
            {/* Knob line */}
            <div className="w-[70px] h-[10px] bg-[#ffffff] absolute top-1/2 left-1/2 rounded-sm left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white -z-1 shadow-xl shadow-lg shadow-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
