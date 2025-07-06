import { SectionHeading } from "./SectionHeading";

export function Post(props: any) {
  return (
    <>
    <SectionHeading>{`${props.post.date}`}</SectionHeading>
      <h1 className="text-lg font-bold font-mono">{props.post.title}</h1>
      {props.children}
    </>
  );
}