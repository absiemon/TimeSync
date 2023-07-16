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
import { CardContent, CardMedia } from '@mui/material';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';




function ProfilePassport() {
    const path = useParams();

    const diffInDate = (date) => {
        const currentDate = new Date(); // Current date
        const specificDate = new Date(date);
        const differenceInMilliseconds = specificDate - currentDate;

        // Convert milliseconds to days
        const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
        return differenceInDays;
    }
    const [licenceData, setLicenceData] = useState([]);

    const columns = [
        { field: 'for_person', headerName: 'For Person', width: 150 },
        { field: 'name_on_passport', headerName: 'Name on Passport', width: 200 },
        { field: 'position', headerName: 'Position', width: 200 },
        { field: 'passport_id', headerName: 'Passport Number', width: 200 },
        {
            field: 'passport_issued', headerName: 'Passport Issued', width: 200,
            valueGetter: (params) => moment(params.row.passport_issued).format('MMM DD, YYYY')
        },
        {
            field: 'passport_expired', headerName: 'Passport Expired', width: 200,
            renderCell: (params) => {
                const diff = diffInDate(params.row.passport_expired)
                return (
                    <div style={{ cursor: "pointer", backgroundColor: `${diff < 0 ? 'red' : diff <= 30 ? 'yellow' : ''}`, width: '100%', padding: '5px', color: `${diff <= 30 && 'white'}` }}>
                        <div placement="topLeft" >
                            <span >{moment(params.row.passport_expired).format('MMM DD, YYYY')}</span>
                        </div>
                    </div>
                )
            },
        },
        { field: 'passport_current_status', headerName: 'Passport Current Status', width: 250 },
        { field: 'original_passport_in_files', headerName: 'Original Passport in Files', width: 250 },
        { field: 'visa_id', headerName: 'Visa Number', width: 200 },
        {
            field: 'visa_issued', headerName: 'Visa Issued', width: 200,
            valueGetter: (params) => moment(params.row.visa_issued).format('MMM DD, YYYY')
        },
        {
            field: 'visa_expired', headerName: 'Visa Expired', width: 200,
            renderCell: (params) => {
                const diff = diffInDate(params.row.visa_expired)
                return (
                    <div style={{ cursor: "pointer", backgroundColor: `${diff < 0 ? 'red' : diff <= 30 ? 'yellow' : ''}`, width: '100%', padding: '5px', color: `${diff <= 30 && 'white'}` }}>
                        <div placement="topLeft" >
                            <span >{moment(params.row.visa_expired).format('MMM DD, YYYY')}</span>
                        </div>
                    </div>
                )
            },
        },
        { field: 'visa_current_status', headerName: 'Visa Current Status', width: 250 },
        { field: 'visa_copy_in_files', headerName: 'Visa Copy in Files', width: 200 },
        { field: 'frc_id', headerName: 'FRC Number', width: 200 },
        {
            field: 'frc_issued', headerName: 'FRC Issued', width: 200,
            valueGetter: (params) => moment(params.row.frc_issued).format('MMM DD, YYYY')
        },
        {
            field: 'frc_expired', headerName: 'FRC Expired', width: 200,
            renderCell: (params) => {
                const diff = diffInDate(params.row.frc_expired)
                return (
                    <div style={{ cursor: "pointer", backgroundColor: `${diff < 0 ? 'red' : diff <= 30 ? 'yellow' : ''}`, width: '100%', padding: '5px', color: `${diff <= 30 && 'white'}` }}>
                        <div placement="topLeft" >
                            <span >{moment(params.row.frc_expired).format('MMM DD, YYYY')}</span>
                        </div>
                    </div>
                )
            },
        },
        { field: 'frc_current_status', headerName: 'FRC Current Status', width: 250 },
        { field: 'frc_copy_in_files', headerName: 'FRC Copy in Files', width: 230 },
        { field: 'formc_id', headerName: 'Form C Number', width: 200 },
        {
            field: 'formc_issued', headerName: 'FORMC Issued', width: 200,
            valueGetter: (params) => moment(params.row.formc_issued).format('MMM DD, YYYY')
        },
        {
            field: 'formc_expired', headerName: 'FORMC Expired', width: 200,
            renderCell: (params) => {
                const diff = diffInDate(params.row.formc_expired)
                return (
                    <div style={{ cursor: "pointer", backgroundColor: `${diff < 0 ? 'red' : diff <= 30 ? 'yellow' : ''}`, width: '100%', padding: '5px', color: `${diff <= 30 && 'white'}` }}>
                        <div placement="topLeft" >
                            <span >{moment(params.row.formc_expired).format('MMM DD, YYYY')}</span>
                        </div>
                    </div>
                )
            },
        },
        { field: 'formc_current_status', headerName: 'FORMC Current Status', width: 250 },
        { field: 'formc_copy_in_files', headerName: 'FORMC Copy in Files', width: 250 },
        { field: 'holiday', headerName: 'Holiday', width: 200 },
        { field: 'company', headerName: 'Company', width: 200 },
        { field: 'remark', headerName: 'Remark', width: 200 },
        { field: 'created_by', headerName: 'Created By', width: 200 },

    ];

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
            const result = await axios.get('http://localhost:8000/api/passport/get-emp_passport/' + Id);
            setLicenceData(result.data);
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
                axios.delete(`http://localhost:8000/api/passport/delete/${sr_no}`);
                setLicenceData(licenceData.filter((item) => item.id !== sr_no));
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

                    <Link to={`/passportform/${params.row.id}`}>
                        <Button aria-label="edit" style={{ margin: "0px 10px" }}>
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

            <Card style={{ width: '70%', marginTop: '2rem' }} className="details-card">
                <CardMedia

                    sx={{ height: 60, backgroundColor: '#ecf7ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px' }}
                    className="card-media"
                >
                    <h5 className="mt-3">Passport Details</h5>
                </CardMedia>

                <CardContent className="mt-4">
                    <div style={{ height: 450, width: '100%',  }}>
                        <DataGrid
                            rows={licenceData}
                            columns={columns.concat(actionColumn)}
                            pageSize={10}
                            checkboxSelection
                            disableSelectionOnClick
                            components={{
                                Toolbar: GridToolbar,
                            }}
                        />
                    </div>

                </CardContent>

            </Card>
            
        </>
    );
}

export default ProfilePassport;
