import { allShorts } from "contentlayer/generated";
import { NextSeo } from "next-seo";
import { SingleArticle } from "../../components/SingleArticle";
import { useMDXComponent } from "next-contentlayer/hooks";
import SampleComponent from '../../components/SampleComponent';
import '../../styles/short.module.scss';

const usedcomponents = {
  SampleComponent,
};
const SinglePost = ({ article }) => {
  const MDXContent = useMDXComponent(article.body.code);

  return (
    <>
      <NextSeo title={article.title} description={article.seoDescription} />

      <SingleArticle
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
    paths: allShorts.map((article) => ({
      params: { slug: article.slug },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const article = allShorts.find((article) => article.slug === params.slug);

  return { props: { article } };
}
