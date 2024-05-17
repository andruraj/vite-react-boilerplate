import { useRouteError } from "react-router-dom";

export const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="flex flex-col">
        <header className="font-semibold text-xl">
          {error.message || error.statusText}
        </header>
        <main>{error.stack}</main>
      </div>
    </div>
  );
};
