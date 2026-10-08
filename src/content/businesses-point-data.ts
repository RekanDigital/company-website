export const businessPointSlices = [
  { slug: "technology-digitalization", byteOffset: 0, pointCount: 7938, x: 40, z: 12 },
  { slug: "data-business-intelligence", byteOffset: 63504, pointCount: 12880, x: 170, z: 60 },
  { slug: "general-trading-supply-chain", byteOffset: 166544, pointCount: 24874, x: -185, z: -130 },
  { slug: "fisheries-seaweed-blue-economy", byteOffset: 365536, pointCount: 23212, x: -520, z: 50 },
  { slug: "health-bioscience", byteOffset: 551232, pointCount: 20036, x: 440, z: -60 },
  { slug: "agriculture-green-economy", byteOffset: 711520, pointCount: 6797, x: -215, z: 345 },
  { slug: "food-beverage", byteOffset: 765896, pointCount: 12303, x: 378, z: 242 },
] as const;

export type BusinessPointSlug = (typeof businessPointSlices)[number]["slug"];

export const businessPointCount = businessPointSlices.reduce((sum, item) => sum + item.pointCount, 0);
