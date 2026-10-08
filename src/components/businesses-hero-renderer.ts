import { businessPointCount, businessPointSlices } from "@/content/businesses-point-data";

type Site = { slug: string; name: string };
type HeroState = "words" | "world" | "focus";
type StateChange = (state: HeroState, slug: string | null) => void;

type SitePoint = (typeof businessPointSlices)[number] & {
  name: string;
  centerX: number;
  centerZ: number;
  height: number;
  extent: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
};

export type BusinessesHeroRenderer = {
  pointCount: number;
  pause: () => void;
  resume: () => void;
  setReducedMotion: (reduced: boolean) => void;
  dispose: () => void;
};

export class WebGLUnavailableError extends Error {
  constructor() {
    super("WebGL is unavailable");
    this.name = "WebGLUnavailableError";
  }
}

const POINT_BYTES = 8;
const GROUND = { minX: -760, maxX: 640, minZ: -330, maxZ: 500, step: 26 };
const VERTEX_SHADER = `
attribute vec3 aPos;
attribute vec4 aMeta;
attribute vec3 aTxt;
uniform vec2 uRes;
uniform vec2 uCam;
uniform vec4 uRot;
uniform float uSc;
uniform vec2 uOrg;
uniform float uMix;
uniform vec2 uMouse;
uniform float uHot;
uniform float uFoc;
uniform float uFz;
uniform float uDpr;
varying float vA;
varying float vB;
void main() {
  float X = aPos.x - uCam.x;
  float Z = aPos.z - uCam.y;
  float xr = X * uRot.x - Z * uRot.y;
  float zr = X * uRot.y + Z * uRot.x;
  vec2 w = vec2(uOrg.x + xr * uSc, uOrg.y - (aPos.y * uRot.z - zr * uRot.w) * uSc);
  float t = clamp(uMix * 1.55 - aMeta.z * 0.55, 0.0, 1.0);
  float e = t * t * (3.0 - 2.0 * t);
  vec2 p = mix(aTxt.xy, w, e);
  vec2 dir = normalize(w - aTxt.xy + vec2(0.001));
  p += vec2(-dir.y, dir.x) * sin(e * 3.14159) * (aMeta.w - 0.5) * 150.0;
  vec2 d = p - uMouse;
  float L = length(d);
  float k = (1.0 - e) * smoothstep(120.0, 0.0, L);
  p += normalize(d + vec2(0.001)) * k * 46.0;
  float site = aMeta.y;
  float isG = step(6.5, site);
  float sel = uFoc > -0.5 ? uFoc : uHot;
  float mine = 1.0 - step(0.5, abs(site - sel));
  float any = step(-0.5, sel);
  float aw = mix(mix(0.86, 1.0, aMeta.x), mix(mix(0.30, 0.16, uFz), 1.0, mine), any);
  aw = mix(aw, mix(0.30, 0.14, uFz), isG);
  vA = mix(aTxt.z, aw, e);
  float blue = mix(aMeta.x, mine * mix(1.0, aMeta.x, step(-0.5, uFoc)), any) * (1.0 - isG);
  vB = blue * e;
  float sz = mix(2.5, mix(mix(mix(1.25, 1.6, aMeta.x), mix(1.9, 2.4, aMeta.x), uFz), 1.5, isG), e);
  gl_PointSize = sz * uDpr;
  gl_Position = vec4(p.x / uRes.x * 2.0 - 1.0, 1.0 - p.y / uRes.y * 2.0, 0.0, 1.0);
}`;

const FRAGMENT_SHADER = `
precision mediump float;
varying float vA;
varying float vB;
void main() {
  if (vA < 0.02) discard;
  vec3 c = mix(vec3(0.055, 0.067, 0.086), vec3(0.192, 0.475, 0.796), vB);
  gl_FragColor = vec4(c, vA);
}`;

