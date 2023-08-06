import { allShorts, Short } from "contentlayer/generated";
import BlogHeader from "../components/layout/BlogHeader";
import { NextIntlClientProvider } from "next-intl";
import TagsList from "../components/layout/TagsList";
import { format, parse, parseISO } from "date-fns";
import { roboto } from "../components/Landing";
import Link from "next/link";

export default function ShortsArchive({ shorts }: { shorts: Short[] }) {
  return (
    <NextIntlClientProvider locale="en-US">
      <BlogHeader
        title={"🩳 Shorts (a web journal)"}
        subTitle={
          "A collection of bite-sized blog posts focused on a variety of topics (mostly coding, movies, comics, and story telling)."
        }
        showArchiveLink={false}
      />
      <div className={`flex w-full justify-center mt-10`}>
        <ul className="w-full max-w-2xl">
          {shorts.map((s) => {
            return (
              <li className="flex w-full mb-5" key={s._id}>
                <Link className="flex w-full" href={`/short/${s.slug}`}>
                  <div
                    style={{ fontFamily: "Roboto Mono" }}
                    className={`w-1/5`}
                  >
                    {format(
                      parse(s.publishedAt, "yyyy-MM-dd", new Date()),
                      "LLL do"
                    )}
                  </div>{" "}
                  <div className="flex-1">
                    {s.title} <br />
                    {s.tags && <TagsList tags={s.tags} />}
                  </div>{" "}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </NextIntlClientProvider>
  );
}

export async function getStaticProps({ req, res }) {
  return {
    props: { shorts: allShorts },
    revalidate: 86400,
  };
}
