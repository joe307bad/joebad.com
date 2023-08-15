import styles from "../styles/page.module.scss";
import Link from "next/link";
import Image from "next/legacy/image";
import TagsList from "./layout/TagsList";

export default function Page({ page, children }) {
  return (
    <div
      className={`${styles.experience} flex justify-center text-center bg-[#43527f] pb-10`}
    >
      <style global jsx>{`
        html,
        body {
          background: #43527f;
        }
      `}</style>
      <div className={`w-full md:max-w-2xl p-5 md:p-0`}>
        <div
          className="h-[100px] w-[100px]"
          style={{
            position: "relative",
            margin: "10px auto",
          }}
        >
          <Link href="/">
            <Image
              src="/joebad-logo.png"
              layout="fill"
              objectFit="contain"
              alt="Joe Bad's logo"
              className="block"
            />
          </Link>
        </div>
        <TagsList tags={["professional profile"]} />
        <h1 className="font-[Roboto] font-thin text-2xl md:text-4xl pb-5 text-[#4ce0b3]">
          {page.title}
        </h1>
        <span className="block pb-5 text-[#4ce0b3]">◆</span>
        <TagsList tags={["career overview"]} />
        <h2 className="font-[Roboto] font-thin text-2xl pb-5 text-[#4ce0b3]">
          {page.subtitle}
        </h2>
        <span className="block pb-5 text-[#4ce0b3]">◆</span>
        <div className={`${styles.content}`}>{children}</div>
      </div>
    </div>
  );
}
