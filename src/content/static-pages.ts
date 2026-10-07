import type { Locale } from "./site";
import { pageMapSources } from "./page-map-sources";

export type ContentNode = { kind: "heading"; text: string } | { kind: "paragraph"; text: string };
export type ContentSection = { name: string; nodes: ContentNode[] };

function parsePageMap(file: string) {
  const sections: Record<Locale, ContentSection[]> = { en: [], id: [] };
  const lines = pageMapSources[file]
    .replace(/^\uFEFF/, "")
    .replaceAll("\r", "")
    .split("\n");
  let section = "";
  let locale: Locale | undefined;
  let paragraph: string[] = [];

  const flush = () => {
    if (!section || !locale || paragraph.length === 0) return;
    const text = paragraph.join(" ").replaceAll("  ", " ").trim();
    paragraph = [];
    if (!text || /^\\?\[.*CTA \\?\]$/.test(text)) return;
    sections[locale].at(-1)?.nodes.push({ kind: "paragraph", text });
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith("## ")) {
      flush();
      section = line.slice(3);
      locale = undefined;
      continue;
    }
    if (line === "### English" || line === "### Bahasa Indonesia") {
      flush();
      locale = line === "### English" ? "en" : "id";
      if (!sections[locale].some((item) => item.name === section)) {
        sections[locale].push({ name: section, nodes: [] });
      }
      continue;
    }
    if (!locale || !section || section === "Hero" || section.startsWith("CTA Destination")) continue;
    if (!line) {
      flush();
      continue;
    }
    const strong = line.match(/^\*\*(.+)\*\*$/);
    if (strong) {
      flush();
      sections[locale].at(-1)?.nodes.push({ kind: "heading", text: strong[1] });
      continue;
    }
    if (!line.startsWith(">") && !line.startsWith("**Route:")) paragraph.push(line.replace(/ {2,}$/, ""));
  }
  flush();
  return sections;
}

export const aboutContent = parsePageMap("ABOUT.md");
export const productsContent = parsePageMap("PRODUCTS-SERVICES.md");
export const businessesContent = parsePageMap("BUSINESSES.md");

export const businessPages = [
  { slug: "technology-digitalization", name: "Technology & Digitalization", specimenIndex: 1, file: "TECHNOLOGY-DIGITALIZATION.md", render: "specimen-tech.jpg" },
  { slug: "data-business-intelligence", name: "Data & Business Intelligence", specimenIndex: 2, file: "DATA-BUSINESS-INTELLIGENCE.md", render: "specimen-data.jpg" },
  { slug: "general-trading-supply-chain", name: "General Trading & Supply Chain", specimenIndex: 0, file: "GENERAL-TRADING-SUPPLY-CHAIN.md", render: "specimen-trading.jpg" },
  { slug: "fisheries-seaweed-blue-economy", name: "Fisheries, Seaweed & Blue Economy", specimenIndex: 3, file: "FISHERIES-SEAWEED-BLUE-ECONOMY.md", render: "specimen-fisheries.jpg" },
  { slug: "health-bioscience", name: "Health & Bioscience", specimenIndex: 4, file: "HEALTH-BIOSCIENCE.md", render: "specimen-health.jpg" },
  { slug: "agriculture-green-economy", name: "Agriculture & Green Economy", specimenIndex: 5, file: "AGRICULTURE-GREEN-ECONOMY.md", render: "specimen-agriculture.jpg" },
  { slug: "food-beverage", name: "Food & Beverage", specimenIndex: 6, file: "FOOD-BEVERAGE.md", render: "specimen-food-beverage.jpg" },
] as const;

export type BusinessPage = (typeof businessPages)[number];

export const businessDetailContent = Object.fromEntries(
  businessPages.map((business) => [business.slug, parsePageMap(business.file)]),
) as Record<BusinessPage["slug"], Record<Locale, ContentSection[]>>;

export function contentItems(nodes: ContentNode[]) {
  const intro: string[] = [];
  const items: { title: string; paragraphs: string[] }[] = [];
  for (const node of nodes) {
    if (node.kind === "heading") items.push({ title: node.text, paragraphs: [] });
    else if (items.length) items.at(-1)?.paragraphs.push(node.text);
    else intro.push(node.text);
  }
  return { intro, items };
}

export function homeProductStreams(locale: Locale) {
  return productsContent[locale]
    .filter((section) => section.name !== "Business Inquiry" && section.nodes.length > 0)
    .map((section) => {
      const content = contentItems(section.nodes);
      return {
        name: section.name,
        description: content.intro[0] ?? "",
        count: content.items.filter((item) => item.paragraphs.length > 0).length,
      };
    });
}
