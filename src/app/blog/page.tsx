import { Main } from "@/components/Main";
import { SectionHeading } from "@/components/SectionHeading";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import "../page.css";
import { format } from "date-fns";

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

export default async function BlogPage() {
  const posts: Post[] = await getPosts();

  return (
    <Main activePage="blog">
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
