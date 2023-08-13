import BaseWidget from "../BaseWidget";
import { Short } from "contentlayer/generated";
import Link from "next/link";

type MostRecentShortProps = {
  short: Short & { formattedDatetime: string };
  nowrap?: boolean;
  className?: string;
};

export function MostRecentShort(props: MostRecentShortProps) {
  const { title, formattedDatetime: date, slug } = props.short;
  const url = `/short/${slug}`;

  return (
    <BaseWidget
      heading={
        <span>
          Keeping a <Link href="/shorts">digital journal</Link>
        </span>
      }
      column1={[date, undefined]}
      column2={[title, url, false]}
      className={""}
      description={
        <>
          {`I like to write about my interests (coding, comics, sports, and movies, to name a few). 
          I started a series of bite sized blog posts
          called 'shorts'. Every post should be between 300-400 words and gathers quick
          thoughts on a focused topic. This widget shows my most recent short.`}
        </>
      }
      id={"mostRecentShortWidget"}
      nowrap
    />
  );
}
