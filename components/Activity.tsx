import MostRecentMovie from "./widgets/MostRecentMovie";
import { CommitDetails, MovieDetails } from "../pages";
import { roboto } from "./Landing";
import MostRecentCommit from "./widgets/MostRecentCommit";

export function Activity({
  mostRecentMovie,
  mostRecentCommit,
}: {
  mostRecentMovie: MovieDetails;
  mostRecentCommit: CommitDetails;
}) {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      <div style={{ backgroundColor: "#43527F" }} className="w-full">
        <h2 className={`${roboto.className} float-left pb-2 pl-5`}>
          My recent activity
        </h2>
      </div>
      <div
        style={{ textAlign: "center", backgroundColor: "#43527F" }}
        className="overflow-x-auto"
      >
        <div className="flex w-full space-x-4 items-start">
          {mostRecentMovie?.name ? (
            <MostRecentMovie
              mostRecentMovie={mostRecentMovie}
              nowrap
              className="pl-5"
            />
          ) : null}
          {mostRecentCommit?.hash ? (
            <MostRecentCommit mostRecentCommit={mostRecentCommit} nowrap />
          ) : null}
          {/*{mostRecentMovie?.name ? (*/}
          {/* Bookmarking with Raindrop.io  <MostRecentMovie mostRecentMovie={mostRecentMovie} nowrap />*/}
          {/*) : null}*/}
          {/*{mostRecentMovie?.name ? (*/}
          {/* Building with GitHub <MostRecentMovie mostRecentMovie={mostRecentMovie} nowrap />*/}
          {/*) : null}*/}
          {/*{mostRecentMovie?.name ? (*/}
          {/* Tweeting and retweeting <MostRecentMovie mostRecentMovie={mostRecentMovie} nowrap />*/}
          {/*) : null}*/}
          {/* writing Shorts (tiny blog postS) {mostRecentMovie?.name ? (*/}
          {/*      <MostRecentMovie mostRecentMovie={mostRecentMovie} nowrap />*/}
          {/*  ) : null}*/}
        </div>
      </div>
    </div>
  );
}
