interface NumberLabelProps {
  number: number;
  href?: string;
}

export default function NumberLabel({ number, href }: NumberLabelProps) {
  return (
    <a
      href={href || `#${number}`}
      className="inline-flex items-center justify-center bg-red-500 text-white rounded-full w-4 h-4 text-[9px] font-bold mx-0.5 align-middle no-underline"
    >
      <span className="leading-none">{number}</span>
    </a>
  );
}
