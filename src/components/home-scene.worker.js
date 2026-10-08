import * as THREE from "three";
import createWorld from "./home-scene-world.js";

self.onmessage = ({ data }) => {
  const started = performance.now();
  try {
    const { progressPointEstimate, ...options } = data;
    const world = createWorld(THREE, {
      ...options,
      onProgress: (count) => self.postMessage({ progress: 0.08 + 0.78 * Math.min(count / progressPointEstimate, 1) }),
    });
    const pointData = world.pointData();
    const transfer = [
      pointData.position.buffer,
      pointData.aRand.buffer,
      pointData.aMeta.buffer,
      pointData.aScan.buffer,
      pointData.aScanW.buffer,
    ];
    self.postMessage({ pointData, durationMs: performance.now() - started }, transfer);
    self.close();
  } catch (error) {
    self.postMessage({ error: error instanceof Error ? error.message : String(error) });
  }
};
