import styles from "../styles/page.module.scss";

export default function Page({ page, children }) {
  return (
    <div className={`flex justify-center text-center h-full bg-[#43527f]`}>
      <div className={`w-full md:max-w-2xl`}>{children}</div>
    </div>
  );
}
