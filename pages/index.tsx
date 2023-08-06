import Head from "next/head";
import { allArticles, allShorts, Short } from "contentlayer/generated";
import { select } from "../utils/select";
import Landing, { roboto } from "../components/Landing";
import { MovieDetails, tmdbApi, traktApi } from "@widgets/MostRecentMovie";
import { CommitDetails, githubApi } from "@widgets/MostRecentCommit";
import { Activity } from "../components/Activity";
import { format, parseISO } from "date-fns";

export default function Home({
  mostRecentMovie,
  shorts,
  mostRecentCommit,
}: {
  mostRecentMovie: MovieDetails;
  mostRecentCommit: CommitDetails;
  shorts: (Short & { formattedDatetime: string })[];
}) {
  console.log("shorts", shorts);
  return (
    <>
      <Head>
        <title>Joe Badaczewski | Front-End Engineer</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Pridi:wght@300;600&display=swap"
          rel="preload"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@200;500&family=Roboto:wght@300;500&display=swap"
          rel="preload"
        />
        <link
          rel="preload"
          href="/payback-webfont.woff2"
          as="font"
          crossOrigin=""
          type="font/woff2"
        />
        <meta name="title" content="Joe Badaczewski | Front-End Engineer" />
        <meta
          name="description"
          content="Joe Badaczewski | Pittsburgh-based Front-End Engineer at AWS | Writing short blog posts about coding, comics, movies, sports, and open source software."
        />
      </Head>

      <main className="bg-[#43527F]" style={{ textAlign: "center" }}>
        <div className="flex flex-col w-full h-full overflow-hidden">
          <Landing>
            <div
              style={{ backgroundColor: "#43527F" }}
              className="w-full absolute bottom-[120px]"
            >
              <h2
                className={`${roboto.className} float-left pb-2 pl-5 text-[#4ce0b3] text-[30px] z-0`}
              >
                Interests + activity
              </h2>
            </div>
            <Activity
              mostRecentMovie={mostRecentMovie}
              mostRecentCommit={mostRecentCommit}
              short={shorts[0]}
            />
          </Landing>
        </div>
      </main>
    </>
  );
}

export async function getStaticProps({ req, res }) {
  const mostRecentMovie = await (async () => {
    if (!process.env.TRACKT_TV_API_KEY || !process.env.TMDB_API_KEY) {
      return null;
    }

    const trakt = traktApi();
    const tmdb = tmdbApi();

    const [tmdbId, traktId] = await trakt.getIdsOfMostRecentlyWatchedMovie();

    if (!tmdbId) {
      return { error: "No recent movie found from Trakt.tv" };
    }

    const movieDetails = await tmdb.getMovieDetailsByTmdbId(tmdbId);
    const { rating, date } = await trakt.getRatingByTraktId(traktId);

    if (!movieDetails) {
      return { error: `No movie details found from TMDB with id: ${tmdbId}` };
    }

    movieDetails.rating = rating ?? null;
    movieDetails.date = date ?? null;

    return movieDetails;
  })();
  const mostRecentCommit = await githubApi().getMostRecentCommit();
  const shorts = allShorts
    .map((article) => {
      const a = select(article, [
        "slug",
        "title",
        "description",
        "publishedAt",
      ]);

      const d = format(parseISO(a.publishedAt), "LLL do");

      return {
        formattedDatetime: d,
        ...a,
      };
    })
    .sort(
      (a, b) =>
        Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt))
    );

  return {
    props: { mostRecentMovie, mostRecentCommit, shorts },
    revalidate: 86400,
  };
}
