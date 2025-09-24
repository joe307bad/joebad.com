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
  const postsDirectory = path.join(process.cwd(), "src/content/post");
  const filenames = fs.readdirSync(postsDirectory);

  return filenames
    .filter((name) => name.endsWith(".mdx"))
    .map((name) => {
      const fullPath = path.join(postsDirectory, name);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);

      return {
        slug: data.slug || name.replace(".mdx", ""),
      };
    });
}

async function getPostBySlug(slug: string) {
  const postsDirectory = path.join(process.cwd(), "src/content/post");
  const filenames = fs.readdirSync(postsDirectory);

  for (const filename of filenames) {
    if (!filename.endsWith(".mdx")) continue;

    const fullPath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    const postSlug = data.slug || filename.replace(".mdx", "");

    if (postSlug === slug) {
      return {
        frontmatter: data,
        content: content,
        slug: postSlug,
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
  const post = await getPostBySlug(params.slug).then((p) => p?.frontmatter);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  const baseUrl = "https://joebad.com";
  const postUrl = `${baseUrl}/post/${params.slug}`;
  // const imageUrl = post.featuredImage
  //   ? `${baseUrl}${post.featuredImage}`
  //   : `${baseUrl}/default-og-image.jpg`;

  return {
    // Basic metadata
    title: `${post.title}`,
    description: post.subTitle,
    keywords: post.tags?.join(", "),
    authors: [{ name: "Joe Badaczewski" }],
    creator: "Joe Badaczewski",
    publisher: "joebad.com",

    // Canonical URL
    alternates: {
      canonical: postUrl,
    },

    // Open Graph
    openGraph: {
      type: "article",
      title: post.title,
      description: post.subTitle,
      url: postUrl,
      siteName: "https://joebad.com",
      images: [
        {
          url: `https://joebad.com/joe.png`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: "en_US",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: ["Joe Badaczewski"],
      section: post.category,
      tags: post.tags,
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.subTitle,
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
      "article:published_time": post.publishedAt,
      "article:modified_time": post.updatedAt,
      "article:author": "Joe Badaczewski",
      "article:section": post.category,
      "article:tag": post.tags?.join(","),
    },
  };
}

// Page component
export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = await getPostBySlug((await params).slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <ScrollToHash />
      <Main
        title="  Applied software research"
        isPage
        activePage={post.slug}
      >
        <article>
          <div className="pb-20 flex gap-4 flex-col">
            <SectionHeading>post</SectionHeading>
            <h1 className="text-2xl font-bold font-mono">
              {post.frontmatter.title}
            </h1>
            <h2 className="font-mono text-lg">{post.frontmatter.subTitle}</h2>
            <div className="flex">
              <p className="text-sm text-(--color-text) font-mono pr-2">
                Published on {" "}
                <time
                  dateTime={post.frontmatter.publishedAt}
                  className="text-sm text-(--color-text)"
                >
                  {format(post.frontmatter.publishedAt, "EEEE, MMMM dd, yyyy")}
                </time>
                 {"  "}//  Written by <Link href="/cv">Joe Badaczewski</Link>
              </p>
            </div>
            <div className="border-t-2 border-dotted border-(--color-primary-500) py-2 mt-4"></div>
            <MDXRemote
              source={post.content}
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
