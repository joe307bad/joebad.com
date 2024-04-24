import styles from "../styles/v2.module.scss";
import Link from "next/link";
import TagsList from "./layout/TagsList";
import Stars from "./Rating";
import { MovieDetails } from "@widgets/MostRecentMovie";
import { CommitDetails } from "@widgets/MostRecentCommit";
import { Learning, Short } from "contentlayer/generated";
import Header from "./layout/Header";
import Page from "../components/Page";
import { useMDXComponent } from "next-contentlayer/hooks";

export default function V2({
  mostRecentMovie,
  shorts,
  mostRecentCommit,
  mostRecentLearning
}: {
  mostRecentMovie: MovieDetails;
  mostRecentCommit: CommitDetails;
  shorts: (Short & { formattedDatetime: string })[];
  mostRecentLearning: Learning;
}) {
  const MDXContent = useMDXComponent(mostRecentLearning.body.code);

  return (
    <Page>
      <Header />
      <br />
      <div className="inline">
        <span>
          <Link href="/cv">CV</Link>
        </span>
        {/*<span className='pl-2'>◆</span>*/}
        {/*<span className='pl-2'><Link href="/">Blog</Link></span>*/}
        <span className="pl-2">◆</span>
        <span className="pl-2">
          <Link target="_blank" href="https://github.com/joe307bad/">
            Github
          </Link>
        </span>
        <span className="pl-2">◆</span>
        <span className="pl-2">
          <Link target="_blank" href="https://x.com/joe307bad">
            Twitter/X
          </Link>
        </span>
        <span className="pl-2">◆</span>
        <span className="pl-2">
          <Link target="_blank" href="https://www.linkedin.com/in/joebad/">
            LinkedIn
          </Link>
        </span>
        {/*<span className='pl-2'>◆</span>*/}
        {/*<span className='pl-2'><Link href="/">Email</Link></span>*/}
      </div>
      <br />
      <br />
      <br />
      <h2 className="h-[37px] font-bold">Projects</h2>
      <div className="border-l-[5px] border-l-[#f26130] p-1 pl-5">
        <div className="flex">
          <h3 className="text-lg">end</h3>
          <span className="pl-5">
            <TagsList tags={["active development"]} />
          </span>
        </div>
        <br />
        <p>
          Interplanetary macroeconomic simulator with RPG and turn-based
          strategy elements
        </p>
        <br />
        <div className="flex">
          <div>◆</div>
          <p className="pl-2">
            Built with: TypeScript, React, React Native, Nx, Three.js, React
            Three Fiber, NestJS, WatermelonDB, MongoDB
          </p>
        </div>
        <div className="flex">
          <div>◆</div>
          <p className="pl-2">Deployed using: Docker and Fly.io</p>
        </div>
        <div className="flex">
          <div>◆</div>
          <p className="pl-2">
            Principles: Cross-platform (web + native mobile), offline-first
          </p>
        </div>
        <br />
        <div className="inline">
          <span>
            <Link target="_blank" href="https://github.com/joe307bad/end">
              Github
            </Link>
          </span>
          {/*<span className='pl-2'>◆</span>*/}
          {/*<span className='pl-2'><Link href="/">Website</Link></span>*/}
          {/*<span className='pl-2'>◆</span>*/}
          {/*<span className='pl-2'><Link href="/">Download</Link></span>*/}
        </div>
      </div>
      <br />
      <br />
      <div className="border-l-[5px] border-l-[#f26130] p-1 pl-5">
        <div className="flex">
          <h3 className="text-lg">act</h3>
          <span className="pl-5">
            <TagsList tags={["active development"]} />
          </span>
        </div>
        <br />
        <p>General purpose achievement tracker</p>
        <br />
        <div className="flex">
          <div>◆</div>
          <p className="pl-2">
            Built with: TypeScript, React, React Native, Nx, NestJS,
            WatermelonDB, CouchDB, Keycloak
          </p>
        </div>
        <div className="flex">
          <div>◆</div>
          <p className="pl-2">
            Principles: Self-hostable with Docker Compose, Cross-platform (web +
            native mobile), offline-first
          </p>
        </div>
        <br />
        <div className="inline">
          <span>
            <Link target="_blank" href="https://github.com/joe307bad/act">
              Github
            </Link>
          </span>
          {/*<span className='pl-2'>◆</span>*/}
          {/*<span className='pl-2'><Link href="/">Website</Link></span>*/}
          {/*<span className='pl-2'>◆</span>*/}
          {/*<span className='pl-2'><Link href="/">Download</Link></span>*/}
        </div>
      </div>
      <br />
      <br />
      <br />
      <h2 className="h-[37px] font-bold">Activity</h2>
      <div className="border-l-[5px] border-l-[purple] p-1 pl-5">
        <h3 className="text-lg">Programming on Github</h3>
        <br />
        <p>
          {mostRecentCommit.date} ◆{" "}
          <Link
            target="_blank"
            className={styles.purple}
            href={mostRecentCommit.repoLink}
          >
            {mostRecentCommit.repoName}
          </Link>{" "}
          ◆ {mostRecentCommit.message}
        </p>
        <br />
        <span>
          <Link className={styles.purple} href={mostRecentCommit.link}>
            View this commit on Github
          </Link>
        </span>
      </div>
      <br />
      <br />
      <div className="border-l-[5px] border-l-[#4ce0b3] p-1 pl-5">
        <h3 className="text-lg">
          Rating movies using{" "}
          <Link
            target="_blank"
            className={styles.cyan}
            href="https://github.com/michaldrabik/showly-2.0"
          >
            Showly
          </Link>
        </h3>
        <br />
        <div className="flex items-center">
          <p>
            {mostRecentMovie.date} ◆{" "}
            <Link
              target="_blank"
              className={styles.cyan}
              href={mostRecentMovie.url ?? ""}
            >
              {mostRecentMovie.name}
            </Link>{" "}
            ◆
          </p>
          <span className="">
            <Stars
              stars={
                mostRecentMovie.rating
                  ? Math.floor(mostRecentMovie.rating / 2)
                  : 0
              }
            />
          </span>
        </div>
        <br />
        <span>
          <Link
            target="_blank"
            className={styles.cyan}
            href="https://trakt.tv/users/joe307bad/ratings"
          >
            My ratings
          </Link>
        </span>
      </div>
      <br />
      <br />
      <div className={styles.education}>
        <div className="border-l-[5px] border-l-[#DCF763] p-1 pl-5">
          <h3 id="continuing-education" className="text-lg">
            Continuing education and taking notes
          </h3>
          <br />
          <div className="flex items-center">
            <p>
              {mostRecentLearning.publishedAt} ◆{" "}
              <Link
                target="_blank"
                className={styles.cyan}
                href={mostRecentLearning.courseLink ?? ""}
              >
                {mostRecentLearning.courseTitle}
              </Link>
            </p>
          </div>
          <br />
          <MDXContent />
          <br />
          <span>
            <Link
              target="_blank"
              className={styles.cyan}
              href={`https://github.com/joe307bad/joebad.com/tree/main/data/${mostRecentLearning._id}`}
            >
              View this note on GitHub
            </Link>
          </span>
        </div>
      </div>
    </Page>
  );
}
