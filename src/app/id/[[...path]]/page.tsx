import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FoundationPage } from "@/components/foundation-page";
import { homeSceneCopy } from "@/content/home";
import { pageHeroes, pagePaths, type PagePath } from "@/content/pages";
import type { Locale } from "@/content/site";

export const dynamicParams = false;
export function generateStaticParams() {
  return Object.keys(pageHeroes).map((path) => ({ path: path === "/" ? [] : path.slice(1).split("/") }));
}

type RouteParams = Promise<{ path?: string[] }>;

async function pagePath(params: RouteParams): Promise<PagePath> {
  const path = `/${((await params).path ?? []).join("/")}`;
  if (!pagePaths.includes(path as PagePath)) notFound();
  return path as PagePath;
}

async function localizedMetadata(params: RouteParams, locale: Locale): Promise<Metadata> {
  const path = await pagePath(params);
  const hero = pageHeroes[path][locale];
  const heading = `${hero.title.solid} ${hero.title.point}`;
  const description = path === "/" ? homeSceneCopy[locale].positioning : hero.lead;

  return {
    title: heading.endsWith("RekanMU") ? { absolute: heading } : heading,
    ...(description ? { description } : {}),
  };
}

export async function generateMetadata({ params }: { params: RouteParams }): Promise<Metadata> {
  return localizedMetadata(params, "id");
}

export default async function Page({ params, searchParams }: {
  params: RouteParams;
  searchParams: Promise<{ components?: string }>;
}) {
  const path = await pagePath(params);
  const showComponents = process.env.NODE_ENV === "development" && (await searchParams).components === "1";
  return <FoundationPage locale="id" path={path as PagePath} showComponents={showComponents} />;
}
