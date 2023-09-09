import React, { useEffect, lazy, Suspense, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import { Navbar, Footer, Sidebar, ThemeSettings } from './components';
import { Home } from './pages';
import './App.css';

import { useStateContext } from './contexts/ContextProvider';
import Login from './pages/auth/Login2';
import { Spin, message } from 'antd';
import LoadingPage from './LoadingPage';
import axios from 'axios';
import Profile2 from './pages/profile/Profile2';
import Profile3 from './pages/profile/Profile3';
import LeaveStatus from './pages/employeeLeave/LeaveStatus';
import LeaveForm from './pages/employeeLeave/LeaveForm';
import LeaveRequest from './pages/employeeLeave/LeaveRequest';
import EmployeeAttendance from './pages/attendance/EmployeeAttendance';
// import Department from './pages/department/Department';
// import DepartmentForm from './pages/department/DepartmentForm';
// import Announcement from './pages/announcement/Announcement';
// import AnnouncementForm from './pages/announcement/AnnouncementForm';
import Pipeline from './pages/pipelines/Pipeline';
import Sales_pipelines from './pages/pipeline view/Sales_pipelines';
// import Persons from './pages/persons/Persons';
// import PersonsForm from './pages/persons/PersonsForm';
// import Organization from './pages/organization/Person_Organization';
// import OrganizationForm from './pages/organization/OrganizationForm';
// import Proposal from './pages/proposal/Proposal';
// import ProposalForm from './pages/proposal/ProposalForm';

const Employees = lazy(() => import('./pages/employees/Employees'));
const EmployeesForm = lazy(() => import('./pages/employees/EmployeesForm'))
const Designation = lazy(() => import('./pages/desingnation/Designation'));
const DesignationForm = lazy(() => import('./pages/desingnation/DesignationForm'))
const Department = lazy(() => import('./pages/department/Department'));
const DepartmentForm = lazy(() => import('./pages/department/DepartmentForm'))
const Announcement = lazy(() => import('./pages/announcement/Announcement'));
const AnnouncementForm = lazy(() => import('./pages/announcement/AnnouncementForm'))
const Persons = lazy(() => import('./pages/persons/Persons'));
const PersonsForm = lazy(() => import('./pages/persons/PersonsForm'))
const Organization = lazy(() => import('./pages/organization/Person_Organization'));
const OrganizationForm = lazy(() => import('./pages/organization/OrganizationForm'))
const Proposal = lazy(() => import('./pages/proposal/Proposal'));
const ProposalForm = lazy(() => import('./pages/proposal/ProposalForm'))

const App = () => {
  const { setUser, user } = useStateContext()
  const { currentMode, activeMenu, themeSettings } = useStateContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))

    if (user) {
      const token = user.token;
      setLoading(true)
      axios.post('http://localhost:8000/api/auth/profile', { token }).then((res) => {
        setLoading(false)
        setIsAuthenticated(true)
        setUser(res.data);

      }).catch((err) => {
        setLoading(false)
        message.error("Unauthorized action")
      })
    }

  }, [])

  return (
    <>
      {isAuthenticated && user ?
        <div className={currentMode === 'Dark' ? 'dark' : ''}>
          <div className="flex relative dark:bg-main-dark-bg">
            <div className="fixed right-4 bottom-4" style={{ zIndex: '1000' }}>
              <TooltipComponent
                content="Settings"
                position="Top"
              >

              </TooltipComponent>
            </div>
            {activeMenu ? (
              <div className="fixed sidebar" style={{ width: "17vw", background: "#252932" }}>
                <Sidebar />
              </div>
            ) : (
              <div className="w-0 dark:bg-secondary-dark-bg">
                <Sidebar />
              </div>
            )}
            <div
              className={
                activeMenu
                  ? 'dark:bg-main-dark-bg  bg-main-bg min-h-screen margin-l'
                  : 'bg-main-bg dark:bg-main-dark-bg min-h-screen flex-2 margin-o'
              }

              style={{ background: "#1c1f26", width: '83vw' }}
            >
              <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg w-full" style={{ background: "#252932", position: "sticky", top: "0", zIndex: 1000 }}>
                <Navbar />
              </div>
              <div>
                {themeSettings && (<ThemeSettings />)}

                <Routes>
                  {/* dashboard  */}
                  <Route path="/" element={(<Home />)} />
                  <Route path="/employee" element={<Suspense fallback={<div style={{ textAlign: 'center' }}><Spin /></div>}>
                    {user && user.role === 'admin' && <Employees />}
                  </Suspense>} />
                  <Route path="/employee/create" element={<Suspense fallback={<div style={{ textAlign: 'center' }}><Spin /></div>}>
                    {user && user.role === 'admin' && <EmployeesForm />}
                  </Suspense>} />
                  <Route path="/employee/create/:id" element={<Suspense fallback={<div style={{ textAlign: 'center' }}><Spin /></div>}>
                    {user && user.role === 'admin' && <EmployeesForm />}
                  </Suspense>} />

                  <Route path="/employee/designation" element={<Suspense fallback={<div style={{ textAlign: 'center' }}><Spin /></div>}>
                    {user && user.role === 'admin' && <Designation />}
                  </Suspense>} />
                  <Route path="/employee/designation/create" element={<Suspense fallback={<div style={{ textAlign: 'center' }}><Spin /></div>}>
                    {user && user.role === 'admin' && <DesignationForm />}
                  </Suspense>} />
                  <Route path="/employee/designation/create/:id" element={<Suspense fallback={<div style={{ textAlign: 'center' }}><Spin /></div>}>
                    {user && user.role === 'admin' && <DesignationForm />}
                  </Suspense>} />

                  <Route path="/employee/department" element={<Suspense fallback={<div style={{ textAlign: 'center' }}><Spin /></div>}>
                    {user && user.role === 'admin' && <Department />}
                  </Suspense>} />
                  <Route path="/employee/department/create" element={<Suspense fallback={<div style={{ textAlign: 'center' }}><Spin /></div>}>
                    {user && user.role === 'admin' && <DepartmentForm />}
                  </Suspense>} />
                  <Route path="/employee/department/create/:id" element={<Suspense fallback={<div style={{ textAlign: 'center' }}><Spin /></div>}>
                    {user && user.role === 'admin' && <DepartmentForm />}
                  </Suspense>} />


                  <Route path="/announcement" element={<Suspense fallback={<div style={{ textAlign: 'center' }}><Spin /></div>}>
                    {user && user.role === 'admin' && <Announcement />}
                  </Suspense>} />
                  <Route path="/announcement/create" element={<Suspense fallback={<div style={{ textAlign: 'center' }}><Spin /></div>}>
                    {user && user.role === 'admin' && <AnnouncementForm />}
                  </Suspense>} />
                  <Route path="/announcement/create/:id" element={<Suspense fallback={<div style={{ textAlign: 'center' }}><Spin /></div>}>
                    {user && user.role === 'admin' && <AnnouncementForm />}
                  </Suspense>} />

                  <Route path="/persons" element={<Suspense fallback={<div style={{ textAlign: 'center' }}><Spin /></div>}>
                    {user && user.role === 'admin' && <Persons />}
                  </Suspense>} />
                  <Route path="/persons/create" element={<Suspense fallback={<div style={{ textAlign: 'center' }}><Spin /></div>}>
                    {user && user.role === 'admin' && <PersonsForm />}
                  </Suspense>} />
                  <Route path="/persons/create/:id" element={<Suspense fallback={<div style={{ textAlign: 'center' }}><Spin /></div>}>
                    {user && user.role === 'admin' && <PersonsForm />}
                  </Suspense>} />


                  <Route path="/organization" element={<Suspense fallback={<div style={{ textAlign: 'center' }}><Spin /></div>}>
                    {user && user.role === 'admin' && <Organization />}
                  </Suspense>} />
                  <Route path="/organization/create" element={<Suspense fallback={<div style={{ textAlign: 'center' }}><Spin /></div>}>
                    {user && user.role === 'admin' && <OrganizationForm />}
                  </Suspense>} />
                  <Route path="/organization/create/:id" element={<Suspense fallback={<div style={{ textAlign: 'center' }}><Spin /></div>}>
                    {user && user.role === 'admin' && <OrganizationForm />}
                  </Suspense>} />


                  <Route path="/proposal" element={<Suspense fallback={<div style={{ textAlign: 'center' }}><Spin /></div>}>
                    {user && user.role === 'admin' && <Proposal />}
                  </Suspense>} />
                  <Route path="/proposal/create" element={<Suspense fallback={<div style={{ textAlign: 'center' }}><Spin /></div>}>
                    {user && user.role === 'admin' && <ProposalForm />}
                  </Suspense>} />
                  <Route path="/proposal/create/:id"  element={<Suspense fallback={<div style={{ textAlign: 'center' }}><Spin /></div>}>
                    {user && user.role === 'admin' && <ProposalForm />}
                  </Suspense>} />


                  {/* {user && user.role === 'admin' && <Route path="/employee/create" element={(<EmployeesForm />)} />}
                  {user && user.role === 'admin' && <Route path="/employee/create/:id" element={(<EmployeesForm />)} />}
                  {user && user.role === 'admin' && <Route path="/employee/designation" element={(<Designation />)} />}
                  {user && user.role === 'admin' && <Route path="/employee/designation/create" element={(<DesignationForm />)} />}
                  {user && user.role === 'admin' && <Route path="/employee/designation/create/:id" element={(<DesignationForm />)} />}

                  {user && user.role === 'admin' && <Route path="/employee/department" element={(<Department />)} />}
                  {user && user.role === 'admin' && <Route path="/employee/department/create" element={(<DepartmentForm />)} />}
                  {user && user.role === 'admin' && <Route path="/employee/department/create/:id" element={(<DepartmentForm />)} />} */}


                  {/* {user && user.role === 'admin' && <Route path="/announcement" element={(<Announcement />)} />}
                  {user && user.role === 'admin' && <Route path="/announcement/create" element={(<AnnouncementForm />)} />}
                  {user && user.role === 'admin' && <Route path="/announcement/create/:id" element={(<AnnouncementForm />)} />} */}


                  {/* {user && user.role === 'admin' && <Route path="/persons" element={(<Persons />)} />}
                  {user && user.role === 'admin' && <Route path="/persons/create" element={(<PersonsForm />)} />}
                  {user && user.role === 'admin' && <Route path="/persons/create/:id" element={(<PersonsForm />)} />} */}

                  {/* {user && user.role === 'admin' && <Route path="/organization" element={(<Organization />)} />}
                  {user && user.role === 'admin' && <Route path="/organization/create" element={(<OrganizationForm />)} />}
                  {user && user.role === 'admin' && <Route path="/organization/create/:id" element={(<OrganizationForm />)} />} */}

                  {/* {user && user.role === 'admin' && <Route path="/proposal" element={(<Proposal />)} />}
                  {user && user.role === 'admin' && <Route path="/proposal/create" element={(<ProposalForm />)} />}
                  {user && user.role === 'admin' && <Route path="/proposal/create/:id" element={(<ProposalForm />)} />} */}

                  
                  <Route path="/pipeline" element={(<Pipeline />)} />
                  <Route path="/pipeline/view" element={(<Sales_pipelines />)} />

                  <Route path="/user/my_profile" element={(<Profile2 />)} />
                  <Route path="/employee/profile/:id" element={(<Profile3 />)} />
                  <Route path="/leave/status" element={(<LeaveStatus />)} />
                  <Route path="/leave/create" element={(<LeaveForm />)} />
                  <Route path="/leave/create/:id" element={(<LeaveForm />)} />
                  <Route path="/leave/requests" element={(<LeaveRequest />)} />

                  <Route path="/attendance/lists" element={(<EmployeeAttendance />)} />

                </Routes>
                {/* </Suspense> */}
              </div>
              <Footer />
            </div>
          </div>
        </div>
        :
        loading ? <LoadingPage /> :
          <Login />

      }

    </>
  );
};

export default App;
