import Link from "next/link";

export default function LinkButton({
  link,
  text,
  align = "center",
  newWindow = false,
  variant = "primary",
}: {
  link: string;
  text: string;
  align?: "center" | "start";
  newWindow?: boolean;
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
}) {
  const bgColor = (() => {
    switch (variant) {
      case "primary":
        return ["bg-[#4ce0b3]"];
      case "secondary":
        return ["bg-[#FCFF6C]"];
    }
  })();
  return (
    <Link
      rel="noopener noreferrer"
      href={link}
      target={newWindow ? "_blank" : "_self"}
    >
      <button
        style={{
          fontFamily: "Roboto Mono",
          display: "flex",
          alignSelf: align,
        }}
        className={`hover:bg-opacity-80 p-2 rounded ${bgColor} text-[#43527f]`}
      >
        {text}
      </button>
    </Link>
  );
}
