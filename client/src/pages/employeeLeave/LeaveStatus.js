import { useState, useEffect, useContext } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  message,
  Input,
  Spin,
} from "antd";


import { Link, useNavigate } from "react-router-dom";

import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import moment from 'moment';
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2'
import { useStateContext } from '../../contexts/ContextProvider';
import '../employees/style.css';
import '../../assets/styles/home.css';
import redirect from '../../assets/images/maximize.png'


function LeaveStatus() {

  const { user } = useStateContext();
  const navigate = useNavigate()


  const handleView = (fname) => {
    const url = `https://superdolphins.com/superdolphins.com/superdolphinsltd/${fname}`;
    window.open(url, '_blank');
    }

  const columns = [
    // { field: 'emp_id', headerName: 'Employee Id', width: 200 },
    {
      field: 'emp_name', headerName: 'Profile', width: 200,
      renderCell: (params) => {
        const name  =params.row.emp_name;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className='h-12 w-12 rounded-full bg-main-dark-bg flex justify-center items-center'>{name.charAt(0)}</div>
            <div placement="topLeft" style={{ display: 'flex', flexDirection: 'column' }}>
              <Link to={'/employee/profile/' + params.row.id} target="_blank" style={{ color: '#0088e1' }}>{params.row.emp_name}</Link>
              <div className='text-white text-xs'>{params.row.emp_id}</div>
            </div>
          </div>
        )
      },
    }, 
    { field: 'leave_type', headerName: 'Leave Type', width: 200 },
    {
      field: 'start_date', headerName: 'Start Date', width: 200,
      valueGetter: (params) => moment(params.row.start_date).format('MMM DD, YYYY')
    },
    {
      field: 'apply_date', headerName: 'Apply Date', width: 200,
      valueGetter: (params) => moment(params.row.apply_date).format('MMM DD, YYYY')
    },
    { field: 'leave_duration', headerName: 'Leave Duration', width: 150 },
    {
      field: 'attachment', headerName: 'Attachment', width: 200,
      renderCell: (params) => {
        return (
            <div style={{ cursor: "pointer" }}>
                <div placement="topLeft" className='flex gap-2'>
                    <div>{params.row.attachment}</div>
                    {params.row.attachment &&
                        <div role="button" onClick={() => handleView(params.row.attachment)}>
                            <img src={redirect} alt='icon' style={{ height: '20px', width: '20px', margin: '0px 0px 3px 10px' }} />
                        </div>}
                </div>
            </div>
        )
    },},
    { field: 'reason', headerName: 'Reason', width: 150 },
    {
      field: 'status', headerName: 'Status', width: 150,
      renderCell: (params) => {
        const status = params.row.status
        const id = params.row.id
        return (
          <div style={{ cursor: "pointer", backgroundColor: `${status === 'pending' ? 'yellow' : status === 'accepted' ? 'green' : 'red'}`, width: '100%', padding: '5px 26px', borderRadius:'35px', color: 'white' }}>
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

  const [leaveStatus, setLeaveStatus] = useState([]);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [filterByName, setFilterByName] = useState()
  const [loading, setLoading] = useState(false);

  const getRowClassName = (params) => {
    const date = params.row.contract_end_date;
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    if (new Date(date) > today) {
      return 'yellow-row';
    } else if (new Date(date) < today) {
      return 'red-row';
    }
    return '';
  };

  
  const handleChange = (e) => {
    setFilterByName(e.target.value);
    if (e.target.value.length === 0) {
      setFetchAgain(!fetchAgain)
    }
  }

  const handleKeyPress = () => {
    setFetchAgain(!fetchAgain)
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      let result;
      if(user && user?.role==='admin'){
        result = await axios.get(`http://localhost:8000/api/leave/get?type=status&name=${filterByName}`);
      }
      else{
        result = await axios.get(`http://localhost:8000/api/leave/get-leave/${user?.id}?type=status&name=${filterByName}`);
      }
      setLoading(false)
      setLeaveStatus(result.data);
    };
    fetchData();
  }, [fetchAgain]);

  // const handleStatus = async(status) => {
  //   if(empId){
  //     try {
  //       const result = await axios.post('http://localhost:8000/api/employee-leave/update-employee-leave-status',
  //       {id: empId, status:status}
  //       );
  //       setOpen(false);
  //       setFetchAgain(!fetchAgain)
  //     } catch (error) {
  //       message("cannot update status")
  //     }
  //   }
  // }

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
        axios.delete(`http://localhost:8000/api/leave/delete-status/${sr_no}`);
        setLeaveStatus(leaveStatus.filter((item) => item.id !== sr_no));
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
          {user?.role==='admin' && <Button
            aria-label="delete"
            className='punch bg-white'
            onClick={() => handleDelete(params.row.id)}
          >
            <DeleteOutlined />
          </Button>}
        </>
      ),
    },
  ]


  return (
    <>
      <header className='p-8'>
        <div className='flex justify-between pb-6'>
          <h2 className='text-xl text-white'>Leave Status</h2>
          <Button type="primary" htmlType="submit" style={{ margin: "0px 10px", backgroundColor: "limegreen" }} className='punch' onClick={() => navigate('/leave/create')}>
            {user.role==='admin' ? 'Assign' : 'Request'} Leave
          </Button>
        </div>
        <div className='flex justify-end'>
          {/* <div className='flex gap-5'>
            <div className='bgcl py-3 px-6 rounded-full text-sm cursor-pointer'>Created</div>
            <div className='bgcl py-3 px-6 rounded-full text-sm cursor-pointer' onClick={() => setOpen(true)}>Department</div>
            <div className='bgcl py-3 px-6 rounded-full text-sm cursor-pointer'>Email</div>
          </div> */}
          <div className='flex relative'>
            <SearchOutlined className='search-icon' />
            <Input placeholder='search' className='search-input w-48' value={filterByName} onChange={handleChange} onPressEnter={handleKeyPress} />
          </div>
        </div>
      </header>
      <div className="tabled">
        <div className="table-responsive">
          <div style={{ height: 750, width: '100%', padding: "15px 20px" }}>
          {!loading  ?
            <DataGrid
              className='gridstyle'
              rowHeight={80}
              rows={loading ? [] : leaveStatus}
              columns={columns.concat(actionColumn)}
              pageSize={10}
              checkboxSelection
              disableSelectionOnClick
              components={{
                Toolbar: GridToolbar,
              }}
              getRowClassName={getRowClassName}
            />
            :
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Spin /> 
              </div>
            }
          </div>

        </div>
      </div>
    </>
  );
}

export default LeaveStatus;
