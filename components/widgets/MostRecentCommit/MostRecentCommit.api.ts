import { format, parseISO } from "date-fns";

export const githubApi = () => {
  return {
    async getMostRecentCommit(): Promise<CommitDetails> {
      const activity = await fetch(
        `https://api.github.com/users/joe307bad/events/public`
      ).then((res) => res.json());

      const { payload, repo, created_at } =
        activity?.find((activity) => activity.type === "PushEvent") ?? {};
      const { commits } = payload ?? {};
      const { sha, message } = commits?.filter(
        ({ message }) => message !== "Badaczewski_CV"
      )?.[0] ?? { message: null, sha: null };
      const { name } = repo ?? { name: "" };

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
        repoName: name.split("/")[1] ?? null,
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
