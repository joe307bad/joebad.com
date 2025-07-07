import { DetailedReactHTMLElement, ReactNode } from "react";

export interface PageData {
  slug: string;
  title: string;
  content: string;
  component?: (...args) => DetailedReactHTMLElement<any, any>;
  componentString?: string;
  frontmatter: Record<string, any>;
  type: "markdown" | "react" | "blog-post" | "index";
  seo?: BlogPostSEO
}

export interface RSSItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  guid?: string;
}

export interface RSSData {
  title: string;
  description: string;
  link: string;
  items: RSSItem[];
}

export interface BlogPostSEO {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  modifiedDate?: string;
  author?: string;
  tags?: string[];
  imageUrl?: string;
  imageAlt?: string;
}
