import { notFound } from "next/navigation";
import { FoundationPage } from "@/components/foundation-page";
import { pageHeroes, type PagePath } from "@/content/pages";

export const dynamicParams = false;
export function generateStaticParams() {
  return Object.keys(pageHeroes).map((path) => ({ path: path === "/" ? [] : path.slice(1).split("/") }));
}

export default async function Page({ params, searchParams }: {
  params: Promise<{ path?: string[] }>;
  searchParams: Promise<{ components?: string }>;
}) {
  const path = "/" + ((await params).path ?? []).join("/");
  if (!(path in pageHeroes)) notFound();
  const showComponents = process.env.NODE_ENV === "development" && (await searchParams).components === "1";
  return <FoundationPage locale="en" path={path as PagePath} showComponents={showComponents} />;
}
