import { allPosts } from "contentlayer/generated";
import { useMDXComponent } from "next-contentlayer/hooks";
import SampleComponent from "../../components/SampleComponent";
import { NextIntlClientProvider } from "next-intl";
import Header from "../../components/layout/Header";
import Page from "../../components/Page";
import Head from "../../components/Head";
import { useEffect, useState } from "react";
import BlogHeaderV2 from "../../components/layout/BlogHeaderV2";
import { format } from "date-fns";
import Link from "next/link";

const usedcomponents = {
  SampleComponent,
};
const SinglePost = ({ post }) => {
  const MDXContent = useMDXComponent(post.body.code);

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return null;
  }

  return (
    <NextIntlClientProvider locale="en-US">
      <Head />
      <Page>
        <BlogHeaderV2 />
        <h1 className="text-xl pb-2">{post.title}</h1>
        <h2 className="pb-2">{post.subTitle}</h2>
        <div className="pb-[40px] space-x-2 flex items-center">
          <div className="flex items-center space-x-1">
            <p className="text-sm truncate">{post.publishedAt}</p>
          </div>
          <div>◆</div>
          <div className="overflow-hidden truncate items-center">
            <Link target="_blank" className="text-sm block" href={post.mainLink}>
              {post.mainLink}
            </Link>
          </div>
          <div>◆</div>
          <div className="overflow-hidden items-center">
            <Link className="text-sm block" href="/blog">
              Back to blog
            </Link>
          </div>
        </div>
        <MDXContent components={usedcomponents} />
      </Page>
    </NextIntlClientProvider>
  );
};
export default SinglePost;

export async function getStaticPaths() {
  return {
    paths: allPosts.map((article) => ({
      params: { slug: article.slug },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = allPosts.find((article) => article.slug === params.slug);

  return {
    props: {
      post: {
        ...post,
        publishedAt: format(new Date(post.publishedAt), "MMM do, y"),
      },
    },
  };
}
