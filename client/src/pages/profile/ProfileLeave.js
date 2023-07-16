import { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Spin,
} from "antd";
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Link } from "react-router-dom";

import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import moment from 'moment';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2'
import { useParams } from 'react-router-dom';
import "./profile.css"


const columns = [
  
  { field: 'leave_type', headerName: 'Leave Type', width: 200 },
  {
    field: 'start_date', headerName: 'Start Date', width: 200,
    valueGetter: (params) => moment(params.row.start_date).format('MMM DD, YYYY')
  },
  { field: 'leave_duration', headerName: 'Leave Duration', width: 200 },
  {
    field: 'apply_date', headerName: 'Apply Date', width: 200,
    valueGetter: (params) => moment(params.row.apply_date).format('MMM DD, YYYY')
  },
  // {
  //   field: 'attachment', headerName: 'Attachment', width: 200,
  //   valueGetter: (params) => params.row.attachment && JSON.parse(params.row.attachment)
  // },
  { field: 'reason', headerName: 'Reason', width: 150 },
  {
    field: 'status', headerName: 'Status', width: 150,
    renderCell: (params) => {
      const status = params.row.status
      return (
        <div style={{ cursor: "pointer", backgroundColor: `${status === 'pending' ? 'yellow' : status === 'accepted' ? 'green' : 'red'}`, width: '100%', padding: '4px 26px', borderRadius:'35px', color: 'white' }}>
          <div placement="topLeft" >
            <span >{status}</span>
          </div>
        </div>
      )
    },
  },

  {
    field: 'updated_at', headerName: 'Updated At', width: 150,
    valueGetter: (params) => moment(params.row.time_stamp).format('MMM DD, YYYY HH:mm:ss')
  },
];


function ProfileLeave() {
  const path = useParams();
  const [employeeLeave, setEmployeeLeave] = useState([]);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [user, setUser] = useState();

  const [loading, setLoading] = useState(false);

  const [leaveAccepted, setLeaveAccepted] = useState(0)
  const [leaveRejected, setLeaveRejected] = useState(0)
  const [UpcomingLeave, setUpcomingLeave] = useState(0)


  useEffect(() => {
    const id = path.id;
    const userData = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))
    let Id;
    if (id) {
      Id = id;
    }
    else {
      Id = userData?.userId
    }
    setUser(userData);
    const fetchData = async () => {
      setLoading(true)
      const result = await axios.get(`http://localhost:8000/api/leave/get-leave/${Id}`);
      setEmployeeLeave(result.data)
      const data = result.data;
      data.map((leave)=>{
        if(leave.status === 'rejected'){
          setLeaveRejected((prev)=>{
            return prev+1
          })
        }
        else if(leave.status === 'accepted'){
          setLeaveAccepted((prev)=>{
            return prev+1
          })
        }
        else if(leave.status==='pending') {
          setUpcomingLeave((prev)=>{
            return prev+1
          })
        }
      })
      setLoading(false)

    };
    fetchData();
  }, [])

  const handleDelete = (sr_no) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
        axios.delete(`http://localhost:8000/api/employee-leave/delete-employee-leave/${sr_no}`);
        setEmployeeLeave(employeeLeave.filter((item) => item.id !== sr_no));
      }
    })
  };

  const actionColumn = [
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <>
          <Link to={`/employeeleaveform/${params.row.id}`}>
            <Button aria-label="edit" style={{ margin: "0px 10px" }} className='punch bg-white'>
              <EditOutlined />
            </Button>
          </Link>
          <Button
            aria-label="delete"
            className='punch bg-white'
            onClick={() => handleDelete(params.row.id)}
          >
            <DeleteOutlined />
          </Button>
        </>
      ),
    },
  ]


  return (
    <>
      <Card style={{ width: '70%', marginTop: '2rem' }} className="details-card" bordered={false}>
        <CardMedia
          sx={{ height: 60, backgroundColor: '#ecf7ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px' }}
          className="card-media"
        >
          <p className="mt-3 text-lg">Leave</p>
        </CardMedia>

        <CardContent className="mt-4">
          <div className='flex justify-around flex-wrap mb-4'>
            <div style={{height:'80px', width:'180px', backgroundColor:'black', borderRadius:'4px', textAlign:'center', paddingTop:'15px'}}>
              <p>{leaveAccepted}</p>
              <p>Leave approved</p>
            </div>
            <div style={{height:'80px', width:'180px', backgroundColor:'black', borderRadius:'4px', textAlign:'center', paddingTop:'15px'}}>
              <p>{UpcomingLeave}</p>
              <p>Upcoming leave</p>
            </div>
            <div style={{height:'80px', width:'180px', backgroundColor:'black', borderRadius:'4px', textAlign:'center', paddingTop:'15px'}}>
              <p>{leaveRejected}</p>
              <p>Rejected leave</p>
            </div>
          </div>

          <div style={{ height: 450, width: '100%', }}>
          {!loading ?
            <DataGrid
              rows={employeeLeave}
              rowHeight={80}
              className='gridstyle'
              columns={columns.concat(actionColumn)}
              pageSize={10}
              checkboxSelection
              disableSelectionOnClick
              components={{
                Toolbar: GridToolbar,
              }}
              // getRowClassName={getRowClassName}
            />
            :
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Spin />
            </div>
        }
          </div>

        </CardContent>

      </Card>

    </>
  );
}

export default ProfileLeave;
