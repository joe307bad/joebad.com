import { ReactNode } from "react";

function DarkModeSwitch() {
  return (
    <div className="flex items-center space-x-3">
      <label
        for="dark-mode-toggle"
        class="relative inline-flex items-center cursor-pointer"
      >
        <input id="dark-mode-toggle" type="checkbox" className="sr-only" />
        <div
          id="switch-bg"
          className="relative w-8 h-4 bg-(--color-primary-500) rounded-full transition-colors duration-200"
        >
          <div
            id="switch-circle"
            className="absolute top-0.5 left-0.5 w-3 h-3 bg-(--color-text) rounded-full transition-transform duration-200"
          ></div>
        </div>
      </label>
    </div>
  );
}

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
    <div className="gap-4 w-full md:max-w-3xl flex flex-col">
      <div className=" gap-4 flex flex-col">
        <h1 className="font-mono font-bold text-(--color-primary-500) mt-10 text-xl">
          Welcome, my name is Joe Badaczewski
        </h1>
        <DarkModeSwitch />
        <nav className="font-mono font-bold italic text-md gap-4 flex">
          <div className="flex flex-col items-center">
            <a href="/" className="border-b-2 border-(--color-secondary-500)">
              home
            </a>
            <div className="text-(--color-primary-500)">
              {isHome ? "•" : ""}
            </div>
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
            <div className="text-(--color-primary-500)">
              {isBlog ? "•" : ""}
            </div>
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
