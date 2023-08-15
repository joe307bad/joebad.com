import { allShorts } from "contentlayer/generated";
import { NextSeo } from "next-seo";
import { SingleArticle } from "../../components/SingleArticle";
import { useMDXComponent } from "next-contentlayer/hooks";
import SampleComponent from "../../components/SampleComponent";
import "../../styles/short.module.scss";
import { NextIntlClientProvider } from "next-intl";

// Setting a vision (working with customers/stakeholders, defining mission/tenets, writing narratives or PR/FAQs)
// Hands-on delivery (e.g. defining requirements, analysis, designing/presenting solutions, coding/code reviews, building, testing, deploying)
// Tackling hard problems (e.g., scientific research, inventing, root cause resolution, simplifying a process or architecture, resolving blockers)
// Sustaining engineering and operations (e.g. CMs, oncall, break/fix, COEs, incident analysis, ticket reviews, scaling, handling escalations, automating manual procedures)
// Business operations (e.g. attending metrics reviews, acquisitions, strategic/roadmap planning, other meetings)
// Organizational health (e.g. hiring, developing others, coaching/mentoring, providing feedback on a promotion)
// Developing your own skills (attending talks/training, being mentored)
// Listening to customers

const usedcomponents = {
  SampleComponent,
};
const SinglePost = ({ article }) => {
  const MDXContent = useMDXComponent(article.body.code);

  return (
    <NextIntlClientProvider locale='en-US'>
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
