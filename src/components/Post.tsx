export function Post(props: any) {
  console.log("post props", { props })
  return (
    <>
      <h1 className="text-lg font-bold font-mono">{props.post.title}</h1>
      <span>{props.post.publishedAt?.toString()}</span>
      {props.children}
    </>
  );
}