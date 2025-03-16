import { Outlet } from "react-router-dom"
import SideBar from "../Dashboard/SideBar/SideBar"

function DashboardLayout() {
  return (
    <div className="flex flex-col lg:flex-row ">
      <div className="w-full lg:w-1/4 bg-white lg:shadow-md ">
        <SideBar />
      </div>
      <div className="w-full bg-white lg:w-3/4 ">
        <Outlet />
      </div>
    </div>
  );
}


export default DashboardLayout