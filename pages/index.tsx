import Head from "next/head";
import { allArticles } from "contentlayer/generated";
import { select } from "../utils/select";
import Landing from "../components/Landing";
import { MovieDetails, tmdbApi, traktApi } from "@widgets/MostRecentMovie";
import { CommitDetails, githubApi } from "@widgets/MostRecentCommit";
import { Activity } from "../components/Activity";

export default function Home({
  mostRecentMovie,
  articles,
  mostRecentCommit,
}: {
  mostRecentMovie: MovieDetails;
  mostRecentCommit: CommitDetails;
  articles: any[];
}) {
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
      </Head>

      <main className="bg-[#43527F]" style={{ textAlign: "center" }}>
        <div className="flex flex-col w-full h-full overflow-hidden">
          <Landing>
            <Activity
              mostRecentMovie={mostRecentMovie}
              mostRecentCommit={mostRecentCommit}
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
  const articles = allArticles
    .map((article) =>
      select(article, [
        "slug",
        "title",
        "description",
        "publishedAt",
        "readingTime",
        "author",
        "category",
        "image",
      ])
    )
    .sort(
      (a, b) =>
        Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt))
    );

  return {
    props: { mostRecentMovie, articles, mostRecentCommit },
    revalidate: 86400,
  };
}
