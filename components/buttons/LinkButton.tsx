import Link from "next/link";

export default function LinkButton({
  link,
  text,
  align = "center",
  newWindow = false,
}) {
  return (
    <Link href={link} target={newWindow ? "_blank" : "_self"}>
      <button
        style={{
          fontFamily: "Roboto Mono",
          borderColor: "#4ce0b3",
          display: "flex",
          alignSelf: align,
        }}
        className=" border-[#4ce0b3] hover:bg-opacity-80 border p-2 rounded bg-[#4ce0b3] text-[#43527f]"
      >
        {text}
      </button>
    </Link>
  );
}
