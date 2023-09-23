import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { SiShopware } from 'react-icons/si';
import { MdOutlineCancel } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { useStateContext } from '../contexts/ContextProvider';
import { AiOutlineUser } from "react-icons/ai";
import { FiUsers } from "react-icons/fi";

import {BiDollarCircle} from "react-icons/bi"
import {LuBriefcase, LuCalendarCheck, LuLayoutDashboard} from "react-icons/lu"
import {BsStopwatch} from "react-icons/bs"
import {TfiAnnouncement} from "react-icons/tfi"
import { FaRegHandshake} from "react-icons/fa"
import { RiExchangeDollarFill} from "react-icons/ri"


const Sidebar = () => {
  const { currentColor, activeMenu, setActiveMenu, screenSize, user } = useStateContext();
  const location = useLocation();

  const handleCloseSideBar = () => {
    if (activeMenu !== undefined && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 text-white text-md m-2 br-2';
  const normalLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 text-md text-gray-700 dark:text-gray-200 m-2 br-2';

  return (
    <div className="h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10 " style={{ background: "#252932" }}>
      {activeMenu && (
        <>
          <div className="flex justify-between items-center fixed pl-2.5 " style={{ background: "#2b303b", width:'17vw', height:'70px'}}>
            <Link to="/" onClick={handleCloseSideBar} className="items-center gap-3 ml-3 mt-5 mb-5 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900">
              <SiShopware /> <span>Time Sync</span>
            </Link>
          </div>

          <div className="mt-24" >

            <NavLink
              to={`/`}
              key="home"
              onClick={handleCloseSideBar}
              style={{backgroundColor:`${location.pathname==='/' ? currentColor:''}`}}
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <span className='p-2 bg-myblack rounded-sm'><LuLayoutDashboard style={{ fontSize: "20px" }} /></span>
              <span className={`capitalize text-sm ${location.pathname==='/' ? "text-myblack" : "text-primary"}`}>Home</span>
            </NavLink>

            {user && user.role === 'admin' && <NavLink
              to={`/employee`}
              key="employee"
              onClick={handleCloseSideBar}
              style={{backgroundColor:`${location.pathname==='/employee' ? currentColor:''}`}}
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <span className='p-2 bg-myblack rounded-sm'><FiUsers style={{ fontSize: "20px" }} /></span>
              <span className={`capitalize text-sm ${location.pathname==='/employee' ? "text-myblack" : "text-primary"}`}>All Employees</span>
            </NavLink>}

            {user && user.role === 'admin' && <NavLink
              to={`/employee/designation`}
              key="designation"
              onClick={handleCloseSideBar}
              style={{backgroundColor:`${location.pathname==='/employee/designation' ? currentColor:''}`}}
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <span className='p-2 bg-myblack rounded-sm'><AiOutlineUser style={{ fontSize: "20px" }} /></span>
              <span className={`capitalize text-sm ${location.pathname==='/employee/designation' ? "text-myblack" : "text-primary"}`}>Designation</span>
            </NavLink>}

            {user && user.role === 'admin' && <NavLink
              to={`/employee/department`}
              key="department"
              onClick={handleCloseSideBar}
              style={{backgroundColor:`${location.pathname==='/employee/department' ? currentColor:''}`}}
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <span className='p-2 bg-myblack rounded-sm'><LuBriefcase style={{ fontSize: "20px" }} /></span>
              <span className={`capitalize text-sm ${location.pathname==='/employee/department' ? "text-myblack" : "text-primary"}`}>Departments</span>
            </NavLink>}


            <NavLink
              to={`/leave/status`}
              key="leave"
              onClick={handleCloseSideBar}
              style={{backgroundColor:`${location.pathname==='/leave/status' ? currentColor:''}`}}
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <span className='p-2 bg-myblack rounded-sm'><BsStopwatch style={{ fontSize: "20px" }} /></span>
              <span className={`capitalize text-sm ${location.pathname==='/leave/status' ? "text-myblack" : "text-primary"}`}>Leave Status</span>
            </NavLink>

            <NavLink
              to={`/leave/requests`}
              key="leave_requests"
              onClick={handleCloseSideBar}
              style={{backgroundColor:`${location.pathname==='/leave/requests' ? currentColor:''}`}}
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <span className='p-2 bg-myblack rounded-sm'><BsStopwatch style={{ fontSize: "20px" }} /></span>
              <span className={`capitalize text-sm ${location.pathname==='/leave/requests' ? "text-myblack" : "text-primary"}`}>Leave Request</span>
            </NavLink>

            <NavLink
              to={`/attendance/lists`}
              key="leave"
              onClick={handleCloseSideBar}
              style={{backgroundColor:`${location.pathname==='/attendance/lists' ? currentColor:''}`}}
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <span className='p-2 bg-myblack rounded-sm'><LuCalendarCheck style={{ fontSize: "20px" }} /></span>
              <span className={`capitalize text-sm ${location.pathname==='/attendance/lists' ? "text-myblack" : "text-primary"}`}>Attendance lists</span>
            </NavLink>

            {user && user.role === 'admin' &&
              <NavLink
                to={`/announcement`}
                key="announcement"
                onClick={handleCloseSideBar}
                style={{backgroundColor:`${location.pathname==='/announcement' ? currentColor:''}`}}
                className={({ isActive }) => (isActive ? activeLink : normalLink)}
              >
                <span className='p-2 bg-myblack rounded-sm'><TfiAnnouncement style={{ fontSize: "20px" }} /></span>
                <span className={`capitalize text-sm ${location.pathname==='/announcement' ? "text-myblack" : "text-primary"}`}> Announcements</span>
              </NavLink>}

            <NavLink
              to={`/pipeline`}
              key="pipeline"
              onClick={handleCloseSideBar}
              style={{backgroundColor:`${location.pathname==='/pipeline' ? currentColor:''}`}}
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <span className='p-2 bg-myblack rounded-sm'><RiExchangeDollarFill style={{ fontSize: "20px" }} /></span>
              <span className={`capitalize text-sm ${location.pathname==='/pipeline' ? "text-myblack" : "text-primary"}`}> Pipeline</span>
            </NavLink>

            <NavLink
              to={`/pipeline/view`}
              key="pipeline/view"
              onClick={handleCloseSideBar}
              style={{backgroundColor:`${location.pathname==='/pipeline/view' ? currentColor:''}`}}
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <span className='p-2 bg-myblack rounded-sm'><BiDollarCircle style={{ fontSize: "20px" }} /></span>
              <span className={`capitalize text-sm ${location.pathname==='/pipeline/view' ? "text-myblack" : "text-primary"}`}> Pipeline View</span>
            </NavLink>


            <NavLink
              to={`/persons`}
              key="persons"
              onClick={handleCloseSideBar}
              style={{backgroundColor:`${location.pathname==='/persons' ? currentColor:''}`}}
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <span className='p-2 bg-myblack rounded-sm'><FiUsers style={{ fontSize: "20px" }} /></span>
              <span className={`capitalize text-sm ${location.pathname==='/persons' ? "text-myblack" : "text-primary"}`}> Persons</span>
            </NavLink>

            <NavLink
              to={`/organization`}
              key="organization"
              onClick={handleCloseSideBar}
              style={{backgroundColor:`${location.pathname==='/organization' ? currentColor:''}`}}

              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <span className='p-2 bg-myblack rounded-sm'><LuBriefcase style={{ fontSize: "20px" }} /></span>
              <span className={`capitalize text-sm ${location.pathname==='/organization' ? "text-myblack" : "text-primary"}`}>Organization</span>
            </NavLink>

            <NavLink
              to={`/proposal`}
              key="proposal"
              onClick={handleCloseSideBar}
              style={{backgroundColor:`${location.pathname==='/proposal' ? currentColor:''}`}}
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
            >
              <span className='p-2 bg-myblack rounded-sm'><FaRegHandshake style={{ fontSize: "20px" }} /></span>
              <span className={`capitalize text-sm ${location.pathname==='/proposal' ? "text-myblack" : "text-primary"}`}> Proposal list</span>
            </NavLink>

          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
