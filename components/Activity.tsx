import MostRecentMovie from "./widgets/MostRecentMovie";
import { MovieDetails } from "../pages";
import { roboto } from "./Landing";

export function Activity({
  mostRecentMovie,
}: {
  mostRecentMovie: MovieDetails;
}) {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      <div className="w-full">
        <h2 className={`${roboto.className} float-left pb-2 pl-5`}>
          My recent activity
        </h2>
      </div>
      <div className="overflow-x-auto">
        <div className="flex w-full space-x-4 items-start">
          {mostRecentMovie?.name ? (
            <MostRecentMovie
              mostRecentMovie={mostRecentMovie}
              nowrap
              className="pl-5"
            />
          ) : null}
          {/*{mostRecentMovie?.name ? (*/}
          {/*  <MostRecentMovie mostRecentMovie={mostRecentMovie} nowrap />*/}
          {/*) : null}*/}
          {/*{mostRecentMovie?.name ? (*/}
          {/*  <MostRecentMovie mostRecentMovie={mostRecentMovie} nowrap />*/}
          {/*) : null}*/}
          {/*{mostRecentMovie?.name ? (*/}
          {/*  <MostRecentMovie mostRecentMovie={mostRecentMovie} nowrap />*/}
          {/*) : null}*/}
          {/*  {mostRecentMovie?.name ? (*/}
          {/*      <MostRecentMovie mostRecentMovie={mostRecentMovie} nowrap />*/}
          {/*  ) : null}*/}
          {/*  {mostRecentMovie?.name ? (*/}
          {/*      <MostRecentMovie mostRecentMovie={mostRecentMovie} nowrap />*/}
          {/*  ) : null}*/}
        </div>
      </div>
    </div>
  );
}
