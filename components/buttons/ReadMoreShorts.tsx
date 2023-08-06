import Link from "next/link";

export default function ReadMoreShorts() {
  return (
    <Link href="/shorts">
      <button
        style={{ fontFamily: "Roboto Mono", borderColor: "#4ce0b3" }}
        className=" border-[#4ce0b3] hover:bg-opacity-80 border p-2 rounded bg-[#4ce0b3] text-[#43527f]"
      >
        Read more shorts
      </button>
    </Link>
  );
}
