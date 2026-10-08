/* Headless check: renders the 3D scene (without the page shell) at given readout frame numbers.
   Usage:  npm i three@0.128 gl pngjs   then   xvfb-run -a node tools/render-frames.js 2 20 39 90
   Output: reference-renders/frame-NNN.png (1280x720). Frame N means page scroll N percent. */
const path = require('path'), fs = require('fs');
const THREE = require('three'), createGL = require('gl'), { PNG } = require('pngjs');
const createWorld = require(path.join(__dirname, '..', 'source', 'world.js'));
const W = 1280, H = 720, OUT = path.join(__dirname, '..', 'reference-renders');
const ENTER = 0.05, EXIT = 0.965;
function coreP(P) { if (P < ENTER) { return 0.02 * (P / ENTER); } if (P < EXIT) { return 0.02 + (P - ENTER) / (EXIT - ENTER) * 0.965; } return 0.985 + (P - EXIT) / (1 - EXIT) * 0.015; }
const gl = createGL(W, H, { preserveDrawingBuffer: true, antialias: false });
const canvas = { width: W, height: H, style: {}, addEventListener() {}, removeEventListener() {}, getContext() { return gl; } }; gl.canvas = canvas;
const renderer = new THREE.WebGLRenderer({ canvas, context: gl, alpha: true }); renderer.setSize(W, H, false);
const T = createWorld(THREE, { spacing: 2.4, objStep: 1, pointSize: 170, pixelRatio: 1, alwaysDark: true, order: [2, 0, 1, 3, 4, 5, 6] });
console.log('points', T.count);
for (const f of process.argv.slice(2).map(Number)) {
  T.camera.aspect = W / H;
  const st = T.update(coreP(f / 100), 3.0, 0, 0, false, W, H);
  renderer.setClearColor(new THREE.Color(st.bg[0] / 255, st.bg[1] / 255, st.bg[2] / 255), 1);
  renderer.render(T.scene, T.camera);
  const px = new Uint8Array(W * H * 4); gl.readPixels(0, 0, W, H, gl.RGBA, gl.UNSIGNED_BYTE, px);
  const png = new PNG({ width: W, height: H });
  for (let y = 0; y < H; y++) { const src = (H - 1 - y) * W * 4; png.data.set(px.subarray(src, src + W * 4), y * W * 4); }
  const name = 'frame-' + ('00' + Math.round(f)).slice(-3) + '.png';
  fs.writeFileSync(path.join(OUT, name), PNG.sync.write(png)); console.log(name);
}
