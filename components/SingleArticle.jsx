import { Roboto } from "@next/font/google";
import styles from "../styles/short.module.scss";
import "prismjs/themes/prism-coy.css";
import { useEffect } from "react";
import Prism from "prismjs";
import ReadMoreShorts from "./buttons/ReadMoreShorts";
import BlogHeader from "./layout/BlogHeader";

export const roboto = Roboto({
  weight: ["100", "500", "900"],
  subsets: ["latin"],
});

export const SingleArticle = ({ title, children, publishedAt, subTitle, tags }) => {
  const dateTime = new Date(publishedAt);
  useEffect(() => {
    const highlight = async () => {
      await Prism.highlightAll();
    };
    highlight();
  }, [title, publishedAt]);
  return (
    <div className={`${styles.singleArticle} flex justify-between mb-10`}>
      <article className="items-center flex flex-col mx-auto w-full format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
        <BlogHeader
          title={title}
          subTitle={subTitle}
          dateTime={dateTime}
          tags={tags}
        />
        <div
          className={`${styles.articleContent} articleContent max-w-full md:max-w-2xl p-5 md:p-0 pt-0 mt-5 md:mt-10`}
        >
          {children}
        </div>
        <ReadMoreShorts />
      </article>
    </div>
  );
};
