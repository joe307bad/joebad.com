import Head from "next/head";
import {
  allShorts,
  Short,
  allLearnings as al,
  Learning,
} from "contentlayer/generated";
import { select } from "../utils/select";
import {
  EpisodeDetails,
  MovieDetails,
  tmdbApi,
  traktApi,
} from "@widgets/MostRecentMovie";
import { CommitDetails, githubApi } from "@widgets/MostRecentCommit";
import { format, parseISO, addDays, addMinutes } from "date-fns";
import V2 from "../components/V2";
import {
  flickrApi,
  PhotoDetails,
} from "../components/widgets/MostRecentPhoto/MostRecentPhoto.api";

export default function Home({
  mostRecentMovie,
  shorts,
  mostRecentCommit,
  mostRecentLearning,
  mostRecentPhoto,
  mostRecentEpisode,
  lastBuildTime,
                               lastBuildTimeUTC
}: {
  mostRecentMovie: MovieDetails;
  mostRecentCommit: CommitDetails;
  shorts: (Short & { formattedDatetime: string })[];
  mostRecentLearning: Learning;
  mostRecentPhoto: PhotoDetails;
  mostRecentEpisode: EpisodeDetails;
  lastBuildTime: string;
  lastBuildTimeUTC: string;
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
        <meta
          name="title"
          content="Joe Badaczewski | Senior Software Engineer"
        />
        <meta
          name="description"
          content="Joe Badaczewski | Senior Software Engineer at SoftWriters"
        />
      </Head>
      <V2
        {...{
          mostRecentMovie,
          shorts,
          mostRecentCommit,
          mostRecentLearning,
          mostRecentPhoto,
          mostRecentEpisode,
          lastBuildTime,
          lastBuildTimeUTC,
        }}
      />
    </>
  );
}

export async function getStaticProps({ req, res }) {
  const [mostRecentMovie, mostRecentEpisode] = await (async () => {
    if (!process.env.TRACKT_TV_API_KEY || !process.env.TMDB_API_KEY) {
      return [];
    }

    const trakt = traktApi();
    const tmdb = tmdbApi();

    const { movie, episode } = await trakt.getIdsOfMostRecentlyWatchedMovie();
    const [tmdbId, traktId] = movie ?? [undefined, undefined];
    const [epTvdbId, epTraktId, epTmdbId] = episode ?? [undefined, undefined];

    if (!tmdbId) {
      return [{ error: "No recent movie found from Trakt.tv" }];
    }

    const movieDetails = await tmdb.getMovieDetailsByTmdbId(tmdbId);
    const { rating, date } = await trakt.getRatingByTraktId(traktId);

    const epDetail = await tmdb.getEpisodeDetailsByTmdbId(epTvdbId, epTmdbId);
    const { rating: epRating, date: epDate } =
      await trakt.getEpisodeRatingByTraktId(epTraktId);

    if (!movieDetails || !epDetail) {
      return [{ error: `No movie details found from TMDB with id: ${tmdbId}` }];
    }

    movieDetails.rating = rating ?? null;
    movieDetails.date = date ?? null;

    epDetail.rating = epRating ?? null;
    epDetail.date = epDate ?? null;

    return [movieDetails, epDetail];
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
    return (
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  })[0];

  const flickr = flickrApi();
  const photo = await flickr.getMostRecentPhoto();

  var now = new Date();
  var date = new Date();
  var now = addMinutes(date, date.getTimezoneOffset())
  const oneDayFromNow = addDays(now, 1);

  return {
    props: {
      mostRecentEpisode,
      mostRecentPhoto: photo,
      mostRecentMovie,
      mostRecentCommit,
      shorts,
      mostRecentLearning: {
        ...mostRecentLearning,
        publishedAt: format(parseISO(mostRecentLearning.publishedAt), "LLL do"),
      },
      lastBuildTime: format(oneDayFromNow, "LLL do @ h:mm a") + " UTC",
      lastBuildTimeUTC: now.toString()
    },
    revalidate: 86400,
  };
}
