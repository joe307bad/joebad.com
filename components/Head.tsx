import H from "next/head";

export default function Head() {
  return (
    <H>
      <title>Joe Badaczewski | Senior Software Engineer</title>
      <link rel="icon" href="/favicon.ico" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="true"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@200;500&family=Roboto:wght@300;500&display=swap"
        rel="preload"
      />
      <link
        rel="preload"
        href="/Geist-Regular.woff2"
        as="font"
        crossOrigin=""
        type="font/woff2"
      />
      <meta name="title" content="Joe Badaczewski | Senior Software Engineer" />
    </H>
  );
}
