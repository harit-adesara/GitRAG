import { Outlet } from "react-router-dom";
import Header from "../component/Header.jsx";
import Sidebar from "../component/SideBar.jsx";
import Footer from "../component/Footer.jsx";
import { useContext } from "react";

const Layout = () => {
  return (
    <div className="bg-[#0a0a0f] h-screen flex overflow-hidden">
      {/* Sidebar — handles its own mobile state internally */}
      <div className="h-full shrink-0">
        <Sidebar />
      </div>

      {/* Right panel */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <div className="shrink-0">
          <Header />
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>

        <div className="shrink-0">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Layout;
