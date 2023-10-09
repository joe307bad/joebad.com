import { MovieDetails, MostRecentMovie } from "@widgets/MostRecentMovie";
import { CommitDetails, MostRecentCommit } from "@widgets/MostRecentCommit";
import styles from "../styles/activity.module.scss";
import { Short } from "contentlayer/generated";
import { MostRecentShort } from "./widgets/MostRecentShort";

export function Activity({
  mostRecentMovie,
  mostRecentCommit,
  short,
}: {
  mostRecentMovie: MovieDetails;
  mostRecentCommit: CommitDetails;
  short: Short & { formattedDatetime: string };
}) {
  return (
    <div
      id={styles.activity}
      className={`flex flex-col w-full overflow-hidden z-10`}
    >
      <div style={{ textAlign: "center" }} className="overflow-x-auto">
        <div className="flex w-full space-x-4 items-end">
          {mostRecentCommit?.hash ? (
            <MostRecentCommit
              className="pl-5"
              mostRecentCommit={mostRecentCommit}
              nowrap
            />
          ) : null}
          {mostRecentMovie?.name ? (
            <MostRecentMovie mostRecentMovie={mostRecentMovie} nowrap />
          ) : null}
          {/*<MostRecentShort short={short} nowrap />*/}
          {/* Bookmarking with Raindrop.io */}
          {/* Tweeting */}
        </div>
      </div>
    </div>
  );
}
