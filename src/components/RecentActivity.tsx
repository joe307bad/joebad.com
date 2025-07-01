import { ReactNode } from "react";

interface ActivityItemProps {
  relativeTime: string;
  categoryLabel: string;
  description?: string;
  children?: ReactNode;
}

function ActivityItem(props: ActivityItemProps) {
  return (
    <li className="break-words">
      <div className="flex flex-row w-full pb-2">
        <div className="flex-1 max-w-[100%]">
          <b>{props.relativeTime}</b> • {props.categoryLabel} •{" "}
          {props.description} {props.children}
        </div>
      </div>
    </li>
  );
}

interface ActivityData {
  contentType: string;
  pubDate: string;
  title?: string;
  link: string;
  description?: string;
}

interface RecentActivityProps {
  items?: ActivityData[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ items = [] }) => {
  const getCategoryLabel = (contentType: string): string => {
    switch (contentType) {
      case "code-commit":
        return "Code";
      case "movie-review":
        return "Movie";
      case "episode-review":
        return "Episode";
      default:
        return "Photo";
    }
  };

  const sortedItems = [...items].sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );

  return (
    <ul className="font-mono flex flex-col gap-6 w-full">
      {sortedItems.map((item, index) => {
        
        if (item.contentType === "code-commit") {
          return (
            <ActivityItem
              key={index}
              description={item.title}
              relativeTime={item.pubDate}
              categoryLabel={getCategoryLabel(item.contentType)}
            >
              {" "}
              (
              <a
                className="border-b-2 border-(--color-secondary-500) italic"
                href={item.link}
              >
                link
              </a>
              )
            </ActivityItem>
          );
        }
        return (
          <ActivityItem
            key={index}
            relativeTime={item.pubDate}
            categoryLabel={getCategoryLabel(item.contentType)}
            description={item.description}
          >
            {" "}
            (
            <a
              className="border-b-2 border-(--color-secondary-500) italic"
              href={item.link}
            >
              link
            </a>
            )
          </ActivityItem>
        );
      })}
    </ul>
  );
};

export default RecentActivity;