import { useState, useEffect } from 'react';
import {
    Row,
    Col,
    Card,
    Button,
    Spin,
} from "antd";

import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import moment from 'moment';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2'
// import EmployeeAttendanceForm from './EmployeeAttendanceForm'
import { CardContent, CardMedia } from '@mui/material';
import { useParams } from 'react-router-dom';
import "./profile.css"


const columns = [
    // { field: 'id', headerName: 'ID', width: 100 },
    {
        field: 'atten_date', headerName: 'Date', width: 200,
        valueGetter: (params) => moment(params.row.atten_date).format('MMM DD, YYYY')
    },

    { field: 'signin_time', headerName: 'Punch in', width: 200, },
    { field: 'signout_time', headerName: 'Punch out', width: 200 },
    { field: 'behaviour', headerName: 'Behaviour', width: 200 },
    { field: 'working_hour', headerName: 'Total hours', width: 200 },
    { field: 'location', headerName: 'Location', width: 230 },
    {
        field: 'updated_at', headerName: 'Updated At', width: 150,
        valueGetter: (params) => moment(params.row.time_stamp).format('MMM DD, YYYY HH:mm:ss')
    },
];


function ProfileAttendance() {

    const [employeeAttend, setEmployeeAttend] = useState([]);
    // const [fetchAgain, setFetchAgain] = useState(false);
    const [Id, setId] = useState();
    const path = useParams();
    const [loading, setLoading] = useState(false)

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

    const [open, setOpen] = useState(false);
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
        const fetchData = async () => {
            setLoading(true)
            const result = await axios.get('http://localhost:8000/api/attendance/get-employee-attendance/' + Id);
            setEmployeeAttend(result.data);
            setLoading(false)

        };
        fetchData();
    }, []);

    // const showDrawer = () => {
    //     setId();
    //     setOpen(true);
    // };
    const showDrawer2 = (id) => {
        setId(id);
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };


    const actionColumn = [
        // {
        //     field: 'actions',
        //     headerName: 'Actions',
        //     width: 150,
        //     sortable: false,
        //     disableColumnMenu: true,
        //     renderCell: (params) => (
        //         <>
        //             <Button aria-label="edit" style={{ margin: "0px 10px" }} onClick={() => showDrawer2(params.row.id)}>
        //                 <EditOutlined />
        //             </Button>
        //             {/* <Button
        //                 aria-label="delete"
        //                 onClick={() => handleDelete(params.row.id)}
        //             >
        //                 <DeleteOutlined />
        //             </Button> */}
        //         </>
        //     ),
        // },
    ]

    return (
        <>
            <Card style={{ width: '70%', marginTop: '2rem' }} className="details-card" bordered={false}>
                <CardMedia

                    sx={{ height: 60, backgroundColor: '#ecf7ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px' }}
                    className="card-media"
                >
                    <p className="mt-3 text-lg">Attendance</p>
                </CardMedia>

                <CardContent className="mt-4">
                    <div style={{ height: 450, width: '100%'}}>
                    {!loading ?
                        <DataGrid
                            rows={employeeAttend}
                            className='gridstyle'
                            rowHeight={80}
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

export default ProfileAttendance;
