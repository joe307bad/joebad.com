"use client";

import { ArrowUpRight } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import { SmallLogo } from "./SmallLogo";

function DarkModeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();

  const currentTheme = theme === "system" ? systemTheme : theme;

  const isDark = currentTheme === "dark";

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const translate = isDark ? "translate-x-4" : "";

  return (
    <div className="flex items-baseline pt-[5px] space-x-3 absolute right-[10px] top-[6px] md:relative md:right-auto md:top-auto">
      <button
        aria-label="Theme selector"
        onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
      >
        <div
          id="switch-bg"
          className="relative w-8 h-4 bg-(--color-primary-500) rounded-full transition-colors duration-200"
        >
          <div
            id="switch-circle"
            className={`absolute top-0.5 left-0.5 w-3 h-3 bg-(--color-text) rounded-full transition-transform duration-200 ${translate}`}
          ></div>
        </div>
      </button>
    </div>
  );
}

export function Main(props: {
  title?: string;
  children: ReactNode;
  activePage: string;
  isPage?: boolean;
}) {
  const title =
    !props.title || props.title?.trim() === ""
      ? "  Welcome, my name is Joe Badaczewski"
      : props.title;

  const [isHome, isCv, isBlog] = (() => {
    if (props.activePage === "index") {
      return [true, false, false];
    }

    if (props.activePage === "cv") {
      return [false, true, false];
    }

    return [false, false, true];
  })();

  const id = props.isPage ? "page" : "";

  return (
    <div id={id} className="gap-4 w-full md:max-w-3xl flex flex-col mb-20">
      <div className=" gap-4 flex flex-col">
        <h1 className="font-mono font-bold text-(--color-primary-500) mt-10 md:text-2xl text-lg">
          <SmallLogo />
          {title}
        </h1>
        <div className="flex gap-4 max-w-[100%] overflow-y-auto">
          <nav className="font-mono font-bold italic text-sm md:text-lg gap-4 flex">
            <div className="flex flex-col items-center">
              <Link
                href="/"
                className="border-b-2 border-(--color-secondary-500)"
              >
                home
              </Link>
              <div className="text-(--color-primary-500)">
                {isHome ? "•" : ""}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <Link
                href="/cv"
                className="border-b-2 border-(--color-secondary-500)"
              >
                cv
              </Link>
              <div className="text-(--color-primary-500)">
                {isCv ? "•" : ""}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <Link
                href="/blog"
                className="border-b-2 border-(--color-secondary-500)"
              >
                blog
              </Link>
              <div className="text-(--color-primary-500)">
                {isBlog ? "•" : ""}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <a
                href="https://x.com/joe307bad"
                className="border-b-2 border-(--color-secondary-500) flex gap-2 items-center"
                target="_blank"
              >
                x
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <div></div>
            </div>
            <div className="flex flex-col items-center">
              <a
                href="https://github.com/joe307bad"
                className="border-b-2 border-(--color-secondary-500) flex gap-2 items-center"
                target="_blank"
              >
                github
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <div></div>
            </div>
            <div className="flex flex-col items-center">
              <a
                href="https://linkedin.com/in/joebad"
                className="border-b-2 border-(--color-secondary-500) flex gap-2 items-center"
                target="_blank"
              >
                linkedin
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <div></div>
            </div>
          </nav>
          <DarkModeSwitch />
        </div>
      </div>

      {props.children}
    </div>
  );
}
