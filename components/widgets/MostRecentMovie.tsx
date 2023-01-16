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

export default function MostRecentMovie({ title, description, date, rating }) {
  const stars = Math.floor(rating / 2);

  return (
    <>
      {" "}
      <div
        style={{ fontFamily: "Roboto Mono", borderColor: "#4ce0b3" }}
        className="max-w-sm rounded overflow-hidden border-2 border-sky-500 hover:shadow-lg text-left"
      >
        <div
          style={{ borderColor: "#4ce0b3" }}
          className="inline-flex text-l border-b-2 p-1 w-full items-center"
        >
          <div
            style={{ fontFamily: "Roboto Mono" }}
            className="text-left flex-1"
          >
            <p>{title}</p>
          </div>

          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="far"
            className="w-5 h-5 cursor-pointer"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            data-bs-toggle="collapse"
            data-bs-target="#collapseExample"
          >
            <svg
              fill="#4ce0b3"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM288 352c0 17.7-14.3 32-32 32s-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32z" />
            </svg>
          </svg>
        </div>
        <div className="inline-flex items-center w-full">
          <p
            style={{ fontFamily: "Roboto", borderColor: "#4ce0b3" }}
            className="text-bold p-1 text-base"
          >
            {date}
          </p>
          <p
            style={{ fontFamily: "Roboto", borderColor: "#4ce0b3" }}
            className="font-light p-1 text-base border-r-2 border-l-2 flex-1 text-left"
          >
            {description}
          </p>
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
        </div>
        <div className="collapse" id="collapseExample">
          <div style={{ borderColor: "#4ce0b3" }} className="border-t-2 p-2">
            <p className="text-sm font-light">
              I like to watch movies or TV shows and rate them out of 10 stars
              (simplified here to 5 stars). I use an open-source, Android app
              called{" "}
              <strong>
                <Link
                  target="_blank"
                  href="https://github.com/michaldrabik/showly-2.0"
                >
                  Showly
                </Link>
              </strong>{" "}
              to track my ratings. This widget shows the most recent movie I've
              rated.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
