import Link from "next/link";
import { CommitDetails } from "../../pages";

type MostRecentCommitProps = {
  mostRecentCommit: CommitDetails;
  nowrap?: boolean;
  className?: string;
};

export default function MostRecentCommit({
  mostRecentCommit,
  className,
  nowrap,
}: MostRecentCommitProps) {
  const {
    hash,
    message,
    link: url,
    date,
    repoName,
    repoLink,
  } = mostRecentCommit;

  return (
    <div className={className}>
      {" "}
      <div
        style={{ fontFamily: "Roboto Mono", borderColor: "#4ce0b3" }}
        className="w-[350px] rounded overflow-hidden border-2 border-sky-500 hover:shadow-lg text-left"
      >
        <div
          style={{ borderColor: "#4ce0b3" }}
          className="inline-flex text-l border-b-2 p-1 w-full items-center"
        >
          <div
            style={{ fontFamily: "Roboto Mono" }}
            className="text-left flex-1"
          >
            <p>@joe307bad building on GitHub</p>
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
            data-bs-target="#recentCommitInfo"
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
        <div className="inline-flex w-full">
          <p
            style={{ fontFamily: "Roboto", borderColor: "#4ce0b3" }}
            className="text-bold p-1 text-base flex items-center"
          >
            {date}
          </p>
          <p
            style={{ fontFamily: "Roboto", borderColor: "#4ce0b3" }}
            className="text-bold p-1 border-l-2 text-base flex items-center"
          >
            <Link className="line-clamp-2" target="_blank" href={repoLink}>
              {repoName}
            </Link>
          </p>
          <p
            style={{ fontFamily: "Roboto", borderColor: "#4ce0b3" }}
            className="font-light p-1 text-base border-l-2 flex-1 text-left line-clamp-2"
          >
            {url ? (
              <Link className="line-clamp-2" target="_blank" href={url}>
                {message}
              </Link>
            ) : (
              message
            )}
          </p>
        </div>
        <div className="collapse" id="recentCommitInfo">
          <div style={{ borderColor: "#4ce0b3" }} className="border-t-2 p-2">
            <p className="text-sm font-light">
              I program as a hobby and creative outlet. I am always working on
              some proof of concept or passion project. This widget shows my most
              recent commit across all my GitHub repositories.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
