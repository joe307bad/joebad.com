import BaseWidget from "../BaseWidget";
import { Short } from "contentlayer/generated";

type MostRecentShortProps = {
  short: Short & { formattedDatetime: string };
  nowrap?: boolean;
  className?: string;
};

export function MostRecentShort(props: MostRecentShortProps) {
  const { title, formattedDatetime: date, slug } = props.short;
  const url = `/short/${slug}`;
  console.log("formattedDatetime", props.short.formattedDatetime)
  return (
    <BaseWidget
      heading="Writing blog posts"
      column1={[date, undefined]}
      column2={[title, url]}
      className={""}
      description={
        <>
          {`I like to write about my interests (coding, comics, sports, and movies, to name a few). 
          I started a series of bite sized blog posts
          called 'shorts'. Every post should be between 300-400 and gathers quick
          thoughts on a focused topic. This widget shows my most recent short.`}
        </>
      }
      id={"mostRecentShortWidget"}
      nowrap
    />
  );
}
