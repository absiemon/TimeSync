import { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Form, Input, DatePicker, message, Select, } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import moment from 'moment';


import {
    DeleteOutlined,
    FilePdfOutlined,
    FolderViewOutlined,
    LoadingOutlined,
    MinusCircleOutlined,
    PlusCircleOutlined,
} from "@ant-design/icons";
import { useStateContext } from '../../contexts/ContextProvider';
// const { Option } = Select;

function AnnouncementForm() {

    const [form] = Form.useForm();
    const { punchOut, user } = useStateContext();

    const { TextArea } = Input;
    const navigate = useNavigate()
    const path = useParams();
    const id = path.id

    const [loading, setLoading] = useState(false);

    const [buttonLoading, setButtonLoading] = useState(false);

    const [departments, setDepartments] = useState([]);


    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const res = await axios.get(`http://localhost:8000/api/announcement/get/${id}`);
                    const data = res.data[0];

                    form.setFieldsValue({
                        created_by: data?.created_by,
                        departments: data?.departments && JSON.parse(data?.departments),
                        start_date: moment(data.start_date),
                        end_date: moment(data.end_date),
                        description: data.description,
                    });
                } catch (err) {
                    message.error('Error in fetching data');
                }
            };
            fetchData();
        }
        else{
            form.setFieldsValue({
                created_by: user && user?.emp_name
            })
        }
    }, [id, form]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get(`http://localhost:8000/api/department/get`);
            setDepartments(result.data);
        };
        fetchData();
    }, []);


    const handleFinish = async (values) => {
        setButtonLoading(true)
        console.log(values)
        try {
            if (id) {
                await axios.put(`http://localhost:8000/api/announcement/update/${id}`, values);
                setButtonLoading(false)
                navigate("/announcement")
            } else {
                await axios.post('http://localhost:8000/api/announcement/create', values);
                setButtonLoading(false)
                navigate("/announcement")
            }
            message.success('Announcement data saved successfully');
            form.resetFields();
        } catch (err) {
            setButtonLoading(false)
            message.error('Error submitting form');
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
                            title={id ? "Announcement Form Edit" : "Announcement Form"}
                            extra={
                                <>
                                    <Link to="/announcement">
                                        <Button type="primary" style={{ margin: "0px 10px", backgroundColor: "rgb(3, 201, 215)" }} className='punch'>
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
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }} >
                                            <Form.Item label="Created by" name="created_by" rules={[{ required: true }]} labelAlign="left">
                                                <Input style={{ padding: '11px' }} />
                                            </Form.Item>
                                        </Col>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }}>

                                            <Form.Item label="Department" name="departments" rules={[{ required: true }]} labelAlign="left">
                                                <Select
                                                    placeholder="select department"
                                                    mode="multiple"
                                                    popupClassName='select-dropdown'
                                                    options={
                                                        departments.map((dep) => {
                                                            return (
                                                                {
                                                                    value: dep.name,
                                                                    label: dep.name,
                                                                }
                                                            )
                                                        })
                                                    }
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }}>
                                            <Form.Item label="Start Date" name="start_date" rules={[{ required: true }]}>
                                                <DatePicker className='datepicker' />
                                            </Form.Item>
                                        </Col>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }}>
                                            <Form.Item label="End Date" name="end_date" rules={[{ required: true }]}>
                                                <DatePicker className='datepicker' />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }} >
                                            <Form.Item label="Description" name="description" rules={[{ required: true }]}>
                                                <TextArea rows={4} style={{ padding: '11px', width: "100%" }} />
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

                                            <Link to="/announcement">
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
            </div >
        </>
    );
}

export default AnnouncementForm;
