import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedin,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import localFont from "@next/font/local";
import { Roboto } from "@next/font/google";

const font = localFont({ src: "../fonts/payback-webfont.woff2" });

const roboto = Roboto({
  weight: "100",
  subsets: ["latin"],
});

export default function Landing() {
  return (
    <>
      <div
        style={{
          position: "relative",
          width: 100,
          height: 100,
          margin: "0 auto",
        }}
      >
        <Image src="/joebad-logo.png" layout="fill" objectFit="contain"  alt="Joe Bad's logo"/>
      </div>
      <h1 className={font.className}>
        <strong>Joe</strong> Badaczewski
      </h1>
      <h2 className={roboto.className}>
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
          <FontAwesomeIcon icon={faLinkedin} />
        </Link>
        <Link href="https://twitter.com/joe307bad">
          <FontAwesomeIcon icon={faTwitter} />
        </Link>
        <Link href="https://github.com/joe307bad/">
          <FontAwesomeIcon icon={faGithub} />
        </Link>
      </div>
    </>
  );
}
