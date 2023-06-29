import Head from "next/head";
import { allArticles } from "contentlayer/generated";
import { select } from "../utils/select";
import Landing from "../components/Landing";
import { format, parseISO } from "date-fns";

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
      const ids = mostRecentMovie?.movie?.ids;
      return [ids?.tmdb, ids?.trakt];
    },
    async getRatingByTraktId(traktId) {
      const allRatings = await fetch(
        "https://api.trakt.tv/users/joe307bad/ratings/movies",
        init
      );
      const ratings = await allRatings?.json();
      const { rating, rated_at } = (() => {
        const movie = (ratings ?? []).find(
          (r) => r?.movie?.ids?.trakt == traktId
        );

        return movie ?? ratings[0];
      })();

      const ratedDate = (() => {
        try {
          return format(parseISO(rated_at), "LLL do");
        } catch (e) {
          return format(rated_at ?? new Date(), "LLL do");
        }
      })();
      return { rating, date: ratedDate };
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
        id,
      } = (await movieDetails.json()) || {};
      return {
        name,
        description,
        photoSrc: photo
          ? `https://image.tmdb.org/t/p/w500/${photo}`
          : undefined,
        url: `https://www.themoviedb.org/movie/${id}`,
      };
    },
  };
};

const githubApi = () => {
  return {
    async getMostRecentCommit(): Promise<CommitDetails> {
      // https://api.github.com/users/joe307bad/events/public
      const activity = await fetch(
        `https://api.github.com/users/joe307bad/events/public`
      ).then((res) => res.json());

      const { payload, repo, created_at } = activity[0];
      const { commits } = payload;
      const { sha, url, message } = commits[0];
      const { name } = repo;

      const date = (() => {
        try {
          return format(parseISO(created_at), "LLL do");
        } catch (e) {
          return format(created_at ?? new Date(), "LLL do");
        }
      })();

      return {
        message,
        link: `https://github.com/${name}/commit/${sha}`,
        repoLink: `https://github.com/${name}`,
        hash: sha,
        date,
        repoName: name.split("/")[1],
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
  url?: string;
};

export type CommitDetails = {
  message: string;
  link: string;
  hash: string;
  repoName: string;
  date: string;
  repoLink: string;
};

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
          <Landing
            mostRecentMovie={mostRecentMovie}
            mostRecentCommit={mostRecentCommit}
          />
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
