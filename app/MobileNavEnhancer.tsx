"use client";

import { useEffect } from "react";

const MOBILE_NAV_QUERY = "(max-width: 850px)";

export default function MobileNavEnhancer() {
  useEffect(() => {
    const media = window.matchMedia(MOBILE_NAV_QUERY);
    const nav = document.querySelector<HTMLElement>(".nav-links");
    const menuButton = document.querySelector<HTMLButtonElement>(".menu-button");
    const navWrap = document.querySelector<HTMLElement>(".nav-wrap");
    if (!nav) return;

    const items = Array.from(nav.querySelectorAll<HTMLElement>(":scope > .nav-item"));
    const cleanups: Array<() => void> = [];

    const optimizeMobileImages = () => {
      if (!media.matches) return;

      const priorityImages = new Set(
        Array.from(document.querySelectorAll<HTMLImageElement>(
          ".hero-photo, .brand img, .hero-team-title",
        )),
      );

      document.querySelectorAll<HTMLImageElement>("img").forEach((image) => {
        image.decoding = "async";
        if (priorityImages.has(image)) return;

        image.loading = "lazy";
        image.fetchPriority = "low";
      });
    };

    const collapseGroups = () => {
      items.forEach((item) => {
        item.classList.remove("mobile-expanded");
        item.querySelector<HTMLElement>(":scope > a, :scope > button")
          ?.setAttribute("aria-expanded", "false");
      });
    };

    const closeMobileMenu = () => {
      if (!media.matches || !nav.classList.contains("open")) return;
      collapseGroups();
      menuButton?.click();
    };

    optimizeMobileImages();

    const closeOtherGroups = (current: HTMLElement) => {
      items.forEach((item) => {
        if (item !== current) {
          item.classList.remove("mobile-expanded");
          item.querySelector<HTMLElement>(":scope > a, :scope > button")
            ?.setAttribute("aria-expanded", "false");
        }
      });
    };

    items.forEach((item) => {
      const trigger = item.querySelector<HTMLElement>(":scope > a, :scope > button");
      const dropdown = item.querySelector<HTMLElement>(":scope > .nav-dropdown");
      if (!trigger || !dropdown) return;

      trigger.setAttribute("aria-haspopup", "true");
      trigger.setAttribute("aria-expanded", "false");

      const onTriggerClick = (event: Event) => {
        if (!media.matches) return;
        event.preventDefault();
        event.stopPropagation();

        const willOpen = !item.classList.contains("mobile-expanded");
        closeOtherGroups(item);
        item.classList.toggle("mobile-expanded", willOpen);
        trigger.setAttribute("aria-expanded", String(willOpen));
      };

      const onDropdownClick = () => {
        if (!media.matches) return;
        item.classList.remove("mobile-expanded");
        trigger.setAttribute("aria-expanded", "false");
      };

      trigger.addEventListener("click", onTriggerClick);
      dropdown.addEventListener("click", onDropdownClick);
      cleanups.push(() => {
        trigger.removeEventListener("click", onTriggerClick);
        dropdown.removeEventListener("click", onDropdownClick);
      });
    });

    const onDocumentPointerDown = (event: PointerEvent) => {
      if (!media.matches || !nav.classList.contains("open")) return;
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (navWrap?.contains(target)) return;
      closeMobileMenu();
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      closeMobileMenu();
    };

    const resetGroups = () => {
      if (media.matches) {
        optimizeMobileImages();
        return;
      }
      collapseGroups();
    };

    document.addEventListener("pointerdown", onDocumentPointerDown, true);
    document.addEventListener("keydown", onEscape);
    media.addEventListener("change", resetGroups);

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      document.removeEventListener("pointerdown", onDocumentPointerDown, true);
      document.removeEventListener("keydown", onEscape);
      media.removeEventListener("change", resetGroups);
    };
  }, []);

  return null;
}
