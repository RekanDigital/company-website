import Image from "next/image";

import type { Locale } from "@/content/site";

const slides = [
  {
    src: "/assets/about-rekanmu-slideshow/about-slide-1_v2.png",
    alt: {
      en: "The RekanMU team gathered around a conference table.",
      id: "Tim RekanMU berkumpul mengelilingi meja rapat.",
    },
  },
  {
    src: "/assets/about-rekanmu-slideshow/about-slide-2_v2.png",
    alt: {
      en: "RekanMU team members standing together outdoors.",
      id: "Anggota tim RekanMU berdiri bersama di luar ruangan.",
    },
  },
  {
    src: "/assets/about-rekanmu-slideshow/about-slide-3_v2.png",
    alt: {
      en: "RekanMU team members with an information display about Indonesian seaweed.",
      id: "Anggota tim RekanMU bersama tampilan informasi tentang rumput laut Indonesia.",
    },
  },
  {
    src: "/assets/about-rekanmu-slideshow/about-slide-4_v2.png",
    alt: {
      en: "A large RekanMU team gathering inside a room.",
      id: "Tim RekanMU berkumpul di dalam ruangan.",
    },
  },
] as const;

export function AboutSlideshow({ locale }: { locale: Locale }) {
  return (
    <section
      aria-label={locale === "en" ? "RekanMU moments" : "Momen RekanMU"}
      className="worldBand aboutSlideshow"
      role="region"
    >
      <div className="aboutSlideshowPin">
        <div className="aboutSlideshowViewport">
          {slides.map((slide, index) => (
            <div
              aria-label={`${index + 1} ${locale === "en" ? "of" : "dari"} ${slides.length}`}
              aria-roledescription="slide"
              className={`aboutSlideshowSlide aboutSlideshowSlide--${index + 1}`}
              key={slide.src}
              role="group"
            >
              <Image
                alt={slide.alt[locale]}
                height={1536}
                loading={index === 0 ? "eager" : "lazy"}
                sizes="100vw"
                src={slide.src}
                width={2732}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
