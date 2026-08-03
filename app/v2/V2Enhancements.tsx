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
    const style = document.createElement("style");
    style.textContent = `
      .v2-system-hud{position:absolute;right:5vw;top:28%;z-index:8;width:220px;padding:18px;border:1px solid rgba(255,255,255,.18);background:rgba(4,8,15,.42);backdrop-filter:blur(14px);font-family:monospace;color:#fff;box-shadow:0 0 40px rgba(80,150,255,.15)}
      .hud-title{font-size:11px;letter-spacing:.18em;color:#d7ff38;margin-bottom:16px}.hud-title span{display:inline-block;width:8px;height:8px;border-radius:50%;background:#d7ff38;box-shadow:0 0 12px #d7ff38;margin-right:8px}
      .hud-row{display:flex;justify-content:space-between;padding:8px 0;border-top:1px solid rgba(255,255,255,.08);font-size:12px}.hud-row em{font-style:normal;color:#8ee8ff}
      @media(max-width:800px){.v2-system-hud{display:none}}
    `;
    document.head.appendChild(style);
    const hud = document.createElement("div");
    hud.className = "v2-system-hud";
    hud.innerHTML = `<div class="hud-title"><span></span>SYSTEM ONLINE</div><div class="hud-row"><b>ROS2</b><em>NORMAL</em></div><div class="hud-row"><b>VISION</b><em>ACTIVE</em></div><div class="hud-row"><b>CONTROL</b><em>READY</em></div><div class="hud-row"><b>AI CORE</b><em>RUNNING</em></div>`;
    hero.appendChild(hud);
  }, []);

  return null;
}
