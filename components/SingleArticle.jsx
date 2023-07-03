import { Roboto } from "@next/font/google";
import styles from "../styles/short.module.scss";
import "prismjs/themes/prism-coy.css";
import { useEffect } from "react";
import Prism from "prismjs";

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
}) => {
  useEffect(() => {
    const highlight = async () => {
      await Prism.highlightAll(); // <--- prepare Prism
    };
    highlight(); // <--- call the async function
  }, [title]);
  return (
    <main
      className={`${styles.singleArticle} pt-8 pb-16 lg:pt-16 lg:pb-24 bg-white dark:bg-gray-900`}
    >
      <div className="flex justify-between px-4 mx-auto max-w-screen-xl ">
        <article className="mx-auto w-full max-w-2xl format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
          <header className="mb-4 lg:mb-6 not-format">
            <address className="flex items-center mb-6 not-italic">
              <div className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white">
                <img
                  style={{ backgroundColor: "#43527f" }}
                  className="mr-4 w-12 h-12 rounded-full border-5 border-blue-100"
                  src="/Joe.jpg"
                  alt="Jese Leos"
                />
                <div>
                  <p
                    href="#"
                    rel="author"
                    className="text-xl text-gray-900 dark:text-white"
                  >
                    Joe Badaczewski
                  </p>
                  <p className="text-base font-light text-gray-500 dark:text-gray-400">
                    Front-end Engineer II @ AWS
                  </p>
                  <p className="text-base font-light text-gray-500 dark:text-gray-400">
                    <time
                      pubdate
                      dateTime="2022-02-08"
                      title="February 8th, 2022"
                    >
                      {publishedAt}
                    </time>
                  </p>
                </div>
              </div>
            </address>
            <h1
              className={`mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl dark:text-white`}
            >
              {title}
            </h1>
          </header>
          {children}
        </article>
      </div>
    </main>
  );
};
