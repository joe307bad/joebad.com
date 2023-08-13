import Image from "next/legacy/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedin,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { Roboto } from "@next/font/google";
import styles from "../styles/landing.module.scss";

export const roboto = Roboto({
  weight: ["100", "400", "700"],
  subsets: ["latin"],
});

export default function Landing({ children }) {
  const yoe = new Date().getFullYear() - 2012;

  return (
    <>
      <div className="w-full md:h-1/4 wide:landscape:h-0"></div>
      <div
        id={styles.landing}
        className="wide:landscape:flex-row flex flex-col wide:landscape: justify-center w-full wide:landscape:h-3/4 md:h-1/2 h-3/4 wide:landscape: relative"
      >
        <div className="justify-center items-center flex flex-col">
          <div
            className="block wide:landscape:hidden"
            style={{
              position: "relative",
              width: 100,
              height: 100,
              margin: "0 auto",
            }}
          >
            <Image
              src="/joebad-logo.png"
              layout="fill"
              objectFit="contain"
              alt="Joe Bad's logo"
            />
          </div>
          <h1
            className={`${roboto.className} p-10 pt-1 pb-1 md:max-w-4xl text-[25px] md:text-[40px] font-thin`}
          >
            Hey there, my name is{" "}
            <strong className="font-bold">Joe Badaczewski</strong>.{" "}
            <span className="wide:landscape:hidden">
              I am a Pittsburgh-based Senior Software Engineer.
            </span>
          </h1>
          <span className="wide:landscape:hidden">◆</span>
          <h2
            className={`${roboto.className}  font-sans md:max-w-2xl p-1 text-[20px] md:text-[27px] font-thin wide:landscape:hidden`}
          >
            {`I have ${yoe} years of experience building and scaling high volume web and mobile apps. I currently work as a Front-End Engineer II at `}
            <Link href={"https://aws.amazon.com/"}>AWS</Link>.
          </h2>
        </div>
        <span>◆</span>
        <div
          className="items-center wide:landscape:p-10 "
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
            <FontAwesomeIcon icon={faLinkedin} />
          </Link>
          <Link href="https://twitter.com/joe307bad">
            <FontAwesomeIcon icon={faTwitter} />
          </Link>
          <Link href="https://github.com/joe307bad/">
            <FontAwesomeIcon icon={faGithub} />
          </Link>
        </div>
      </div>
      <div className="w-full h-1/4 flex items-end pb-5 z-[1] relative">
        {children}
      </div>
    </>
  );
}
