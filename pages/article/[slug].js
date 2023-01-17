import { allArticles } from "contentlayer/generated";
import { NextSeo } from "next-seo";
import { SingleArticle } from "../../components/SingleArticle";
import SampleComponent from "../../components/SampleComponent";
import CodeBlock from "../../components/CodeBlock";
import { useLiveReload, useMDXComponent } from "next-contentlayer/hooks";
import Head from "next/head";

const usedcomponents = {
  SampleComponent,
  CodeBlock,
};
const SinglePost = ({ article }) => {
  const MDXContent = useMDXComponent(article.body.code);
  useLiveReload();

  return (
    <>
        <script
            rel="preload"
            src="https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/prism.min.js"
            integrity="sha512-UOoJElONeUNzQbbKQbjldDf9MwOHqxNz49NNJJ1d90yp+X9edsHyJoAs6O4K19CZGaIdjI5ohK+O2y5lBTW6uQ=="
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
        ></script>
        <Head>
        <script
          rel="preload"
          src="https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/components/prism-actionscript.min.js"
          integrity="sha512-YSZLJbdXeh9n0X0aJAuJUk8ArMBEu1F0LQPeiydyVXUMlJ2QZPAFzp/84lkxk9M0NpTJ5aSEUTlbsC4UoUpwYw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        ></script>
      </Head>
      <NextSeo title={article.title} description={article.seoDescription} />

      <SingleArticle
        image={article.image}
        title={article.title}
        category={article.category}
        author={article.author}
      >
        <MDXContent components={usedcomponents} />
      </SingleArticle>
    </>
  );
};
export default SinglePost;

export async function getStaticPaths() {
  return {
    paths: allArticles.map((article) => ({
      params: { slug: article.slug },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const article = allArticles.find((article) => article.slug === params.slug);

  return { props: { article } };
}
