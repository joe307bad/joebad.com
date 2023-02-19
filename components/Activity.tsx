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
        <div className="flex w-full space-x-4 min-w-[120rem]">
          {mostRecentMovie?.name ? (
            <MostRecentMovie
              mostRecentMovie={mostRecentMovie}
              nowrap
              className="pl-5"
            />
          ) : null}
          {/*{mostRecentMovie?.name ? (*/}
          {/*  <MostRecentMovie*/}
          {/*    description={*/}
          {/*      "// abj7inwsk543 // joebad.com // [styles] updating background color"*/}
          {/*    }*/}
          {/*    title={"building on Github"}*/}
          {/*    date={"Jan. 5th"}*/}
          {/*    nowrap*/}
          {/*    */}
          {/*  />*/}
          {/*) : null}*/}
          {/*{mostRecentMovie?.name ? (*/}
          {/*  <MostRecentMovie*/}
          {/*    description={*/}
          {/*      "Lorem ipsum dolor sit amet, consectetur adipiscing elit"*/}
          {/*    }*/}
          {/*    title={"writing Shorts"}*/}
          {/*    date={mostRecentMovie.date}*/}
          {/*    rating={mostRecentMovie.rating}*/}
          {/*    nowrap*/}
          {/*  />*/}
          {/*) : null}*/}
          {/*{mostRecentMovie?.name ? (*/}
          {/*  <MostRecentMovie*/}
          {/*    description={*/}
          {/*      "Lorem ipsum dolor sit amet, consectetur adipiscing elit"*/}
          {/*    }*/}
          {/*    title={"bookmarking on Raindrop.io"}*/}
          {/*    date={mostRecentMovie.date}*/}
          {/*    rating={mostRecentMovie.rating}*/}
          {/*    nowrap*/}
          {/*  />*/}
          {/*) : null}*/}
          {/*{mostRecentMovie?.name ? (*/}
          {/*  <MostRecentMovie*/}
          {/*    description={*/}
          {/*      "Lorem ipsum dolor sit amet, consectetur adipiscing elit"*/}
          {/*    }*/}
          {/*    title={"tweeting and retweeting"}*/}
          {/*    date={mostRecentMovie.date}*/}
          {/*    rating={mostRecentMovie.rating}*/}
          {/*    nowrap*/}
          {/*  />*/}
          {/*) : null}*/}
        </div>
      </div>
    </div>
  );
}
