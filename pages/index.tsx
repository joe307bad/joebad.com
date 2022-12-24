import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLinkedin,
  faTwitter,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import { allArticles } from "contentlayer/generated";
import { select } from "../utils/select";
import Image from "next/image";
import Link from "next/link";
import MostRecentMovie from "../components/widgets/MostRecentMovie";
import { useEffect, useState } from "react";

export default function Home({ articles }) {
  const [movieDetails, setMovieDetails] = useState<{
    name?: string;
    description?: string;
    photoSrc?: string;
  }>({});

  useEffect(() => {
      // TODO move this to SSR
    fetch("/api/most-recent-movie/").then(async (response) => {
      const movieDetailsRes = await response.json();
      setMovieDetails(movieDetailsRes);
    });
  }, []);

  return (
    <>
      <Head>
        <title>Joe Badaczewski | Front-End Engineer</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Pridi:wght@300;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      <main style={{ paddingLeft: 50, textAlign: "center" }}>
        <div style={{ paddingLeft: 50 }}>
          <div
            style={{
              position: "relative",
              width: 100,
              height: 100,
              margin: "0 auto",
            }}
          >
            <Image src="/joebad-logo.png" layout="fill" objectFit="contain" />
          </div>
          <h1>
            <strong>Joe</strong> Badaczewski
          </h1>
          <h2>
            Pittsburgh-based Front-End Engineer at{" "}
            <Link href={"https://aws.amazon.com/"}>AWS</Link>
          </h2>
          <div
            style={{
              marginTop: 10,
              display: "flex",
              fontSize: 40,
              gap: 10,
              columnGap: 20,
              justifyContent: "center",
            }}
          >
            <Link href="https://www.linkedin.com/in/joebad/">
              <a>
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
            </Link>
            <Link href="https://twitter.com/joe307bad">
              <a>
                <FontAwesomeIcon icon={faTwitter} />
              </a>
            </Link>
            <Link href="https://github.com/joe307bad/">
              <a>
                <FontAwesomeIcon icon={faGithub} />
              </a>
            </Link>
          </div>
          <MostRecentMovie
            title={movieDetails?.name}
            thumbnail={movieDetails?.photoSrc}
            description={movieDetails?.description}
          />
        </div>
      </main>
    </>
  );
}

export function getStaticProps() {
  const articles = allArticles
    .map((article) =>
      select(article, [
        "slug",
        "title",
        "description",
        "publishedAt",
        "readingTime",
        "author",
        "category",
        "image",
      ])
    )
    .sort(
      (a, b) =>
        Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt))
    );

  return { props: { articles } };
}
