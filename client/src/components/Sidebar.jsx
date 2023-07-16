import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { SiShopware } from 'react-icons/si';
import { MdOutlineCancel } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { useStateContext } from '../contexts/ContextProvider';
import { HiOutlineHome } from "react-icons/hi";
import { AiOutlineUser } from "react-icons/ai";
import { FiUsers } from "react-icons/fi";

const Sidebar = () => {
  const { currentColor, activeMenu, setActiveMenu, screenSize, user } = useStateContext();

  const handleCloseSideBar = () => {
    if (activeMenu !== undefined && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 text-white  text-md m-2 br-2';
  const normalLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 text-md text-gray-700 dark:text-gray-200 m-2 br-2';

  return (
    <div className="h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10" style={{background:"#252932" }}>
      {activeMenu && (
        <>
          <div className="flex justify-between items-center" style={{background:"#2b303b",paddingLeft:"10px", paddingTop:"2px"}}>
            <Link to="/" onClick={handleCloseSideBar} className="items-center gap-3 ml-3 mt-5 mb-5 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900">
              <SiShopware /> <span>Digital Ipsum</span>
            </Link>
            <TooltipComponent content="Menu" position="BottomCenter">
              <button
                type="button"
                onClick={() => setActiveMenu(!activeMenu)}
                style={{ color: currentColor }}
                className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
              >
                <MdOutlineCancel />
              </button>
            </TooltipComponent>
          </div>
          <div className="mt-8" style={{paddingLeft:"10px"}}>
              <div>
                <p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase">
                  Dashboard
                </p>
                  <NavLink
                    to={`/`}
                    key="home"
                    onClick={handleCloseSideBar}
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? currentColor : '',
                    })}
                    className={({ isActive }) => (isActive ? activeLink : normalLink)}
                  >
                    <HiOutlineHome  style={{fontSize:"20px"}}/>
                    <span className="capitalize">Home</span>
                  </NavLink>

                  <NavLink
                    to={`user/my_profile`}
                    key="jobdesk"
                    onClick={handleCloseSideBar}
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? currentColor : '',
                    })}
                    className={({ isActive }) => (isActive ? activeLink : normalLink)}
                  >
                    <AiOutlineUser  style={{fontSize:"20px"}}/>
                    <span className="capitalize">Job Desk</span>
                  </NavLink>
              </div>


              <div>
              {user && user.role==='admin' &&<p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase">
                  Employee
                </p>}
                {user && user.role==='admin' &&<NavLink
                    to={`/employee`}
                    key="employee"
                    onClick={handleCloseSideBar}
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? currentColor : '',
                    })}
                    className={({ isActive }) => (isActive ? activeLink : normalLink)}
                  >
                    <FiUsers  style={{fontSize:"20px"}}/>
                    <span className="capitalize">All Employees</span>
                  </NavLink>}

                  {user && user.role==='admin' &&<NavLink
                    to={`/employee/designation`}
                    key="designation"
                    onClick={handleCloseSideBar}
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? currentColor : '',
                    })}
                    className={({ isActive }) => (isActive ? activeLink : normalLink)}
                  >
                    <AiOutlineUser  style={{fontSize:"20px"}}/>
                    <span className="capitalize">Designation</span>
                  </NavLink>}

                  {user && user.role==='admin' &&<NavLink
                    to={`/employee/department`}
                    key="department"
                    onClick={handleCloseSideBar}
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? currentColor : '',
                    })}
                    className={({ isActive }) => (isActive ? activeLink : normalLink)}
                  >
                    <AiOutlineUser  style={{fontSize:"20px"}}/>
                    <span className="capitalize">Departments</span>
                  </NavLink>}
              </div>

              <div>
                <p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase">
                  Leave
                </p>
                  <NavLink
                    to={`/leave/status`}
                    key="leave"
                    onClick={handleCloseSideBar}
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? currentColor : '',
                    })}
                    className={({ isActive }) => (isActive ? activeLink : normalLink)}
                  >
                    <FiUsers  style={{fontSize:"20px"}}/>
                    <span className="capitalize">Leave Status</span>
                  </NavLink>

                  <NavLink
                    to={`/leave/requests`}
                    key="leave_requests"
                    onClick={handleCloseSideBar}
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? currentColor : '',
                    })}
                    className={({ isActive }) => (isActive ? activeLink : normalLink)}
                  >
                    <AiOutlineUser  style={{fontSize:"20px"}}/>
                    <span className="capitalize">Leave Request</span>
                  </NavLink>
              </div>

              <div>
                <p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase">
                  Attendance
                </p>
                  <NavLink
                    to={`/attendance/lists`}
                    key="leave"
                    onClick={handleCloseSideBar}
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? currentColor : '',
                    })}
                    className={({ isActive }) => (isActive ? activeLink : normalLink)}
                  >
                    <FiUsers  style={{fontSize:"20px"}}/>
                    <span className="capitalize">Attendance lists</span>
                  </NavLink>

                
              </div>

              <div>
              {user && user.role==='admin' &&<p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase">
                  Adminstration
                </p>}
                {user && user.role==='admin' &&
                <NavLink
                    to={`/announcement`}
                    key="announcement"
                    onClick={handleCloseSideBar}
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? currentColor : '',
                    })}
                    className={({ isActive }) => (isActive ? activeLink : normalLink)}
                  >
                    <FiUsers  style={{fontSize:"20px"}}/>
                    <span className="capitalize"> Announcements</span>
                  </NavLink>}
              </div>

              <div>
                <p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase">
                  Pipeline
                </p>
                
                <NavLink
                    to={`/pipeline`}
                    key="pipeline"
                    onClick={handleCloseSideBar}
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? currentColor : '',
                    })}
                    className={({ isActive }) => (isActive ? activeLink : normalLink)}
                  >
                    <FiUsers  style={{fontSize:"20px"}}/>
                    <span className="capitalize"> Pipeline</span>
                  </NavLink>

                  <NavLink
                    to={`/pipeline/view`}
                    key="pipeline/view"
                    onClick={handleCloseSideBar}
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? currentColor : '',
                    })}
                    className={({ isActive }) => (isActive ? activeLink : normalLink)}
                  >
                    <FiUsers  style={{fontSize:"20px"}}/>
                    <span className="capitalize"> Pipeline View</span>
                  </NavLink>
              </div>

              <div>
                <p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase">
                  Deals
                </p>
                
                <NavLink
                    to={`/persons`}
                    key="persons"
                    onClick={handleCloseSideBar}
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? currentColor : '',
                    })}
                    className={({ isActive }) => (isActive ? activeLink : normalLink)}
                  >
                    <FiUsers  style={{fontSize:"20px"}}/>
                    <span className="capitalize"> Persons</span>
                  </NavLink>

                  <NavLink
                    to={`/organization`}
                    key="organization"
                    onClick={handleCloseSideBar}
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? currentColor : '',
                    })}
                    className={({ isActive }) => (isActive ? activeLink : normalLink)}
                  >
                    <FiUsers  style={{fontSize:"20px"}}/>
                    <span className="capitalize">Organization</span>
                  </NavLink>
              </div>

              <div>
                <p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase">
                  Proposals
                </p>
                
                <NavLink
                    to={`/proposal`}
                    key="proposal"
                    onClick={handleCloseSideBar}
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? currentColor : '',
                    })}
                    className={({ isActive }) => (isActive ? activeLink : normalLink)}
                  >
                    <FiUsers  style={{fontSize:"20px"}}/>
                    <span className="capitalize"> Proposal list</span>
                  </NavLink>

              </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
