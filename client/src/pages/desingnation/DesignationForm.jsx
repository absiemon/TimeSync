import { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Form, Input, message, } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import TextArea from 'antd/es/input/TextArea';

function DesignationForm() {

    const [form] = Form.useForm();
    const navigate = useNavigate()
    const path = useParams();
    const id = path.id
    const [buttonLoading, setButtonLoading] = useState(false);

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const res = await axios.get(`http://localhost:8000/api/designation/get/${id}`);
                    const data = res.data[0];

                    form.setFieldsValue({
                        name: data.name,
                        description: data?.description,
                        no_of_employees: data?.no_of_employees,

                    });
                } catch (err) {
                    message.error('Error retrieving data');
                }
            };
            fetchData();
        }
        else{
            form.setFieldsValue({
                no_of_employees: 0
            })
        }
    }, [id, form]);


    const handleFinish = async (values) => {
        setButtonLoading(true)
        try {
            if (id) {
                console.log(values)
                await axios.put(`http://localhost:8000/api/designation/update/${id}`, values);
                setButtonLoading(false)
                navigate("/employee/designation")
            } else {
                await axios.post('http://localhost:8000/api/designation/create', values);
                setButtonLoading(false)
                navigate("/employee/designation")
            }
            message.success('Designation saved successfully');
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
                            title={id ? "Designation Form Edit" : "Designation Form"}
                            extra={
                                <>
                                    <Link to="/employee/designation">
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
                                            <Form.Item label="Name" name="name" rules={[{ required: true }]} labelAlign="left">
                                                <Input style={{ padding: '11px' }} />
                                            </Form.Item>
                                        </Col>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }}>
                                            <Form.Item label="Description" name="description" rules={[{ required: true }]} labelAlign="left">
                                                <TextArea rows={4} />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row>
                                       
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px', display: 'none' }}>
                                            <Form.Item label="" name="no_of_employees" >
                                                <Input style={{ padding: '11px' }} />
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

                                            <Link to="/employee/designation">
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

export default DesignationForm;
