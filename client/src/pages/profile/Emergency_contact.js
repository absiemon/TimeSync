import { useState, useEffect } from 'react';
import {
    Card,
    Button,
    Spin,
    Tooltip,
} from "antd";
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2'
import { useParams } from 'react-router-dom';
import "./profile.css"
import AddEmergencyContact from './AddEmergencyContact';

function EmergencyContact() {

    const path = useParams();
    const [fetchAgain, setFetchAgain] = useState(false);
    const [contacts, setContacts] = useState([])
    const [loading, setLoading] = useState(false)
    const [visible, setVisible] = useState(false)
    const [rowId, setRowId] = useState();

    const columns = [

        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'relationship', headerName: 'Relationship', width: 200 },
        {
            field: 'email', headerName: 'Email', width: 200,
            renderCell: (params) => {
              const tags = JSON.parse(params.row.email)
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
            field: 'phone_number', headerName: 'Phone(s)', width: 200,
            renderCell: (params) => {
              const tags = JSON.parse(params.row.phone)
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
            field: 'address', headerName: 'Address', width: 200,
            renderCell: (params) => {
                const address = params.row.address;
                const city = params.row.city;
                const state = params.row.state;
                const country = params.row.country;
                let tags = [address, city, state, country]
                return (
                    <div style={{ cursor: "pointer" }}>
                        <Tooltip placement="topLeft" title={tags.join(", ")}>
                            <span >{tags.join(", ")}</span>
                        </Tooltip>
                    </div>
                )
            }
        },

        { field: 'added_by', headerName: 'Added By', width: 200 },

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
        setLoading(true)
        const fetchData = async () => {
            const result = await axios.get(`http://localhost:8000/api/emg_contact/get/${Id}`);
            setContacts(result.data);
            setLoading(false)
        };
        fetchData();
    }, [fetchAgain])

    const handleOpenModal = (rowid) => {
        setRowId(rowid);
        setVisible(true);
    }

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
                axios.delete(`http://localhost:8000/api/emg_contact/delete/${sr_no}`);
                setContacts(contacts.filter((item) => item.id !== sr_no));
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
                    <Button
                        aria-label="edit"
                        style={{ margin: "0px 10px" }}
                        className='punch bg-white'
                        onClick={() => handleOpenModal(params.row.id)}
                    >
                        <EditOutlined />
                    </Button>
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
            <AddEmergencyContact
                visible={visible}
                setVisible={setVisible}
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
                id={rowId}
                emp_id={path.id}
            />

            <Card style={{ width: '70%', marginTop: '2rem' }} className="details-card" bordered={false}>
                <CardMedia
                    sx={{ height: 60, backgroundColor: '#ecf7ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px' }}
                    className="card-media"
                >
                    <p className="mt-3 text-lg">Emergency contacts</p>
                </CardMedia>

                <CardContent className="mt-4 relative">
                    <Button type="primary" htmlType="submit" style={{ margin: "0px 10px", backgroundColor: "limegreen" }} className='punch absolute right-1' onClick={() => setVisible(true)}>
                        Add
                    </Button>
                    <div style={{ height: 450, width: '100%' }} className='mt-12'>
                        {!loading ?
                            <DataGrid
                                rows={contacts}
                                rowHeight={80}
                                className='gridstyle'
                                columns={columns.concat(actionColumn)}
                                pageSize={10}
                                checkboxSelection
                                disableSelectionOnClick
                                components={{
                                    Toolbar: GridToolbar,
                                }}
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

export default EmergencyContact;
