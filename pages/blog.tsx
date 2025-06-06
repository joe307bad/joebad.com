import { allPosts } from "contentlayer/generated";
import { NextIntlClientProvider } from "next-intl";
import Head from "../components/Head";
import Page from "../components/Page";
import BlogHeaderV2 from "../components/layout/BlogHeaderV2";
import Link from "next/link";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import H from "next/head";

const SinglePost = ({ posts }) => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return null;
  }
  return (
    <NextIntlClientProvider locale="en-US">
      <Head title="Joe's internet journal" />
            <H>
              <>
                <meta property="og:type" content="website" />
                <meta property="og:description" content="Writing about programming, comics, and sports." />
                <meta property="og:site_name" content="joebad.com" />
                <meta property="og:title" content="Joe's journal" />
                <meta
                  property="og:url"
                  content={`https://joebad.com/blog`}
                />
                <meta
                  property="og:image"
                  content="https://joebad.com/logo-twitter.png"
                />
              </>
            </H>
      <Page>
        <div className=" w-[600px] max-w-[100%]">
          <BlogHeaderV2 />
          {posts.map((p, i) => (
            <div
              key={i}
              className="flex space-x-2 pb-3 items-center"
            >
              <p className="w-[120px] text-sm"><span className="text-[10px] pr-[5px]">{posts.length - i}. </span>{p.publishedAt}</p>
              <div className="flex-1 overflow-hidden truncate pb-2">
                <Link key={i} href={`/post/${p.slug}`}>
                    {p.title}
                </Link>
              </div>
              <br />
            </div>
          ))}
        </div>
      </Page>
    </NextIntlClientProvider>
  );
};
export default SinglePost;

export async function getStaticProps({ params }) {
  const posts = allPosts
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

    .map((p) => ({
      ...p,
      publishedAt: format(new Date(p.publishedAt), "MMM do, y"),
    }));

  return { props: { posts } };
}
