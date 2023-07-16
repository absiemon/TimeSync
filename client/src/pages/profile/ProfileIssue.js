import { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
} from "antd";
import { Link } from "react-router-dom";

import { DataGrid, GridToolbar } from '@material-ui/data-grid';
import axios from 'axios';
import moment from 'moment';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2'
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
// import "./rental.css"


const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'emp_id', headerName: 'Employee Id', width: 200 },
    { field: 'emp_name', headerName: 'Employee Name', width: 200 },
    { field: 'issue_items', headerName: 'Issue Items', width: 200, valueGetter: (params) => JSON.parse(params.row.issue_items)},
    { field: 'issue_date', headerName: 'Issue Date', width: 200, 
    valueGetter: (params) => moment(params.row.issue_date).format('MMM DD, YYYY')},
    { field: 'return_date', headerName: 'Return Date', width: 200,
    valueGetter: (params) => moment(params.row.return_date).format('MMM DD, YYYY')},
    { field: 'created_by', headerName: 'Created By', width: 200},
        
    { field: 'created_at', headerName: 'Created At', width: 150 ,
    valueGetter: (params) => moment(params.row.created_at).format('MMM DD, YYYY HH:mm:ss')},
    { field: 'updated_at', headerName: 'Updated At', width: 150 ,
    valueGetter: (params) => moment(params.row.updated_at).format('MMM DD, YYYY HH:mm:ss')},
  ];


function ProfileIssue() {

    const path = useParams();
    const [employeeIssue, setEmployeeIssue] = useState([]);
    const[fetchAgain, setFetchAgain] = useState(false);
    const [user, setUser] = useState();

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

    useEffect(() => {
      const id = path.id;
      const userData = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))
      let Id;
      if(id){
        Id = id;
      }
      else{
        Id = userData?.userId
      }
      setUser(userData);
      const fetchData = async () => {
        const result = await axios.get(`http://localhost:8000/api/employee-issue/get-employee-issue/${Id}`);
        setFetchAgain(!fetchAgain)
        setEmployeeIssue(result.data);
      };
      fetchData();
    }, []);
  
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
            axios.delete(`http://localhost:8000/api/employee-issue/delete-employee-issue/${sr_no}`);
          setEmployeeIssue(employeeIssue.filter((item) => item.id !== sr_no));
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
              <Link to={`/employeeissueform/${params.row.id}`}>
          <Button aria-label="edit" style={{margin:"0px 10px"}}>
            <EditOutlined />
          </Button>
          </Link>
          <Button
            aria-label="delete"
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
      <div className="tabled">
        <Row gutter={[24, 0]}>
          <Col xs="24" xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="Employee Issue List"
              extra={
                <>
                  <Link to="/employeeissueform">
                  <Button type="primary">
                    Add Details
                  </Button>
                  </Link>
                </>
              }
            >
              <div className="table-responsive">
                <div style={{ height: 450, width: '100%', padding:"15px 20px" }}>
                  <DataGrid
                    rows={employeeIssue}
                    columns={columns.concat(actionColumn)}
                    pageSize={10}
                    checkboxSelection
                    disableSelectionOnClick
                    components={{
                      Toolbar: GridToolbar,
                    }}
                    getRowClassName={getRowClassName} 
                  />
                </div>

              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default ProfileIssue;
