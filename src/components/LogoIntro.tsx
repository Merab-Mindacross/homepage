import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * LogoIntro
 *
 * Fullscreen animated logo intro overlay.
 * - Draws the logo SVG paths over 2s, holds for 1s, then fades out (logo + blur) over 1s.
 * - Covers the viewport with a blurred, semi-opaque background.
 * - Strictly typed, robust, accessible, and self-unmounting after animation.
 *
 * @component
 */
// const ANIMATION_DURATION_DRAW = 2; // seconds
// const ANIMATION_DURATION_HOLD = 1; // seconds
// const ANIMATION_DURATION_FADE = 1; // seconds
const ANIMATION_DURATION_DRAW = 0; // seconds
const ANIMATION_DURATION_BLUR_OUT = 0.5; // seconds

const BLUR_START = 12; // px
const BLUR_END = 0; // px
const BLUR_BG_COLOR = "rgba(0,0,0,0.6)";

export const LogoIntro: React.FC = () => {
  // Ref for the overlay container
  const overlayRef = useRef<HTMLDivElement>(null);
  // Ref for the blur layer
  const blurRef = useRef<HTMLDivElement>(null);
  // State to control mounting
  const [visible, setVisible] = useState<boolean>(true);

  useEffect(() => {
  const overlay = overlayRef.current;
  const blurLayer = blurRef.current;
  if (!overlay || !blurLayer ) {
    setVisible(false);
    return;
  }
  

  blurLayer.style.filter = `blur(${BLUR_START}px)`;
  blurLayer.style.opacity = "1";
  blurLayer.style.background = BLUR_BG_COLOR;

  const tl: gsap.core.Timeline = gsap.timeline({
    defaults: { ease: "power1.inOut" },

  });

  
  // 3. Blur out the background for 0.5s (blur and opacity to 0)
  tl.to(
    blurLayer,
    {
      filter: `blur(${BLUR_END}px)`,
      opacity: 0,
      duration: ANIMATION_DURATION_BLUR_OUT,
      onStart: () => {
        overlay.style.pointerEvents = "none";
      },
    },
    ANIMATION_DURATION_DRAW 
  );
  // 4. Fade out overlay (opacity only, so logo disappears with blur)
  tl.to(
    overlay,
    {
      opacity: 0,
      duration: ANIMATION_DURATION_BLUR_OUT,
      onStart: () => {
        overlay.style.pointerEvents = "none";
      },
    },
    "<" // sync with blur fade
  );


  return () => {
    document.body.style.overflow = "";
    tl.kill();
  };
}, []);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Logo animation"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-2xl transition-opacity duration-1000"
      style={{
        filter: `blur(5px)`,
        opacity: 1,
        pointerEvents: "auto",
      }}
      tabIndex={-1}
      data-testid="logo-intro-overlay"
    >
        <div
    ref={blurRef}
    className="absolute inset-0 w-full h-full"
    style={{
      zIndex: 0,
      pointerEvents: "none",
      filter: `blur(${BLUR_START}px)`,
      background: BLUR_BG_COLOR,
      transition: "filter 0.5s, opacity 0.5s"
    }}
    data-testid="logo-intro-blur"
  />
      
    </div>
  )
};

export default LogoIntro; 