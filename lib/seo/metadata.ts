import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

interface BuildMetadataOptions {
  title?: string;
  description?: string;
  /** Path beginning with "/" — used for canonical + og:url. */
  path: string;
  image?: string;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  noIndex?: boolean;
}

export const absoluteUrl = (path = "/") => `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;

/** Consistent page metadata: title, description, canonical, Open Graph and Twitter. */
export function buildMetadata({
  title,
  description = siteConfig.description,
  path,
  image = siteConfig.defaultOgImage,
  keywords,
  type = "website",
  publishedTime,
  noIndex,
}: BuildMetadataOptions): Metadata {
  const fullTitle = title ? `${title} | ${siteConfig.name}` : `${siteConfig.name} | Recruitment & Business Solutions in the UAE`;
  return {
    title: title ?? { absolute: fullTitle },
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      title: fullTitle,
      description,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images: [{ url: image, width: 1200, height: 630, alt: siteConfig.name }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
    robots: noIndex ? { index: false, follow: true } : undefined,
  };
}
