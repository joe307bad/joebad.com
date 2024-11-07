import Link from "next/link";

export default function BlogHeaderV2() {
  return (
    <div className="w-full items-end">
      <div className="pb-2 pt-4">
        <div style={{ height: 50, width: 95 }}>
          <Link href="/">
            <img className="pb-5" width={95} src="/joe.png" />
          </Link>
        </div>
      </div>
    </div>
  );
}
