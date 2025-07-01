import esbuild, { BuildResult } from "esbuild";
import { writeFileSync, unlinkSync } from "fs";
import { renderToString } from "react-dom/server";
import React from "react";
import { getHtml } from "./utils/getHtml";
import { RSSData } from "./types";

interface AppComponent {
  default: React.ComponentType;
}

export async function buildWithSSR(
  file: string,
  rssData?: RSSData,
  css?: string
): Promise<void> {
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
    define: {
      "process.env.NODE_ENV": '"development"',
    },
    write: false, // Don't write to disk, we'll handle it
  });

  // Step 2: Build client version for hydration
  await esbuild.build({
    entryPoints: ["src/client.tsx"], // Entry point for hydration
    outfile: "dist/client.js",
    format: "iife", // For browser
    jsx: "automatic",
    target: "es2020",
    platform: "browser",
    bundle: true,
    minify: true,
    define: {
      "process.env.NODE_ENV": '"development"',
    },
  });

  // Step 3: Generate static HTML
  const serverCode: string = serverBuild.outputFiles![0].text;

  // Create a temporary module to execute server code
  const tempPath: string = "./temp-server.mjs";
  writeFileSync(tempPath, serverCode);

  try {
    // Import and render component
    // @ts-ignore
    const { default: App }: AppComponent = await import("../temp-server.mjs");
    const cleanItems = JSON.parse(JSON.stringify(rssData?.items ?? []))
    const htmlContent: string = renderToString(
      React.createElement(App)
    );

    const html = getHtml(
      css ?? "",
      htmlContent,
      `<script src="client.js"></script>`,
      rssData
    );

    writeFileSync("dist/index.html", html);
    console.log("✅ Static HTML generated with hydration support!");
  } finally {
    // Cleanup temp file
    unlinkSync(tempPath);
  }
}
