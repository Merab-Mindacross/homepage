import { useEffect, useRef, type JSX } from "react";
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

  // Animate the knob upwards on scroll using GSAP + ScrollTrigger
  useEffect(() => {
    /**
     * Animate the knob upwards as the user scrolls down the hero section.
     * Moves the knob -300px on the y-axis (upwards).
     */
    const knob = knobRef.current;
    const hero = heroRef.current;
    if (!knob || !hero) return;

    // Reset knob position before animation
    gsap.set(knob, { y: 0, rotation: 0 });

    const tl: gsap.core.Timeline = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: true,
        // markers: true, // Uncomment for debugging
      },
    });

    tl.to(knob, {
      y: -sliderHeight, // Move the knob 300px upwards
      duration: 1, // Duration is controlled by scrollTrigger
      ease: "power1.inOut",
    });

    // Cleanup GSAP/ScrollTrigger on unmount
    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <div className="h-[500vh]">
      {/* Hero section */}
      <div className="h-[100vh] w-full flex items-center justify-center fixed top-0 left-0 bg-[#333333]" ref={heroRef}>
        {/* Slider */}
        <div className={`w-[300px] h-[${sliderHeight}px] flex items-center justify-center relative`}>
          {/* Track */}
          <div className="w-[30px] h-full bg-[#171717] rounded-sm overflow-hidden" >
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
