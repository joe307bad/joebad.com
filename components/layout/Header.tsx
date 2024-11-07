import Link from "next/link";

export default function Header() {
  return (
    <div className="w-full items-end">
      <div className="pb-2 pt-4">
        <div style={{ height: 50, width: 95 }}>
          <Link href="/">
            <img className="pb-5" width={95} src="/joe.png" />
          </Link>
        </div>
      </div>
      <h1 className="h-[27px] text-lg font-bold">Joe Badaczewski</h1>
      <h2 className="h-[37px] font-light">
        Senior Software Engineer at{" "}
        <Link target="_blank" href="https://frameworkltc.com/">
          SoftWriters
        </Link>
      </h2>
      <h2 className="h-[37px] max-w-[400px] font-light">
        MS in Multimedia Technology + BA in Digital Media Arts from Duquesne
        University
      </h2>
    </div>
  );
}
