import Link from "next/link";
import { ReactNode } from "react";

type BaseWidgetProps = {
  heading: string;
  column1: [string | ReactNode, string | undefined];
  column2: [string | ReactNode, string | undefined];
  column3?: [string | ReactNode, string | undefined];
  className: string | undefined;
  description: string | ReactNode;
  id: string;
  nowrap: boolean;
};

export default function BaseWidget(props: BaseWidgetProps) {
  const {
    heading,
    column1,
    column2,
    column3,
    className,
    nowrap,
    id,
    description,
  } = props;
  const [column1Text, column1Link] = column1;
  const [column2Text, column2Link] = column2;
  const [column3Text, column3Link] = column3 ?? [];
  return (
    <div className={className}>
      {" "}
      <div
        style={{ fontFamily: "Roboto Mono", borderColor: "#4ce0b3" }}
        className="w-[350px] min-h-[95px] flex flex-col rounded overflow-hidden border-2 border-sky-500 hover:shadow-lg text-left bg-[#43527F]"
      >
        <div
          style={{ borderColor: "#4ce0b3" }}
          className="inline-flex text-l border-b-2 p-1 w-full items-center"
        >
          <div
            style={{ fontFamily: "Roboto Mono" }}
            className="text-left flex-1"
          >
            <p>{heading}</p>
          </div>

          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="far"
            className="w-5 h-5 cursor-pointer"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            data-bs-toggle="collapse"
            data-bs-target={`#${id}`}
          >
            <svg
              fill="#4ce0b3"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM288 352c0 17.7-14.3 32-32 32s-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32z" />
            </svg>
          </svg>
        </div>
        <div className="flex-1 inline-flex flex w-full">
          <p
            style={{ fontFamily: "Roboto", borderColor: "#4ce0b3" }}
            className="text-bold p-1 text-base flex items-center whitespace-nowrap"
          >
            {column1Text}
          </p>
          <p
            style={{ fontFamily: "Roboto", borderColor: "#4ce0b3" }}
            className={`font-light p-1 text-base ${
              column3 ? "border-r-2" : ""
            } border-l-2 flex-1 text-left flex items-center`}
          >
            {column2Link ? (
              <Link target="_blank" href={column2Link}>
                {column2Text}
              </Link>
            ) : (
              column2Text
            )}
          </p>
          {column3 && (
            <div
              className="flex p-1 items-center font-light"
              style={{ fontFamily: "Roboto", borderColor: "#4ce0b3" }}
            >
              {column3Link ? (
                <Link
                  target="_blank"
                  className="line-clamp-2 text-base"
                  href={column3Link}
                >
                  {column3Text}
                </Link>
              ) : (
                column3Text
              )}
            </div>
          )}
        </div>
        <div className="collapse" id={id}>
          <div style={{ borderColor: "#4ce0b3" }} className="border-t-2 p-2">
            <p className="text-sm font-light ">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
