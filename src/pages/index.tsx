import RecentActivity from "../components/RecentActivity";

interface ProjectItemProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

function ProjectItem({ title, description, children }: ProjectItemProps) {
  return (
    <li className="flex flex-wrap flex-row gap-2">
      <div className="truncate order-first md:order-none flex-1 md:flex-none md:w-[100px] font-bold mb-[-10px]">
        {title}
      </div>
      <div className="w-full order-last md:order-none md:w-auto md:flex-1">
        {description} {children}
      </div>
    </li>
  );
}

interface ProjectLinkProps {
  href: string;
  children: React.ReactNode;
}

function ProjectLink({ href, children }: ProjectLinkProps) {
  return (
    <a 
      className="border-b-2 border-(--color-secondary-500) italic" 
      href={href}
    >
      {children}
    </a>
  );
}

interface SectionHeadingProps {
  children: React.ReactNode;
  color?: 'secondary' | 'accent';
}

function SectionHeading({ children, color = 'secondary' }: SectionHeadingProps) {
  const colorClass = color === 'secondary' ? 'text-(--color-secondary-500)' : 'text-(--color-accent-500)';
  
  return (
    <p className={`font-mono ${colorClass} font-bold pt-10 `}>
      # {children}
    </p>
  );
}

interface IndexProps {
  rssData: {
    items: any[];
  };
}

export default function Index({ rssData }: IndexProps) {
  const projects = [
    {
      title: "cards",
      description: "free, cozy card games",
      links: [
        { label: "source", href: "https://github.com/joe307bad/cards" },
        { label: "site", href: "https://cards.joebad.com" }
      ]
    },
    {
      title: "void", 
      description: "a simple, intergalactic strategy game",
      links: [
        { label: "source", href: "https://github.com/joe307bad/end" },
        { label: "site", href: "https://void.joebad.com" }
      ]
    },
    {
      title: "fastbreak",
      description: "daily pro sports pick-em and trivia", 
      links: [
        { label: "source", href: "https://github.com/joe307bad/fastbreak" }
      ]
    },
    {
      title: "act",
      description: "a general purpose achievement tracking and todo app",
      links: [
        { label: "source", href: "https://github.com/joe307bad/act" }
      ]
    }
  ];

  return (
    <div className="gap-4 w-full md:max-w-3xl flex flex-col self-center">
      <h1 className="font-mono font-bold text-(--color-primary-500) mt-10 text-xl">
        Welcome, my name is Joe Badaczewski
      </h1>
      
      <p className="font-mono">
        I am a senior software development engineer focused on application
        performance, distributed systems, and user interface design.
      </p>

      <SectionHeading>projects</SectionHeading>
      
      <ul className="font-mono flex flex-col gap-6 md:gap-4">
        {projects.map((project) => (
          <ProjectItem 
            key={project.title}
            title={project.title} 
            description={project.description}
          >
            ({project.links.map((link, index) => (
              <span key={link.label}>
                {index > 0 && " | "}
                <ProjectLink href={link.href}>{link.label}</ProjectLink>
              </span>
            ))})
          </ProjectItem>
        ))}
      </ul>

      <SectionHeading color="accent">feed</SectionHeading>
      
      <RecentActivity items={rssData.items} />
    </div>
  );
}