import { useEffect, useState } from "react";
import {} from "react-router-dom";
import {
  Card,
  Col,
  Row,
  Typography,
  message,
  Button,
  Timeline,
  Radio,
} from "antd";
import {
  EditOutlined,
  HomeOutlined,
  UserOutlined,
  UserDeleteOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import "../assets/styles/home.css";

// import EChart from "../components/chart/EChart";
import EmployeeAttendanceForm2 from "./attendance/EmployeeAttendanceForm2";
import axios from "axios";
import { useStateContext } from "../contexts/ContextProvider";
import TakeBreakModal from "./attendance/TakeBreakModal";
import EmployeeDashboard from "./EmployeeDashboard";

const Home = () => {
  const { punchOut, user } = useStateContext();

  const [open, setOpen] = useState(false);
  const [punchTime, setPunchTime] = useState();
  const [punchLocation, setPunchLocation] = useState();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [todayAtten, setTodayAtten] = useState();
  const [allTodayAtten, setAllTodayAtten] = useState([]);
  const [allData, setAllData] = useState();
  const [Id, setId] = useState();

  const [isOpen, setIsOpen] = useState(false) // for take breal modal

  const showDrawer3 = async () => {
    setLoading(true);
    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const userAgent = window.navigator.userAgent;
    const deviceName = userAgent.split('(')[1].split(')')[0];

    const currentDate = new Date().toISOString();
    const obj = {
      time: currentTime,
      date: currentDate,
      device_info: deviceName
    };
    try {
      const response = await axios.get("https://ipapi.co/json/");
      const data = response.data;
      const ipAddress = data?.ip;
      setPunchLocation(ipAddress);
    } catch (error) {
      console.error("Error fetching IP address:", error);
    }
    setLoading(false);
    setPunchTime(obj);
    setId();
    setOpen(true);
  };

  const handleTakeBreak = ()=>{
    setIsOpen(true)
  }

  const onClose = () => {
    setOpen(false);
  };

  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    const user =
      localStorage.getItem("user") && JSON.parse(localStorage.getItem("user"));
    const fetchData = async () => {
      await axios
        .get(
          "http://localhost:8000/api/attendance/get-today_attendance/" +
            user?.id
        )
        .then((res) => {
          setTodayAtten(res.data);
        })
        .catch((err) => {
          message.error("Error fetching data");
        });
    };
    fetchData();
  }, [punchOut]);

  useEffect(() => {
    setDataLoading(true);
    const fetchData = async () => {
      await axios
        .get(`http://localhost:8000/api/mis/all_data?emp_id=${user?.id}`)
        .then((res) => {
          setAllData(res.data);
          setDataLoading(false);
        })
        .catch((err) => {
          setDataLoading(false);
          message.error("Error fetching data");
        });
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const currentDate = new Date().toISOString().split("T")[0];
      const result = await axios.get(
        `http://localhost:8000/api/attendance/get-employee-attendance?date=${currentDate}`
      );

      setAllTodayAtten(result.data);
    };
    fetchData();
  }, []);
  return (
    <>
      <EmployeeAttendanceForm2
        onClose={onClose}
        open={open}
        Id={Id}
        punchTime={punchTime}
        punchLocation={punchLocation}
        todayAtten={todayAtten}
      />
      <TakeBreakModal isOpen={isOpen} setIsOpen={setIsOpen} onClose={()=> setIsOpen(false)}  todayAtten={todayAtten}/>

      <div className="layout-content p-8">
        <Row
          // gutter={[24, 0]}
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Col xs={24} sm={24} md={12} lg={12} xl={10} className="punchcol">
            {todayAtten && todayAtten.length === 0 ? (
              <div className="btn">
                <Button
                  type="primary"
                  className="punch"
                  style={{ backgroundColor: "limegreen" }}
                  onClick={showDrawer3}
                  loading={loading}
                >
                  Punch In
                </Button>
              </div>
            ) : (
              <>
                <div className="btn">
                  <Button
                    type="primary"
                    className="punch"
                    style={{ backgroundColor: "#fc6510" }}
                    onClick={showDrawer3}
                    loading={loading}
                  >
                    Punch out
                  </Button>
                </div>
                {todayAtten && todayAtten.length>0 && todayAtten[0].on_break === 0 ?
                <div className="btn">
                  <Button
                    type="primary"
                    className="punch"
                    onClick={handleTakeBreak}
                  >
                    Take a break
                  </Button>
                </div>
                :
                <div className="btn">
                  <Button
                    type="primary"
                    className="punch"
                    onClick={handleTakeBreak}
                  >
                    On a break
                  </Button>
                </div>
                }
              </>
            )}
          </Col>
        </Row>

        {user?.role==='admin' && 
        <div className="flex gap-8 justify-between flex-wrap">
          <div
            bordered={false}
            className="h-24 w-60 cardbg rounded-sm flex items-center pl-8 gap-4"
          >
            <div
              className="h-12 w-12 flex justify-center items-center rounded-sm"
              style={{ backgroundColor: "#03C9D7" }}
            >
              <UserOutlined className="text-2xl" />
            </div>
            <div>
              <div>
                {dataLoading ? <LoadingOutlined /> : allData?.employees}
              </div>
              <p className="text-xs text-primary">Total employees </p>
            </div>
          </div>

          <div
            bordered={false}
            className="h-24 w-60 cardbg rounded-sm flex items-center pl-8 gap-4"
          >
            <div
              className="h-12 w-12 flex justify-center items-center rounded-sm"
              style={{ backgroundColor: "#03C9D7" }}
            >
              <HomeOutlined className="text-2xl" />
            </div>
            <div>
              <div>
                {dataLoading ? (
                  <LoadingOutlined />
                ) : (
                  allData?.departments.length
                )}
              </div>
              <p className="text-xs text-primary">Total departments </p>
            </div>
          </div>

          <div
            bordered={false}
            className="h-24 w-60 cardbg rounded-sm flex items-center pl-8 gap-4"
          >
            <div
              className="h-12 w-12 flex justify-center items-center rounded-sm"
              style={{ backgroundColor: "#03C9D7" }}
            >
              <EditOutlined className="text-2xl" />
            </div>
            <div>
              <div>
                {dataLoading ? (
                  <LoadingOutlined />
                ) : (
                  allData?.leave_request.length
                )}
              </div>
              <p className="text-xs text-primary">Total leave requests</p>
            </div>
          </div>

          <div
            bordered={false}
            className="h-24 w-60 cardbg rounded-sm flex items-center pl-8 gap-4"
          >
            <div
              className="h-12 w-12 flex justify-center items-center rounded-sm"
              style={{ backgroundColor: "#03C9D7" }}
            >
              <UserDeleteOutlined className="text-2xl" />
            </div>
            <div>
              <div>
                {dataLoading ? <LoadingOutlined /> : allData?.leave_today}
              </div>
              <p className="text-xs text-primary">Leave today </p>
            </div>
          </div>
        </div>}

        <EmployeeDashboard todayAtten={todayAtten} allData={allData}/>

      </div>
    </>
    
  );
};

export default Home;
