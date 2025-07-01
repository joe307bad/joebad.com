import { RSSData } from "../types";

export function getHtml(css: string, content: string, js?: string, rssData?: RSSData) {

  return `
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body >
  <div id="root">${content}</div>
    ${js ? js : ""}
</body>
</html>`;
}