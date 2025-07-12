import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { SectionHeading } from "@/components/SectionHeading";
import { format } from "date-fns";
import { Main } from "@/components/Main";
import { remark } from "remark";
import remarkHtml from "remark-html";
import "../../../page.css";
import Head from "next/head";

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
      // Process markdown content with remark
      const processedContent = await remark().use(remarkHtml).process(content);

      return {
        frontmatter: data,
        content: processedContent.toString(),
        rawContent: content, // Keep original content if needed
        slug: postSlug,
      };
    }
  }

  return null;
}


export async function generateMetadata({ params }: { params: any }) {
  const post = await getPostBySlug((await params).slug);
  const seo = post?.frontmatter ?? {};
  const canonicalUrl = `https://joebad.com.com/post/${params.slug}`; // or however you construct your URL

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: seo.title,
    description: seo.description,
    author: {
      "@type": "Person",
      name: "Joe Badaczewski",
    },
    datePublished: seo.publishedAt,
    ...(seo.modifiedDate && { dateModified: seo.modifiedDate }),
    url: canonicalUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    ...(seo.imageUrl && {
      image: {
        "@type": "ImageObject",
        url: seo.imageUrl,
        ...(seo.imageAlt && { caption: seo.imageAlt }),
      },
    }),
  };

  return {
    title: seo.title,
    description: seo.description,
    other: {
      "script:ld+json": JSON.stringify(jsonLd),
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
  const title = `${post?.frontmatter.title} - Joe Badaczewski`;
  const canonicalUrl = `https://joebad.com/post/${post.slug}`;

  if (!post) {
    notFound();
  }

  return (
    <>
      <Head>
        <head>
          <meta charSet="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />

          <title>{title}</title>
          <meta name="description" content={post.frontmatter.subTitle} />
          <meta name="author" content="Joe Badaczewski" />

          <link rel="canonical" href={canonicalUrl} />

          <meta
            property="article:published_time"
            content="${seo.publishedAt}"
          />
          <meta property="article:author" content="Joe Badaczewski" />

          <meta property="og:type" content="article" />
          <meta property="og:title" content={canonicalUrl} />
          <meta property="og:description" content={post.frontmatter.subTitle} />
          <meta property="og:url" content={canonicalUrl} />
          <meta
            property="og:site_name"
            content="Joe Badaczewski - Senior Software Engineer"
          />
          <meta property="og:locale" content="en_US" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={title} />
          <meta
            name="twitter:description"
            content={post.frontmatter.subTitle}
          />
          <meta name="twitter:creator" content="@joe307bad" />
        </head>
      </Head>
      <Main activePage={post.slug}>
        <article>
          <div className="pb-20 flex gap-4 flex-col">
            <SectionHeading>post</SectionHeading>
            <h1 className="text-2xl font-bold font-mono">
              {post.frontmatter.title}
            </h1>
            <h2 className="font-mono text-lg">
              {format(post.frontmatter.publishedAt, "yyyy-MM-dd")} •{" "}
              {post.frontmatter.subTitle}
            </h2>
            <div className="border-t-2 border-dotted border-(--color-primary-500) py-2 mt-4"></div>
            <MDXRemote source={post.content} components={{ SectionHeading }} />
          </div>
        </article>
      </Main>
    </>
  );
}
