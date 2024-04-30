import {
  defineDocumentType,
  defineNestedType,
  makeSource,
} from "contentlayer/source-files";
import readingTime from "reading-time";

const Author = defineNestedType(() => ({
  name: "Author",
  fields: {
    name: { type: "string", required: true }
  },
}));

const Article = defineDocumentType(() => ({
  name: "Article",
  filePathPattern: "articles/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    publishedAt: { type: "string", required: true },
    description: { type: "string", required: true },
    seoDescription: { type: "string", required: true },
    category: { type: "string", required: true },
    author: {
      type: "nested",
      of: Author,
    },
    image: { type: "string", required: true },
  },
  computedFields,
}));


export const Page = defineDocumentType(() => ({
  name: "Page",
  filePathPattern: `./*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true,
    },
    subtitle: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
      required: false,
    },
    published: {
      type: "date",
      required: true,
    },
    updated: {
      type: "date",
      required: false,
    },
    pinned: {
      type: "boolean",
      required: false,
    },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (post) => post._raw.sourceFileName.replace(/\.mdx$/, ""),
    },
  },
}));

const Short = defineDocumentType(() => ({
  name: "Short",
  filePathPattern: "shorts/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    publishedAt: { type: "string", required: true },
    description: { type: "string", required: true },
    seoDescription: { type: "string", required: true },
    category: { type: "string", required: true },
    tags: {
      type: "list",
      of: { type: "string" },
    },
    author: {
      type: "nested",
      of: Author,
    },
    image: { type: "string", required: false },
    subTitle: { type: "string", required: true },
  },
  computedFields,
}));

const Learning = defineDocumentType(() => ({
  name: "Learning",
  filePathPattern: "learnings/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    courseTitle: { type: "string", required: true },
    courseLink: { type: "string", required: true },
    status: { type: "string", required: true },
    publishedAt: { type: "string", required: true },
    description: { type: "string", required: true },
    seoDescription: { type: "string", required: true },
    category: { type: "string", required: true },
    tags: {
      type: "list",
      of: { type: "string" },
    },
    author: {
      type: "nested",
      of: Author,
    },
    subTitle: { type: "string", required: true },
  },
  computedFields,
}));

const computedFields = {
  readingTime: { type: "json", resolve: (doc) => readingTime(doc.body.raw) },
  wordCount: {
    type: "number",
    resolve: (doc) => doc.body.raw.split(/\s+/gu).length,
  },
  slug: {
    type: "string",
    resolve: (doc) => doc._raw.sourceFileName.replace(/\.mdx$/, ""),
  },
};

const contentLayerConfig = makeSource({
  contentDirPath: "data",
  documentTypes: [Article, Short, Page, Learning],
});
export default contentLayerConfig;
