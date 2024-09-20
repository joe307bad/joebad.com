import Head from "next/head";
import { allShorts, Short, allLearnings as al, Learning } from "contentlayer/generated";
import { select } from "../utils/select";
import { MovieDetails, tmdbApi, traktApi } from "@widgets/MostRecentMovie";
import { CommitDetails, githubApi } from "@widgets/MostRecentCommit";
import { format, parseISO } from "date-fns";
import V2 from "../components/V2";
import { flickrApi } from "../components/widgets/MostRecentPhoto/MostRecentPhoto.api";

export default function Home({
  mostRecentMovie,
  shorts,
  mostRecentCommit,
  mostRecentLearning
}: {
  mostRecentMovie: MovieDetails;
  mostRecentCommit: CommitDetails;
  shorts: (Short & { formattedDatetime: string })[];
  mostRecentLearning: Learning
}) {

  return (
    <>
      <Head>
        <title>Joe Badaczewski | Senior Software Engineer</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@200;500&family=Roboto:wght@300;500&display=swap"
          rel="preload"
        />
        <link
          rel="preload"
          href="/Geist-Regular.woff2"
          as="font"
          crossOrigin=""
          type="font/woff2"
        />
        <meta name="title" content="Joe Badaczewski | Senior Software Engineer" />
        <meta
          name="description"
          content="Joe Badaczewski | Senior Software Engineer at SoftWriters"
        />
      </Head>

      <V2 {...{
        mostRecentMovie,
        shorts,
        mostRecentCommit,
        mostRecentLearning
      }} />
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
    const flickr = flickrApi();
    const photo = await flickr.getMostRecentPhoto();

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

  const mostRecentLearning = al.sort((a: Learning, b: Learning) => {
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  })[0]

  return {
    props: {
      mostRecentMovie, mostRecentCommit, shorts, mostRecentLearning: {
        ...mostRecentLearning,
        publishedAt: format(parseISO(mostRecentLearning.publishedAt), "LLL do")
      }
    },
    revalidate: 86400,
  };
}
