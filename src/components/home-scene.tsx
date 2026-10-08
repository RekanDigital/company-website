"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { homeSceneCopy } from "@/content/home";
import { pageHeroes } from "@/content/pages";
import { localizeHref, type Locale } from "@/content/site";
import { ButtonLink, PointType } from "./ui";
import "./home-scene.css";

const ORDER = [2, 0, 1, 3, 4, 5, 6];
const ROUTE_NAMES = [
  "GENERAL TRADING & SUPPLY CHAIN",
  "TECHNOLOGY & DIGITALIZATION",
  "DATA & BUSINESS INTELLIGENCE",
  "FISHERIES, SEAWEED & BLUE ECONOMY",
  "HEALTH & BIOSCIENCE",
  "AGRICULTURE & GREEN ECONOMY",
  "FOOD & BEVERAGE",
];

type HomeLoadingInstance = {
  setProgress: (progress: number) => void;
  finish: (onDone?: () => void) => void;
  destroy: () => void;
};

type HomeLoadingOptions = {
  root: HTMLElement;
  canvas: HTMLCanvasElement;
  square: HTMLElement;
  logo: HTMLImageElement;
};

type HomeSceneRoot = HTMLElement & { __homeLoading?: HomeLoadingInstance };
type HomeLoadingWindow = Window & { createHomeLoading?: (options: HomeLoadingOptions) => HomeLoadingInstance };

