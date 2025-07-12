import "../globals.css";

export default function PostLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main
      id="root"
      className="p-2 min-h-[100%] justify-center items-start flex bg-(--color-bg)"
    >
      {children}
    </main>
  );
}
