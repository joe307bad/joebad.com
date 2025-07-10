import { SectionHeading } from "./SectionHeading";

export function Post(props: any) {
  return (
    <div className="pb-20 flex gap-4 flex-col">
      <SectionHeading>post</SectionHeading>
      <h1 className="text-lg font-bold font-mono">{props.post.title}</h1>
      <h2 className="font-mono">{props.post.date} • {props.post.subTitle}</h2>
      <div className="border-t-2 border-dotted border-(--color-primary-500) py-2 mt-4"></div>
      {props.children}
    </div>
  );
}
