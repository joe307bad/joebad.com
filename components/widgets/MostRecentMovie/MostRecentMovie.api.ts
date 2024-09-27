import { format, parseISO } from "date-fns";

export type MovieDetails = {
  name?: string;
  description?: string;
  photoSrc?: string;
  rating?: any;
  date?: string;
  url?: string;
};

export type EpisodeDetails = MovieDetails & {
  showName?: string;
  season?: string;
  episode?: string;
};

export const traktApi = () => {
  const traktTvApiKey = process.env.TRACKT_TV_API_KEY || "";
  const init = { headers: { "trakt-api-key": traktTvApiKey } };
  return {
    async getIdsOfMostRecentlyWatchedMovie() {
      const watchedHistory: false | Response = await fetch(
        "https://api.trakt.tv/users/joe307bad/history/movies",
        init
      ).catch(() => false);

      const episodeHistory: false | Response = await fetch(
        "https://api.trakt.tv/users/joe307bad/history/episodes",
        init
      ).catch(() => false);

      if (watchedHistory === false || episodeHistory === false) {
        return { movie: undefined, episode: undefined };
      }

      const b = await watchedHistory?.json();
      const e = await episodeHistory?.json();
      const [mostRecentEpisode] = e || [];
      const [mostRecentMovie] = b || [];
      const episodeIds = mostRecentEpisode?.episode?.ids;
      const ids = mostRecentMovie?.movie?.ids;
      return {
        movie: [ids?.tmdb, ids?.trakt],
        episode: [episodeIds?.tvdb, episodeIds?.trakt],
      };
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
    async getEpisodeRatingByTraktId(traktId) {
      const allRatings = await fetch(
          "https://api.trakt.tv/users/joe307bad/ratings/episodes",
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
      const movieDetails: false | Response = await fetch(
        `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${tmdbApiKey}&language=en-US`
      ).catch(() => false);

      if (movieDetails === false) {
        return {};
      }

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
    async getEpisodeDetailsByTmdbId(
      tvdbid: string
    ): Promise<EpisodeDetails | undefined> {
      const apikey = process.env.TVDB_API_KEY || "";
      const login: false | Response = await fetch(
        `https://api4.thetvdb.com/v4/login`,
        {
          method: "POST",
          body: JSON.stringify({ apikey }),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json; charset=UTF-8",
          },
        }
      ).catch(() => false);

      if (!login) {
        return undefined;
      }

      const response = await login?.json();
      const epDetails: false | Response = await fetch(
        `https://api4.thetvdb.com/v4/episodes/${tvdbid}/extended`,
        { headers: { Authorization: `Bearer ${response?.data?.token}` } }
      ).catch(() => false);

      // https://api4.thetvdb.com/v4/login
      // https://api.themoviedb.org/3/tv/{series_id}/season/{season_number}/episode/{episode_number}

      if (epDetails === false) {
        return undefined;
      }

      const details =  (await epDetails.json())?.data || {};

      const seriesDetails: false | Response = await fetch(
          `https://api4.thetvdb.com/v4/series/${details.seriesId}/extended`,
          { headers: { Authorization: `Bearer ${response?.data?.token}` } }
      ).catch(() => false);

      if (seriesDetails === false) {
        return undefined;
      }

      const serDetails =  (await seriesDetails.json())?.data || {};

      return {
        name: details.name,
        showName: serDetails.name,
        season: details.seasonNumber,
        episode: details.number,
        description: '',
        photoSrc: '',
        url: `https://www.thetvdb.com/series/${serDetails.slug}/episodes/${details.id}`,
      };
    },
  };
};
