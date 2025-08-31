// src/app/cv/page.tsx
import { MDXRemote } from "next-mdx-remote/rsc";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { SectionHeading } from "@/components/SectionHeading";
import { Main } from "@/components/Main";
import "../page.css";

export const metadata = {
  // Basic metadata
  title: "Joe Badaczewski - CV & Professional Experience | Senior Software Engineer",
  description:
    "View Joe Badaczewski's comprehensive CV and professional experience as a senior software engineer. Expertise in web application performance, distributed systems, and user interface design.",
  keywords: "Joe Badaczewski CV, resume, senior software engineer, professional experience, web development, distributed systems, UI design, career history",

  // Canonical URL
  alternates: {
    canonical: "https://joebad.com/cv",
  },

  // Open Graph
  openGraph: {
    type: "profile",
    title: "Joe Badaczewski - CV & Professional Experience",
    description:
      "View Joe Badaczewski's comprehensive CV and professional experience as a senior software engineer. Expertise in web application performance, distributed systems, and user interface design.",
    url: "https://joebad.com/cv",
    siteName: "joebad.com",
    images: [
      {
        url: `https://joebad.com/joe.png`,
        width: 1200,
        height: 630,
        alt: 'Joe Badaczewski - Senior Software Engineer',
      },
    ],
    locale: "en_US",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Joe Badaczewski - CV & Professional Experience",
    description:
      "View Joe Badaczewski's comprehensive CV and professional experience as a senior software engineer. Expertise in web application performance, distributed systems, and user interface design.",
    images: [
      {
        url: `https://joebad.com/joe.png`,
        width: 1200,
        height: 630,
        alt: 'Joe Badaczewski - Senior Software Engineer',
      },
    ],
    creator: "@joe307bad",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Additional structured data hints
  other: {
    "profile:first_name": "Joe",
    "profile:last_name": "Badaczewski",
    "profile:username": "joe307bad",
  },
};

export default async function CVPage() {
  const filePath = path.join(process.cwd(), "src/content/cv.mdx");
  const fileContent = fs.readFileSync(filePath, "utf8");

  const { content } = matter(fileContent);

  return (
    <Main isPage activePage="cv">
      <MDXRemote source={content} components={{ SectionHeading }} />
    </Main>
  );
}
