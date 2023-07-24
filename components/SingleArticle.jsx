import { Roboto } from "@next/font/google";
import styles from "../styles/short.module.scss";
import "prismjs/themes/prism-coy.css";
import { useEffect } from "react";
import Prism from "prismjs";
import { useFormatter } from "next-intl";

export const roboto = Roboto({
  weight: ["100", "500", "900"],
  subsets: ["latin"],
});

export const SingleArticle = ({
  author,
  image,
  category,
  title,
  children,
  publishedAt,
  subTitle,
}) => {
  const format = useFormatter();
  const dateTime = new Date(publishedAt);
  useEffect(() => {
    const highlight = async () => {
      await Prism.highlightAll();
    };
    highlight();
  }, [title, publishedAt]);
  return (
    <div className={`${styles.singleArticle} flex justify-between`}>
      <article className="items-center flex flex-col mx-auto w-full format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
        <div className="w-full flex items-center flex-col bg-[#43527f]">
          <header
            className={`${roboto.className} w-full max-w-2xl text-[#4ce0b3] p-5 md:p-0 mb-0 md:mb-10 m-5 md:mb-10 mt-5 pt-0`}
          >
            <address className="flex items-center mb-6 not-italic">
              <div className="inline-flex items-center mr-3 text-sm">
                <img
                  className="mr-4 w-20 h-230 rounded-full border-[#4ce0b3] border-2"
                  src="/Joe.jpg"
                  alt="Joe Badaczewski"
                />
                <div>
                  <p href="#" rel="author" className="text-xl">
                    Joe Badaczewski
                  </p>
                  <p style={{ fontWeight: 100 }} className="text-base">
                    Front-end Engineer II @ AWS
                  </p>
                </div>
              </div>
            </address>
            <p className="text-base">
              <time>
                {format.dateTime(dateTime, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </p>
            <h1
              className={`mb-4 text-3xl font-extrabold leading-tight pb-0 mb-10 mt-1`}
            >
              {title}
            </h1>
            <h2 className="text-base font-light">{subTitle}</h2>
          </header>
        </div>
        <div
          className={`${styles.articleContent} articleContent max-w-full md:max-w-2xl p-5 md:p-0 pt-0 mt-5 md:mt-10`}
        >
          {children}
        </div>
      </article>
    </div>
  );
};
