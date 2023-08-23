import { allPages } from "contentlayer/generated";
import { NextSeo } from "next-seo";
import { useMDXComponent } from "next-contentlayer/hooks";
import { NextIntlClientProvider } from "next-intl";
import Education from "../components/about/Education";
import Page from "../components/Page";
import { MostRecentExperience } from "../components/MostRecentExerience";
import TagsList from "../components/layout/TagsList";
import { SplitContent } from "../components/layout/SplitContent";
import LinkButton from "../components/buttons/LinkButton";

const usedComponents = {
  Education,
  MostRecentExperience,
  LinkButton,
  TagsList,
  SplitContent,
};

const SinglePost = ({ page }) => {
  const MDXContent = useMDXComponent(page.body.code);

  return (
    <NextIntlClientProvider locale="en-US">
      <NextSeo title={page.title} description={page.seoDescription} />
      <Page page={page}>
        <MDXContent components={usedComponents} />
      </Page>
    </NextIntlClientProvider>
  );
};
export default SinglePost;

export async function getStaticPaths() {
  return {
    paths: allPages.map((page) => ({
      params: { slug: page.slug },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const page = allPages.find((article) => article.slug === params.slug);

  return { props: { page } };
}
