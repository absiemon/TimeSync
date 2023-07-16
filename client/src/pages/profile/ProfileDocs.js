import { useState, useEffect } from 'react';
import {
    Row,
    Col,
    Card,
    Button,
} from "antd";
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Link } from "react-router-dom";

import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import moment from 'moment';
import { DeleteOutlined, EditOutlined, ManOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2'
import { useParams } from 'react-router-dom';
import "./profile.css"
import redirect from '../../assets/images/share.png'



function ProfileDocs({ employee }) {
    const path = useParams();
    const [employeeDocs, setEmployeeDocs] = useState([]);
    
    const handleView = (fname) => {
        const url = `https://vimpexltd.com/vimpexltd.com/vimpexsoftware/${fname}`;
        window.open(url, '_blank');
    }
    const columns = [

        { field: 'name', headerName: 'Name', width: 200 },
        {
            field: 'attachment', headerName: 'Attachment', width: 200,
            renderCell: (params) => {
                return (
                    <div style={{ cursor: "pointer" }}>
                        <div placement="topLeft" className='d-flex'>
                            <div>{params.row.attachment}</div>
                            {params.row.attachment &&
                                <div role="button" onClick={() => handleView(params.row.attachment)}>
                                    <img src={redirect} alt='icon' style={{ height: '20px', width: '20px', margin: '0px 0px 3px 10px' }} />
                                </div>}
                        </div>
                    </div>
                )
            },
        },
        { field: 'added_by', headerName: 'Added By', width: 200 },

    ];


    useEffect(() => {
        
        const fetchData = async () => {
            let mergedObj = { ...employee };
            // console.log(mergedObj);
            const arrOfObj = [
                {
                    id: 1,
                    name: 'Employee cv',
                    attachment: mergedObj?.emp_cv,
                    added_by: mergedObj.created_by
                },
                {
                    id: 2,
                    name: 'Certificates',
                    attachment: mergedObj?.certificates && JSON.parse(mergedObj.certificates)[0],
                    added_by: mergedObj.created_by
                },
            ]

            setEmployeeDocs(arrOfObj);
        };
        fetchData();
    }, [])

    // const handleDelete = (sr_no) => {
    //     Swal.fire({
    //         title: 'Are you sure?',
    //         text: "You won't be able to revert this!",
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonColor: '#3085d6',
    //         cancelButtonColor: '#d33',
    //         confirmButtonText: 'Yes, delete it!'
    //     }).then((result) => {
    //         if (result.isConfirmed) {
    //             Swal.fire(
    //                 'Deleted!',
    //                 'Your file has been deleted.',
    //                 'success'
    //             )
    //             axios.delete(`http://localhost:8000/api/employee-leave/delete-employee-leave/${sr_no}`);
    //             // setEmployeeLeave(employeeLeave.filter((item) => item.id !== sr_no));
    //         }
    //     })
    // };

    const actionColumn = [
        // {
        //     field: 'actions',
        //     headerName: 'Actions',
        //     width: 150,
        //     sortable: false,
        //     disableColumnMenu: true,
        //     renderCell: (params) => (
        //         <>
        //             <Link to={`/employeeleaveform/${params.row.id}`}>
        //                 <Button aria-label="edit" style={{ margin: "0px 10px" }}>
        //                     <EditOutlined />
        //                 </Button>
        //             </Link>
        //             <Button
        //                 aria-label="delete"
        //                 onClick={() => handleDelete(params.row.id)}
        //             >
        //                 <DeleteOutlined />
        //             </Button>
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
                    <p className="mt-3 text-lg">Documents</p>
                </CardMedia>

                <CardContent className="mt-4">
                    <div style={{ height: 450, width: '100%' }}>
                        <DataGrid
                            rows={employeeDocs}
                            rowHeight={80}
                            className='gridstyle'
                            columns={columns.concat(actionColumn)}
                            pageSize={10}
                            checkboxSelection
                            disableSelectionOnClick
                            components={{
                                Toolbar: GridToolbar,
                            }}
                        //   getRowClassName={getRowClassName}
                        />
                    </div>

                </CardContent>

            </Card>

        </>
    );
}

export default ProfileDocs;
