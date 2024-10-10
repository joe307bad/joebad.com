import { format, previousDay } from "date-fns";

export function sportsScoresApi() {
  return {
    async pitt() {
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

      const obj = {
        homeTeam,
        awayTeam,
        homeScore: lastScoringPlay.homeScore,
        awayScore: lastScoringPlay.awayScore,
        date: data.header.competitions[0].date,
      };

      return data;
    },
  };
}
