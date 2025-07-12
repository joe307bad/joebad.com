import "./globals.css";
import { ThemeProvider } from "@/components/ThemesProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html id="html" lang="en" className="h-full w-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

        <title>Joe Badaczewski - Senior Software Engineer</title>
        <meta
          name="description"
          content="Joe Badaczewski is a senior software development engineer focused on application performance, distributed systems, and user interface design."
        />

        <link rel="canonical" href="https://joebad.com" />

        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Joe Badaczewski - Senior Software Engineer"
        />
        <meta
          property="og:description"
          content="Joe Badaczewski is a senior software development engineer focused on application performance, distributed systems, and user interface design."
        />
        <meta property="og:url" content="https://joebad.com" />
        <meta
          property="og:site_name"
          content="Joe Badaczewski - Senior Software Engineer"
        />
        <meta property="og:locale" content="en_US" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Joe Badaczewski - Senior Software Engineer"
        />
        <meta
          name="twitter:description"
          content="Joe Badaczewski is a senior software development engineer focused on application performance, distributed systems, and user interface design."
        />
        <meta name="twitter:creator" content="@joe307bad" />
      </head>
      <body className="h-full w-full">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main
            id="root"
            className="p-2 min-h-[100%] w-full justify-center items-start flex bg-(--color-bg)"
          >
            {children}
          </main>
        </ThemeProvider>
        {/* <script>window.__RSS_DATA__ = ${JSON.stringify({
      items: rssData?.items ?? [],
    })};</script>
    ${js ? js : ""}
    <script>${toggleDarkModeListeners}</script> */}
      </body>
    </html>
  );
}
