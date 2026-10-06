// Re-render the five approved menu places from the supplied world, with no frame.
// Run: node tools/render-menu.mjs (requires the local design handoff).
import { chromium } from '@playwright/test';
import { readFile, mkdir } from 'node:fs/promises';

const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
  await page.setContent('<style>body{margin:0}canvas{display:block}</style>');
  const three = await fetch('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js');
  if (!three.ok) throw new Error(`Three.js reference download: ${three.status}`);
  await page.addScriptTag({ content: await three.text() });
  await page.addScriptTag({ content: await readFile('design-docs/prototypes/home-scene/source/world.js', 'utf8') });
  await page.evaluate(() => {
    const THREE = window.THREE;
    window.world = window.createWorld(THREE, { spacing: 2.4, objStep: 1, pointSize: 170, pixelRatio: 1, alwaysDark: true, order: [2, 0, 1, 3, 4, 5, 6] });
    window.renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true });
    window.renderer.setSize(1280, 720);
    document.body.append(window.renderer.domElement);
  });
  await mkdir('public/assets/renders', { recursive: true });
  for (const [place, frame] of [['coast', 8], ['highlands', 20], ['closing', 90], ['data', 53], ['city', 35]]) {
    await page.evaluate((frame) => {
      const P = frame / 100;
      const p = P < .05 ? .02 * P / .05 : P < .965 ? .02 + (P - .05) / .915 * .965 : .985 + (P - .965) / .035 * .015;
      const { world, renderer, THREE } = window;
      world.camera.aspect = 1280 / 720;
      const state = world.update(p, 3, 0, 0, false, 1280, 720);
      world.uniforms.uQuiet.value.set(0, 0);
      world.uniforms.uScan.value = 9;
      world.uniforms.uBandK.value = 0;
      world.scene.traverse((object) => { if (object.type === 'Group') object.visible = false; });
      renderer.setClearColor(new THREE.Color(...state.bg.map((value) => value / 255)), 1);
      renderer.render(world.scene, world.camera);
    }, frame);
    await page.locator('canvas').screenshot({ path: `public/assets/renders/menu-${place}.jpg`, type: 'jpeg', quality: 90 });
    console.log(`menu-${place}.jpg: source timeline frame ${frame}, frame and scan line removed`);
  }
} finally {
  await browser.close();
}
