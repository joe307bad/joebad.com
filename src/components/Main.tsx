import { ReactNode } from "react";

export function Main(props: { children: ReactNode; activePage: string }) {
  const [isHome, isCv, isBlog] = (() => {
    if (props.activePage === "index") {
      return [true, false, false];
    }

    if (props.activePage === "cv") {
      return [false, true, false];
    }

    return [false, false, true];
  })();

  return (
    <div className="gap-4 w-full md:max-w-3xl flex flex-col self-center">
      <div className=" gap-4 flex flex-col">
        <h1 className="font-mono font-bold text-(--color-primary-500) mt-10 text-xl">
          Welcome, my name is Joe Badaczewski
        </h1>
        <nav className="font-mono font-bold italic text-md gap-4 flex">
          <div className="flex flex-col items-center">
            <a href="/" className="border-b-2 border-(--color-secondary-500)">
              home
            </a>
            <div className="text-(--color-primary-500)">{isHome ? "•" : ""}</div>
          </div>
          <div className="flex flex-col items-center">
            <a href="/cv" className="border-b-2 border-(--color-secondary-500)">
              cv
            </a>
            <div className="text-(--color-primary-500)">{isCv ? "•" : ""}</div>
          </div>
          <div className="flex flex-col items-center">
            <a
              href="/blog"
              className="border-b-2 border-(--color-secondary-500)"
            >
              blog
            </a>
            <div className="text-(--color-primary-500)">{isBlog ? "•" : ""}</div>
          </div>
          <div className="flex flex-col items-center">
            <a
              href="https://x.com/joe307bad"
              className="border-b-2 border-(--color-secondary-500)"
            >
              x
            </a>
            <div></div>
          </div>
          <div className="flex flex-col items-center">
            <a
              href="https://github.com/joe307bad"
              className="border-b-2 border-(--color-secondary-500)"
            >
              github
            </a>
            <div></div>
          </div>
          <div className="flex flex-col items-center">
            <a
              href="https://linkedin.com/in/joebad"
              className="border-b-2 border-(--color-secondary-500)"
            >
              linkedin
            </a>
            <div></div>
          </div>
        </nav>
      </div>

      {props.children}
    </div>
  );
}
