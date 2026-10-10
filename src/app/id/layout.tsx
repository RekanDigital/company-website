import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Document } from "@/components/document";

export const metadata: Metadata = {
  title: { default: "RekanMU — PT Rekan Makmur Utama", template: "%s | RekanMU" },
  robots: { index: false, follow: false },
  icons: { icon: "/assets/logo/logo-rekanmu.png", apple: "/assets/logo/logo-rekanmu.png" },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <Document locale="id">{children}</Document>;
}
