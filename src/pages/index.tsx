import RecentActivity from "../components/RecentActivity";

function Item(props: any) {
  return (
    <li className="flex flex-wrap flex-row gap-2">
      <div className="order-first md:order-none flex-1 md:flex-none md:w-[100px] font-bold mb-[-10px]">
        {props.title}
      </div>
      <div className="w-full order-last md:order-none md:w-auto md:flex-1">
        {props.description} {props.children}
      </div>
    </li>
  );
}

function Link(props: any) {
  return (
    <a className="border-b-2 border-b-[#3a86ff] italic" href={props.href}>
      {props.children}
    </a>
  );
}

export default function Index(props: any) {
  return (
    <div className="gap-4 max-w-[768px] flex flex-col self-center">
      <h1 className="font-mono font-bold text-[#ff006e] mt-10 text-xl">
        Welcome, my name is Joe Badaczewski
      </h1>
      <p className="font-mono">
        I am a senior software development engineer focused on application
        performance, distributed systems, and user interface design.
      </p>
      {/* <ul className="flex font-mono gap-3  md:gap-8">
        <li>
          <a className="italic font-bold border-b-5 border-b-indigo-500" href="">cv</a>
        </li>
        <li>
          <a className="italic font-bold border-b-5 border-b-green-500" href="">blog</a>
        </li>
        <li>
          <a className="italic font-bold border-b-5 border-b-red-500" href="">github</a>
        </li>
        <li>
          <a className="italic font-bold border-b-5 border-b-orange-500" href="">x/twitter</a>
        </li>
        <li>
          <a className="italic font-bold border-b-5 border-b-blue-500" href="">linkedin</a>
        </li>
      </ul> */}
      <p className="font-mono text-[#3a86ff] font-bold pt-10"># projects</p>
      <ul className="font-mono flex flex-col gap-6 md:gap-4">
        <Item title="cards" description="free, cozy card games">
          (<Link href="https://github.com/joe307bad/cards">source</Link> |{" "}
          <Link href="https://cards.joebad.com">site</Link>)
        </Item>
        <Item title="void" description="a simple, intergalactic strategy game">
          (<Link href="https://github.com/joe307bad/end">source</Link> |{" "}
          <Link href="https://void.joebad.com">site</Link>)
        </Item>
        <Item
          title="fastbreak"
          description="daily pro sports pick-em and trivia"
        >
          (<Link href="https://github.com/joe307bad/fastbreak">source</Link>)
        </Item>
        <Item
          title="act"
          description="a general purpose achievement tracking and todo app"
        >
          (<Link href="https://github.com/joe307bad/act">source</Link>)
        </Item>
      </ul>
      <p className="font-mono text-[#8338ec] font-bold pt-10"># feed</p>
      <RecentActivity items={props.rssData.items} />
    </div>
  );
}
