import { Suspense } from "react";
import NavBar from "~/components/Navbar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-bg-sidebar flex w-full flex-col">
      <NavBar />
      <Suspense>
        <div className="flex w-full flex-col">{children}</div>
      </Suspense>
    </div>
  );
};

export default layout;
