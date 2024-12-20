import Bottombar from "@/components/shared/Bottombar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import Topbar from "@/components/shared/Topbar";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="w-full h-full md:flex">
      <Topbar />
      <LeftSidebar />

      <section className="flex-1 flex h-full ">
        <Outlet />
      </section>

      <Bottombar />
    </div>
  );
};

export default RootLayout;