export function HomeScene({ locale }: { locale: Locale }) {
  const rootRef = useRef<HTMLElement>(null);
  const copy = homeSceneCopy[locale];
  const hero = pageHeroes["/"][locale];

  useEffect(() => {
    const root = rootRef.current;
    const sequence = root?.querySelector<HTMLElement>("[data-home-flight-sequence]");
    const stage = root?.querySelector<HTMLElement>("[data-home-flight-stage]");
    const canvas = root?.querySelector<HTMLCanvasElement>("[data-home-flight-canvas]");
    const loadingCanvas = root?.querySelector<HTMLCanvasElement>("[data-home-loading-canvas]");
    const loadingSquare = root?.querySelector<HTMLElement>("[data-home-loading-square]");
    const loadingLogo = root?.querySelector<HTMLImageElement>("[data-home-loading-logo]");
    const worldBg = root?.querySelector<HTMLElement>("[data-home-flight-background]");
    const frame = root?.querySelector<HTMLElement>("[data-home-flight-frame]");
    const logo = root?.querySelector<HTMLImageElement>("[data-home-flight-logo]");
    const heroBack = root?.querySelector<HTMLElement>("[data-home-flight-hero-back]");
    const heroButton = root?.querySelector<HTMLElement>("[data-home-flight-hero-button]");
    const target = root?.querySelector<HTMLElement>("[data-home-flight-target]");
    const header = document.querySelector<HTMLElement>(".site-header--home");
    const brandLogo = header?.querySelector<HTMLImageElement>(".site-brand img");
    const headerTextNodes = [...(header?.querySelectorAll<HTMLElement>(
      ".site-brand span, .site-header__link, .site-menu-button__label, .site-menu-mark",
    ) ?? [])];
    const contrastTextNodes = [...headerTextNodes, ...(heroButton ? [heroButton] : [])];
    const chapters = [...(root?.querySelectorAll<HTMLElement>("[data-home-flight-chapter]") ?? [])];
    if (!root || !sequence || !stage || !canvas || !worldBg || !frame || !logo) return;

    const sceneRoot = root as HomeSceneRoot;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) {
      sceneRoot.__homeLoading?.destroy();
      delete sceneRoot.__homeLoading;
      root.dataset.homeLoadingState = "done";
      root.dataset.homeFlightMode = "static";
      sequence.style.height = "auto";
      return;
    }

    let loading = sceneRoot.__homeLoading ?? null;
    const loadingFactory = (window as HomeLoadingWindow).createHomeLoading;
    if (!loading && loadingFactory && loadingCanvas && loadingSquare && loadingLogo?.complete && loadingLogo.naturalWidth) {
      try {
        loading = loadingFactory({ root, canvas: loadingCanvas, square: loadingSquare, logo: loadingLogo });
        sceneRoot.__homeLoading = loading;
      } catch {
        root.dataset.homeLoadingState = "done";
      }
    }

    const webglContext = canvas.getContext("webgl2", { alpha: true, antialias: false, powerPreference: "high-performance" });
    if (!webglContext) {
      const restoreStatic = () => {
        root.dataset.homeLoadingState = "done";
        root.dataset.homeFlightMode = "static";
        sequence.style.height = "auto";
        chapters.forEach((chapter) => { chapter.inert = false; });
        if (heroButton) heroButton.inert = false;
        delete sceneRoot.__homeLoading;
        loading = null;
      };
      if (loading) loading.finish(restoreStatic);
      else restoreStatic();
      return () => {
        loading?.destroy();
        delete sceneRoot.__homeLoading;
      };
    }

    let disposed = false;
    let frameId = 0;
    let worker: Worker | null = null;
    let observer: IntersectionObserver | null = null;
    let renderer: import("three").WebGLRenderer | null = null;
    let world: ReturnType<typeof import("./home-scene-world.js").default> | null = null;
    let THREE: typeof import("three") | null = null;
    let pointData: HomeScenePointData | null = null;
    let pointDataReceivedAt = 0;
    let sceneReady = false;
    let flightStarted = false;
    let fallbackStarted = false;
    let visible = false;
    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;
    let P = 0;
    let Ps = 0;
    let W = 1;
    let H = 1;
    let portrait = false;
    let contrastTextPositions: { node: HTMLElement; x: number; y: number }[] = [];
    let start = performance.now();
    let handoffAt = 0;
    const squareGeometry = () => ({
      cx: portrait ? W * 0.5 : W * 0.68,
      cy: portrait ? H * 0.64 : H * 0.63,
      side: portrait ? Math.min(W * 0.56, H * 0.34) : Math.min(H * 0.4, W * 0.3),
    });
    const lowMemory = Math.min(window.innerWidth, window.innerHeight) < 700 ||
      ("deviceMemory" in navigator && Number((navigator as Navigator & { deviceMemory?: number }).deviceMemory) <= 4);
    const options = {
      spacing: lowMemory ? 3.4 : 2.4,
      objStep: lowMemory ? 1.25 : 1,
      pointSize: lowMemory ? 200 : 170,
      pixelRatio: Math.min(window.devicePixelRatio || 1, lowMemory ? 1.5 : 2),
      alwaysDark: true,
      order: ORDER,
    };

    const fallback = () => {
      if (disposed || fallbackStarted) return;
      fallbackStarted = true;
      root.dataset.homeFlightMode = "static";
      root.dataset.homeLoadingState = "done";
      delete root.dataset.homeFlightReady;
      delete header?.dataset.homeFlightHeader;
      delete header?.dataset.homeFlightHeaderHidden;
      contrastTextNodes.forEach((node) => { delete node.dataset.homeFlightDark; });
      if (brandLogo) brandLogo.style.opacity = "";
      chapters.forEach((chapter) => { chapter.inert = false; });
      if (heroButton) {
        heroButton.inert = false;
        heroButton.classList.remove("dk");
      }
      observer?.disconnect();
      if (frameId) cancelAnimationFrame(frameId);
      worker?.terminate();
      worker = null;
      loading?.destroy();
      loading = null;
      delete sceneRoot.__homeLoading;
      canvas.removeEventListener("webglcontextlost", onContextLost);
      root.removeEventListener("home-loading-ready", onLoaderReady);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      motion.removeEventListener("change", onMotionChange);
      if (world) {
        world.scene.traverse((object: import("three").Object3D) => {
          const resource = object as typeof object & { geometry?: { dispose: () => void }; material?: import("three").Material | import("three").Material[] };
          resource.geometry?.dispose();
          const materials: import("three").Material[] = Array.isArray(resource.material) ? resource.material : resource.material ? [resource.material] : [];
          materials.forEach((material) => material.dispose());
        });
        world = null;
      }
      renderer?.dispose();
      renderer?.forceContextLoss();
      renderer = null;
      sequence.style.height = "auto";
    };

    const clamp = (value: number) => Math.max(0, Math.min(1, value));
    const smooth = (a: number, b: number, value: number) => {
      const t = clamp((value - a) / (b - a));
      return t * t * (3 - 2 * t);
    };
    const ease = (value: number) => value < 0.5
      ? 4 * value * value * value
      : 1 - Math.pow(-2 * value + 2, 3) / 2;
    const coreP = (progress: number) => progress < 0.05
      ? 0.02 * (progress / 0.05)
      : progress < 0.965
        ? 0.02 + (progress - 0.05) / 0.915 * 0.965
        : 0.985 + (progress - 0.965) / 0.035 * 0.015;

    const updateScroll = () => {
      const total = sequence.offsetHeight - stage.offsetHeight;
      const rect = sequence.getBoundingClientRect();
      P = total > 0 ? clamp(-rect.top / total) : 0;
      if (header) header.dataset.homeFlightHeaderHidden = rect.bottom <= 0 ? "true" : "false";
      if (observer && visible && !document.hidden && !frameId) frameId = requestAnimationFrame(renderFrame);
    };

    const resize = () => {
      if (!renderer || !world) return;
      W = stage.clientWidth;
      H = stage.clientHeight;
      renderer.setSize(W, H, false);
      world.camera.aspect = W / H;
      portrait = W / H < 0.8 || W <= 900;
      world.camera.updateProjectionMatrix();
      const heroChapter = chapters[0];
      if (heroChapter && heroButton) {
        const belowHeadline = heroChapter.offsetTop + heroChapter.offsetHeight + 30;
        const { cy, side } = squareGeometry();
        const squareBottom = cy + side / 2;
        heroButton.style.top = `${portrait ? Math.max(belowHeadline, squareBottom + 24) : belowHeadline}px`;
      }
      contrastTextPositions = contrastTextNodes.map((node) => {
        const rect = node.getBoundingClientRect();
        return { node, x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      });
    };

    const renderFrame = (now: number) => {
      frameId = 0;
      if (disposed || !renderer || !world || !visible || document.hidden) return;
      const time = (now - start) / 1000;
      const handoff = handoffAt ? smooth(0, 0.6, (now - handoffAt) / 1000) : 0;
      Ps += (P - Ps) * 0.085;
      if (Math.abs(P - Ps) < 0.00005) Ps = P;
      pointerX += (targetX - pointerX) * 0.06;
      pointerY += (targetY - pointerY) * 0.06;

      const cp = coreP(Ps);
      const enter = ease(clamp(Ps / 0.05));
      const exit = ease(clamp((Ps - 0.965) / (1 - 0.965)));
      const { cx, cy, side } = squareGeometry();
      const cover = Math.max(cx, W - cx, cy, H - cy) + 2;
      const half = side / 2 + (cover - side / 2) * enter;
      let left = Math.max(0, cx - half);
      let top = Math.max(0, cy - half);
      let right = Math.min(W, cx + half);
      let bottom = Math.min(H, cy + half);
      const brandRect = brandLogo?.getBoundingClientRect();
      const exitX = brandRect?.left ?? 20;
      const exitY = brandRect?.top ?? 20;
      const exitW = brandRect?.width ?? 32;
      const exitH = brandRect?.height ?? 32;
      if (exit > 0) {
        left = exitX * exit;
        top = exitY * exit;
        right = W + (exitX + exitW - W) * exit;
        bottom = H + (exitY + exitH - H) * exit;
      }
      const clip = `inset(${top.toFixed(1)}px ${(W - right).toFixed(1)}px ${(H - bottom).toFixed(1)}px ${left.toFixed(1)}px)`;
      canvas.style.clipPath = clip;
      worldBg.style.clipPath = clip;
      frame.style.transform = `translate3d(${left.toFixed(1)}px,${top.toFixed(1)}px,0)`;
      frame.style.width = `${(right - left).toFixed(1)}px`;
      frame.style.height = `${(bottom - top).toFixed(1)}px`;
      worldBg.style.opacity = String(handoff);
      canvas.style.opacity = String(handoff);
      frame.style.opacity = exit > 0 ? String(smooth(0.05, 0.3, exit)) : String(handoff * (1 - smooth(0.6, 1, enter)));
      const fade = Math.max(handoff, smooth(0.0005, 0.012, Ps));
      logo.style.transform = `translate3d(${left.toFixed(1)}px,${top.toFixed(1)}px,0)`;
      logo.style.width = `${(right - left).toFixed(1)}px`;
      logo.style.height = `${(bottom - top).toFixed(1)}px`;
      logo.style.opacity = exit > 0 ? String(smooth(0.86, 1, exit)) : String(1 - fade);
      if (brandLogo) {
        brandLogo.style.opacity = Ps > 0.05 && exit < 1
          ? String(exit > 0 ? 1 - smooth(0, 0.12, exit) : 1)
          : "1";
      }
      const inside = enter >= 0.999;
      contrastTextPositions.forEach(({ node, x, y }) => {
        const dark = x >= left && x <= right && y >= top && y <= bottom;
        if (node.dataset.homeFlightDark !== String(dark)) node.dataset.homeFlightDark = String(dark);
      });
      const result = world.update(cp, time, pointerX, pointerY, portrait, W, H, {
        x: cx - W / 2,
        y: cy - H / 2,
        k: 1 - enter,
      });
      renderer.render(world.scene, world.camera);
      const heroOpacity = result.chap === 0 ? result.o : 0;
      if (heroBack) {
        heroBack.style.opacity = inside ? String(heroOpacity) : "0";
        heroBack.style.visibility = inside && heroOpacity > 0.001 ? "visible" : "hidden";
      }

      chapters.forEach((chapter, index) => {
        const activeOpacity = index === result.chap ? result.o * (exit > 0 ? 1 - smooth(0, 0.2, exit) : 1) : 0;
        const opacity = index === 0 && inside ? 0 : activeOpacity;
        chapter.style.opacity = String(opacity);
        chapter.style.visibility = opacity <= 0.001 ? "hidden" : "visible";
        chapter.style.transform = `translate3d(0,${((1 - opacity) * 18).toFixed(1)}px,0)`;
        chapter.inert = opacity <= 0.001;
      });
      if (heroButton) {
        const buttonOpacity = result.chap === 0 ? result.o * (exit > 0 ? 1 - smooth(0, 0.2, exit) : 1) : 0;
        heroButton.style.opacity = String(buttonOpacity);
        heroButton.style.visibility = buttonOpacity <= 0.001 ? "hidden" : "visible";
        const buttonY = (1 - buttonOpacity) * 18;
        heroButton.style.transform = `translate3d(0,${buttonY.toFixed(1)}px,0)`;
        heroButton.inert = buttonOpacity <= 0.001;
      }
      if (target) {
        const label = result.site >= 0 ? `${String(result.site + 1).padStart(3, "0")}  ${ROUTE_NAMES[result.site]}` : "";
        target.textContent = label;
        target.style.opacity = label && result.label.front && exit <= 0 ? String(result.o) : "0";
        target.style.transform = `translate3d(${(result.label.x * W).toFixed(1)}px,${(result.label.y * H - 20).toFixed(1)}px,0)`;
      }
      root.dataset.homeFlightFrame = String(Math.round(Ps * 100));
      if (visible && !document.hidden) frameId = requestAnimationFrame(renderFrame);
    };

    const onPointer = (event: PointerEvent) => {
      targetX = (event.clientX / window.innerWidth) * 2 - 1;
      targetY = (event.clientY / window.innerHeight) * 2 - 1;
    };
    const onVisibility = () => {
      if (!document.hidden && visible && renderer && world && !frameId) frameId = requestAnimationFrame(renderFrame);
    };
    const onContextLost = (event: Event) => {
      event.preventDefault();
      fallback();
    };
    const onMotionChange = (event: MediaQueryListEvent) => {
      if (event.matches) fallback();
    };
    const onResize = () => {
      resize();
      updateScroll();
    };

    const enterFlight = () => {
      if (!sceneReady || disposed || fallbackStarted || flightStarted || !renderer || !world) return;
      flightStarted = true;
      handoffAt = performance.now();
      worldBg.style.opacity = "0";
      canvas.style.opacity = "0";
      frame.style.opacity = "0";
      logo.style.opacity = "1";
      root.dataset.homeFlightMode = "flight";
      if (header) header.dataset.homeFlightHeader = "true";
      resize();
      root.dataset.homeFlightReady = "true";
      updateScroll();
      Ps = P;
      if (visible && !document.hidden) frameId = requestAnimationFrame(renderFrame);
    };
    const onLoaderReady = () => enterFlight();

    // Reserve the locked scroll track immediately; worker readiness never changes its height.
    root.dataset.homeFlightMode = "loading";
    if (!loading) root.dataset.homeLoadingState = "done";
    if (header) header.dataset.homeFlightHeader = "true";
    sequence.style.height = "2000svh";
    canvas.addEventListener("webglcontextlost", onContextLost);
    root.addEventListener("home-loading-ready", onLoaderReady);
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    motion.addEventListener("change", onMotionChange);
    observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !document.hidden && renderer && world && !frameId) frameId = requestAnimationFrame(renderFrame);
    });
    observer.observe(stage);
    updateScroll();

    loading?.setProgress(0.08);

    const startFlight = async () => {
      try {
        worker = new Worker(new URL("./home-scene.worker.js", import.meta.url), { type: "module" });
        worker.onmessage = ({ data }: MessageEvent<WorkerResult>) => {
          if (data.error) {
            fallback();
            return;
          }
          if (typeof data.progress === "number") {
            loading?.setProgress(data.progress);
            return;
          }
          if (!data.pointData) {
            fallback();
            return;
          }
          pointData = data.pointData;
          loading?.setProgress(0.9);
          pointDataReceivedAt = performance.now();
          root.dataset.homePointCount = String(pointData.count);
          root.dataset.homePointSource = "worker";
          root.dataset.homeWorkerMs = String(data.durationMs);
          void initialize();
        };
        worker.onerror = fallback;
        worker.postMessage({ ...options, progressPointEstimate: lowMemory ? 376_041 : 672_052 });
        await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
        if (disposed || motion.matches) return;
        const three = await import("three");
        THREE = three;
        if (pointData) await initialize();
      } catch {
        fallback();
      }
    };

    const initialize = async () => {
      if (disposed || !pointData || !THREE) return;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, context: webglContext, alpha: true, antialias: false, powerPreference: "high-performance" });
        renderer.setPixelRatio(options.pixelRatio);
        renderer.setClearColor(0x000000, 0);
        const { default: makeWorld } = await import("./home-scene-world.js");
        if (disposed || root.dataset.homeFlightMode === "static") {
          renderer.dispose();
          renderer.forceContextLoss();
          renderer = null;
          return;
        }
        world = makeWorld(THREE, { ...options, pointData });
        await document.fonts?.ready;
        if (disposed) return;
        start = performance.now();
        root.dataset.homeMainInitMs = String(performance.now() - pointDataReceivedAt);
        sceneReady = true;
        loading?.setProgress(0.96);
        if (loading) {
          loading.finish(() => {
            loading = null;
            delete sceneRoot.__homeLoading;
          });
        } else {
          root.dataset.homeLoadingState = "done";
          enterFlight();
        }
        pointData = null;
      } catch {
        fallback();
      }
    };

    const terminateOnUnmount = () => {
      disposed = true;
      observer?.disconnect();
      if (frameId) cancelAnimationFrame(frameId);
      worker?.terminate();
      loading?.destroy();
      loading = null;
      delete sceneRoot.__homeLoading;
      canvas.removeEventListener("webglcontextlost", onContextLost);
      root.removeEventListener("home-loading-ready", onLoaderReady);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      motion.removeEventListener("change", onMotionChange);
      delete header?.dataset.homeFlightHeader;
      delete header?.dataset.homeFlightHeaderHidden;
      contrastTextNodes.forEach((node) => { delete node.dataset.homeFlightDark; });
      if (brandLogo) brandLogo.style.opacity = "";
      if (world) {
        world.scene.traverse((object: import("three").Object3D) => {
          const resource = object as typeof object & { geometry?: { dispose: () => void }; material?: import("three").Material | import("three").Material[] };
          resource.geometry?.dispose();
          const materials: import("three").Material[] = Array.isArray(resource.material) ? resource.material : resource.material ? [resource.material] : [];
          materials.forEach((material) => material.dispose());
        });
      }
      renderer?.dispose();
      renderer?.forceContextLoss();
    };

    void startFlight();
    return terminateOnUnmount;
  }, []);

  return (
    <section ref={rootRef} aria-label={copy.sceneLabel} className="homeScene" data-home-scene data-home-flight-mode="loading" data-home-loading-state="loading">
      <div aria-hidden="true" className="homeScene__loading" data-home-loading>
        <canvas data-home-loading-canvas suppressHydrationWarning />
        <div className="homeScene__loadingSquare" data-home-loading-square>
          <img alt="" data-home-loading-logo decoding="async" src="/assets/logo/logo-rekanmu.png" />
        </div>
      </div>
      <div className="homeScene__sequence" data-home-flight-sequence>
        <div className="homeScene__stage" data-home-flight-stage>
          <div className="homeScene__background" data-home-flight-background aria-hidden="true" />
          <div aria-hidden="true" className="homeScene__back" data-home-flight-hero-back>
            <h1 className="disp">{hero.title.solid}<br /><PointType>{hero.title.point}</PointType></h1>
          </div>
          <canvas aria-hidden="true" data-home-flight-canvas />
          <img alt="" aria-hidden="true" className="homeScene__windowLogo" data-home-flight-logo src="/assets/logo/logo-rekanmu.png" />
          <div aria-hidden="true" className="homeScene__windowFrame" data-home-flight-frame />
          <div aria-hidden="true" className="homeScene__target" data-home-flight-target />
          <div className="homeScene__chapters">
            <section className="homeScene__chapter homeScene__hero foundationHero homeHero" data-home-flight-chapter>
              <h1 className="disp">
                {hero.title.solid}
                <br />
                <PointType>{hero.title.point}</PointType>
              </h1>
            </section>
          </div>
          {hero.cta ? <ButtonLink className="homeScene__heroButton" data-home-flight-hero-button href={localizeHref(hero.cta.href, locale)}>{hero.cta.label}</ButtonLink> : null}
          <div className="homeScene__chapters">
            <section className="homeScene__chapter homeScene__positioning" data-home-flight-chapter>
              <p className="lead">{copy.positioning}</p>
            </section>
            {copy.stops.map((stop) => (
              <section className="homeScene__chapter homeScene__stop" data-home-flight-chapter key={stop.href}>
                <h2><Link href={localizeHref(stop.href, locale)}>{stop.name}</Link></h2>
                <p>{stop.summary}</p>
              </section>
            ))}
            <section className="homeScene__chapter homeScene__story" data-home-flight-chapter>
              <h2>{copy.intelligence.heading}</h2>
              <p>{copy.intelligence.paragraph}</p>
            </section>
            <section className="homeScene__chapter homeScene__story" data-home-flight-chapter>
              <h2>{copy.source.heading}</h2>
              <p>{copy.source.paragraph}</p>
              <ButtonLink href={localizeHref(copy.source.cta.href, locale)}>{copy.source.cta.label}</ButtonLink>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}

type HomeScenePointData = {
  position: Float32Array;
  aRand: Float32Array;
  aMeta: Float32Array;
  aScan: Float32Array;
  aScanW: Float32Array;
  cityEnd: number;
  count: number;
};
type WorkerResult = { pointData?: HomeScenePointData; durationMs?: number; error?: string; progress?: number };
