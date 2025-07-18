import { Main } from "@/components/Main";
import { SectionHeading } from "@/components/SectionHeading";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import "../page.css";
import { format } from "date-fns";
import { Post } from "@/types/Post";

async function getPosts(): Promise<Post[]> {
  const contentDir = path.join(process.cwd(), "src/content/post");
  const files = fs.readdirSync(contentDir);

  const posts = files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const filePath = path.join(contentDir, file);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data: frontMatter } = matter(fileContent);

      return {
        slug: file.replace(".mdx", ""),
        ...frontMatter,
      };
    });

  return posts;
}

export const metadata = {
  // Basic metadata
  title: "Joe's digital journal",
  description:
    "Explore my digital journal where I write about building software",
  keywords: "Joe Badaczewski blog, digital journal, software engineering blog",

  // Canonical URL
  alternates: {
    canonical: "https://joebad.com/blog",
  },

  // Open Graph
  openGraph: {
    type: "website",
    title: "Joe's digital journal",
    description:
      "Explore my digital journal where I write about building software",
    url: "https://joebad.com/blog",
    siteName: "joebad.com",
    // images: [
    //   {
    //     url: "https://joebad.com/blog-og-image.jpg",
    //     width: 1200,
    //     height: 630,
    //     alt: "Joe Badaczewski's Digital Journal - Tech Blog",
    //   },
    // ],
    locale: "en_US",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Joe's digital journal",
    description:
      "Explore my digital journal where I write about building software",
    // images: ["https://joebad.com/blog-og-image.jpg"],
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
    "article:author": "Joe Badaczewski",
    "article:section": "Technology",
  },
};

export default async function BlogPage() {
  const posts: Post[] = await getPosts();

  return (
    <Main isPage activePage="blog">
      <SectionHeading>posts</SectionHeading>
      <div className="flex flex-col">
        <div>
          {posts.map((post, i) => (
            <div key={i} className="flex md:gap-8 gap-2 font-mono pb-2">
              <div>
                <p>
                  <b>{posts.length - i}.</b>
                </p>
              </div>{" "}
              <div className="whitespace-nowrap">
                <p>{format(post.publishedAt ?? 0, "yyyy-MM-dd")}</p>
              </div>{" "}
              <div className="truncate">
                <a href={`/post/${post.slug}`}>{post.title}</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Main>
  );
}
