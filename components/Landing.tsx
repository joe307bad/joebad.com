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
import LinkButton from "./buttons/LinkButton";

export const roboto = Roboto({
  weight: ["100", "400", "700"],
  subsets: ["latin"],
});

export default function Landing({ children }) {
  const yoe = new Date().getFullYear() - 2012;

  return (
    <>
      <div className="w-full mt-5 md:h-1/4 wide:landscape:h-0"></div>
      <div
        id={styles.landing}
        className="wide:landscape:flex-row flex flex-col w-full wide:landscape:h-3/4 md:h-1/2 h-3/4 relative"
      >
        <div className="flex flex-col">
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
          <div className="flex flex-col wide:landscape:flex-row items-center">
            <h1
              className={`font-[Roboto] p-10 pt-1 pb-1 md:max-w-4xl text-[25px] md:text-[40px] font-thin`}
            >
              Hey there, my name is{" "}
              <strong className="font-bold">Joe Badaczewski</strong>.{" "}
              <span className="wide:landscape:hidden">
                I am a Pittsburgh-based Senior Software Engineer.
              </span>
            </h1>
            <div className="mt-2 mb-2 m-4 md:ml-0 md:mr-0">
              <LinkButton
                link={"/experience"}
                text={`${yoe} years of exp. building large-scale web and mobile apps`}
              />
            </div>
          </div>
        </div>
        <div
          className="justify-center items-center wide:landscape:items-start wide:landscape:p-10 "
          style={{
            marginTop: 10,
            display: "flex",
            fontSize: 40,
            gap: 10,
            columnGap: 20,
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
