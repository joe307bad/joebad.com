import { format, previousDay } from "date-fns";
import Redis from "ioredis";

const redisPw = process.env.REDIS_PASSWORD;
const client = new Redis(
  `redis://:${redisPw}@fly-empty-cherry-3230.upstash.io:6379/4`
);

type Score = {
  homeTeam: string;
  awayTeam: string;
  homeScore: string;
  awayScore: string;
  date: Date;
};

export function sportsScoresApi() {
  return {
    async pitt() {
      try {
        const givenDate = new Date();
        const lastSaturday = format(previousDay(givenDate, 6), "yyyyMMdd");

        const scoreboardUrl = `https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard?dates=${lastSaturday}`;
        const scoreboard = await fetch(scoreboardUrl).then((res) => res.json());
        const eventId = scoreboard.events.find((e) =>
          e.name.includes("Pittsburgh Panthers")
        ).id;

        const url = `https://site.api.espn.com/apis/site/v2/sports/football/college-football/summary?event=${eventId}`;

        const data = await fetch(url).then((res) => res.json());

        const lastScoringPlay = data.scoringPlays[data.scoringPlays.length - 1];
        const homeTeam = data.boxscore.teams.find((t) => t.homeAway === "home")
          .team.displayName;
        const awayTeam = data.boxscore.teams.find((t) => t.homeAway === "away")
          .team.displayName;

        const obj: Score = {
          homeTeam,
          awayTeam,
          homeScore: lastScoringPlay.homeScore,
          awayScore: lastScoringPlay.awayScore,
          date: data.header.competitions[0].date,
        };

        const b = await client.get("pitt");
        await client.set("pitt", JSON.stringify(obj));

        return obj;
      } catch (_) {
        try {
          return JSON.parse((await client.get("pitt")) ?? "{}") as Score;
        } catch (_) {
          return null;
        }
      }
    },
  };
}
