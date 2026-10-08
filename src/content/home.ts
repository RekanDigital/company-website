import type { Locale } from "./site";

export const homeCatalogueCopy: Record<Locale, { headingSolid: string; headingPoint: string; description: string; action: string; partnersSolid: string; partnersPoint: string }> = {
  en: {
    headingSolid: "Products",
    headingPoint: "& Services",
    description:
      "RekanMU translates its capabilities into practical offerings across digital services, intelligent automation, enterprise systems, professional technology services, and strategic real-sector initiatives.",
    action: "Explore Products & Services",
    partnersSolid: "Built",
    partnersPoint: "Through Collaboration",
  },
  id: {
    headingSolid: "Produk",
    headingPoint: "& Layanan",
    description:
      "RekanMU menerjemahkan kapabilitasnya menjadi penawaran praktis di bidang layanan digital, otomasi cerdas, sistem enterprise, layanan profesional teknologi, dan inisiatif strategis sektor riil.",
    action: "Jelajahi Produk & Layanan",
    partnersSolid: "Dibangun",
    partnersPoint: "Melalui Kolaborasi",
  },
};

export const homeSceneCopy: Record<Locale, {
  sceneLabel: string;
  positioning: string;
  stops: { href: string; name: string; summary: string }[];
  intelligence: { heading: string; paragraph: string };
  source: { heading: string; paragraph: string; cta: { href: string; label: string } };
}> = {
  en: {
    sceneLabel: "Home scene",
    positioning:
      "RekanMU develops businesses by combining data, technology, automation, and Indonesia’s strategic productive sectors to improve operations, strengthen decision-making, and create higher-value products.",
    stops: [
      { href: "/businesses/general-trading-supply-chain", name: "General Trading & Supply Chain", summary: "Sourcing, procurement, logistics, and distribution for business and industry." },
      { href: "/businesses/technology-digitalization", name: "Technology & Digitalization", summary: "Digital systems, automation, AI, IoT, and infrastructure for connected operations." },
      { href: "/businesses/data-business-intelligence", name: "Data & Business Intelligence", summary: "Turning business, operational, and spatial data into clearer decisions." },
      { href: "/businesses/fisheries-seaweed-blue-economy", name: "Fisheries, Seaweed & Blue Economy", summary: "Developing marine resources from cultivation through processing and downstream value." },
      { href: "/businesses/health-bioscience", name: "Health & Bioscience", summary: "Developing higher-value opportunities from herbal and biological resources." },
      { href: "/businesses/agriculture-green-economy", name: "Agriculture & Green Economy", summary: "Strengthening agriculture through productivity, circular resources, and green-economy development." },
      { href: "/businesses/food-beverage", name: "Food & Beverage", summary: "Connecting agricultural outputs with processing, product development, and markets." },
    ],
    intelligence: {
      heading: "From Intelligence to Execution",
      paragraph:
        "RekanMU turns data into decisions, decisions into systems, and systems into more efficient operations. We combine intelligence, digital technology, automation, and infrastructure to help businesses operate with greater clarity, speed, and control.",
    },
    source: {
      heading: "From Source to Market",
      paragraph:
        "We connect sourcing, production, processing, distribution, and commercialization into a more complete path to value. The goal is not simply to move resources through the chain, but to create stronger products, more efficient operations, and greater value at every stage.",
      cta: { href: "/businesses", label: "Explore Our Businesses" },
    },
  },
  id: {
    sceneLabel: "Adegan Beranda",
    positioning:
      "RekanMU mengembangkan bisnis dengan menggabungkan data, teknologi, otomasi, dan sektor produktif strategis Indonesia untuk meningkatkan operasional, memperkuat pengambilan keputusan, dan menciptakan produk bernilai tambah lebih tinggi.",
    stops: [
      { href: "/businesses/general-trading-supply-chain", name: "General Trading & Supply Chain", summary: "Sourcing, pengadaan, logistik, dan distribusi untuk kebutuhan bisnis dan industri." },
      { href: "/businesses/technology-digitalization", name: "Technology & Digitalization", summary: "Sistem digital, otomasi, AI, IoT, dan infrastruktur untuk operasional yang terhubung." },
      { href: "/businesses/data-business-intelligence", name: "Data & Business Intelligence", summary: "Mengubah data bisnis, operasional, dan spasial menjadi keputusan yang lebih jelas." },
      { href: "/businesses/fisheries-seaweed-blue-economy", name: "Fisheries, Seaweed & Blue Economy", summary: "Mengembangkan sumber daya laut dari budidaya hingga pengolahan dan hilirisasi." },
      { href: "/businesses/health-bioscience", name: "Health & Bioscience", summary: "Mengembangkan peluang bernilai tambah dari sumber daya herbal dan hayati." },
      { href: "/businesses/agriculture-green-economy", name: "Agriculture & Green Economy", summary: "Memperkuat pertanian melalui produktivitas, sumber daya sirkular, dan pengembangan ekonomi hijau." },
      { href: "/businesses/food-beverage", name: "Food & Beverage", summary: "Menghubungkan hasil pertanian dengan pengolahan, pengembangan produk, dan pasar." },
    ],
    intelligence: {
      heading: "Dari Intelegensi ke Eksekusi",
      paragraph:
        "RekanMU mengubah data menjadi keputusan, keputusan menjadi sistem, dan sistem menjadi operasional yang lebih efisien. Kami menggabungkan inteligensi, teknologi digital, otomasi, dan infrastruktur untuk membantu bisnis bekerja dengan lebih terarah, cepat, dan terkendali.",
    },
    source: {
      heading: "Dari Sumber ke Pasar",
      paragraph:
        "Kami menghubungkan pengadaan, produksi, pengolahan, distribusi, dan komersialisasi dalam satu perjalanan nilai yang lebih utuh. Tujuannya bukan sekadar menggerakkan sumber daya melalui rantai bisnis, tetapi menciptakan produk yang lebih kuat, operasional yang lebih efisien, dan nilai yang lebih tinggi di setiap tahap.",
      cta: { href: "/businesses", label: "Jelajahi Bisnis Kami" },
    },
  },
};
