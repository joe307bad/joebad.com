import "./globals.css";
import { ThemeProvider } from "@/components/ThemesProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="h-full w-full">
      <body className="h-full w-full">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main
            id="root"
            className="p-2 min-h-[100%] w-full justify-center items-start flex bg-(--color-bg)"
          >
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
