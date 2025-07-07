import fs, { readFile } from "fs/promises";
import path, { join } from "path";
import { glob } from "glob";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { exec } from "child_process";
import { promisify } from "util";
import React, { FC } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createRequire } from "module";
import { XMLParser } from "fast-xml-parser";
import { compile } from "@mdx-js/mdx";
import { buildWithSSR } from "./hydrate";
import { getHtml } from "./utils/getHtml";
import { getBlogPostHtml } from "./utils/getBlogPostHtml";
import { BlogPostSEO, PageData, RSSData, RSSItem } from "./types";
import { Main } from '../src/components/Main';
import { Post } from '../src/components/Post';
import { SectionHeading } from '../src/components/SectionHeading'
import { getBlogPageProps } from "./utils/getBlogPageProps";
import { format } from "date-fns";

const execAsync = promisify(exec);
const require = createRequire(import.meta.url);

// Markdown processor
const processor = remark().use(html);

// Fetch and parse RSS feed
async function fetchRSSFeed(url: string): Promise<RSSData> {
  console.log(`📡 Fetching RSS feed: ${url}`);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const xmlText = await response.text();

    // Simple RSS parser (you might want to use a proper XML parser like 'fast-xml-parser')
    const rssData = parseRSS(xmlText);

    console.log(`✅ RSS feed fetched: ${rssData.items.length} items`);
    return rssData;
  } catch (error) {
    console.error(`❌ Error fetching RSS feed:`, error);
    throw error;
  }
}

// RSS parser using fast-xml-parser
function parseRSS(xmlText: string): RSSData {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    parseTagValue: true,
    parseAttributeValue: true,
    trimValues: true,
    alwaysCreateTextNode: false,
    isArray: (name, jpath, isLeafNode, isAttribute) => {
      // Always treat 'item' as an array to handle single or multiple items consistently
      return name === "item";
    },
  });

  try {
    const result = parser.parse(xmlText);

    // Handle different RSS structures (RSS 2.0, Atom, etc.)
    const channel = result.rss?.channel || result.feed;

    if (!channel) {
      throw new Error("Invalid RSS/Atom feed structure");
    }

    // Extract feed metadata
    const title = channel.title || "RSS Feed";
    const description = channel.description || channel.subtitle || "";
    const link = channel.link?.["@_href"] || channel.link || "";

    // Extract items (RSS) or entries (Atom)
    const rawItems = channel.item || channel.entry || [];
    const itemsArray = Array.isArray(rawItems) ? rawItems : [rawItems];

    const items: RSSItem[] = itemsArray.map((item: any) => {
      // Handle both RSS and Atom formats
      const itemTitle = item.title || "Untitled";
      const itemLink = item.link?.["@_href"] || item.link || "";
      const itemDescription =
        item.description || item.summary || item.content || "";
      const itemPubDate = item.pubDate || item.published || item.updated || "";
      const itemGuid = item.guid?.["#text"] || item.guid || item.id;

      // Clean up description if it's an object (sometimes happens with CDATA)
      let cleanDescription = "";
      if (typeof itemDescription === "string") {
        cleanDescription = itemDescription;
      } else if (itemDescription && typeof itemDescription === "object") {
        cleanDescription =
          itemDescription["#text"] || itemDescription.toString();
      }

      // Clean up title if it's an object
      let cleanTitle = "";
      if (typeof itemTitle === "string") {
        cleanTitle = itemTitle;
      } else if (itemTitle && typeof itemTitle === "object") {
        cleanTitle = itemTitle["#text"] || itemTitle.toString();
      }

      return {
        title: cleanTitle,
        link: itemLink,
        description: cleanDescription,
        pubDate: itemPubDate,
        guid: itemGuid,
        contentType: item.contentType,
        sha: item.sha,
        repo: item.repo,
      };
    });

    return {
      title: typeof title === "string" ? title : title?.["#text"] || "RSS Feed",
      description:
        typeof description === "string"
          ? description
          : description?.["#text"] || "",
      link: typeof link === "string" ? link : link?.["#text"] || "",
      items: items.filter((item) => item.title && item.title !== "Untitled"), // Filter out empty items
    };
  } catch (error: any) {
    console.error("Error parsing RSS XML:", error);
    throw new Error(`Failed to parse RSS feed: ${error.message}`);
  }
}

