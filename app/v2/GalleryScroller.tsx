"use client";

import { ReactNode, useEffect, useRef } from "react";

type GalleryScrollerProps = {
  children: ReactNode;
};

export default function GalleryScroller({ children }: GalleryScrollerProps) {
  const stripRef = useRef<HTMLDivElement>(null);
  const velocityRef = useRef(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const startMomentum = () => {
    if (frameRef.current !== null) return;

    const tick = () => {
      const strip = stripRef.current;
      if (!strip) {
        frameRef.current = null;
        return;
      }

      strip.scrollLeft += velocityRef.current;
      velocityRef.current *= 0.88;

      const maxScroll = strip.scrollWidth - strip.clientWidth;
      if (strip.scrollLeft <= 0 || strip.scrollLeft >= maxScroll) {
        velocityRef.current *= 0.45;
      }

      if (Math.abs(velocityRef.current) < 0.18) {
        velocityRef.current = 0;
        frameRef.current = null;
        return;
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
  };

  return (
    <div
      ref={stripRef}
      className="v2-gallery-strip"
      onWheel={(event) => {
        const strip = stripRef.current;
        if (!strip || window.innerWidth <= 800) return;
        if (strip.scrollWidth <= strip.clientWidth) return;

        event.preventDefault();
        const wheelDelta = Math.abs(event.deltaY) >= Math.abs(event.deltaX)
          ? event.deltaY
          : event.deltaX;
        velocityRef.current += wheelDelta * 0.22;
        velocityRef.current = Math.max(-42, Math.min(42, velocityRef.current));
        startMomentum();
      }}
      aria-label="团队照片横向展示"
    >
      {children}
    </div>
  );
}
