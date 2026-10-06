import type { Locale } from "@/content/site";

export const pagePaths = [
  "/",
  "/about",
  "/businesses",
  "/products-services",
  "/businesses/technology-digitalization",
  "/businesses/data-business-intelligence",
  "/businesses/general-trading-supply-chain",
  "/businesses/fisheries-seaweed-blue-economy",
  "/businesses/health-bioscience",
  "/businesses/agriculture-green-economy",
  "/businesses/food-beverage",
] as const;

export type PagePath = (typeof pagePaths)[number];

export type PageHero = {
  title: {
    solid: string;
    point: string;
  };
  lead?: string;
  tagline?: string;
  cta?: {
    label: string;
    href: string;
  };
};

type LocalizedPageHero = Record<Locale, PageHero>;

export const pageHeroes: Record<PagePath, LocalizedPageHero> = {
  "/": {
    en: {
      title: {
        solid: "Beyond Technology.",
        point: "Building Strategic Industries.",
      },
      cta: { label: "About RekanMU", href: "/about" },
    },
    id: {
      title: {
        solid: "Melampaui Teknologi.",
        point: "Membangun Industri Strategis.",
      },
      cta: { label: "Tentang RekanMU", href: "/about" },
    },
  },
  "/about": {
    en: {
      title: { solid: "About", point: "RekanMU" },
      lead:
        "RekanMU is PT Rekan Makmur Utama, founded in 2024 in Sidoarjo, East Java. We develop businesses across data, technology, automation, and Indonesia’s strategic productive sectors.",
    },
    id: {
      title: { solid: "Tentang", point: "RekanMU" },
      lead:
        "RekanMU adalah PT Rekan Makmur Utama, yang didirikan pada 2024 di Sidoarjo, Jawa Timur. Kami mengembangkan bisnis di bidang data, teknologi, otomasi, dan sektor produktif strategis Indonesia.",
    },
  },
  "/businesses": {
    en: {
      title: { solid: "A Portfolio Built", point: "to Work Together." },
      lead:
        "Each RekanMU business has a distinct role, but none operates in isolation. Across the group, data, technology, supply networks, operational capabilities, and industry development are connected to support better decisions, stronger execution, and long-term value creation.",
    },
    id: {
      title: {
        solid: "Portofolio yang Dibangun",
        point: "untuk Bekerja Bersama.",
      },
      lead:
        "Setiap bisnis RekanMU memiliki peran yang berbeda, namun tidak berjalan sendiri. Di seluruh grup, data, teknologi, jaringan pasok, kapabilitas operasional, dan pengembangan industri saling terhubung untuk mendukung keputusan yang lebih baik, pelaksanaan yang lebih kuat, dan penciptaan nilai jangka panjang.",
    },
  },
  "/products-services": {
    en: {
      title: {
        solid: "Practical Solutions",
        point: "Built Around Real Business Needs.",
      },
      lead:
        "RekanMU brings together digital services, intelligent automation, enterprise systems, professional technology services, and strategic real-sector initiatives in a portfolio designed around practical business and operational needs.",
    },
    id: {
      title: {
        solid: "Solusi Praktis",
        point: "untuk Kebutuhan Bisnis yang Nyata.",
      },
      lead:
        "RekanMU menggabungkan layanan digital, otomasi cerdas, sistem enterprise, layanan profesional teknologi, dan inisiatif strategis sektor riil dalam portofolio yang dibangun untuk menjawab kebutuhan bisnis dan operasional secara praktis.",
    },
  },
  "/businesses/technology-digitalization": {
    en: {
      title: { solid: "Technology", point: "& Digitalization" },
      tagline: "Technology That Moves Business Forward.",
      lead:
        "RekanMU develops digital systems, automation, intelligent solutions, IoT, and supporting infrastructure to improve efficiency and connect business processes for clients and across the group.",
    },
    id: {
      title: { solid: "Technology", point: "& Digitalization" },
      tagline: "Teknologi yang Menggerakkan Bisnis Maju.",
      lead:
        "RekanMU mengembangkan sistem digital, otomasi, solusi cerdas, IoT, dan infrastruktur pendukung untuk meningkatkan efisiensi serta menghubungkan proses bisnis bagi klien dan di seluruh grup.",
    },
  },
  "/businesses/data-business-intelligence": {
    en: {
      title: { solid: "Data", point: "& Business Intelligence" },
      tagline: "Turning Data into Business Intelligence.",
      lead:
        "RekanMU helps businesses turn market, operational, and production data into clearer insight and better-supported strategic decisions.",
    },
    id: {
      title: { solid: "Data", point: "& Business Intelligence" },
      tagline: "Mengubah Data Menjadi Inteligensi Bisnis.",
      lead:
        "RekanMU membantu bisnis mengubah data pasar, operasional, dan produksi menjadi insight yang lebih jelas serta mendukung pengambilan keputusan strategis.",
    },
  },
  "/businesses/general-trading-supply-chain": {
    en: {
      title: { solid: "General Trading", point: "& Supply Chain" },
      tagline: "Connecting Business Needs with the Right Supply.",
      lead:
        "RekanMU supports business and industrial procurement through sourcing, supply, logistics, and distribution. We help clients obtain the right products from the right suppliers through an efficient and structured process.",
    },
    id: {
      title: { solid: "General Trading", point: "& Supply Chain" },
      tagline: "Menghubungkan Kebutuhan Bisnis dengan Pasokan yang Tepat.",
      lead:
        "RekanMU mendukung kebutuhan pengadaan bisnis dan industri melalui sourcing, penyediaan, logistik, dan distribusi. Kami membantu klien memperoleh barang yang tepat dari pemasok yang tepat melalui proses yang efisien dan terukur.",
    },
  },
  "/businesses/fisheries-seaweed-blue-economy": {
    en: {
      title: { solid: "Fisheries, Seaweed", point: "& Blue Economy" },
      tagline: "From Marine Resources to Higher-Value Products.",
      lead:
        "RekanMU develops value across fisheries and seaweed, connecting cultivation, post-harvest processing, downstream development, and higher-value products such as seaweed-based biostimulants.",
    },
    id: {
      title: { solid: "Fisheries, Seaweed", point: "& Blue Economy" },
      tagline:
        "Dari Sumber Daya Laut Menuju Produk Bernilai Tambah Lebih Tinggi.",
      lead:
        "RekanMU mengembangkan nilai pada sektor perikanan dan rumput laut dengan menghubungkan budidaya, pengolahan pascapanen, pengembangan hilir, dan produk bernilai tambah seperti biostimulan berbasis rumput laut.",
    },
  },
  "/businesses/health-bioscience": {
    en: {
      title: { solid: "Health", point: "& Bioscience" },
      tagline: "Creating Value from Indonesia’s Biological Resources.",
      lead:
        "RekanMU develops opportunities around herbal resources and bioscience as part of its strategic industry portfolio.",
    },
    id: {
      title: { solid: "Health", point: "& Bioscience" },
      tagline: "Menciptakan Nilai dari Sumber Daya Hayati Indonesia.",
      lead:
        "RekanMU mengembangkan peluang pada sumber daya herbal dan biosains sebagai bagian dari portofolio industri strategisnya.",
    },
  },
  "/businesses/agriculture-green-economy": {
    en: {
      title: { solid: "Agriculture", point: "& Green Economy" },
      tagline: "Building More Value from Agricultural Production.",
      lead:
        "RekanMU develops agricultural value through cultivation, productivity improvement, agricultural inputs, post-harvest activities, and agro-industrial development, while extending the Green Economy pillar into circular resource use, biomass utilization, and resource-efficiency initiatives.",
    },
    id: {
      title: { solid: "Agriculture", point: "& Green Economy" },
      tagline: "Membangun Nilai Lebih dari Produksi Pertanian.",
      lead:
        "RekanMU mengembangkan nilai pertanian melalui budidaya, peningkatan produktivitas, input pertanian, kegiatan pascapanen, dan pengembangan agroindustri, sekaligus memperluas pilar Green Economy melalui pemanfaatan sumber daya sirkular, biomassa, dan inisiatif efisiensi sumber daya.",
    },
  },
  "/businesses/food-beverage": {
    en: {
      title: { solid: "Food", point: "& Beverage" },
      tagline: "From Food Production to Higher-Value Products.",
      lead:
        "RekanMU develops value across food processing, product development, distribution, and downstream agro-industry, connecting agricultural outputs with products and markets.",
    },
    id: {
      title: { solid: "Food", point: "& Beverage" },
      tagline:
        "Dari Produksi Pangan Menuju Produk Bernilai Tambah Lebih Tinggi.",
      lead:
        "RekanMU mengembangkan nilai melalui pengolahan pangan, pengembangan produk, distribusi, dan hilirisasi agroindustri, menghubungkan hasil pertanian dengan produk dan pasar.",
    },
  },
};

export function getPageHero(path: string, locale: Locale) {
  return pageHeroes[path as PagePath]?.[locale];
}
