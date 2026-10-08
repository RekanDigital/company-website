"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";

import specimens from "@/assets/specimens.jpg";
import type { Locale } from "@/content/site";
import type { BusinessPointSlug } from "@/content/businesses-point-data";
import type { BusinessesCardViewerRenderer } from "./businesses-card-viewer-renderer";

type SpecimenStyle = CSSProperties & { "--specimen-index": number };

export function BusinessesCardViewer({
  locale,
  name,
  slug,
  specimenIndex,
  rotating = false,
  hero = false,
}: {
  locale: Locale;
  name: string;
  slug: BusinessPointSlug;
  specimenIndex: number;
  rotating?: boolean;
  hero?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const renderer = useRef<BusinessesCardViewerRenderer | undefined>(undefined);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const [interactionPaused, setInteractionPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const imageStyle: SpecimenStyle = { "--specimen-index": specimenIndex };
  const viewLabel = locale === "id" ? `Tampilan 3D ${name}.` : `${name} 3D view.`;
  const isPlaying = rotating && visible && !paused && !interactionPaused && !reducedMotion;

  useEffect(() => {
    const element = root.current;
    const target = canvas.current;
    if (!element || !target) return;

    let inView = false;
    let loading = false;
    let failed = false;
    let disposed = false;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motion.matches);

    const start = async () => {
      if (disposed || !inView || loading || failed || renderer.current) return;
      loading = true;
      element.dataset.rendererState = "loading";
      try {
        const { mountBusinessesCardViewer, ViewerWebGLUnavailableError } = await import("./businesses-card-viewer-renderer");
        if (disposed) return;
        const instance = await mountBusinessesCardViewer(target, slug, { rotating });
        if (disposed) {
          instance.dispose();
          return;
        }
        renderer.current = instance;
        setReady(true);
        element.dataset.rendererState = "ready";
      } catch (error) {
        if (!(error instanceof Error && error.name === "ViewerWebGLUnavailableError")) {
          console.error("Business card viewer failed", error);
        }
        failed = true;
        element.dataset.rendererState = "fallback";
      } finally {
        loading = false;
      }
    };

    const observer = "IntersectionObserver" in window
      ? new IntersectionObserver(([entry]) => {
          inView = entry.isIntersecting;
          setVisible(inView);
          if (inView && !renderer.current) void start();
        }, { threshold: 0.05 })
      : undefined;
    observer?.observe(element);
    if (!observer) {
      inView = true;
      setVisible(true);
      void start();
    }

    const onMotionChange = () => setReducedMotion(motion.matches);
    const onContextLost = (event: Event) => {
      event.preventDefault();
      renderer.current?.dispose();
      renderer.current = undefined;
      failed = true;
      setReady(false);
      element.dataset.rendererState = "fallback";
    };
    motion.addEventListener("change", onMotionChange);
    target.addEventListener("webglcontextlost", onContextLost);

    return () => {
      disposed = true;
      observer?.disconnect();
      motion.removeEventListener("change", onMotionChange);
      target.removeEventListener("webglcontextlost", onContextLost);
      renderer.current?.dispose();
      renderer.current = undefined;
    };
  }, [slug, rotating]);

  useEffect(() => {
    renderer.current?.setPlaying(isPlaying);
  }, [isPlaying, ready]);

  const toggleRotation = () => {
    setPaused(!paused);
    setInteractionPaused(false);
  };

  return (
    <div
      aria-label={viewLabel}
      className={`businessCardViewer${hero ? " businessDetailHeroViewer" : ""}`}
      data-ready={ready}
      data-business-slug={slug}
      data-rotating={rotating}
      data-renderer-state="idle"
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setInteractionPaused(false);
      }}
      onFocusCapture={() => setInteractionPaused(true)}
      onPointerEnter={() => rotating && setInteractionPaused(true)}
      onPointerLeave={() => rotating && setInteractionPaused(false)}
      ref={root}
      role={rotating ? "group" : "img"}
    >
      <div aria-hidden="true" className={`businessCardViewerVisual${hero ? " businessDetailHeroVisual" : ""}`}>
        <Image alt="" className="businessCardViewerFallback" src={specimens} style={imageStyle} unoptimized />
        <canvas className="businessCardViewerCanvas" ref={canvas} />
      </div>
      {rotating && ready && !reducedMotion ? (
        <button
          aria-label={paused ? (locale === "id" ? "Lanjutkan rotasi" : "Resume rotation") : (locale === "id" ? "Jeda rotasi" : "Pause rotation")}
          className="businessViewerMotionControl"
          onClick={toggleRotation}
          type="button"
        >
          {paused ? (locale === "id" ? "Putar" : "Resume") : (locale === "id" ? "Jeda" : "Pause")}
        </button>
      ) : null}
    </div>
  );
}
