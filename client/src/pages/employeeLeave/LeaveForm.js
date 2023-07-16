import { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Form, Input, DatePicker, message, Select } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import moment from 'moment';
// import '../../assets/styles/principal.css'

import {
    DeleteOutlined,
    FilePdfOutlined,
    FolderViewOutlined,
    LoadingOutlined,
} from "@ant-design/icons";
import { useStateContext } from '../../contexts/ContextProvider';
// const { Option } = Select;

function LeaveForm() {
    const { user } = useStateContext();

    const [form] = Form.useForm();
    const navigate = useNavigate()
    const path = useParams();
    const id = path.id
    const [uploadedAttachment, setUploadedAttachment] = useState();
    const [loading, setLoading] = useState(false);
    const[uploadValue, setUploadValue] = useState("")
    const [buttonLoading, setButtonLoading] = useState(false);
    const [employees, setEmployees] = useState([])


    const leaveTypes= [
        {value:"Annual leave", label:"Annual leave"},
        {value:"Casual leave", label:"Casual leave"},
        {value:"Medical leave", label:"Medical leave"},
    ]

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const res = await axios.get(`http://localhost:8000/api/leave/get/${id}`);
                    const data = res.data[0];
                    data.attachment && data?.attachment.length>0 && setUploadedAttachment(data?.attachment);
                    form.setFieldsValue({
                        emp_id: data.emp_id,
                        emp_name	: data.emp_name,
                        leave_type	: data.leave_type,
                        start_date	: moment(data.start_date),
                        end_date	: moment(data.end_date),
                        leave_duration	: data.leave_duration,
                        apply_date	: moment(data.apply_date),
                        attachment	: data.attachment,
                        reason	: data.reason,
                        status	: data.status,
                    });
                } catch (err) {
                    message.error('Error Employee Leave data');
                }
            };
            fetchData();
        }
        else{
            form.setFieldsValue({
                status: "pending",
                apply_date: moment(new Date())
            })
            if(user?.role !== 'admin'){
                form.setFieldsValue({
                    emp_name: user.emp_name,
                    emp_id: user.id
                })
            }
        }
    }, [id, form]);

    useEffect(() => {
        const fetchData = async () => {
          const result = await axios.get(`http://localhost:8000/api/employee/get-employee`);
          setEmployees(result.data);
        };
        fetchData();
    }, []);

    const handleEmployeeSelect = (value)=>{
        employees.map((employee)=>{
            if(employee.emp_name === value){
                form.setFieldsValue({
                    emp_id: employee.id
                })
            }
        })
    }
      

   const handleDateSelect = (e)=>{

    const sdate = form.getFieldValue('start_date');
    const edate = form.getFieldValue('end_date');

    if(sdate !== undefined && edate !== undefined){
        
        const diffInMs = Math.abs(new Date(edate) - new Date(sdate));
        const diffInDays = parseInt(diffInMs / (1000 * 60 * 60 * 24));

        form.setFieldsValue({
            leave_duration: diffInDays + ' days'
        })
    }
   }

    const handleFileUpload = (e) => {
        e.preventDefault();
        const files = e.target.files;  // contains array of seleted files from the system.
        const data = new FormData();
        for (let i = 0; i < files.length; i++) {
            data.append('files', files[i]);
        }
        setLoading(true)
        axios.post('http://localhost:8000/api/leave/upload-files', data).then((res) => {
            const lableData = res.data;
            
            form.setFieldsValue({ upload_contract: "" });
            form.setFieldsValue({ attachment: lableData });
            setUploadedAttachment(res.data);
            
            setLoading(false)
        }).catch((err) => {
            message.error('Error Uploading files');
            setLoading(false)
        })
    }

    const handleFileDelete = (fname, id) => {
        setUploadedAttachment();
        
        axios.delete(`http://localhost:8000/api/leave/delete-ftp-file/${fname}?id=${id}`).then((res) => {
            form.setFieldsValue({
                attachment: res.data
            })
            
        }).catch(err => {
            message.error('Error in file deleting');
        })
    }
    const handleView = (fname) => {
        const url = `https://superdolphins.com/superdolphins.com/superdolphinsltd/${fname}`;
        window.open(url, '_blank');
    }

    const handleFinish = async (values) => {
        setButtonLoading(true)
        try {
            if (id) {
                await axios.put(`http://localhost:8000/api/leave/update/${id}`, values);
                setButtonLoading(false)
                navigate("/leave/requests")
            } else {
                await axios.post('http://localhost:8000/api/leave/create', values)
                setButtonLoading(false)
                navigate("/leave/requests")
            }
            message.success('Employee Leave data saved successfully');
            form.resetFields();
        } catch (err) {
            setButtonLoading(false)
            message.error('Error in creating employee leave! possibly leave duration is not correct');
        }
    };

    const handleFinishFailed = ({ errorFields }) => {
        form.scrollToField(errorFields[0].name);
    };

    return (
        <>
            <div className="tabled px-9 py-9">
                <Row gutter={[24, 0]}>
                    <Col xs="24" xl={24}>
                        <Card
                            bordered={false}
                            className="criclebox tablespace mb-24 antd-card"
                            title={id ? "Employee Leave Form Edit" : "Employee Leave Form"}
                            extra={
                                <>
                                    <Link to="/leave/status">
                                        <Button type="primary">
                                            Back
                                        </Button>
                                    </Link>
                                </>
                            }
                        >
                            <div className="table-responsive" style={{ padding: "20px 20px" }}>

                                <Form
                                    name="two_column_form"
                                    onFinish={handleFinish}
                                    onFinishFailed={handleFinishFailed}
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    form={form}
                                >

                                    <Row>
                                       
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }}>
                                            <Form.Item label="Employee Name" name="emp_name" rules={[{ required: true }]} labelAlign="left">
                                                <Select
                                                    defaultValue="select employee"
                                                    popupClassName='select-dropdown'
                                                    onChange={handleEmployeeSelect}
                                                    disabled={user?.role !=='admin'}
                                                    options={
                                                        employees.map((emp) => {
                                                            return (
                                                                {
                                                                    value: emp.emp_name,
                                                                    label: emp.emp_name,
                                                                }
                                                            )
                                                        })
                                                    }
                                                />
                                            </Form.Item>
                                        </Col>
                                         
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px', }}>
                                            <Form.Item label="Employee Id" name="emp_id" rules={[{ required: true }]} labelAlign="left">
                                                <Input style={{ padding: '11px' }} disabled={user?.role !=='admin'}/>
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }} >
                                            <Form.Item label="Leave Type" name="leave_type" rules={[{ required: true }]} labelAlign="left">
                                                {/* <Select
                                                    defaultValue={leave}
                                                    onChange={(value)=>{setLeave(value)}}
                                                    options={leaveTypes}
                                                /> */}
                                                <Input style={{ padding: '11px' }} />
                                            </Form.Item>
                                        </Col>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }}>
                                            <Form.Item label="Start Date" name="start_date" rules={[{ required: true }]}>
                                                <DatePicker className='datepicker' onChange={handleDateSelect}/>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }}>
                                            <Form.Item label="End Date" name="end_date" rules={[{ required: true }]}>
                                                <DatePicker className='datepicker' onChange={handleDateSelect}/>
                                            </Form.Item>
                                        </Col>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }}>

                                            <Form.Item label="Leave Duration" name="leave_duration" rules={[{ required: true }]} labelAlign="left">
                                                <Input style={{ padding: '11px' }} disabled/>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }}>
                                            <Form.Item label="Apply Date" name="apply_date" rules={[{ required: true }]}>
                                                <DatePicker className='datepicker' disabled/>
                                            </Form.Item>
                                        </Col>

                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }} >
                                            <Form.Item label="Attachment" name="upload_contract">
                                                <Input style={{ padding: '5px' }} type='file' accept='.pdf,.docx,.png,.jpg'  onChange={handleFileUpload} disabled={loading} value={uploadValue}/>

                                                { loading && <LoadingOutlined style={{position:'absolute', top:'14px', right:'24px'}}/>}

                                                {uploadedAttachment && uploadedAttachment.length>0 && 
                                                <div style={{height: "100px", overflowY: "scroll", display:'flex', flexWrap:'wrap', gap:'5px'}}>
                                               
                                                        <Card style={{ marginTop: '10px', height: 50, }} >
                                                            <div style={{display:'flex', alignItems:'center', gap:'10px', fontSize:'1rem'}}>
                                                                <FilePdfOutlined className='text-red-600 text-xl'/>
                                                                <div>{uploadedAttachment}</div>
                                                                <FolderViewOutlined style={{cursor:'pointer', fontSize:'1.25rem'}} onClick={()=> handleView(uploadedAttachment)}/>
                                                                <DeleteOutlined style={{cursor:'pointer', fontSize:'1.25rem'}} onClick={()=>handleFileDelete(uploadedAttachment, id)}/>
                                                            </div>
                                                        </Card>
                                                </div>}
                                                
                                            </Form.Item>
                                        </Col>
                                        
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px', display:'none' }}>
                                            <Form.Item label="Attachment" name="attachment" labelAlign="left">
                                                <Input style={{ padding: '11px' }}/>
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px',}}>
                                            <Form.Item label="Reason" name="reason" rules={[{ required: true }]}>
                                                <Input style={{ padding: '11px' }} />
                                            </Form.Item>
                                        </Col>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }} >
                                            <Form.Item label="Status" name="status" rules={[{ required: true }]}>
                                                <Input style={{ padding: '11px', width: "100%" }} disabled/>
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <div className="form-buttons" style={{ display: "flex", justifyContent: "center" }}>
                                        <Form.Item
                                            label=" "
                                            name=" "
                                            labelCol={{ span: 24 }}
                                            wrapperCol={{ span: 24 }}
                                        >
                                             <Button type="primary" htmlType="submit" className="punch" style={{ margin: "0px 10px", backgroundColor: "rgb(3, 201, 215)" }} loading={buttonLoading}>
                                                Submit
                                            </Button>

                                            <Link to="/leave/status">
                                                <Button type="default" className='punch bg-white'>
                                                    Cancel
                                                </Button>
                                            </Link>
                                        </Form.Item>
                                    </div>
                                </Form>

                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default LeaveForm;
