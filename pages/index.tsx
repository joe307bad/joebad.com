import Head from "next/head";
import { allArticles } from "contentlayer/generated";
import { select } from "../utils/select";
import MostRecentMovie from "../components/widgets/MostRecentMovie";
import Landing from "../components/Landing";

const getTmdbIdOfMostRecentlyWatchedMovie = async (): Promise<
  string | undefined
> => {
  const tracktTvApiKey = process.env.TRACKT_TV_API_KEY || "";
  const watchedHistory = await fetch(
    "https://api.trakt.tv/users/joe307bad/history/movies",
    { headers: { "trakt-api-key": tracktTvApiKey } }
  );
  const [mostRecentMovie] = (await watchedHistory.json()) || [];
  return mostRecentMovie?.movie?.ids?.tmdb;
};

const getMovieDetailsByTmdbId = async (
  tmdbId: string
): Promise<
  { name?: string; description?: string; photoSrc?: string } | undefined
> => {
  const tmdbApiKey = process.env.TMDB_API_KEY || "";
  const movieDetails = await fetch(
    `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${tmdbApiKey}&language=en-US`
  );
  const {
    overview: description,
    backdrop_path: photo,
    title: name,
  } = (await movieDetails.json()) || {};
  return {
    name,
    description,
    photoSrc: photo ? `https://image.tmdb.org/t/p/w500/${photo}` : undefined,
  };
};

export default function Home({
  mostRecentMovie: movieDetails,
  articles,
}: {
  mostRecentMovie: {
    name?: string;
    description?: string;
    photoSrc?: string;
  };
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
      </Head>

      <main style={{ paddingLeft: 50, textAlign: "center" }}>
        <div style={{ paddingLeft: 50 }}>
          <Landing />
          <MostRecentMovie
            title={movieDetails?.name}
            thumbnail={movieDetails?.photoSrc}
            description={movieDetails?.description}
          />
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  const mostRecentMovie = await (async () => {
    const tmdbId = await getTmdbIdOfMostRecentlyWatchedMovie();

    if (!tmdbId) {
      return { error: "No recent movie found from Trakt.tv" };
    }

    const movieDetails = await getMovieDetailsByTmdbId(tmdbId);

    if (!movieDetails) {
      return { error: `No movie details found from TMDB with id: ${tmdbId}` };
    }

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
