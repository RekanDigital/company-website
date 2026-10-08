import Image from "next/image";
import type { CSSProperties } from "react";

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

export function AboutSlideshow({ locale, paragraphs }: { locale: Locale; paragraphs: string[] }) {
  return (
    <section className="aboutStoryScene" aria-label={locale === "en" ? "RekanMU moments and story" : "Momen dan kisah RekanMU"}>
      <div className="aboutStoryBackdrop">
        <Image alt={slides[0].alt[locale]} src={slides[0].src} width={2732} height={1536} sizes="100vw" loading="eager" />
      </div>
      <div className="aboutStoryPairs gut">
        {slides.slice(1).map((slide, index) => {
          const words = paragraphs[index].split(" ");
          return (
            <article className="aboutStoryPair" key={slide.src}>
              <div className="aboutStoryPhoto">
                <Image alt={slide.alt[locale]} src={slide.src} width={2732} height={1536} sizes="(max-width: 820px) 90vw, 48vw" />
              </div>
              <div className="aboutStoryCopy">
                <p className="body">
                  {words.map((word, wordIndex) => (
                    <span key={wordIndex}><span className="aboutStoryWord" style={{ "--word-start": `${8 + wordIndex / words.length * 40}%`, "--word-end": `${8 + (wordIndex + 1) / words.length * 40}%` } as CSSProperties}><span>{word}</span></span>{" "}</span>
                  ))}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
