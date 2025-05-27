import Link from "next/link";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Link
        href="/"
      >
        <img
          src="/logo.svg"
          alt="Logo de BuildIt"
          className="w-24 h-auto m-4"
        />
      </Link>
      <div className="">{children}</div>
    </>
  );
}
