export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
    {/* este estilo en tailwind img {
        width: 100px;
        height: auto;
        que esté al lado izquierdo y que aparte y con este color de fondo #f3f4f6

    } */}
      <img src="/logo.svg" alt="Logo de BuildIt"  className="w-24 h-auto m-4" />
      <div className="">{children}</div>
    </>
  );
}
