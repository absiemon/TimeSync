import { useState, useEffect, useContext } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  message,
  Input,
  Spin,
  Tooltip,
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


function Announcement() {

  const { user } = useStateContext();
  const navigate = useNavigate()


  const handleView = (fname) => {
    const url = `https://superdolphins.com/superdolphins.com/superdolphinsltd/${fname}`;
    window.open(url, '_blank');
    }

  const columns = [
    {
      field: 'departments', headerName: 'Departments', width: 200,
      renderCell: (params) => {
        const tags = JSON.parse(params.row.departments)
        return (
          <div style={{ cursor: "pointer" }}>
            <Tooltip placement="topLeft" title={tags.join(", ")}>
              <span >{tags.join(", ")}</span>
            </Tooltip>
          </div>
        )
      },
    },

    {
      field: 'start_date', headerName: 'Start Date', width: 200,
      valueGetter: (params) => moment(params.row.start_date).format('MMM DD, YYYY')
    },
    {
      field: 'end_date', headerName: 'End Date', width: 200,
      valueGetter: (params) => moment(params.row.apply_date).format('MMM DD, YYYY')
    },
    {
      field: 'description', headerName: 'Description', width: 200,
      renderCell: (params) => {
        const tags = params.row.description;
        return (
          <div style={{ cursor: "pointer" }}>
            <Tooltip placement="topLeft" title={tags}>
              <span >{tags}</span>
            </Tooltip>
          </div>
        )
      },
    },
    
    { field: 'create_by', headerName: 'Created By', width: 150 },
   
    {
      field: 'updated_at', headerName: 'Updated At', width: 150,
      valueGetter: (params) => moment(params.row.time_stamp).format('MMM DD, YYYY HH:mm:ss')
    },
  ];

  const [announcements, setAnnouncements] = useState([]);
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
        result = await axios.get(`http://localhost:8000/api/announcement/get?name=${filterByName}`);
      }
      else{
        result = await axios.get(`http://localhost:8000/api/announcement/get-announcement/${user?.id}`);
      }
      setLoading(false)
      setAnnouncements(result.data);
    };
    fetchData();
  }, [fetchAgain]);


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
        axios.delete(`http://localhost:8000/api/announcement/delete/${sr_no}`);
        setAnnouncements(announcements.filter((item) => item.id !== sr_no));
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

          {user?.role==='admin' &&
          <Link to={`/announcement/create/${params.row.id}`}>
            <Button aria-label="edit" style={{ margin: "0px 10px" }} className='punch bg-white'>
              <EditOutlined />
            </Button>
          </Link>}
        </>
      ),
    },
  ]


  return (
    <>
      {user?.role==='admin' && 
      <header className='p-8'>
        <div className='flex justify-between pb-6'>
          <h2 className='text-xl text-white'>Announcements</h2>
          <Button type="primary" htmlType="submit" style={{ margin: "0px 10px", backgroundColor: "limegreen" }} className='punch' onClick={() => navigate('/announcement/create')}>
            Create Announcement
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
      </header>}

      {user.role !== 'admin' && <h2 className='text-xl text-white mt-12'>Announcements</h2>}

      <div className="tabled">
        <div className="table-responsive">
          <div style={{ height: 750, width: '100%', padding: "15px 20px" }}>
          {!loading  ?
            <DataGrid
              className='gridstyle'
              rowHeight={80}
              rows={loading ? [] : announcements}
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

export default Announcement;