let numberOfPosts = 0;

// Compile MDX files
async function compileMDX(inputPath: string): Promise<PageData> {
  const mdxSource = await readFile(inputPath, "utf8");
  const { data: frontmatter, content: mdxContent } = matter(mdxSource);

  // c.compileMDX
  // Compile MDX to JavaScript
  const compiled = await compile(mdxContent, {
    outputFormat: "program",
    development: false,
    jsxImportSource: "react",
  });

  // Create a temporary file to execute the compiled MDX
  const tempDir = "temp";
  const tempFile = path.join(tempDir, "temp-mdx.mjs");

  try {
    // Ensure temp directory exists
    await fs.mkdir(tempDir, { recursive: true });
    await fs.mkdir("dist/post", { recursive: true });

    // Create the executable module
    // Use 'program' output format to get a complete ES module
    const moduleContent = compiled.toString();

    await fs.writeFile(tempFile, moduleContent);

    // Import and execute the compiled MDX
    const moduleUrl = `file://${path.resolve(tempFile)}?t=${Date.now()}`;
    const module = await import(moduleUrl);

    const MDXComponent = module.default;

    if (!MDXComponent || typeof MDXComponent !== "function") {
      throw new Error(`No default export found in compiled MDX: ${inputPath}`);
    }

    // Render to HTML
    const reactElement = React.createElement(MDXComponent, {
      components: {
        Accomplishment: (props: any) => props.children,
        Position: (props: any) => props.children,
        SectionHeading: SectionHeading
      },
    });


    const isPost = inputPath.includes("posts");

    if (isPost) {
      numberOfPosts++;
    }

    const post = isPost
      ? React.createElement(Post, { children: reactElement, post: { ...frontmatter, number: numberOfPosts.toString(), date: format(frontmatter.publishedAt, 'yyyy-MM-dd') } })
      : reactElement;

    const slug = path.basename(inputPath, ".mdx");

    const wrapper = React.createElement(Main, { children: post, activePage: slug });
    const htmlContent = renderToStaticMarkup(wrapper);

    // Clean up temp file
    await fs.unlink(tempFile).catch(() => { });

    const postProperties: { type: PageData['type'], seo: BlogPostSEO } = {
      type: 'blog-post',
      seo: {
        description: frontmatter.subTitle,
        title: frontmatter.title,
        publishedAt: frontmatter.publishedAt,
        slug
      }
    }

    return {
      slug,
      title: frontmatter.title || slug,
      content: htmlContent,
      frontmatter,
      type: 'markdown',
      ...(isPost ? postProperties : {})
    };
  } catch (error) {
    console.error(`❌ Error compiling MDX ${inputPath}:`, error);

    // Clean up temp file on error
    await fs.unlink(tempFile).catch(() => { });

    throw error;
  }
}

// Process markdown files
async function processMarkdown(filePath: string): Promise<PageData> {
  const fileContent = await fs.readFile(filePath, "utf-8");
  const { data: frontmatter, content } = matter(fileContent);

  const processedContent = await processor.process(content);
  const htmlContent = processedContent.toString();

  const slug = path.basename(filePath, ".md");

  return {
    slug,
    title: frontmatter.title || slug,
    content: htmlContent,
    frontmatter,
    type: "markdown",
  };
}

