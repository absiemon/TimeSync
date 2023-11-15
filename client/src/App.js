import React, { useEffect, lazy, Suspense, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

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

import Pipeline from './pages/pipelines/Pipeline';
import Sales_pipelines from './pages/pipeline view/Sales_pipelines';

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

axios.defaults.withCredentials = true;

const App = () => {
  const { setUser, user } = useStateContext()
  const { currentMode, activeMenu, themeSettings } = useStateContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // const user = JSON.parse(localStorage.getItem('user'))

    // if (user) {
      setLoading(true)
      axios.post('http://localhost:8000/api/auth/profile').then((res) => {
        setLoading(false)
        if(res.data.login_status){
          setIsAuthenticated(true)
          setUser(res.data?.user);
        }
      }).catch((err) => {
        setLoading(false)
      })
    // }
  }, [])

  return (
    <>
      {isAuthenticated && user ?
        <div className="dark:bg-main-dark-bg">
          <div
            className="sidebar fixed "
            style={{
              width: activeMenu ? '17vw' : '6vw',
              background: "#252932", height: "100%",
              transition: 'width .25s ease-in-out',
            }}
          >
            <Sidebar />
          </div>
          <div
            className='main_section'
            style={{
              background: "#1c1f26",
              width: activeMenu ? 'calc(100% - 17vw)' : 'calc(100% - 6vw)',
              marginLeft: activeMenu ? '17vw' : '6vw',
              transition: 'width .25s ease-in-out,margin .25s ease-in-out',
            }}
          >
            <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg w-full" style={{ background: "#252932", position: "sticky", top: "0", zIndex: 1000 }}>
              <Navbar />
            </div>
            <div>

              <Routes>
                {/* dashboard  */}
                <Route path="/" element={(<Home />)} />
                <Route path="/employee" element={<Suspense fallback={<div className='spinner_tone'><Spin /></div>}>
                  {user && user.role === 'admin' && <Employees />}
                </Suspense>} />
                <Route path="/employee/create" element={<Suspense fallback={<div className='spinner_tone'><Spin /></div>}>
                  {user && user.role === 'admin' && <EmployeesForm />}
                </Suspense>} />
                <Route path="/employee/create/:id" element={<Suspense fallback={<div className='spinner_tone'><Spin /></div>}>
                  {user && user.role === 'admin' && <EmployeesForm />}
                </Suspense>} />

                <Route path="/employee/designation" element={<Suspense fallback={<div className='spinner_tone'><Spin /></div>}>
                  {user && user.role === 'admin' && <Designation />}
                </Suspense>} />
                <Route path="/employee/designation/create" element={<Suspense fallback={<div className='spinner_tone'><Spin /></div>}>
                  {user && user.role === 'admin' && <DesignationForm />}
                </Suspense>} />
                <Route path="/employee/designation/create/:id" element={<Suspense fallback={<div className='spinner_tone'><Spin /></div>}>
                  {user && user.role === 'admin' && <DesignationForm />}
                </Suspense>} />

                <Route path="/employee/department" element={<Suspense fallback={<div className='spinner_tone'><Spin /></div>}>
                  {user && user.role === 'admin' && <Department />}
                </Suspense>} />
                <Route path="/employee/department/create" element={<Suspense fallback={<div className='spinner_tone'><Spin /></div>}>
                  {user && user.role === 'admin' && <DepartmentForm />}
                </Suspense>} />
                <Route path="/employee/department/create/:id" element={<Suspense fallback={<div className='spinner_tone'><Spin /></div>}>
                  {user && user.role === 'admin' && <DepartmentForm />}
                </Suspense>} />


                <Route path="/announcement" element={<Suspense fallback={<div className='spinner_tone'><Spin /></div>}>
                  {user && user.role === 'admin' && <Announcement />}
                </Suspense>} />
                <Route path="/announcement/create" element={<Suspense fallback={<div className='spinner_tone'><Spin /></div>}>
                  {user && user.role === 'admin' && <AnnouncementForm />}
                </Suspense>} />
                <Route path="/announcement/create/:id" element={<Suspense fallback={<div className='spinner_tone'><Spin /></div>}>
                  {user && user.role === 'admin' && <AnnouncementForm />}
                </Suspense>} />

                <Route path="/persons" element={<Suspense fallback={<div className='spinner_tone'><Spin /></div>}>
                  {user && user.role === 'admin' && <Persons />}
                </Suspense>} />
                <Route path="/persons/create" element={<Suspense fallback={<div className='spinner_tone'><Spin /></div>}>
                  {user && user.role === 'admin' && <PersonsForm />}
                </Suspense>} />
                <Route path="/persons/create/:id" element={<Suspense fallback={<div className='spinner_tone'><Spin /></div>}>
                  {user && user.role === 'admin' && <PersonsForm />}
                </Suspense>} />


                <Route path="/organization" element={<Suspense fallback={<div className='spinner_tone'><Spin /></div>}>
                  {user && user.role === 'admin' && <Organization />}
                </Suspense>} />
                <Route path="/organization/create" element={<Suspense fallback={<div className='spinner_tone'><Spin /></div>}>
                  {user && user.role === 'admin' && <OrganizationForm />}
                </Suspense>} />
                <Route path="/organization/create/:id" element={<Suspense fallback={<div className='spinner_tone'><Spin /></div>}>
                  {user && user.role === 'admin' && <OrganizationForm />}
                </Suspense>} />


                <Route path="/proposal" element={<Suspense fallback={<div className='spinner_tone'><Spin /></div>}>
                  {user && user.role === 'admin' && <Proposal />}
                </Suspense>} />
                <Route path="/proposal/create" element={<Suspense fallback={<div className='spinner_tone'><Spin /></div>}>
                  {user && user.role === 'admin' && <ProposalForm />}
                </Suspense>} />
                <Route path="/proposal/create/:id" element={<Suspense fallback={<div className='spinner_tone'><Spin /></div>}>
                  {user && user.role === 'admin' && <ProposalForm />}
                </Suspense>} />

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
            </div>
            <Footer />
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
