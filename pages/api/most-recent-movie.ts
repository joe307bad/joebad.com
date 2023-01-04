// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

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

export default async function handler(req, res) {
  const tmdbId = await getTmdbIdOfMostRecentlyWatchedMovie();

  if (!tmdbId) {
    return res
      .status(400)
      .json({ error: "No recent movie found from Trakt.tv" });
  }

  const movieDetails = await getMovieDetailsByTmdbId(tmdbId);

  if (!movieDetails) {
    return res
      .status(400)
      .json({ error: `No movie details found from TMDB with id: ${tmdbId}` });
  }

  res.status(200).json(movieDetails);
}
