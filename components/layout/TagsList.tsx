const color = {
  "joebad.com": "pink",
  "side project": "cyan",
  "web dev": "blue",
  "functional programming": "yellow",
  coding: "green",
  comics: "purple",
  review: "orange",
  "professional profile": "purple",
  "career overview": "green",
  "current position": "orange",
  react: "red",
  typescript: "orange",
  "full-stack": "green",
  rxjs: "yellow",
  "project management": "pink",
  "extended experience": "teal",
  "react native": "slate",
  "AWS": "gray",
  "OIDC": "zinc",
  "micro frontends": "neutral",
  "microservices": "stone",
  "IOC": "amber",
  "C#": "lime",
  "docker": "emerald",
  "distributed systems": "teal",
  "redux": "cyan",
  "CI": "sky",
  "CD": "indigo",
  "git": "violet",
  "node.js": "fuchsia",
  "nestjs": "rose",
  "angular": "red",
  "OOP": "cyan",
  ".NET": "blue",
  "jquery": "yellow",
  "wordpress": "green",
  "HTML": "purple",
  "CSS": "teal",
  "PHP": "orange",
  "javascript": "emerald",
  "early experience": "slate",
};

const possibleTagColors = [
  `bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300`,
  `bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300`,
  `bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300`,
  `bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300`,
  `bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`,
  `bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300`,
  `bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300`,
  `bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300`,
  `bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300`,
  `bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300`,
  `bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300`,
  `bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-300`,
  `bg-neutral-100 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-300`,
  `bg-stone-100 text-stone-800 dark:bg-stone-900 dark:text-stone-300`,
  `bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300`,
  `bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-300`,
  `bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300`,
  `bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300`,
  `bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300`,
  `bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300`,
  `bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300`,
  `bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-300`,
  `bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300`,
];

export default function TagsList({ tags, alignContent: alignProp = "center" }) {
  const align = (() => {
    switch (alignProp) {
      case "center":
        return "justify-center";
      case "left":
        return "justify-start";
    }
  })();
  return (
    <div className={`flex flex-wrap ${align}`}>
      {tags.map((text) => (
        <span
          key={text}
          style={{ fontFamily: "Roboto Mono" }}
          className={`bg-${color[text]}-100 text-${color[text]}-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-${color[text]}-900 dark:text-${color[text]}-300 whitespace-nowrap break-all inline-block mb-1`}
        >
          {text}
        </span>
      ))}
    </div>
  );
}
