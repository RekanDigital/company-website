import { businessPointSlices, type BusinessPointSlug } from "@/content/businesses-point-data";

const POINT_BYTES = 8;
const VERTEX_SHADER = `
attribute vec3 aPosition;
attribute float aEdge;
uniform float uAngle;
uniform float uAspect;
uniform float uDistance;
uniform float uHeight;
uniform float uFocal;
uniform float uElevationSin;
uniform float uElevationCos;
uniform float uNear;
uniform float uFar;
uniform float uPointSize;
varying float vEdge;
void main() {
  float c = cos(uAngle);
  float s = sin(uAngle);
  float x = aPosition.x * c + aPosition.z * s;
  float z = -aPosition.x * s + aPosition.z * c;
  float y = aPosition.y * uElevationCos - z * uElevationSin;
  float depth = max(uDistance - aPosition.y * uElevationSin - z * uElevationCos, uNear);
  float viewZ = -depth;
  float clipZ = ((uFar + uNear) / (uNear - uFar)) * viewZ
    + (2.0 * uFar * uNear) / (uNear - uFar);
  gl_Position = vec4(x * uFocal / uAspect, y * uFocal, clipZ, depth);
  gl_PointSize = clamp(uPointSize * uFocal * uHeight * 0.5 / depth, 1.0, 8.0);
  vEdge = aEdge;
}`;

const FRAGMENT_SHADER = `
precision mediump float;
varying float vEdge;
void main() {
  vec2 point = gl_PointCoord - vec2(0.5);
  if (dot(point, point) > 0.25) discard;
  vec3 ink = vec3(0.055, 0.067, 0.086);
  vec3 blue = vec3(0.192, 0.475, 0.796);
  gl_FragColor = vec4(mix(ink, blue, vEdge), 1.0);
}`;

export type BusinessesCardViewerRenderer = {
  setPlaying: (playing: boolean) => void;
  dispose: () => void;
};

export class ViewerWebGLUnavailableError extends Error {
  constructor() {
    super("WebGL is unavailable");
    this.name = "ViewerWebGLUnavailableError";
  }
}

let pointDataPromise: Promise<ArrayBuffer> | undefined;

function loadPointData() {
  if (!pointDataPromise) {
    pointDataPromise = fetch("/assets/point-data/businesses.bin")
      .then((response) => {
        if (!response.ok) throw new Error(`Point data request failed: ${response.status}`);
        return response.arrayBuffer();
      })
      .catch((error: unknown) => {
        pointDataPromise = undefined;
        throw error;
      });
  }
  return pointDataPromise;
}

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Could not create WebGL shader");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) ?? "WebGL shader compilation failed";
    gl.deleteShader(shader);
    throw new Error(message);
  }
  return shader;
}

