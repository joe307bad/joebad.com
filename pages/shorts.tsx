import { allShorts } from "contentlayer/generated";
import BlogHeader from "../components/layout/BlogHeader";
import { NextIntlClientProvider } from "next-intl";

export default function ShortsArchive({ shorts }) {
  return (
    <NextIntlClientProvider locale="en-US">
      <BlogHeader
        title={"🩳 Shorts (a web journal)"}
        subTitle={
          "A collection of bite-sized blog posts focused on a variety of topics (mostly coding, movies, comics, and story telling)."
        }
        showArchiveLink={false}
      />
      <ul>
        {shorts.map((s) => (
          <li key={s._id}>{s.title}</li>
        ))}
      </ul>
    </NextIntlClientProvider>
  );
}

export async function getStaticProps({ req, res }) {
  return {
    props: { shorts: allShorts },
    revalidate: 86400,
  };
}
