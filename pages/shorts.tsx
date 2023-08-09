import { allShorts, Short } from "contentlayer/generated";
import BlogHeader from "../components/layout/BlogHeader";
import { NextIntlClientProvider } from "next-intl";
import TagsList from "../components/layout/TagsList";
import { format, parse } from "date-fns";
import Link from "next/link";
import { NextSeo } from "next-seo";
import * as R from "remeda";

export default function ShortsArchive({ shorts }: { shorts: Short[] }) {
  const shortsByYear = R.pipe(
    shorts,
    R.groupBy((x) =>
      format(parse(x.publishedAt, "yyyy-MM-dd", new Date()), "yyyy")
    )
  );
  console.log(shortsByYear);
  return (
    <NextIntlClientProvider locale="en-US">
      <NextSeo
        title={"🩳 Shorts (a digital journal by Joe Badaczewski)"}
        description="A collection of bite-sized blog posts focused on a variety of topics (mostly coding, movies, comics, and story telling)."
      />

      <BlogHeader
        title={"🩳 Shorts (a digital journal)"}
        subTitle={
          "A collection of bite-sized blog posts focused on a variety of topics (mostly coding, movies, comics, and story telling)."
        }
        showArchiveLink={false}
      />
      <div className={`flex justify-center p-5 md:pt-0 md:mt-10`}>
        <ul className="w-full md:max-w-2xl">
          {Object.keys(shortsByYear)
            .sort()
            .reverse()
            .flatMap((year) => {
              return [
                <li key={year}>
                  <h3
                    style={{ fontFamily: "Roboto Mono" }}
                    className="pb-2 text-xl text-[#43527f]"
                  >
                    {year}
                  </h3>
                </li>,
                ...shortsByYear[year]
                  .sort(
                    (a, b) =>
                      parse(b.publishedAt, "yyyy-MM-dd", new Date()).getTime() -
                      parse(a.publishedAt, "yyyy-MM-dd", new Date()).getTime()
                  )
                  .map((s, i) => (
                    <li
                      className={`flex w-full mb-5 ml-5 ${
                        i === shortsByYear[year].length - 1 ? "mb-10" : ""
                      }`}
                      key={s._id}
                    >
                      <Link className="flex w-full" href={`/short/${s.slug}`}>
                        <div
                          style={{ fontFamily: "Roboto Mono" }}
                          className={`pr-5`}
                        >
                          {format(
                            parse(s.publishedAt, "yyyy-MM-dd", new Date()),
                            "LLL do"
                          )}
                        </div>{" "}
                        <div className="flex-1">
                          <span className=" hover:underline">{s.title}</span>{" "}
                          <br />
                          {s.tags && <TagsList tags={s.tags} />}
                        </div>{" "}
                      </Link>
                    </li>
                  )),
              ];
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
