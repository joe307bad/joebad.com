import fs from 'fs';
import path from 'path';
import matter from 'gray-matter'
import { format } from 'date-fns';

interface FrontmatterData {
  [key: string]: any;
  // Common frontmatter fields you might expect
  title?: string;
  date?: string;
  author?: string;
  tags?: string[];
  description?: string;
  slug?: string;
}

type PostData = {
  slug: string;
  filePath: string;
} & FrontmatterData

interface WithPostsProps {
  posts: PostData[];
}


export async function getBlogPageProps(): Promise<WithPostsProps> {
  try {
    // Get all markdown files from the posts directory
    const postsPath = path.join(process.cwd(), "src/content/posts");
    const files = fs.readdirSync(postsPath);
    const markdownFiles = files.filter(file => file.endsWith('.md') || file.endsWith('.mdx'));

    // Process each markdown file
    const posts: PostData[] = [];

    for (const file of markdownFiles) {
      const filePath = path.join(postsPath, file);
      const fileContents = fs.readFileSync(filePath, 'utf8');

      // Parse frontmatter using gray-matter
      const { data: frontmatter } = matter(fileContents);

      // Generate slug from filename (remove extension)
      const slug = file.replace(/\.(md|mdx)$/, '');

      posts.push({
        ...frontmatter,
        date: format(frontmatter.publishedAt, 'yyyy-MM-dd'),
        slug,
        filePath: path.relative(process.cwd(), filePath)
      });
    }

    // Sort posts by date if available (newest first)
    posts.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });

    return { posts }

  } catch (error) {
    return { posts: [] }
  }
}