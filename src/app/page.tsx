import { Main } from "../components/Main";
import RecentActivity from "../components/RecentActivity";
import { SectionHeading } from "../components/SectionHeading";
import { XMLParser } from "fast-xml-parser";

interface ActivityData {
  contentType: string;
  pubDate: string;
  title?: string;
  link: string;
  description?: string;
  relativeDate?: string;
}

interface ProjectItemProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

function ProjectItem({ title, description, children }: ProjectItemProps) {
  return (
    <li className="flex flex-wrap flex-row gap-2">
      <div className="truncate order-first md:order-none flex-1 md:flex-none md:w-[100px] font-bold mb-[-10px]">
        <p>{title}</p>
      </div>
      <div className="w-full order-last md:order-none md:w-auto md:flex-1">
        <p>
          {description} {children}
        </p>
      </div>
    </li>
  );
}

interface ProjectLinkProps {
  href: string;
  children: React.ReactNode;
}

const baseUrl = "https://joebad.com";

export const metadata = {
  // Basic metadata
  title: "Joe Badaczewski - Senior Software Engineer",
  description:
    "Joe Badaczewski is a senior software engineer specializing in web application performance, distributed systems, and user interface design.",
  keywords: "Joe Badaczewski, developer, portfolio, blog",

  // Canonical URL
  alternates: {
    canonical: baseUrl,
  },

  // Open Graph
  openGraph: {
    type: "website",
    title: "Joe Badaczewski - Senior Software Engineer",
    description:
      "Joe Badaczewski is a senior software engineer specializing in web application performance, distributed systems, and user interface design.",
    url: baseUrl,
    siteName: "joebad.com",
    images: [
      {
        url: `${baseUrl}/joe.png`,
        width: 1200,
        height: 630,
        alt: 'Joe Badaczewski - Senior Software Engineer',
      },
    ],
    locale: "en_US",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Joe Badaczewski - Senior Software Engineer",
    description:
      "Joe Badaczewski is a senior software engineer specializing in web application performance, distributed systems, and user interface design.",
    images: [`${baseUrl}/joe.png`],
    creator: "@joe307bad", // Your Twitter handle
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

function ProjectLink({ href, children }: ProjectLinkProps) {
  return (
    <a
      className="border-b-2 border-(--color-secondary-500) no-underline italic"
      href={href}
    >
      {children}
    </a>
  );
}

async function getRSSData(): Promise<ActivityData[]> {
  try {
    const response = await fetch("https://rss.joebad.com");
    const xmlText = await response.text();

    const parser = new XMLParser();
    const xmlDoc = parser.parse(xmlText);

    const items = xmlDoc.rss?.channel?.item || [];
    const itemsArray = Array.isArray(items) ? items : [items];

    const rss: ActivityData[] = itemsArray.map((item: Record<string, string>) => ({
      id: item.guid || item.link || "",
      contentType: item.contentType,
      title: item.title || "",
      description: item.description || "",
      link: item.link || "",
      pubDate: item.pubDate || "",
    }));

    rss.sort(
      (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    );

    return rss;
  } catch (error) {
    console.error("Failed to fetch RSS data:", error);
    return [];
  }
}

export const revalidate = 43200; // 12 hours

export default async function Index() {
  const rss = await getRSSData();
  const projects = [
    {
      title: "cards",
      description: "free, cozy card games",
      links: [
        { label: "source", href: "https://github.com/joe307bad/cards" },
        { label: "site", href: "https://cards.joebad.com" },
      ],
    },
    {
      title: "fastbreak",
      description: "daily sports analytics",
      links: [
        { label: "source", href: "https://github.com/joe307bad/fastbreak" },
        { label: "alpha", href: "https://github.com/joe307bad/fastbreak/releases" },
      ],
    },
    {
      title: "void",
      description: "a simple, intergalactic strategy game",
      links: [
        { label: "source", href: "https://github.com/joe307bad/end" },
        { label: "site", href: "https://void.joebad.com" },
      ],
    },
    {
      title: "act",
      description: "a general purpose achievement tracking and todo app",
      links: [{ label: "source", href: "https://github.com/joe307bad/act" }],
    },
  ];

  return (
    <Main activePage="index">
      <SectionHeading>intro</SectionHeading>
      <p className="font-mono">
        I am a senior software engineer specializing in web
        application performance, distributed systems, and user interface design.
      </p>
      <SectionHeading>projects</SectionHeading>
      <ul className="font-mono flex flex-col gap-6 md:gap-4">
        {projects.map((project) => (
          <ProjectItem
            key={project.title}
            title={project.title}
            description={project.description}
          >
            (
            {project.links.map((link, index) => (
              <span key={link.label}>
                {index > 0 && " | "}
                <ProjectLink href={link.href}>{link.label}</ProjectLink>
              </span>
            ))}
            )
          </ProjectItem>
        ))}
      </ul>
      <SectionHeading color="accent">feed</SectionHeading>
      <RecentActivity items={rss} />
    </Main>
  );
}