export async function mountBusinessesCardViewer(
  canvas: HTMLCanvasElement,
  slug: BusinessPointSlug,
  { rotating = false }: { rotating?: boolean } = {},
): Promise<BusinessesCardViewerRenderer> {
  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    powerPreference: "low-power",
  });
  if (!gl) throw new ViewerWebGLUnavailableError();

  const slice = businessPointSlices.find((candidate) => candidate.slug === slug);
  if (!slice) throw new Error(`Unknown Businesses point-data slice: ${slug}`);
  const buffer = await loadPointData();
  if (buffer.byteLength < slice.byteOffset + slice.pointCount * POINT_BYTES) {
    throw new Error("Businesses point data is incomplete");
  }

  const data = new DataView(buffer);
  const positions = new Float32Array(slice.pointCount * 3);
  const edges = new Float32Array(slice.pointCount);
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  for (let index = 0; index < slice.pointCount; index++) {
    const offset = slice.byteOffset + index * POINT_BYTES;
    const x = data.getInt16(offset, true) / 10;
    const y = data.getInt16(offset + 2, true) / 10;
    const z = data.getInt16(offset + 4, true) / 10;
    positions[index * 3] = x;
    positions[index * 3 + 1] = y;
    positions[index * 3 + 2] = z;
    edges[index] = data.getInt16(offset + 6, true) === 1 ? 1 : 0;
    min[0] = Math.min(min[0], x); max[0] = Math.max(max[0], x);
    min[1] = Math.min(min[1], y); max[1] = Math.max(max[1], y);
    min[2] = Math.min(min[2], z); max[2] = Math.max(max[2], z);
  }

  const center = min.map((value, axis) => (value + max[axis]) * 0.5);
  const half = min.map((value, axis) => (max[axis] - value) * 0.5);
  const radius = Math.max(1, Math.hypot(half[0], half[1], half[2]));
  for (let index = 0; index < slice.pointCount; index++) {
    positions[index * 3] -= center[0];
    positions[index * 3 + 1] -= center[1];
    positions[index * 3 + 2] -= center[2];
  }

  const buffers: WebGLBuffer[] = [];
  const shaders: WebGLShader[] = [];
  let program: WebGLProgram | null = null;
  try {
    const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    shaders.push(vertex);
    const fragment = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    shaders.push(fragment);
    program = gl.createProgram();
    if (!program) throw new Error("Could not create WebGL program");
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    shaders.length = 0;
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) ?? "WebGL program linking failed");
    }
    gl.useProgram(program);

    const bindAttribute = (name: string, values: Float32Array, size: number) => {
      const location = gl.getAttribLocation(program!, name);
      if (location < 0) throw new Error(`Missing WebGL attribute: ${name}`);
      const buffer = gl.createBuffer();
      if (!buffer) throw new Error("Could not create WebGL buffer");
      buffers.push(buffer);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, values, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
    };
    bindAttribute("aPosition", positions, 3);
    bindAttribute("aEdge", edges, 1);

    const uniform = (name: string) => {
      const location = gl.getUniformLocation(program!, name);
      if (!location) throw new Error(`Missing WebGL uniform: ${name}`);
      return location;
    };
    const uniforms = {
      angle: uniform("uAngle"),
      aspect: uniform("uAspect"),
      distance: uniform("uDistance"),
      height: uniform("uHeight"),
      focal: uniform("uFocal"),
      elevationSin: uniform("uElevationSin"),
      elevationCos: uniform("uElevationCos"),
      near: uniform("uNear"),
      far: uniform("uFar"),
      pointSize: uniform("uPointSize"),
    };

    const fov = (42 * Math.PI) / 180;
    const cameraElevation = (25 * Math.PI) / 180;
    const focal = 1 / Math.tan(fov * 0.5);
    const elevationSin = Math.sin(cameraElevation);
    const elevationCos = Math.cos(cameraElevation);
    const near = 0.1;
    const distance = radius / Math.sin(fov * 0.5) * 1.12;
    const far = distance + radius * 2;
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clearColor(246 / 255, 248 / 255, 250 / 255, 1);

    let angle = 0.35 + Math.PI;
    let playing = false;
    let last = 0;
    let frameId = 0;

    const draw = () => {
      if (!canvas.width || !canvas.height) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.uniform1f(uniforms.angle, angle);
      gl.uniform1f(uniforms.aspect, canvas.width / canvas.height);
      gl.uniform1f(uniforms.distance, distance);
      gl.uniform1f(uniforms.height, canvas.height);
      gl.uniform1f(uniforms.focal, focal);
      gl.uniform1f(uniforms.elevationSin, elevationSin);
      gl.uniform1f(uniforms.elevationCos, elevationCos);
      gl.uniform1f(uniforms.near, near);
      gl.uniform1f(uniforms.far, far);
      gl.uniform1f(uniforms.pointSize, 1.35);
      gl.drawArrays(gl.POINTS, 0, slice.pointCount);
    };

    const frame = (now: number) => {
      if (!playing) return;
      angle += Math.min(50, now - last || 16.67) * 0.000096;
      last = now;
      draw();
      frameId = requestAnimationFrame(frame);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        draw();
      }
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();
    draw();

    return {
      setPlaying(next) {
        if (!rotating || playing === next) return;
        playing = next;
        if (playing) {
          last = performance.now();
          frameId = requestAnimationFrame(frame);
        } else cancelAnimationFrame(frameId);
      },
      dispose() {
        playing = false;
        cancelAnimationFrame(frameId);
        resizeObserver.disconnect();
        buffers.forEach((buffer) => gl.deleteBuffer(buffer));
        if (program) gl.deleteProgram(program);
      },
    };
  } catch (error) {
    shaders.forEach((shader) => gl.deleteShader(shader));
    buffers.forEach((buffer) => gl.deleteBuffer(buffer));
    if (program) gl.deleteProgram(program);
    throw error;
  }
}
