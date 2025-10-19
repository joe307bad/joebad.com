import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { SectionHeading } from "@/components/SectionHeading";
import { Chart } from "@/components/Chart";
import { ScatterPlot } from "@/components/ScatterPlot";
import { LineChart } from "@/components/LineChart";
import { HorizontalBarChart } from "@/components/HorizontalBarChart";
import { EnhancedChart } from "@/components/EnhancedChart";
import { EnhancedScatterPlot } from "@/components/EnhancedScatterPlot";
import { format } from "date-fns";
import { Main } from "@/components/Main";
import remarkGfm from "remark-gfm";
import "../../page.css";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkSubSuper from "remark-supersub";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { Sticky } from "@/components/Sticky";
import { ScrollToHash } from "@/components/ScrollToHash";
import { WeeklyPerformanceChart } from "@/components/02-fantasy-breakout-charts";
import { WeeklyDataTable } from "@/components/02-fantasy-breakout-charts/WeeklyDataTable";
import Link from "next/link";

// Generate static params for all MDX files
export async function generateStaticParams() {
  const notesDirectory = path.join(process.cwd(), "src/content/note");
  const filenames = fs.readdirSync(notesDirectory);

  return filenames
    .filter((name) => name.endsWith(".mdx"))
    .map((name) => {
      const fullPath = path.join(notesDirectory, name);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);

      return {
        slug: data.slug || name.replace(".mdx", ""),
      };
    });
}

async function getNoteBySlug(slug: string) {
  const notesDirectory = path.join(process.cwd(), "src/content/note");
  const filenames = fs.readdirSync(notesDirectory);

  for (const filename of filenames) {
    if (!filename.endsWith(".mdx")) continue;

    const fullPath = path.join(notesDirectory, filename);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    const noteSlug = data.slug || filename.replace(".mdx", "");

    if (noteSlug === slug) {
      return {
        frontmatter: data,
        content: content,
        slug: noteSlug,
      };
    }
  }

  return null;
}

export async function generateMetadata({
  params: p,
}: {
  params: Promise<Record<string, string>>;
}) {
  const params = await p;
  const note = await getNoteBySlug(params.slug).then((p) => p?.frontmatter);

  if (!note) {
    return {
      title: "Post Not Found",
      description: "The requested blog note could not be found.",
    };
  }

  const baseUrl = "https://joebad.com";
  const noteUrl = `${baseUrl}/note/${params.slug}`;
  
  return {
    // Basic metadata
    title: `${note.title}`,
    description: note.subTitle,
    keywords: note.tags?.join(", "),
    authors: [{ name: "Joe Badaczewski" }],
    creator: "Joe Badaczewski",
    publisher: "joebad.com",

    // Canonical URL
    alternates: {
      canonical: noteUrl,
    },

    // Open Graph
    openGraph: {
      type: "article",
      title: note.title,
      description: note.subTitle,
      url: noteUrl,
      siteName: "https://joebad.com",
      images: [
        {
          url: `https://joebad.com/joe.png`,
          width: 1200,
          height: 630,
          alt: note.title,
        },
      ],
      locale: "en_US",
      publishedTime: note.publishedAt,
      modifiedTime: note.updatedAt,
      authors: ["Joe Badaczewski"],
      section: note.category,
      tags: note.tags,
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: note.title,
      description: note.subTitle,
      images: [ `https://joebad.com/joe.png` ],
      creator: "@joe307bad",
      site: "joebad.com",
    },

    // Additional SEO
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

    // Schema.org structured data
    other: {
      "article:published_time": note.publishedAt,
      "article:modified_time": note.updatedAt,
      "article:author": "Joe Badaczewski",
      "article:section": note.category,
      "article:tag": note.tags?.join(","),
    },
  };
}

// Page component
export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const note = await getNoteBySlug((await params).slug);

  if (!note) {
    notFound();
  }

  return (
    <>
      <ScrollToHash />
      <Main
        title="  A note by Joe Badaczewski"
        isPage
        activePage="notebook"
      >
        <article>
          <div className="pb-20 flex gap-4 flex-col">
            <SectionHeading>note</SectionHeading>
            <h1 className="text-2xl font-bold font-mono">
              {note.frontmatter.title}
            </h1>
            <h2 className="font-mono text-lg">{note.frontmatter.subTitle}</h2>
            <div className="flex">
              <p className="text-sm text-(--color-text) font-mono pr-2">
                Published on {" "}
                <time
                  dateTime={note.frontmatter.publishedAt}
                  className="text-sm text-(--color-text)"
                >
                  {format(note.frontmatter.publishedAt, "EEEE, MMMM dd, yyyy")}
                </time>
                 {"  "}//  Written by <Link href="/cv">Joe Badaczewski</Link>
              </p>
            </div>
            <div className="border-t-2 border-dotted border-(--color-primary-500) py-2 mt-4"></div>
            <MDXRemote
              source={note.content}
              components={{
                SectionHeading,
                Chart,
                ScatterPlot,
                LineChart,
                HorizontalBarChart,
                EnhancedChart,
                EnhancedScatterPlot,
                Sticky,
                WeeklyPerformanceChart,
                WeeklyDataTable,
              }}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm, remarkSubSuper, remarkMath],
                  rehypePlugins: [
                    rehypeSlug,
                    rehypeKatex,
                    [
                      rehypeAutolinkHeadings,
                      {
                        behavior: "prepend",
                        content: [{ type: "text", value: "# " }],
                      },
                    ],
                  ],
                },
              }}
            />
          </div>
        </article>
      </Main>
    </>
  );
}
