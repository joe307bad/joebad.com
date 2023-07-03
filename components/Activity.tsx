import { roboto } from "./Landing";
import { MovieDetails, MostRecentMovie } from "@widgets/MostRecentMovie";
import { CommitDetails, MostRecentCommit } from "@widgets/MostRecentCommit";
import styles from '../styles/activity.module.scss'

export function Activity({
  mostRecentMovie,
  mostRecentCommit,
}: {
  mostRecentMovie: MovieDetails;
  mostRecentCommit: CommitDetails;
}) {
  return (
    <div id={styles.activity} className="flex flex-col w-full overflow-hidden">
      <div style={{ backgroundColor: "#43527F" }} className="w-full">
        <h2 className={`${roboto.className} float-left pb-2 pl-5`}>
          Interests + activity
        </h2>
      </div>
      <div
        style={{ textAlign: "center", backgroundColor: "#43527F" }}
        className="overflow-x-auto"
      >
        <div className="flex w-full space-x-4 items-end">
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
          {/* Bookmarking with Raindrop.io */}
          {/* Tweeting */}
          {/* shorts */}
        </div>
      </div>
    </div>
  );
}
