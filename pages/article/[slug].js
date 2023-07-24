import { allArticles } from "contentlayer/generated";
import { NextSeo } from "next-seo";
import { SingleArticle } from "../../components/SingleArticle";
import { useMDXComponent } from "next-contentlayer/hooks";
import SampleComponent from "../../components/SampleComponent";
import {NextIntlClientProvider} from "next-intl";

const usedcomponents = {
  SampleComponent,
};
const SinglePost = ({ article }) => {
  const MDXContent = useMDXComponent(article.body.code);

  return (
    <NextIntlClientProvider locale="en-US">
      <NextSeo title={article.title} description={article.seoDescription} />

      <SingleArticle {...article}>
        <MDXContent components={usedcomponents} />
      </SingleArticle>
    </NextIntlClientProvider>
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
