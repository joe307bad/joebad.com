export interface BlogPostSEO {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  modifiedDate?: string;
  author?: string;
  tags?: string[];
  imageUrl?: string;
  imageAlt?: string;
}
