import { allPosts } from "contentlayer/generated";
import { useMDXComponent } from "next-contentlayer/hooks";
import SampleComponent from "../../components/SampleComponent";
import { NextIntlClientProvider } from "next-intl";
import Head from "../../components/Head";
import Pre from "../../components/layout/Pre";
import BlogHeaderV2 from "../../components/layout/BlogHeaderV2";
import { format } from "date-fns";
import Link from "next/link";
import styles from "../../styles/post.module.scss";
import H from "next/head";

const usedcomponents = {
  SampleComponent,
  pre: Pre,
};
const SinglePost = ({ post }) => {
  const MDXContent = useMDXComponent(post.body.code);

  return (
    <NextIntlClientProvider locale="en-US">
      <Head />
      <H>
        <>
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:site" content="https://joebad.com" />
          <meta name="twitter:title" content={post.title} />
          <meta name="twitter:description" content={post.subTitle} />
          <meta
            name="twitter:image"
            content="https://joebad.com/joe.png"
          />

          <meta name="description" content={post.subTitle} />
          
          <meta name="og:description" content={post.title} />
          <meta property="og:site_name" content="joebad.com" />
          <meta name="og:title" content={post.title} />
          <meta property="og:type" content="article" />
          <meta
            property="og:url"
            content={`https://joebad.com/${post.slug}`}
          />
          <meta
            name="og:image"
            content="https://joebad.com/joe.png"
          />
        </>
      </H>
      <style global jsx>{`
        html,
        body {
          background-color: black;
          color: white;
        }
        a {
          border-bottom: 5px solid #f26130;
        }
      `}</style>
      <>
        <div className="flex justify-center">
          <div className="w-[600px] pt-5 max-w-[100%] px-5">
            <BlogHeaderV2 />
            <h1 className="text-xl pb-2">{post.title}</h1>
            <h2 className="pb-2">{post.subTitle}</h2>
            <div className="pb-[40px] space-x-2 flex items-center">
              <div className="flex items-center space-x-1">
                <p className="text-sm truncate">{post.publishedAt}</p>
              </div>
              {post.mainLink && (
                <>
                  <div>◆</div>
                  <div className="overflow-hidden truncate items-center">
                    <Link
                      target="_blank"
                      className="text-sm"
                      href={post.mainLink}
                    >
                      {post.mainLink}
                    </Link>
                  </div>
                </>
              )}
              <div>◆</div>
              <div className="overflow-hidden items-center min-w-[80px] space-y-2">
                <Link className="text-sm" href="/blog">
                  Back to Blog
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div id={styles.post} className="flex flex-col">
          <MDXContent components={usedcomponents} />
        </div>
      </>
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