// Compile and process React/TSX files with RSS data
async function processReactPage(
  filePath: string,
  rssData?: RSSData,
  hydrate?: boolean
): Promise<PageData> {

  console.log(`🔄 Compiling React component: ${filePath}`);

  // Create a temporary JS file for compilation
  const relativePath = path.relative(process.cwd(), filePath);
  const tempDir = "temp";
  const tempFile = path.join(
    tempDir,
    path.basename(filePath, path.extname(filePath)) + ".js"
  );

  try {
    // Ensure temp directory exists
    await fs.mkdir(tempDir, { recursive: true });

    // Compile TSX to JS using esbuild or tsc
    const isTypeScript = filePath.endsWith(".tsx") || filePath.endsWith(".ts");

    // Create esbuild configuration with proper path resolution
    const esbuildConfig = [
      `npx esbuild ${relativePath}`,
      `--outfile=${tempFile}`,
      `--format=esm`,
      `--jsx=automatic`,
      `--target=node16`,
      `--platform=node`,
      `--bundle`, // Bundle dependencies to resolve imports
      `--external:react`, // Keep React external since it's provided
      `--external:react-dom`, // Keep React DOM external
      `--resolve-extensions=.tsx,.ts,.jsx,.js`, // Resolve these extensions
      `--tsconfig=tsconfig.json`, // Use your tsconfig for path mapping if it exists
    ].join(" ");

    await execAsync(esbuildConfig);

    // Import the compiled component
    const modulePath = path.resolve(tempFile);

    // Clear module cache to ensure fresh imports
    delete require.cache[modulePath];

    // Dynamic import the compiled component
    const moduleUrl = `file://${modulePath}?t=${Date.now()}`;
    const module = await import(moduleUrl);

    const Component = module.default || module;

    if (!Component || typeof Component !== "function") {
      throw new Error(
        `No default export found or export is not a React component in ${filePath}`
      );
    }

    const props = await (async () => {
      
      if (filePath.includes(`pages${path.sep}blog`)) {
        return await getBlogPageProps();
      }

      return rssData ? { rssData } : {};

    })();

    // Render component to HTML with props
    const reactElement = React.createElement(Component, props as any);
    const htmlContent = renderToStaticMarkup(reactElement);

    // Extract metadata from component (if it has getStaticProps or similar)
    const metadata = module.metadata || {};
    const title =
      metadata.title ||
      Component.displayName ||
      path.basename(filePath, path.extname(filePath));

    const slug = path.basename(filePath, path.extname(filePath));

    // Clean up temp file
    await fs.unlink(tempFile).catch(() => { });

    return {
      slug,
      title,
      content: htmlContent,
      frontmatter: metadata,
      type: filePath.includes("index") ? "index" : "react",
    };
  } catch (error) {
    console.error(`❌ Error processing React component ${filePath}:`, error);

    // Clean up temp file on error
    await fs.unlink(tempFile).catch(() => { });

    throw error;
  }
}

async function buildTailwind(): Promise<string> {
  console.log("🎨 Building Tailwind CSS...");

  try {
    // Ensure output directory exists
    await fs.mkdir("dist/assets", { recursive: true });

    // Build Tailwind CSS
    await execAsync(
      "npx tailwindcss -i src/styles/main.css -o dist/assets/main.css --minify",
      { cwd: process.cwd() }
    );

    // Read the generated CSS
    const css = await fs.readFile("dist/assets/main.css", "utf-8");

    return css;
  } catch (error) {
    console.error("❌ Error building Tailwind CSS:", error);
    throw error;
  }
}

// HTML template wrapper with Tailwind
async function createHtmlTemplate(
  title: string,
  content: string,
  css: string,
  pageType: "index" | "markdown" | "react" | "blog-post" = "markdown",
  seo?: BlogPostSEO
): Promise<string> {
  if (pageType === "blog-post" && seo) {
    return getBlogPostHtml(css, content, seo)
  }

  // For React pages, don't wrap in prose classes as they likely have their own styling
  const contentWrapper =
    pageType === "react"
      ? content
      : `
    <article class="prose-custom">
      ${content}
    </article>
  `;

  if(pageType != "index") {
    css += await fs.readFile("src/styles/page.css", "utf-8");
  }

  return getHtml(css, contentWrapper)
}