export async function mountBusinessesHero(
  canvas: HTMLCanvasElement,
  overlay: HTMLCanvasElement,
  ghost: HTMLElement,
  root: HTMLElement,
  sites: Site[],
  onStateChange: StateChange,
  reducedMotion: boolean,
): Promise<BusinessesHeroRenderer> {
  const context = (canvas.getContext("webgl", { antialias: false, alpha: false, premultipliedAlpha: false })
    ?? canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
  if (!context) throw new WebGLUnavailableError();
  const gl: WebGLRenderingContext = context;

  const response = await fetch("/assets/point-data/businesses.bin");
  if (!response.ok) throw new Error(`Point data request failed: ${response.status}`);
  const buffer = await response.arrayBuffer();
  const byteLength = Math.max(...businessPointSlices.map(({ byteOffset, pointCount }) => byteOffset + pointCount * POINT_BYTES));
  if (buffer.byteLength !== byteLength || businessPointCount !== 108040) {
    throw new Error(`Unexpected Businesses point data length: ${buffer.byteLength}`);
  }

  const dataView = new DataView(buffer);
  const counts = sites.reduce((map, site) => map.set(site.slug, site.name), new Map<string, string>());
  const pointTotal = businessPointCount;
  const ground: number[] = [];
  for (let x = GROUND.minX; x <= GROUND.maxX; x += GROUND.step) {
    for (let z = GROUND.minZ; z <= GROUND.maxZ; z += GROUND.step) ground.push(x, z);
  }

  const total = pointTotal + ground.length / 2;
  const positions = new Float32Array(total * 3);
  const meta = new Float32Array(total * 4);
  const sitePoints: SitePoint[] = [];
  let out = 0;
  for (let siteIndex = 0; siteIndex < businessPointSlices.length; siteIndex++) {
    const slice = businessPointSlices[siteIndex];
    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];
    for (let edge = 0; edge <= 1; edge++) {
      for (let point = 0; point < slice.pointCount; point++) {
        const record = slice.byteOffset + point * POINT_BYTES;
        const flag = dataView.getInt16(record + 6, true) === 1 ? 1 : 0;
        if (flag !== edge) continue;
        const x = dataView.getInt16(record, true) / 10;
        const y = dataView.getInt16(record + 2, true) / 10;
        const z = dataView.getInt16(record + 4, true) / 10;
        positions[out * 3] = x + slice.x;
        positions[out * 3 + 1] = y;
        positions[out * 3 + 2] = z + slice.z;
        meta[out * 4] = flag;
        meta[out * 4 + 1] = siteIndex;
        meta[out * 4 + 2] = Math.random();
        meta[out * 4 + 3] = Math.random();
        out++;
        min[0] = Math.min(min[0], x); max[0] = Math.max(max[0], x);
        min[1] = Math.min(min[1], y); max[1] = Math.max(max[1], y);
        min[2] = Math.min(min[2], z); max[2] = Math.max(max[2], z);
      }
    }
    sitePoints.push({
      ...slice,
      name: counts.get(slice.slug) ?? slice.slug,
      centerX: slice.x + (min[0] + max[0]) / 2,
      centerZ: slice.z + (min[2] + max[2]) / 2,
      height: max[1],
      extent: Math.max(max[0] - min[0], max[2] - min[2], (max[1] - min[1]) * 1.25),
      minX: slice.x + min[0],
      maxX: slice.x + max[0],
      minY: min[1],
      maxY: max[1],
      minZ: slice.z + min[2],
      maxZ: slice.z + max[2],
    });
  }
  const maxSiteExtent = Math.max(...sitePoints.map(({ extent }) => extent));
  for (let index = 0; index < ground.length; index += 2, out++) {
    positions[out * 3] = ground[index];
    positions[out * 3 + 1] = 0;
    positions[out * 3 + 2] = ground[index + 1];
    meta[out * 4 + 1] = 7;
    meta[out * 4 + 2] = Math.random();
    meta[out * 4 + 3] = Math.random();
  }

  const target = new Float32Array(total * 3);
  const order = new Uint32Array(pointTotal);
  for (let index = 0; index < pointTotal; index++) order[index] = index;
  for (let index = pointTotal - 1; index > 0; index--) {
    const swap = Math.floor(Math.random() * (index + 1));
    [order[index], order[swap]] = [order[swap], order[index]];
  }

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) throw new Error("Could not create WebGL shader");
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) ?? "WebGL shader compilation failed");
    return shader;
  };
  const program = gl.createProgram();
  if (!program) throw new Error("Could not create WebGL program");
  const vertex = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) ?? "WebGL program linking failed");
  gl.useProgram(program);

  const buffers: WebGLBuffer[] = [];
  const attribute = (name: string, data: Float32Array, size: number, dynamic = false) => {
    const buffer = gl.createBuffer();
    if (!buffer) throw new Error("Could not create WebGL buffer");
    buffers.push(buffer);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW);
    const location = gl.getAttribLocation(program, name);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
    return buffer;
  };
  attribute("aPos", positions, 3);
  attribute("aMeta", meta, 4);
  const targetBuffer = attribute("aTxt", target, 3, true);
  const uniforms = Object.fromEntries(
    ["uRes", "uCam", "uRot", "uSc", "uOrg", "uMix", "uMouse", "uHot", "uFoc", "uFz", "uDpr"]
      .map((name) => [name, gl.getUniformLocation(program, name)]),
  );
  const uniform = (name: string) => uniforms[name] as WebGLUniformLocation | null;

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(246 / 255, 248 / 255, 250 / 255, 1);
  const links: [number, number][] = [];
  for (let engine = 0; engine < 2; engine++) for (let industry = 2; industry < 7; industry++) links.push([engine, industry]);
  const context2d = overlay.getContext("2d");
  if (!context2d) throw new Error("Could not create overlay canvas context");
  const overlayContext: CanvasRenderingContext2D = context2d;
  const labels = sitePoints.map((site) => {
    const label = document.createElement("p");
    label.className = "businessesHeroLabel";
    label.dataset.business = site.slug;
    label.setAttribute("aria-hidden", "true");
    label.textContent = site.name;
    root.append(label);
    return label;
  });
  let state: HeroState = "words";
  let focused = -1;
  let locked = false;
  let hot = -1;
  let yaw = 0.5;
  let pitch = 0.62;
  let velocityYaw = 0;
  let dragging = false;
  let moved = 0;
  let lastX = 0;
  let lastY = 0;
  let mouseX = -9999;
  let mouseY = -9999;
  let normX = 0.5;
  let normY = 0.5;
  let lastUser = -1e9;
  let ready = false;
  let running = false;
  let mix = 0;
  let last = 0;
  let mapTop = 0;
  let titleBottom = 0;
  let pointerType = "mouse";
  let tapHot = -1;
  let centers: [number, number][] = [];
  let textPointCount = 0;
  let frameId = 0;
  const hold = 8000;
  const camera = { x: -40, z: 95, scale: 0.5, originX: 0, originY: 0, focus: 0 };
  const view = { width: 0, height: 0, dpr: 1 };

  function updateState() {
    root.classList.toggle("world", state !== "words");
    root.classList.toggle("hot", state === "world" && hot >= 0 && !dragging);
    labels.forEach((label, index) => label.classList.toggle("is-visible", index === (state === "world" ? hot : state === "focus" ? focused : -1)));
    const selected = state === "focus" ? focused : state === "world" ? hot : -1;
    onStateChange(state, selected < 0 ? null : sitePoints[selected].slug);
  }

  function go(next: HeroState, index: number, user: boolean) {
    state = next;
    focused = next === "focus" ? index : -1;
    if (next !== "world") hot = -1;
    if (user) lastUser = performance.now();
    updateState();
  }

  function fit() {
    const rect = root.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    for (const element of [canvas, overlay]) {
      element.width = Math.round(rect.width * dpr);
      element.height = Math.round(rect.height * dpr);
    }
    overlayContext.setTransform(dpr, 0, 0, dpr, 0, 0);
    gl.viewport(0, 0, canvas.width, canvas.height);
    view.width = rect.width;
    view.height = rect.height;
    view.dpr = dpr;
  }

  function sampleText() {
    fit();
    const heroRect = root.getBoundingClientRect();
    titleBottom = ghost.getBoundingClientRect().top - heroRect.top;
    const style = getComputedStyle(ghost);
    const fontSize = parseFloat(style.fontSize);
    const range = document.createRange();
    range.selectNodeContents(ghost);
    const rects = range.getClientRects();
    if (!rects.length) return;
    const lines: DOMRect[] = [];
    for (const rect of rects) {
      if (rect.width < 2 || lines.some((line) => Math.abs(line.top - rect.top) < fontSize * 0.4)) continue;
      lines.push(rect);
    }
    const measure = document.createElement("canvas").getContext("2d");
    if (!measure) return;
    measure.font = `${style.fontWeight} ${fontSize}px ${style.fontFamily}`;
    try { measure.letterSpacing = style.letterSpacing; } catch { /* Unsupported Canvas 2D property. */ }
    const words = ghost.textContent?.split(" ") ?? [];
    let word = 0;
    const textLines: [DOMRect, string][] = [];
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const rect = lines[lineIndex];
      let line = "";
      while (word < words.length) {
        const next = line ? `${line} ${words[word]}` : words[word];
        if (line && lineIndex < lines.length - 1 && measure.measureText(next).width > rect.width + fontSize * 0.12) break;
        line = next;
        word++;
      }
      textLines.push([rect, line]);
    }
    const points: number[] = [];
    for (const [rect, line] of textLines) {
      const offscreen = document.createElement("canvas");
      const width = Math.ceil(rect.width) + 24;
      const height = Math.ceil(fontSize * 1.3);
      offscreen.width = width;
      offscreen.height = height;
      const context = offscreen.getContext("2d");
      if (!context) continue;
      context.font = `${style.fontWeight} ${fontSize}px ${style.fontFamily}`;
      try { context.letterSpacing = style.letterSpacing; } catch { /* Unsupported Canvas 2D property. */ }
      context.textBaseline = "alphabetic";
      context.fillStyle = "#000";
      context.fillText(line, 0, fontSize * 0.98);
      const pixels = context.getImageData(0, 0, width, height).data;
      for (let y = 1; y < height; y += 4) {
        for (let x = 1; x < width; x += 4) {
          if (pixels[(y * width + x) * 4 + 3] > 140) {
            points.push(rect.left - heroRect.left + x, rect.top - heroRect.top + (rect.height - fontSize * 1.3) / 2 + y - fontSize * 0.02);
          }
        }
      }
    }
    textPointCount = points.length / 2;
    if (!textPointCount) return;
    mapTop = lines.at(-1)!.bottom - heroRect.top + fontSize * 0.1;
    for (let index = 0; index < total; index++) {
      const source = index < pointTotal ? order[index] : index;
      const targetIndex = (index % textPointCount) * 2;
      target[source * 3] = points[targetIndex] + (index < textPointCount ? 0 : (Math.random() - 0.5) * 10);
      target[source * 3 + 1] = points[targetIndex + 1] + (index < textPointCount ? 0 : (Math.random() - 0.5) * 10);
      target[source * 3 + 2] = index < textPointCount ? 1 : 0;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, targetBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, target);
    ready = true;
  }

  function nearest() {
    let best = -1;
    let distance = Infinity;
    for (let index = 0; index < sitePoints.length; index++) {
      if (!centers[index]) return -1;
      const next = Math.hypot(centers[index][0] - mouseX, centers[index][1] - mouseY);
      if (next < distance) { distance = next; best = index; }
    }
    return best >= 0 && distance <= Math.max(64, sitePoints[best].extent * camera.scale * 0.55) ? best : -1;
  }

  let reduced = reducedMotion;
  const frame = (now: number) => {
    if (!running) return;
    frameId = requestAnimationFrame(frame);
    if (!ready) return;
    const { width, height, dpr } = view;
    const small = width < 760;
    const dt = Math.min(0.12, (now - last) / 1000 || 0.016);
    last = now;
    if (!reduced && !dragging && !locked && mouseX < -9000 && now - lastUser > hold) {
      const phase = Math.floor((now - lastUser - hold) / hold) % 2;
      const desired = phase === 0 ? "world" : "words";
      if (state !== desired) { state = desired; focused = -1; hot = -1; updateState(); }
    }
    const inWorld = state !== "words";
    const focusIndex = state === "focus" ? focused : -1;
    const worldYaw = yaw + (focusIndex >= 0 ? (normX - 0.5) * 0.5 : 0);
    const worldPitch = pitch + (focusIndex >= 0 ? (normY - 0.5) * 0.16 - 0.1 : 0);
    const cy = Math.cos(worldYaw), sy = Math.sin(worldYaw), cp = Math.cos(worldPitch), sp = Math.sin(worldPitch);
    const targetMix = inWorld ? 1 : 0;
    const mixStep = reduced ? 100 : dt / 1.15;
    mix = targetMix > mix ? Math.min(targetMix, mix + mixStep) : Math.max(targetMix, mix - mixStep);
    if (!dragging) {
      const frameScale = dt * 60;
      if (!reduced && inWorld && hot < 0) yaw += (focusIndex >= 0 ? 0.0026 : 0.0016) * frameScale;
      if (reduced) velocityYaw = 0;
      else {
        yaw += velocityYaw * frameScale;
        velocityYaw *= Math.pow(hot >= 0 ? 0.5 : 0.86, frameScale);
      }
    }

    let minWorldX = Infinity, maxWorldX = -Infinity, maxWorldY = -Infinity;
    for (const site of sitePoints) {
      for (let corner = 0; corner < 8; corner++) {
        const x = corner & 1 ? site.maxX : site.minX;
        const y = corner & 2 ? site.maxY : site.minY;
        const z = corner & 4 ? site.maxZ : site.minZ;
        const dx = x + 40, dz = z - 95;
        minWorldX = Math.min(minWorldX, dx * cy - dz * sy);
        maxWorldX = Math.max(maxWorldX, dx * cy - dz * sy);
        const projectedY = y * cp - (dx * sy + dz * cy) * sp;
        maxWorldY = Math.max(maxWorldY, projectedY);
      }
    }
    const baseWorldScale = Math.min(width / 1640, height / 1125);
    const worldScale = baseWorldScale * 2;
    const worldScaleGain = worldScale / baseWorldScale;
    let cameraX: number, cameraZ: number, scale: number, originX: number, originY: number;
    if (focusIndex >= 0) {
      const site = sitePoints[focusIndex];
      cameraX = site.centerX; cameraZ = site.centerZ;
      scale = (small ? Math.min(width * 0.8, height * 0.3) : Math.min(width * 0.44, height * 0.48)) * worldScaleGain / maxSiteExtent;
      originX = width * (small ? 0.5 : 0.56);
      originY = height * (small ? 0.56 : 0.7);
    } else {
      cameraX = -40; cameraZ = 95;
      scale = worldScale;
      originX = width * 0.5 - (minWorldX + maxWorldX) * 0.5 * scale;
      originY = titleBottom + 28 + maxWorldY * scale;
    }
    const ease = reduced ? 1 : 1 - Math.exp(-dt * 5.2);
    camera.x += (cameraX - camera.x) * ease;
    camera.z += (cameraZ - camera.z) * ease;
    camera.scale += (scale - camera.scale) * ease;
    camera.originX += (originX - camera.originX) * ease;
    camera.originY += (originY - camera.originY) * ease;
    camera.focus += ((focusIndex >= 0 ? 1 : 0) - camera.focus) * (reduced ? 1 : 1 - Math.exp(-dt * 4.6));
    const sc = camera.scale, ox = camera.originX, oy = camera.originY;
    const project = (x: number, y: number, z: number): [number, number] => {
      const dx = x - camera.x, dz = z - camera.z;
      const xr = dx * cy - dz * sy, zr = dx * sy + dz * cy;
      return [ox + xr * sc, oy - (y * cp - zr * sp) * sc];
    };
    centers = sitePoints.map((site) => project(site.centerX, 0, site.centerZ));
    if (state === "world" && !dragging && pointerType !== "touch") {
      const next = nearest();
      if (next !== hot) { hot = next; updateState(); }
    }
    if (inWorld) {
      for (let index = 0; index < sitePoints.length; index++) {
        if (focusIndex >= 0 && index !== focusIndex) continue;
        const site = sitePoints[index];
        const label = project(site.centerX, site.height + 12, site.centerZ);
        labels[index].style.left = `${label[0]}px`;
        labels[index].style.top = `${label[1] - 22}px`;
      }
    }
    gl.uniform2f(uniform("uRes"), width, height);
    gl.uniform2f(uniform("uCam"), camera.x, camera.z);
    gl.uniform4f(uniform("uRot"), cy, sy, cp, sp);
    gl.uniform1f(uniform("uSc"), sc);
    gl.uniform2f(uniform("uOrg"), ox, oy);
    gl.uniform1f(uniform("uMix"), mix);
    gl.uniform2f(uniform("uMouse"), mouseX, mouseY);
    gl.uniform1f(uniform("uHot"), state === "world" ? hot : -1);
    gl.uniform1f(uniform("uFoc"), focusIndex);
    gl.uniform1f(uniform("uFz"), camera.focus);
    gl.uniform1f(uniform("uDpr"), dpr);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, total);

    overlayContext.clearRect(0, 0, width, height);
    const linkAlpha = Math.max(0, (mix - 0.7) / 0.3);
    if (linkAlpha > 0.01) {
      overlayContext.strokeStyle = "rgb(49,121,203)";
      overlayContext.lineWidth = 1.5;
      overlayContext.setLineDash([6, 8]);
      overlayContext.lineDashOffset = reduced ? 0 : -now / 40;
      const selected = focusIndex >= 0 ? focusIndex : hot;
      for (const [engine, industry] of links) {
        const on = selected < 0 || engine === selected || industry === selected;
        overlayContext.globalAlpha = linkAlpha * (on ? (selected < 0 ? 0.5 : 1) : 0.1);
        const start = centers[engine], end = centers[industry];
        overlayContext.beginPath();
        overlayContext.moveTo(start[0], start[1]);
        overlayContext.quadraticCurveTo((start[0] + end[0]) / 2, (start[1] + end[1]) / 2 - Math.abs(end[0] - start[0]) * 0.2 - 34 * sc / 0.8, end[0], end[1]);
        overlayContext.stroke();
      }
      overlayContext.setLineDash([]);
      overlayContext.globalAlpha = 1;
    }
  };

  const setPointer = (event: PointerEvent) => {
    const rect = root.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
    normX = mouseX / rect.width;
    normY = mouseY / rect.height;
  };
  const follow = () => {
    if (dragging || locked) return;
    if (mouseY > mapTop) { if (state === "words") go("world", -1, true); }
    else if (state === "world") go("words", -1, true);
  };
  const pointerDown = (event: PointerEvent) => {
    pointerType = event.pointerType || "mouse";
    setPointer(event);
    dragging = true;
    moved = 0;
    lastX = event.clientX;
    lastY = event.clientY;
    velocityYaw = 0;
    lastUser = performance.now();
    try { canvas.setPointerCapture(event.pointerId); } catch { /* Pointer capture is optional. */ }
  };
  const pointerMove = (event: PointerEvent) => {
    setPointer(event);
    lastUser = performance.now();
    if (dragging) {
      const dx = event.clientX - lastX, dy = event.clientY - lastY;
      moved += Math.abs(dx) + Math.abs(dy);
      if (state !== "words" && moved > 5) {
        root.classList.add("drag");
        yaw += dx * 0.006;
        velocityYaw = dx * 0.0022;
        pitch = Math.max(0.28, Math.min(1.15, pitch + dy * 0.004));
      }
      lastX = event.clientX;
      lastY = event.clientY;
    } else if (event.pointerType !== "touch") follow();
  };
  const pointerUp = () => {
    if (!dragging) return;
    dragging = false;
    root.classList.remove("drag");
    if (moved <= 5) {
      if (state === "words") { tapHot = -1; go("world", -1, true); }
      else if (state === "focus") { locked = false; tapHot = -1; go("world", -1, true); }
      else if (pointerType === "touch") {
        const index = nearest();
        if (index < 0) { tapHot = -1; go("words", -1, true); }
        else if (index === tapHot) { locked = true; go("focus", index, true); }
        else { tapHot = index; hot = index; updateState(); }
      } else if (hot >= 0) { locked = true; go("focus", hot, true); }
    }
    lastUser = performance.now();
    updateState();
  };
  const pointerCancel = () => { dragging = false; root.classList.remove("drag"); };
  const pointerLeave = (event: PointerEvent) => {
    if (dragging || event.pointerType === "touch") return;
    mouseX = mouseY = -9999;
    locked = false;
    if (state !== "words") go("words", -1, false);
    lastUser = performance.now();
  };
  const keyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && state !== "words") {
      event.preventDefault();
      locked = false;
      go(state === "focus" ? "world" : "words", -1, true);
    }
  };
  canvas.addEventListener("pointerdown", pointerDown);
  canvas.addEventListener("pointerup", pointerUp);
  canvas.addEventListener("pointercancel", pointerCancel);
  root.addEventListener("pointermove", pointerMove);
  root.addEventListener("pointerleave", pointerLeave);
  document.addEventListener("keydown", keyDown);
  const contextLost = (event: Event) => { event.preventDefault(); pause(); };
  canvas.addEventListener("webglcontextlost", contextLost);

  await (document.fonts?.ready ?? Promise.resolve());
  sampleText();
  camera.originX = view.width * 0.5;
  camera.originY = view.height * 0.7;
  camera.scale = Math.min(view.width / 1640, view.height / 1125);
  updateState();

  function pause() {
    if (!running) return;
    running = false;
    cancelAnimationFrame(frameId);
  }
  function resume() {
    if (running) return;
    running = true;
    last = performance.now();
    lastUser = performance.now();
    frameId = requestAnimationFrame(frame);
  }
  const resize = () => sampleText();
  window.addEventListener("resize", resize);

  return {
    pointCount: total,
    pause,
    resume,
    setReducedMotion(value) { reduced = value; lastUser = performance.now(); },
    dispose() {
      pause();
      canvas.removeEventListener("pointerdown", pointerDown);
      canvas.removeEventListener("pointerup", pointerUp);
      canvas.removeEventListener("pointercancel", pointerCancel);
      root.removeEventListener("pointermove", pointerMove);
      root.removeEventListener("pointerleave", pointerLeave);
      document.removeEventListener("keydown", keyDown);
      canvas.removeEventListener("webglcontextlost", contextLost);
      window.removeEventListener("resize", resize);
      labels.forEach((label) => label.remove());
      buffers.forEach((buffer) => gl.deleteBuffer(buffer));
      gl.deleteProgram(program);
      root.classList.remove("world", "hot", "drag");
    },
  };
}
