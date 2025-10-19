// src/app/cv/page.tsx
import { MDXRemote } from "next-mdx-remote/rsc";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { SectionHeading } from "@/components/SectionHeading";
import { Main } from "@/components/Main";
import "../page.css";
import { Note } from "@/types/Note";
import { format } from "date-fns";

async function getNotes(): Promise<Note[]> {
  const contentDir = path.join(process.cwd(), "src/content/note");
  const files = fs.readdirSync(contentDir);

  const notes = files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const filePath = path.join(contentDir, file);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data: frontMatter } = matter(fileContent);

      return {
        slug: file.replace(".mdx", ""),
        publishedAt: frontMatter.publishedAt,
        ...frontMatter,
      };
    })
    .sort((a, b) => b.publishedAt - a.publishedAt);

  return notes;
}

export const metadata = {
  // Basic metadata
  title: "Joe Badaczewski - Quick thoughts on software, movies, TV, comics and sports | Senior Software Engineer",
  description:
    "View Joe Badaczewski's notebook where he writes short and quick analysis on sports, reviews on movies and TV shows, and general thoughts on software and technology.",
  keywords: "Joe Badaczewski notebook",

  // Canonical URL
  alternates: {
    canonical: "https://joebad.com/notes",
  },

  // Open Graph
  openGraph: {
    type: "profile",
    title: "Joe Badaczewski - Notebook",
    description:
    "View Joe Badaczewski's notebook where he writes short and quick analysis on sports, reviews on movies and TV shows, and general thoughts on software and technology.",
    url: "https://joebad.com/notes",
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
    title: "Joe Badaczewski - Notebook",
    description:
    "View Joe Badaczewski's notebook where he writes short and quick analysis on sports, reviews on movies and TV shows, and general thoughts on software and technology.",
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

export default async function NotesPage() {
  const notes = await getNotes();

  return (
      <Main title="  Welcome, my name is Joe Badaczewski" isPage activePage="notebook">
        <SectionHeading>notebook</SectionHeading>
        <h2>Joe's notebook. A collection of short analyses and opinion.</h2>
        <div className="flex flex-col">
          <div>
            {notes.map((note, i) => (
              <div key={i} className="flex md:gap-8 gap-2 font-mono pb-2">
                <div>
                  <p>
                    <b>{notes.length - i}.</b>
                  </p>
                </div>{" "}
                <div className="whitespace-nowrap">
                  <p>{format(note.publishedAt ?? 0, "yyyy-MM-dd")}</p>
                </div>{" "}
                <div className="truncate">
                  <a href={`/note/${note.slug}`}>{note.title}</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Main>
  );
}
