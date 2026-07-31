"use client";

import { useEffect } from "react";

export default function V2Enhancements() {
  useEffect(() => {
    const strip = document.querySelector<HTMLElement>(".v2-gallery-strip");
    if (!strip) return;

    let velocity = 0;
    let frame: number | null = null;

    const animate = () => {
      strip.scrollLeft += velocity;
      velocity *= 0.88;

      const maxScroll = strip.scrollWidth - strip.clientWidth;
      if (strip.scrollLeft <= 0 || strip.scrollLeft >= maxScroll) velocity *= 0.45;

      if (Math.abs(velocity) < 0.18) {
        velocity = 0;
        frame = null;
        return;
      }

      frame = requestAnimationFrame(animate);
    };

    const onWheel = (event: WheelEvent) => {
      if (window.innerWidth <= 800 || strip.scrollWidth <= strip.clientWidth) return;

      event.preventDefault();
      const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX)
        ? event.deltaY
        : event.deltaX;

      velocity += delta * 0.22;
      velocity = Math.max(-42, Math.min(42, velocity));
      if (frame === null) frame = requestAnimationFrame(animate);
    };

    strip.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      strip.removeEventListener("wheel", onWheel);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
