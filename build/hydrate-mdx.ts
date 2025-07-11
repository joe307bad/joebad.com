import esbuild, { BuildResult } from "esbuild";
import { writeFileSync, unlinkSync } from "fs";
import { readFile } from "fs/promises";
import { renderToString } from "react-dom/server";
import React from "react";
import { getHtml } from "./utils/getHtml";
import { RSSData } from "./types";
import mdx from "@mdx-js/esbuild";
import { SectionHeading } from "../src/components/SectionHeading";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { Main } from "../src/components/Main";

interface AppComponent {
  default: React.ComponentType;
}

export async function buildWithSSR(
  file: string,
  rssData?: RSSData,
  css?: string
): Promise<void> {
  if (css) {
    css += await readFile("src/styles/page.css", "utf-8");
  }

  // Step 1: Build server version for SSR
  const serverBuild: BuildResult = await esbuild.build({
    entryPoints: [file],
    outfile: "dist/server.js",
    format: "esm",
    jsx: "automatic",
    target: "node16",
    platform: "node",
    bundle: true,
    external: ["react", "react-dom"],
    plugins: [
      mdx({
        remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
        jsxImportSource: "react",
        development: false,
      }),
    ],
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    write: false,
  });

  // Step 2: Build client version for hydration
  await esbuild.build({
    entryPoints: ["src/client-mdx.tsx"],
    outfile: "dist/client-mdx.js",
    format: "iife",
    jsx: "automatic",
    target: "es2020",
    platform: "browser",
    bundle: true,
    minify: true,
    plugins: [
      mdx({
        remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
        jsxImportSource: "react",
        development: false,
      }),
    ],
    define: {
      "process.env.NODE_ENV": '"production"',
    },
  });

  // Step 3: Generate static HTML
  const serverCode: string = serverBuild.outputFiles![0].text;
  const tempPath: string = "./temp-server-mdx.mjs";
  writeFileSync(tempPath, serverCode);

  try {
    const { default: App }: AppComponent = await import(
      // @ts-ignore
      "../temp-server-mdx.mjs"
    );
    const items = JSON.parse(JSON.stringify(rssData?.items ?? []));
    const data = { rssData: { items } };

    // Use MDXProvider consistently with client-side

    const htmlContent = React.createElement(App, {
      components: { SectionHeading },
    } as any);
    const wrapper = renderToString(
      React.createElement(Main, { children: htmlContent, activePage: "cv" })
    );

    const html = await getHtml(
      css ?? "",
      wrapper,
      `<script>window.__INITIAL_DATA__ = ${JSON.stringify(data)};</script>
       <script src="client-mdx.js"></script>`,
      data.rssData
    );

    writeFileSync("dist/cv.html", html);
    console.log(
      "✅ CV | Static HTML generated with MDX and hydration support!"
    );
  } finally {
    unlinkSync(tempPath);
  }
}
