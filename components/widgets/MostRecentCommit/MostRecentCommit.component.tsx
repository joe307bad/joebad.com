import BaseWidget from "../BaseWidget";
import Link from "next/link";
import { CommitDetails } from "./MostRecentCommit.api";

type MostRecentCommitProps = {
  mostRecentCommit: CommitDetails;
  nowrap?: boolean;
  className?: string;
};

export function MostRecentCommit({
  mostRecentCommit,
  className,
}: MostRecentCommitProps) {
  const { message, link: url, date, repoName, repoLink } = mostRecentCommit;

  return (
    <BaseWidget
      heading="Building on GitHub"
      column1={[date, undefined]}
      column2={[repoName, repoLink]}
      column3={[message, url]}
      className={className}
      description={
        <>
          I program as a hobby and creative outlet. This widget shows the date
          of my most recent commit across all{" "}
          <strong>
            <Link
              target="_blank"
              href="https://github.com/joe307bad?tab=repositories"
            >
              my Github repositories
            </Link>
          </strong>
          .
        </>
      }
      id={"mostRecentGithubWidget"}
      nowrap
    />
  );
}
