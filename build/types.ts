import { DetailedReactHTMLElement, ReactNode } from "react";

export interface PageData {
  slug: string;
  title: string;
  content: string;
  component?: (...args) => DetailedReactHTMLElement<any, any>;
  componentString?: string;
  frontmatter: Record<string, any>;
  type: "markdown" | "react";
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
