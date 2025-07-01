import fs, { readFile } from "fs/promises";
import path from "path";
import { glob } from "glob";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { exec } from "child_process";
import { promisify } from "util";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createRequire } from "module";
import { XMLParser } from "fast-xml-parser";
import { compile } from "@mdx-js/mdx";

const execAsync = promisify(exec);
const require = createRequire(import.meta.url);

interface PageData {
  slug: string;
  title: string;
  content: string;
  frontmatter: Record<string, any>;
  type: "markdown" | "react";
}

interface RSSItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  guid?: string;
}

interface RSSData {
  title: string;
  description: string;
  link: string;
  items: RSSItem[];
}

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

async function compileMDX(inputPath: string): Promise<PageData> {
  const mdxSource = await readFile(inputPath, "utf8");
  const { data: frontmatter, content: mdxContent } = matter(mdxSource);

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
      },
    });
    const htmlContent = renderToStaticMarkup(reactElement);

    // Clean up temp file
    await fs.unlink(tempFile).catch(() => {});

    const slug = path.basename(inputPath, ".mdx");

    return {
      slug,
      title: frontmatter.title || slug,
      content: htmlContent,
      frontmatter,
      type: "markdown",
    };
  } catch (error) {
    console.error(`❌ Error compiling MDX ${inputPath}:`, error);

    // Clean up temp file on error
    await fs.unlink(tempFile).catch(() => {});

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
  rssData?: RSSData
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

    if (isTypeScript) {
      await execAsync(esbuildConfig);
    } else {
      // For JSX files, also use esbuild with same config
      await execAsync(esbuildConfig);
    }

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

    // Pass RSS data as props if available
    const props = rssData ? { rssData } : {};

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
    await fs.unlink(tempFile).catch(() => {});

    return {
      slug,
      title,
      content: htmlContent,
      frontmatter: metadata,
      type: "react",
    };
  } catch (error) {
    console.error(`❌ Error processing React component ${filePath}:`, error);

    // Clean up temp file on error
    await fs.unlink(tempFile).catch(() => {});

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
function createHtmlTemplate(
  title: string,
  content: string,
  css: string,
  pageType: "markdown" | "react" = "markdown"
): string {
  // For React pages, don't wrap in prose classes as they likely have their own styling
  const contentWrapper =
    pageType === "react"
      ? content
      : `
    <article class="prose-custom">
      ${content}
    </article>
  `;

  return `<!DOCTYPE html>
<html lang="en" class="h-full w-full p-2 bg-[#FFECD1]">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${css}</style>
    <!-- Basic Meta Tags -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    
    <!-- Primary SEO Tags -->
    <title>Joe Badaczewski - Senior Software Engineer</title>
    <meta name="description" content="Joe Badaczewski is a senior software development engineer focused on application performance, distributed systems, and user interface design.">

    <link rel="canonical" href="https://joebad.com">
    
    <!-- Open Graph Meta Tags (Social Media) -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="Joe Badaczewski - Senior Software Engineer">
    <meta property="og:description" content="Joe Badaczewski is a senior software development engineer focused on application performance, distributed systems, and user interface design.">
    <meta property="og:url" content="https://joebad.com">
    <meta property="og:site_name" content="Joe Badaczewski - Senior Software Engineer">
    <meta property="og:locale" content="en_US">
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Joe Badaczewski - Senior Software Engineer">
    <meta name="twitter:description" content="Joe Badaczewski is a senior software development engineer focused on application performance, distributed systems, and user interface design.">
    <meta name="twitter:creator" content="@joe307bad">
    
</head>
</head>
<body class="h-full w-full">
    <main class="flex justify-center">
      ${contentWrapper}
    </main>
</body>
</html>`;
}

// Main build function
async function build() {
  console.log(
    "🏗️  Building static site with Tailwind, React support, and RSS feeds..."
  );

  // Ensure dist directory exists
  await fs.rmdir("dist", { recursive: true });
  await fs.mkdir("dist", { recursive: true });

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
  console.log("⚛️  Processing React components...");
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
    let contentWithMeta = pageData.content;

    // Add metadata for markdown files
    if (
      pageData.type === "markdown" &&
      Object.keys(pageData.frontmatter).length > 0
    ) {
      const metaHtml = `
        <div class="page-meta mb-6 p-4 bg-gray-100 rounded-lg">
          ${Object.entries(pageData.frontmatter)
            .filter(([key]) => key !== "title")
            .map(
              ([key, value]) =>
                `<span class="inline-block mr-4"><strong>${key}:</strong> ${value}</span>`
            )
            .join("")}
        </div>
      `;
      contentWithMeta = metaHtml + pageData.content;
    }

    const html = createHtmlTemplate(
      pageData.title,
      contentWithMeta,
      css,
      pageData.type
    );

    // Write HTML file
    const outputPath = path.join("dist", `${pageData.slug}.html`);
    await fs.writeFile(outputPath, html);

    console.log(`✅ Generated: ${outputPath}`);
  }

  // Clean up temp directory
  await fs.rmdir("temp", { recursive: true }).catch(() => {});

  console.log("🎉 Build complete!");
  console.log(
    `📊 Generated ${pages.length} pages (${
      pages.filter((p) => p.type === "markdown").length
    } Markdown, ${
      pages.filter((p) => p.type === "react").length
    } React) with Tailwind CSS and RSS data`
  );
}

// Run build if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  build().catch(console.error);
}

export {
  build,
  processMarkdown,
  processReactPage,
  createHtmlTemplate,
  fetchRSSFeed,
};
