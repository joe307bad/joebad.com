function ActivityItem(props: any) {
  return (
    <li>
      <div className="flex flex-row w-full pb-2">
        <div className="flex-1">
          <b>{props.relativeTime}</b> • {props.categoryLabel} •{" "}
          {props.description} {props.children}
        </div>
      </div>
    </li>
  );
}

const RecentActivity = ({ items = [] }) => {

  const getCategoryLabel = (contentType: string) => {
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
    <ul className="font-mono flex flex-col gap-6">
      {sortedItems.map((item) => {
        // console.log(item.repo)
        if (item.contentType === "code-commit") {
          return (
            <ActivityItem
              {...item}
              description={item.title}
              relativeTime={item.pubDate}
              categoryLabel={getCategoryLabel(item.contentType)}
            >
              (
              <a
                className="border-b-2 border-b-[#8338ec] italic"
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
            {...item}
            relativeTime={item.pubDate}
            categoryLabel={getCategoryLabel(item.contentType)}
          >
            (
            <a
              className="border-b-2 border-b-[#8338ec] italic"
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
