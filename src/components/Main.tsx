import { ReactNode } from "react";

export function Main(props: { children: ReactNode }) {
  return (
    <div className="gap-4 w-full md:max-w-3xl flex flex-col self-center ">
      <div className=" gap-4 flex flex-col">
        <h1 className="font-mono font-bold text-(--color-primary-500) mt-10 text-xl">
          Welcome, my name is Joe Badaczewski
        </h1>
        <nav className="font-mono font-bold italic text-md text-">
          <a
            href="/"
            className="mr-4 border-b-2 border-(--color-secondary-500)"
          >
            home
          </a>
          <a
            href="/cv"
            className="mr-4 border-b-2 border-(--color-secondary-500)"
          >
            cv
          </a>
          <a
            href="/blog"
            className="mr-4 border-b-2 border-(--color-secondary-500)"
          >
            blog
          </a>
          <a
            href="https://x.com/joe307bad"
            className="mr-4 border-b-2 border-(--color-secondary-500)"
          >
            x
          </a>
          <a
            href="https://github.com/joe307bad"
            className="mr-4 border-b-2 border-(--color-secondary-500)"
          >
            github
          </a>
          <a
            href="https://linkedin.com/in/joebad"
            className="mr-4 border-b-2 border-(--color-secondary-500)"
          >
            linkedin
          </a>
        </nav>
      </div>

      {props.children}
    </div>
  );
}
