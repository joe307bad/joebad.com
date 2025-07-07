import { Main } from "../components/Main"
import { SectionHeading } from "../components/SectionHeading";

type Post = {
  title?: string;
  date?: string;
  author?: string;
  tags?: string[];
  description?: string;
  slug?: string;
}

export default function Blog(props: { posts: Post[] }) {
  
  return (
    <Main>
      <SectionHeading>posts</SectionHeading>
      <div className="flex flex-col">
        <div>
          {props.posts.map((post, i) => (
            <div className="flex md:gap-8 gap-2 font-mono pb-2"><div><b>{props.posts.length - i}.</b></div> <div className="whitespace-nowrap">{post.date}</div> <div className="truncate"><a href={`/post/${post.slug}`}>{post.title}</a></div></div>
          ))}
        </div>
      </div>
    </Main>
  )
}