async function deleteAndRecreateFolder(folderPath: string): Promise<void> {
  try {
    // Check if folder exists and delete it
    await fs.access(folderPath);
    await fs.rm(folderPath, { recursive: true, force: true });
  } catch (error) {
    // Folder doesn't exist, which is fine
  }

  // Create the folder (including parent directories if needed)
  await fs.mkdir(folderPath, { recursive: true });
}

// Main build function
async function build() {
  console.log(
    "🏗️  Building static site with Tailwind, React support, and RSS feeds..."
  );

  // Ensure dist directory exists
  await deleteAndRecreateFolder("dist")

  // Build Tailwind CSS first
  const css = await buildTailwind();

  // Fetch RSS data (you can configure multiple feeds here)
  let rssData: RSSData | undefined;
  const RSS_FEED_URL = process.env.RSS_FEED_URL || "https://rss.joebad.com";

  try {
    rssData = await fetchRSSFeed(RSS_FEED_URL);
  } catch (error) {
    console.warn("⚠️  RSS feed fetch failed, continuing without RSS data");
    rssData = undefined;
  }

  const pages: PageData[] = [];

  // Process markdown files
  console.log("📄 Processing Markdown files...");
  const markdownFiles = await glob("src/content/**/*.md");

  for (const file of markdownFiles) {
    const pageData = await processMarkdown(file);
    pages.push(pageData);
    console.log(`✅ Processed Markdown: ${pageData.title}`);
  }

  // Process mdx files
  console.log("📄 Processing MDX files...");
  const mdxFiles = await glob("src/content/**/*.mdx");

  for (const file of mdxFiles) {
    const pageData = await compileMDX(file);
    pages.push(pageData);
    console.log(`✅ Processed MDX: ${pageData.title}`);
  }

  // Process React/TSX files
  console.log("⚛️  Processing Pages...");
  const reactFiles = await glob("src/pages/**/*.{tsx,jsx,ts,js}");

  for (const file of reactFiles) {
    try {
      const pageData = await processReactPage(file, rssData);
      pages.push(pageData);
      console.log(`✅ Processed React: ${pageData.title}`);
    } catch (error) {
      console.error(`❌ Failed to process ${file}:`, error);
      // Continue with other files
    }
  }

  // Generate HTML files
  console.log("🔨 Generating HTML files...");
  for (const pageData of pages) {

    const html = await createHtmlTemplate(
      pageData.title,
      pageData.content,
      css,
      pageData.type,
      pageData.seo
    );

    // Write HTML file
    const outputPath = (() => {

      if (pageData.type === 'blog-post') {
        return path.join("dist/post", `${pageData.slug}.html`);
      }

      return path.join("dist", `${pageData.slug}.html`);
    })();

    await fs.writeFile(outputPath, html);

    console.log(`✅ Generated: ${outputPath}`);
  }

  await buildWithSSR("src/pages/index.tsx", rssData, css);

  // Clean up temp directory
  await fs.rmdir("temp", { recursive: true }).catch(() => { });

  console.log("🎉 Build complete!");
  console.log(
    `📊 Generated ${pages.length} pages (${pages.filter((p) => p.type === "markdown").length
    } Markdown, ${pages.filter((p) => p.type === "react").length
    } React) with Tailwind CSS and RSS data`
  );

  async function copyFile(fileName: string): Promise<void> {
    const srcPath = join('public', fileName);
    const destPath = join('dist', fileName);

    try {
      await fs.copyFile(srcPath, destPath);
      console.log(`Copied ${fileName} to dist/`);
    } catch (error) {
      console.error(`Failed to copy ${fileName}:`, error);
      throw error;
    }
  }

  copyFile("Badaczewski_CV.pdf")
  copyFile("favicon.ico")

  //await copyPublicToDist();
}

build().catch(console.error);
