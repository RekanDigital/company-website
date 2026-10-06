export type Locale = "en" | "id";

export const CONTACT = {
  email: "rekanmu.digital@gmail.com",
  phone: "0899 9933 349",
  legalName: "PT Rekan Makmur Utama",
  nib: "2302240059465",
} as const;

const copy = {
  en: {
    menu: "Menu",
    close: "Close",
    navigation: "Menu",
    quickLinks: "Quick Links.",
    switchLanguage: "Switch language to Bahasa Indonesia",
    contactUs: "Contact Us.",
    followUs: "Follow Us.",
    location: "Sidoarjo, East Java, Indonesia",
    footerTitle: "Stay Connected",
    footerIntro: "Have a business need, an idea, or an opportunity to explore?",
    contact: "Contact RekanMU",
    closingBody:
      "Have a business need, an idea, or an opportunity to explore? We’re open to discussing how RekanMU can support what comes next.",
    businessesTitle: "Let’s Explore What Fits",
    businessesBody:
      "Every business need starts from a different place. Tell us what you are trying to solve, build, source, improve, or develop, and we can explore where RekanMU’s capabilities may fit.",
    businessInquiry: "Start a Business Inquiry",
  },
  id: {
    menu: "Menu",
    close: "Tutup",
    navigation: "Menu",
    quickLinks: "Tautan Cepat.",
    switchLanguage: "Ganti bahasa ke Inggris",
    contactUs: "Hubungi Kami.",
    followUs: "Ikuti Kami.",
    location: "Sidoarjo, Jawa Timur, Indonesia",
    footerTitle: "Tetap Terhubung",
    footerIntro: "Punya kebutuhan bisnis, ide, atau peluang yang ingin dikembangkan?",
    contact: "Hubungi RekanMU",
    closingBody:
      "Punya kebutuhan bisnis, ide, atau peluang yang ingin dikembangkan? Kami terbuka untuk berdiskusi tentang bagaimana RekanMU dapat mendukung langkah berikutnya.",
    businessesTitle: "Mari Temukan yang Paling Sesuai",
    businessesBody:
      "Setiap kebutuhan bisnis berangkat dari kondisi yang berbeda. Sampaikan apa yang ingin Anda selesaikan, bangun, sediakan, tingkatkan, atau kembangkan, dan kami dapat mengeksplorasi kapabilitas RekanMU yang paling relevan.",
    businessInquiry: "Mulai Diskusi Bisnis",
  },
} as const;

export const siteCopy = (locale: Locale) => copy[locale];

const NAVIGATION = [
  {
    href: "/",
    image: "menu-coast.jpg",
    label: { en: "Home", id: "Beranda" },
    headline: {
      en: "Beyond Technology. Building Strategic Industries.",
      id: "Melampaui Teknologi. Membangun Industri Strategis.",
    },
  },
  {
    href: "/about",
    image: "menu-highlands.jpg",
    label: { en: "About", id: "Tentang" },
    headline: { en: "About RekanMU", id: "Tentang RekanMU" },
  },
  {
    href: "/businesses",
    image: "menu-closing.jpg",
    label: { en: "Businesses", id: "Bisnis" },
    headline: {
      en: "A Portfolio Built to Work Together.",
      id: "Portofolio yang Dibangun untuk Bekerja Bersama.",
    },
  },
  {
    href: "/products-services",
    image: "menu-data.jpg",
    label: { en: "Products & Services", id: "Produk & Layanan" },
    headline: {
      en: "Practical Solutions Built Around Real Business Needs.",
      id: "Solusi Praktis untuk Kebutuhan Bisnis yang Nyata.",
    },
  },
  {
    href: "/businesses#contact",
    image: "menu-city.jpg",
    label: { en: "Contact", id: "Kontak" },
    headline: { en: "Start a Conversation", id: "Mulai Percakapan" },
  },
] as const;

export const navigation = (locale: Locale) =>
  NAVIGATION.map((item) => ({
    href: localizeHref(item.href, locale),
    image: item.image,
    label: item.label[locale],
    headline: item.headline[locale],
  }));

export function localizeHref(href: string, locale: Locale) {
  const hashIndex = href.indexOf("#");
  const path = hashIndex === -1 ? href : href.slice(0, hashIndex);
  const hash = hashIndex === -1 ? "" : href.slice(hashIndex);
  const englishPath = path === "/id" ? "/" : path.replace(/^\/id(?=\/)/, "");

  if (locale === "en") return `${englishPath || "/"}${hash}`;
  return `${englishPath === "/" ? "/id" : `/id${englishPath}`}${hash}`;
}
