import { format, parseISO } from "date-fns";

export const githubApi = () => {
  return {
    async getMostRecentCommit(): Promise<CommitDetails> {
      const activity = await fetch(
        `https://api.github.com/users/joe307bad/events/public`
      ).then((res) => res.json());

      const { payload, repo, created_at } = activity[0];
      const { commits } = payload;
      const { sha, message } = commits[0];
      const { name } = repo;

      const date = (() => {
        try {
          return format(parseISO(created_at), "LLL do");
        } catch (e) {
          return format(created_at ?? new Date(), "LLL do");
        }
      })();

      return {
        message,
        link: `https://github.com/${name}/commit/${sha}`,
        repoLink: `https://github.com/${name}`,
        hash: sha,
        date,
        repoName: name.split("/")[1],
      };
    },
  };
};

export type CommitDetails = {
  message: string;
  link: string;
  hash: string;
  repoName: string;
  date: string;
  repoLink: string;
};
