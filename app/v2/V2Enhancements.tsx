"use client";

import { useEffect } from "react";

export default function V2Enhancements() {
  useEffect(() => {
    const strip = document.querySelector<HTMLElement>(".v2-gallery-strip");
    if (strip) {
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
        const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
        velocity += delta * 0.22;
        velocity = Math.max(-42, Math.min(42, velocity));
        if (frame === null) frame = requestAnimationFrame(animate);
      };

      strip.addEventListener("wheel", onWheel, { passive: false });
      return () => {
        strip.removeEventListener("wheel", onWheel);
        if (frame !== null) cancelAnimationFrame(frame);
      };
    }
  }, []);

  useEffect(() => {
    const hero = document.querySelector(".v2-hero");
    if (!hero || hero.querySelector(".v2-system-hud")) return;

    const hud = document.createElement("div");
    hud.className = "v2-system-hud";
    hud.innerHTML = `
      <div class="hud-title"><span></span> SYSTEM ONLINE</div>
      <div class="hud-row"><b>ROS2</b><em>NORMAL</em></div>
      <div class="hud-row"><b>VISION</b><em>ACTIVE</em></div>
      <div class="hud-row"><b>CONTROL</b><em>READY</em></div>
      <div class="hud-row"><b>AI CORE</b><em>RUNNING</em></div>
    `;
    hero.appendChild(hud);
  }, []);

  return null;
}
