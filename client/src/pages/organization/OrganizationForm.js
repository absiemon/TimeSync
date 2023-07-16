import { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Form, Input, DatePicker, message, InputNumber } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Select, Space } from 'antd';
import { Allcountry } from "../../assets/json/country";

import axios from 'axios';
import moment from 'moment';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';

// const { Option } = Select;

function OrganizationForm() {

    const [form] = Form.useForm();
    const navigate = useNavigate()
    const path = useParams();
    const [leadGroups, setLeadGroups] = useState([])
    const [country, setCountry] = useState("india");
    const [loading, setLoading] = useState(false)
    const id = path.id

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const res = await axios.get(`http://localhost:8000/api/organization/get/${id}`);
                    const data = res.data[0];

                    form.setFieldsValue({
                        name: data.name,
                        lead_group: data?.lead_group,
                        owner: data?.owner,
                        country: data?.country,
                        area: data?.area,
                        city: data?.city,
                        state: data?.state,
                        zipcode: data?.zipcode,

                    });
                } catch (err) {
                    message.error('Error retrieving supplier input data');
                }
            };
            fetchData();
        }
    }, [id, form]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get(`http://localhost:8000/api/lead_group/get`);
            setLeadGroups(res.data)
        }
        fetchData();
    }, [])



    const handleFinish = async (values) => {
        setLoading(true);
        try {
            if (id) {
                await axios.put(`http://localhost:8000/api/organization/update/${id}`, values);
                navigate("/organization")
            } else {
                await axios.post('http://localhost:8000/api/organization/create', values);
                navigate("/organization")
            }
            setLoading(false);
            message.success('Organization data saved successfully');
            form.resetFields();
        } catch (err) {
            setLoading(false);
            message.error('Error submitting form');
        }
    };

    const handleFinishFailed = ({ errorFields }) => {
        form.scrollToField(errorFields[0].name);
    };

    return (
        <>
            <div className="tabled  px-9 py-9">
                <Row gutter={[24, 0]}>
                    <Col xs="24" xl={24}>
                        <Card
                            bordered={false}
                            className="criclebox tablespace mb-24 antd-card"
                            title={id ? "Organization Form Edit" : "Organization Input Form"}
                            extra={
                                <>

                                    <Link to="/organization">
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
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }}>
                                            <Form.Item label="Name" name="name" rules={[{ required: true }]} labelAlign="left">
                                                <Input style={{ padding: '11px' }} />
                                            </Form.Item>
                                        </Col>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }} >
                                            <Form.Item label="Lead group" name="lead_group" rules={[{ required: true }]} labelAlign="left">
                                                <Select
                                                    // defaultValue={department}
                                                    styles={{
                                                        height: '40px',
                                                        borderRadius: "6px"
                                                    }}
                                                    // onChange={(value) => { setDepartment(value) }}
                                                    options={
                                                        leadGroups.map((p) => {
                                                            return (
                                                                {
                                                                    value: p.name,
                                                                    label: p.name,
                                                                }
                                                            )
                                                        })
                                                    }
                                                />
                                            </Form.Item>
                                        </Col>

                                    </Row>

                                    <Row>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }} >
                                            <Form.Item label="Owner" name="owner">
                                                <Input style={{ padding: '11px' }} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <h2 style={{ margin: "15px 12px", fontWeight: "400", fontSize: "24px" }}>Address details</h2>
                                    <Row>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }} >
                                            <Form.Item label="Country" name="country" labelAlign="left">
                                                <Select
                                                    defaultValue={country}
                                                    style={{ marginBottom: '10px' }}
                                                    // onChange={(value) => { handleCountry(value, index) }}
                                                    options={Allcountry}
                                                />
                                                {/* <div style={{ display: 'flex', gap: '5px' }}>
                                                    <PlusCircleOutlined onClick={handleIncreaseCountry} />
                                                    <MinusCircleOutlined onClick={() => { handleDecrese('country') }} />
                                                </div> */}

                                            </Form.Item>
                                        </Col>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }}>
                                            <Form.Item label="Area" name="area" labelAlign="left">
                                                <Input style={{ padding: '11px' }} />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }} >
                                            <Form.Item label="City" name="city">
                                                <Input style={{ padding: '11px' }} />
                                            </Form.Item>
                                        </Col>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }} >
                                            <Form.Item label="State" name="state">
                                                <Input style={{ padding: '11px' }} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }} >
                                            <Form.Item label="Zip code" name="zipcode">
                                                <Input style={{ padding: '11px' }} />
                                            </Form.Item>
                                        </Col>

                                    </Row>

                                    {/* <Row>
                                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }} >
                                            <Form.Item label="Contact Person" name="contact_person" rules={[{ required: true }]} labelAlign="left">
                                                {contactPersonArr.map((val, index) => {
                                                    return (
                                                        <Input style={{ padding: '11px', marginBottom: '10px' }} key={index} value={val} onChange={(value) => { handleContactPerson(value, index) }} />
                                                    )
                                                })}
                                                <div style={{ display: 'flex', gap: '5px' }}>
                                                    <PlusCircleOutlined onClick={handleContactPersonIncrease} />
                                                    <MinusCircleOutlined onClick={() => { handleDecrese('person') }} />
                                                </div>
                                            </Form.Item>
                                        </Col>
                                        
                                    </Row> */}


                                    <div className="form-buttons" style={{ display: "flex", justifyContent: "center" }}>
                                        <Form.Item
                                            label=" "
                                            name=" "
                                            labelCol={{ span: 24 }}
                                            wrapperCol={{ span: 24 }}
                                        >
                                            <Button type="primary" htmlType="submit" className="punch" style={{ margin: "0px 10px", backgroundColor: "rgb(3, 201, 215)" }}loading={loading}>
                                                Submit
                                            </Button>

                                            <Link to="/organization">
                                                <Button type="default" className="punch bg-white">
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

export default OrganizationForm;
