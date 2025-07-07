import { ReactNode } from "react";

interface ActivityItemProps {
  relativeTime: string;
  categoryLabel: string;
  description?: string;
  children?: ReactNode;
}

interface AnimatedDateProps {
  children?: string;
}

const AnimatedDate: React.FC<AnimatedDateProps> = ({
  children = "2025-07-01T03:44:45Z",
}) => {
  const getRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
    } else {
      return "just now";
    }
  };

  const relativeDate = getRelativeTime(children);

  return <b>{relativeDate}</b>;
};

function ActivityItem(props: ActivityItemProps) {
  return (
    <li className="break-words">
      <div className="flex flex-row w-full pb-2">
        <p className="leading-7">
          <AnimatedDate>{props.relativeTime}</AnimatedDate> •{" "}
          {props.categoryLabel} • {props.description} {props.children}
        </p>
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
    <ul className="font-mono flex flex-col gap-6 w-full ">
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
