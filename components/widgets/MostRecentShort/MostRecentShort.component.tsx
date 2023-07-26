import BaseWidget from "../BaseWidget";
import { Short } from "contentlayer/generated";

type MostRecentShortProps = {
  short: Short;
  nowrap?: boolean;
  className?: string;
};

export function MostRecentShort(props: MostRecentShortProps) {
  const { title, publishedAt: date, slug } = props.short;
  const url = `/short/${slug}`;
  return (
    <BaseWidget
      heading="Writing blog posts"
      column1={[date, undefined]}
      column2={[title, url]}
      className={""}
      description={
        <>
          {`I like to write about my interests (coding, comics, sports, movies,
          among other things). I started a series of bite sized blog posts
          called 'shorts'. Every post should be between 300-400 and gathers quick
          thoughts on a focused topic.`}
        </>
      }
      id={"mostRecentShortWidget"}
      nowrap
    />
  );
}
