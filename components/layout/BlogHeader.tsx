import Link from "next/link";
import ReadMoreShorts from "../buttons/ReadMoreShorts";
import { useFormatter } from "next-intl";
import { Roboto } from "@next/font/google";
import TagsList from "./TagsList";
const roboto = Roboto({
  weight: ["100", "500", "900"],
  subsets: ["latin"],
});
type BlogHeader = {
  tags?: string[];
  title: string;
  dateTime?: number | Date;
  subTitle: string;
  showArchiveLink: boolean;
};

export default function BlogHeader({
  tags,
  title,
  dateTime,
  subTitle,
  showArchiveLink = true,
}: BlogHeader) {
  const format = useFormatter();
  return (
    <div className="w-full flex items-center flex-col bg-[#43527f]">
      <header
        className={`${roboto.className} w-full md:max-w-2xl text-[#4ce0b3] p-5 md:p-0 mb-0 md:mb-10 m-5 md:mb-10 mt-5 pt-0`}
      >
        <div className="flex flex-row">
          <address className="flex items-center mb-6 not-italic flex-1">
            <Link href={"/"}>
              <div className="inline-flex items-center mr-3 text-sm">
                <img
                  className="mr-4 w-20 h-230 rounded-full border-[#4ce0b3] border-2"
                  src="/Joe.jpg"
                  alt="Joe Badaczewski"
                />
                <div>
                  <p className={`${roboto.className} baset-text text-xl`}>
                    Joe Badaczewski
                  </p>
                  <p
                    style={{ fontWeight: 400, fontFamily: "Roboto Mono" }}
                    className="text-base text-[18px]"
                  >
                    Front-End Engineer II @ AWS
                  </p>
                </div>
              </div>
            </Link>
          </address>
          {showArchiveLink && (
            <div className="hidden sm:flex flex items-center">
              <ReadMoreShorts />
            </div>
          )}
        </div>
        {dateTime && (
          <p className="text-base" style={{ fontFamily: "Roboto Mono" }}>
            <time>
              {format.dateTime(dateTime, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </p>
        )}
        <h1 className={`text-3xl font-extrabold leading-tight pb-0 mt-1 mb-2`}>
          {title}
        </h1>
        <div className="mb-5">{tags && <TagsList alignContent="left" tags={tags} />}</div>
        <h2 className="text-base">{subTitle}</h2>
      </header>
    </div>
  );
}
