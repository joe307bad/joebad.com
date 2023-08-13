import { allPages } from "contentlayer/generated";
import { NextSeo } from "next-seo";
import { useMDXComponent } from "next-contentlayer/hooks";
import { NextIntlClientProvider } from "next-intl";
import Education from "../components/about/Education";
import Page from "../components/Page";
import Image from "next/legacy/image";
import Link from "next/link";
import { MostRecentExperience } from "../components/MostRecentExerience";
import TagsList from "../components/layout/TagsList";

const usedComponents = { Education, MostRecentExperience, TagsList };

const SinglePost = ({ page }) => {
  const MDXContent = useMDXComponent(page.body.code);

  return (
    <NextIntlClientProvider locale="en-US">
      <NextSeo title={page.title} description={page.seoDescription} />
      <Page page={page}>
        <div
          className="h-[100px] w-[100px]"
          style={{
            position: "relative",
            margin: "10px auto",
          }}
        >
          <Link href="/">
            <Image
              src="/joebad-logo.png"
              layout="fill"
              objectFit="contain"
              alt="Joe Bad's logo"
              className="block"
            />
          </Link>
        </div>
        <TagsList tags={['personal tenets']} />
        <h1 className="font-[Roboto] font-thin text-4xl pb-5 text-[#4ce0b3]">
          {page.title}
        </h1>
        <span className="block pb-5 text-[#4ce0b3]">◆</span>
        <TagsList tags={['professional overview']} />
        <h2 className="font-[Roboto] font-thin text-2xl pb-5 text-[#4ce0b3]">
          {page.subtitle}
        </h2>
        <span className="block pb-5 text-[#4ce0b3]">◆</span>
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
