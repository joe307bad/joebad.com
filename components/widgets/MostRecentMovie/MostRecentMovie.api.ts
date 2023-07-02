import { format, parseISO } from "date-fns";

export type MovieDetails = {
  name?: string;
  description?: string;
  photoSrc?: string;
  rating?: any;
  date?: string;
  url?: string;
};
export const traktApi = () => {
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

export const tmdbApi = () => {
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
