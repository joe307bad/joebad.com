import { RSSData } from "../types";

export function getHtml(css: string, content: string, js?: string, rssData?: any) {

  return `
<!DOCTYPE html>
<input type="checkbox" style="display: none" id="dark-mode-toggle"></input>
<html id="html" lang="en" class="h-full w-full bg-(--color-bg)">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${css}</style>
    <!-- Basic Meta Tags -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    
    <!-- Primary SEO Tags -->
    <title>Joe Badaczewski - Senior Software Engineer</title>
    <meta name="description" content="Joe Badaczewski is a senior software development engineer focused on application performance, distributed systems, and user interface design.">

    <link rel="canonical" href="https://joebad.com">
    
    <!-- Open Graph Meta Tags (Social Media) -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="Joe Badaczewski - Senior Software Engineer">
    <meta property="og:description" content="Joe Badaczewski is a senior software development engineer focused on application performance, distributed systems, and user interface design.">
    <meta property="og:url" content="https://joebad.com">
    <meta property="og:site_name" content="Joe Badaczewski - Senior Software Engineer">
    <meta property="og:locale" content="en_US">
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Joe Badaczewski - Senior Software Engineer">
    <meta name="twitter:description" content="Joe Badaczewski is a senior software development engineer focused on application performance, distributed systems, and user interface design.">
    <meta name="twitter:creator" content="@joe307bad">
</head>
<body class="h-full w-full" id="${!js ? "mdx" : ""}">
    <main id="root" class="p-2 min-h-[100%] w-full justify-center items-start flex bg-(--color-bg)">${content}</main>
    <script>window.__RSS_DATA__ = ${JSON.stringify({ items: rssData?.items ?? [] })};</script>
    ${js ? js : ""}
    <script>
        const checkbox = document.getElementById('dark-mode-toggle');
        const switchBg = document.getElementById('switch-bg');
        const switchCircle = document.getElementById('switch-circle');
        const html = document.getElementById('html');

        checkbox.addEventListener('change', function() {
            if (this.checked) {
                html.classList.remove('bg-(--color-bg-dark)')
                html.classList.add('bg-(--color-bg)')
                switchCircle.classList.add('translate-x-4');
            } else {
                html.classList.add('bg-(--color-bg-dark)')
                html.classList.remove('bg-(--color-bg)')
                switchCircle.classList.remove('translate-x-4');
            }
        });
    </script>
</body>
</html>
`;
}