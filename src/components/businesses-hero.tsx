"use client";

import { useEffect, useRef } from "react";

import "./businesses-hero.css";

type Site = { slug: string; name: string };

export function BusinessesHero({
  title,
  sites,
}: {
  title: { solid: string; point: string };
  sites: Site[];
}) {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const overlay = useRef<HTMLCanvasElement>(null);
  const ghost = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = root.current;
    const mainCanvas = canvas.current;
    const overlayCanvas = overlay.current;
    const text = ghost.current;
    if (!element || !mainCanvas || !overlayCanvas || !text) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let loading = false;
    let failed = false;
    let disposed = false;
    let generation = 0;
    let renderer: import("./businesses-hero-renderer").BusinessesHeroRenderer | undefined;

    const toFallback = () => {
      element.classList.remove("is-rendering");
      element.dataset.rendererState = "fallback";
      element.removeAttribute("data-point-count");
      element.dataset.heroState = "words";
      element.removeAttribute("data-highlighted-business");
    };

    const start = async () => {
      if (disposed || !visible || loading || failed || renderer) return;
      loading = true;
      const currentGeneration = generation;
      element.dataset.rendererState = "loading";
      try {
        const { mountBusinessesHero, WebGLUnavailableError } = await import("./businesses-hero-renderer");
        if (disposed || !visible || currentGeneration !== generation) return;
        const instance = await mountBusinessesHero(
          mainCanvas,
          overlayCanvas,
          text,
          element,
          sites,
          (state, slug) => {
            element.dataset.heroState = state;
            if (slug) element.dataset.highlightedBusiness = slug;
            else element.removeAttribute("data-highlighted-business");
          },
          motion.matches,
        );
        if (disposed || !visible || currentGeneration !== generation) {
          instance.dispose();
          return;
        }
        renderer = instance;
        element.dataset.pointCount = String(instance.pointCount);
        element.classList.add("is-rendering");
        renderer.resume();
        element.dataset.rendererState = "ready";
      } catch (error) {
        if (!(error instanceof Error && error.name === "WebGLUnavailableError")) console.error("Businesses hero renderer failed", error);
        if (!disposed && currentGeneration === generation) {
          failed = true;
          toFallback();
        }
      } finally {
        loading = false;
        if (!disposed && visible && currentGeneration !== generation) void start();
      }
    };

    const observer = "IntersectionObserver" in window
      ? new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          if (visible) {
            failed = false;
            if (renderer) {
              renderer.resume();
              element.dataset.rendererState = "ready";
            } else void start();
          } else {
            generation++;
            renderer?.pause();
            if (renderer) element.dataset.rendererState = "paused";
          }
        }, { threshold: 0.05 })
      : undefined;
    observer?.observe(element);
    if (!observer) {
      visible = true;
      void start();
    }

    const onMotionChange = () => {
      renderer?.setReducedMotion(motion.matches);
      if (!renderer && visible) {
        generation++;
        failed = false;
        void start();
      }
    };
    const onContextLost = () => {
      renderer?.dispose();
      renderer = undefined;
      failed = true;
      toFallback();
    };
    motion.addEventListener("change", onMotionChange);
    mainCanvas.addEventListener("webglcontextlost", onContextLost);

    return () => {
      disposed = true;
      generation++;
      observer?.disconnect();
      motion.removeEventListener("change", onMotionChange);
      mainCanvas.removeEventListener("webglcontextlost", onContextLost);
      renderer?.dispose();
    };
  }, [sites]);

  return (
    <section
      aria-labelledby="businesses-hero-title"
      className="businessesHero"
      data-hero-state="words"
      data-renderer-state="fallback"
      ref={root}
    >
      <canvas aria-hidden="true" className="businessesHeroCanvas" ref={canvas} />
      <canvas aria-hidden="true" className="businessesHeroOverlay" ref={overlay} />
      <div className="businessesHeroTitle">
        <h1 className="disp" id="businesses-hero-title">
          <span className="routeHeroLine routeHeroLine--solid">{title.solid}</span><br />
          <span className="dots businessesHeroGhost routeHeroLine--point" ref={ghost}>{title.point}</span>
        </h1>
      </div>
    </section>
  );
}
