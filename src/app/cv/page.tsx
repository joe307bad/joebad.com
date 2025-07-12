// src/app/cv/page.tsx
import { MDXRemote } from "next-mdx-remote/rsc";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { SectionHeading } from "@/components/SectionHeading";
import { Main } from "@/components/Main";
import "../page.css";

export default async function CVPage() {
  const filePath = path.join(process.cwd(), "src/content/cv.mdx");
  const fileContent = fs.readFileSync(filePath, "utf8");

  const { data, content } = matter(fileContent);

  return (
    <Main activePage="cv">
      <MDXRemote source={content} components={{ SectionHeading }} />
    </Main>
  );
}
