import { MovieDetails } from "../../pages";
import BaseWidget from "./BaseWidget";
import Link from "next/link";

const EmptyStar = () => {
  return (
    <path
      fill="currentColor"
      d="M528.1 171.5L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6zM388.6 312.3l23.7 138.4L288 385.4l-124.3 65.3 23.7-138.4-100.6-98 139-20.2 62.2-126 62.2 126 139 20.2-100.6 98z"
    ></path>
  );
};

const FilledStar = () => {
  return (
    <path
      fill="currentColor"
      d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"
    ></path>
  );
};

type MostRecentMovieProps = {
  mostRecentMovie: MovieDetails;
  nowrap: boolean;
  className?: string;
};

const Stars = ({ stars }: { stars: number }) => {
  return (
    <ul className="flex justify-center pr-1 pl-1">
      <li>
        <svg
          style={{ color: "#4ce0b3" }}
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="star"
          className="w-4 mr-1"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 576 512"
        >
          {stars >= 1 ? <FilledStar /> : <EmptyStar />}
        </svg>
      </li>
      <li>
        <svg
          style={{ color: "#4ce0b3" }}
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="star"
          className="w-4 mr-1"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 576 512"
        >
          {stars >= 2 ? <FilledStar /> : <EmptyStar />}
        </svg>
      </li>
      <li>
        <svg
          style={{ color: "#4ce0b3" }}
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="star"
          className="w-4 text-yellow-500 mr-1"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 576 512"
        >
          {stars >= 3 ? <FilledStar /> : <EmptyStar />}
        </svg>
      </li>
      <li>
        <svg
          style={{ color: "#4ce0b3" }}
          aria-hidden="true"
          focusable="false"
          data-prefix="far"
          data-icon="star"
          className="w-4 text-yellow-500 mr-1"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 576 512"
        >
          {stars >= 4 ? <FilledStar /> : <EmptyStar />}
        </svg>
      </li>
      <li>
        <svg
          style={{ color: "#4ce0b3" }}
          aria-hidden="true"
          focusable="false"
          data-prefix="far"
          data-icon="star"
          className="w-4 text-yellow-500"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 576 512"
        >
          {stars >= 5 ? <FilledStar /> : <EmptyStar />}
        </svg>
      </li>
    </ul>
  );
};

export default function MostRecentMovie({
  mostRecentMovie,
  className,
  nowrap,
}: MostRecentMovieProps) {
  const { name, description, date, rating = undefined, url } = mostRecentMovie;
  const stars = rating ? Math.floor(rating / 2) : 0;
  return (
    <BaseWidget
      heading="@joe307bad using Showly"
      column1={[date, undefined]}
      column2={[name, url]}
      column3={[<Stars stars={stars} key={"movieWidgetStars"} />, undefined]}
      className={className}
      description={
        <>
          I enjoy watching movies or TV shows and rating them out of 10 stars
          (simplified here to 5 stars). I use an open-source, Android app called{" "}
          <strong>
            <Link
              target="_blank"
              href="https://github.com/michaldrabik/showly-2.0"
            >
              Showly
            </Link>
          </strong>{" "}
          to track my ratings. This widget shows the most recent movie I&apos;ve
          rated.
        </>
      }
      id={"mostRecentMovieWidget"}
      nowrap
    />
  );
}
