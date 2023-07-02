import { CommitDetails } from "../../pages";
import BaseWidget from "./BaseWidget";

type MostRecentCommitProps = {
  mostRecentCommit: CommitDetails;
  nowrap?: boolean;
  className?: string;
};

export default function MostRecentCommit({
  mostRecentCommit,
  className,
}: MostRecentCommitProps) {
  const { message, link: url, date, repoName, repoLink } = mostRecentCommit;

  return (
    <BaseWidget
      heading="@joe307bad building on GitHub"
      column1={[date, undefined]}
      column2={[repoName, repoLink]}
      column3={[message, url]}
      className={className}
      description={
        <>
          I program as a hobby and creative outlet. I am always working on some
          proof of concept or passion project. This widget shows my most recent
          commit across all my GitHub repositories.
        </>
      }
      id={"mostRecentGithubWidget"}
      nowrap
    />
  );
}
