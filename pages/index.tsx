import Head from "next/head";
import { allArticles } from "contentlayer/generated";
import { select } from "../utils/select";
import Landing from "../components/Landing";
import MostRecentMovie from "../components/widgets/MostRecentMovie";
import { format, parseISO } from "date-fns";
import { Logger, Amplify, AWSCloudWatchProvider } from "aws-amplify";

const logger = new Logger("JoesLogger", "DEBUG");
Amplify.register(logger);
logger.addPluggable(new AWSCloudWatchProvider());

const traktApi = () => {
  const traktTvApiKey = process.env.TRACKT_TV_API_KEY || "";
  const init = { headers: { "trakt-api-key": traktTvApiKey } };
  return {
    async getIdsOfMostRecentlyWatchedMovie() {
      const watchedHistory = await fetch(
        "https://api.trakt.tv/users/joe307bad/history/movies",
        init
      );
      const [mostRecentMovie] = (await watchedHistory?.json()) || [];
      logger.log({ mostRecentMovie });
      const ids = mostRecentMovie?.movie?.ids;
      return [ids?.tmdb, ids?.trakt];
    },
    async getRatingByTraktId(traktId) {
      const allRatings = await fetch(
        "https://api.trakt.tv/users/joe307bad/ratings/movies",
        init
      );
      const ratings = await allRatings?.json();
      logger.log({ ratings });
      const { rating, rated_at } =
        (ratings ?? []).find((r) => r?.movie?.ids?.trakt == traktId) ?? {};

      return { rating, date: format(parseISO(rated_at), "LLL do") };
    },
  };
};

const tmdbApi = () => {
  const tmdbApiKey = process.env.TMDB_API_KEY || "";
  return {
    async getMovieDetailsByTmdbId(tmdbId: string): Promise<MovieDetails> {
      const movieDetails = await fetch(
        `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${tmdbApiKey}&language=en-US`
      );
      const {
        overview: description,
        backdrop_path: photo,
        title: name,
      } = (await movieDetails.json()) || {};
      logger.log({
        overview: description,
        backdrop_path: photo,
        title: name,
      });
      return {
        name,
        description,
        photoSrc: photo
          ? `https://image.tmdb.org/t/p/w500/${photo}`
          : undefined,
      };
    },
  };
};

export type MovieDetails = {
  name?: string;
  description?: string;
  photoSrc?: string;
  rating?: any;
  date?: string;
};

export default function Home({
  mostRecentMovie,
  articles,
}: {
  mostRecentMovie: MovieDetails;
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
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@200;500&family=Roboto:wght@300;500&display=swap"
          rel="stylesheet"
        />
        <link
          rel="preload"
          href="/payback-webfont.woff2"
          as="font"
          crossOrigin=""
          type="font/woff2"
        />
      </Head>

      <main style={{ textAlign: "center", backgroundColor: "#bd4b4b" }}>
        <div>
          <Landing />

          <div
            style={{ justifyContent: "center", display: "flex", padding: 20 }}
          >
            {mostRecentMovie?.name ? (
              <MostRecentMovie
                description={mostRecentMovie.name}
                title={"@joe307bad on trakt.tv"}
                date={mostRecentMovie.date}
                rating={mostRecentMovie.rating}
              />
            ) : null}
          </div>
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  // res.setHeader(
  //   "Cache-Control",
  //   "public, s-maxage=86400, stale-while-revalidate"
  // );
  const mostRecentMovie = await (async () => {
    if (!process.env.TRACKT_TV_API_KEY || !process.env.TMDB_API_KEY) {
      logger.error("TRACKT_TV_API_KEY or TMDB_API_KEY not found");
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
    props: { mostRecentMovie, articles },
  };
}
