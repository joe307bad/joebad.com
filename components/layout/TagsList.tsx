const color = {
  "joebad.com": "pink",
  "side project": "red",
  "web dev": "blue",
  "functional programming": "yellow",
  "coding": "green",
  "comics": "purple",
  "review": "orange",
  "personal tenets": "purple",
  "professional overview": "green",
  "current position": "orange"
};

const possibleTagColors = [
  `bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300`,
  `bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300`,
  `bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300`,
  `bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300`,
  `bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`,
  `bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300`,
  `bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300`,
];

export default function TagsList({ tags }) {
  return tags.map((text) => (
    <span
      key={text}
      style={{ fontFamily: "Roboto Mono" }}
      className={`bg-${color[text]}-100 text-${color[text]}-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-${color[text]}-900 dark:text-${color[text]}-300 whitespace-nowrap break-all inline-block mb-1`}
    >
      {text}
    </span>
  ));
}
