import React, { useEffect, useState } from 'react'
import { Button, Col, Drawer, Form, Input, Row, Select, message } from "antd";

import axios from 'axios';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import TextArea from 'antd/es/input/TextArea';
import { Country, State, City } from 'country-state-city';
import '../employees/style.css';
import '../../assets/styles/home.css';


function AddEmergencyContact({ visible, setVisible, fetchAgain, setFetchAgain, emp_id, id }) {
    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false);
    const [phoneInputArr, setPhoneInputArr] = useState([""])
    const [emailArr, setEmailArr] = useState([""])
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedState, setSelectedState] = useState('');

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const res = await axios.get(`http://localhost:8000/api/emg_contact/get-single/${id}`);
                    const data = res.data[0];

                    data.phone && data.phone.length > 0 && setPhoneInputArr(JSON.parse(data?.phone));
                    data.email && data.email.length > 0 && setEmailArr(JSON.parse(data?.email));

                    form.setFieldsValue({
                        name: data?.name,
                        relationship: data.relationship,
                        email: data.email,
                        phone: data.phone,
                        address: data.address,
                        country: data?.country,
                        state: data?.state,
                        city: data?.city,
                        emp_id: data?.emp_id
                    });
                } catch (err) {
                    message.error('Error in fetching data');
                }
            };
            fetchData();
        }
        else{
            form.setFieldsValue({
                emp_id: emp_id,
            });
        }
    }, [id, form]);

    const handleCountrySelect = (value)=>{
        form.setFieldsValue({
            country: Country.getCountryByCode(value).name
        })
        setSelectedCountry(value)
    }

    const handleChg = (value, index) => {
        setPhoneInputArr((prev) => {
            const updatedInput = [...prev];
            updatedInput[index] = value;
            form.setFieldsValue({
                phone: JSON.stringify(updatedInput)
            })
            return updatedInput;
        })
    }

    const handleEmail = (value, index) => {
        // console.log(value, index)
        setEmailArr((prev) => {
            const updatedInput = [...prev];
            updatedInput[index] = value.target.value;
            form.setFieldsValue({
                email: JSON.stringify(updatedInput)
            })
            return updatedInput;
        })
    }
    const handleEmailIncrease = () => {
        setEmailArr((prev) => {
            return [...prev, ""];
        })
    }
    const handlePhoneIncrease = () => {
        setPhoneInputArr((prev) => {
            return [...prev, ""];
        })
    }

    const handleDecrese = (field) => {
        if (field === 'phone') {
            if (phoneInputArr.length < 2) return;
            setPhoneInputArr((prev) => {
                const newArr = [...prev];
                newArr.pop();
                form.setFieldsValue({
                    phone: JSON.stringify(newArr)
                })
                return newArr;
            })
        }
        else if (field === 'email') {
            if (emailArr.length < 2) return;
            setEmailArr((prev) => {
                const newArr = [...prev];
                newArr.pop();
                form.setFieldsValue({
                    email: JSON.stringify(newArr)
                })
                return newArr;
            })
        }
    }

    const handleClose = () => {
        setVisible(false)
    }

    const handleFinish = async () => {
        try {
            setLoading(true)
            const values = form.getFieldValue();
            if (id) {
                await axios.put(`http://localhost:8000/api/emg_contact/update/${id}`, values);
                setFetchAgain(!fetchAgain)
                setLoading(false);
                setVisible(false)
                message.success('Stage Updated successfully');
                form.resetFields();
            }
            else {
                await axios.post(`http://localhost:8000/api/emg_contact/create`, values);
                setFetchAgain(!fetchAgain)
                setLoading(false);
                setVisible(false)
                message.success('Stage created successfully');
                form.resetFields();
            }

        } catch (err) {
            setLoading(false);
            message.error('Error submitting form');
        }
    }
    return (
        <div>
            <Drawer
                placement="top"
                mask={false}
                onClose={() => setVisible(false)}
                visible={visible}
                width={100}
                height={500}
                rootClassName='attandance-drawer'
                title="Add Emergency Contact"

                footer={
                    <div className="form-buttons" style={{ display: "flex", justifyContent: "center", padding: '6px' }}>
                        <Button type="primary" htmlType="submit" className="punch" style={{ margin: "0px 10px", backgroundColor: "rgb(3, 201, 215)" }} loading={loading} onClick={handleFinish}>
                            Submit
                        </Button>

                        <Button type="default" className="punch bg-white" onClick={() => setVisible(false)}>
                            Cancel
                        </Button>
                    </div>
                }
            >
                <div>
                    <Form
                        name="two_column_form"
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

                                <Form.Item label="Relationship" name="relationship" rules={[{ required: true }]} labelAlign="left">
                                    <Input style={{ padding: '11px' }} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                        <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }} >
                                <Form.Item label="Phone" name="phone" labelAlign="left">
                                    {phoneInputArr.map((val, index) => {
                                        return (
                                            <PhoneInput
                                                style={{ marginBottom: '10px' }}
                                                country={'in'}
                                                value={val}
                                                onChange={(value) => handleChg(value, index)}
                                                inputClass='phone_input'
                                                dropdownClass='phone-dropdown'
                                                containerClass='phone-container'
                                                searchClass='search-class'
                                                buttonClass='phone-button'
                                            />
                                        )
                                    })}
                                    <div style={{ display: 'flex', gap: '10px', fontSize: '20px', color: '#03C9D7' }}>
                                        <PlusCircleOutlined onClick={handlePhoneIncrease} />
                                        <MinusCircleOutlined onClick={() => { handleDecrese('phone') }} />
                                    </div>

                                </Form.Item>
                            </Col>
                            <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px', }} >
                                <Form.Item label="Email" name="email" rules={[{ required: true }]} labelAlign="left">
                                    {emailArr.map((val, index) => {
                                        return (
                                            <Input style={{ padding: '11px', marginBottom: '10px' }} key={index} value={val} onChange={(value) => { handleEmail(value, index) }} />
                                        )
                                    })}
                                    <div style={{ display: 'flex', gap: '10px', fontSize: '20px', color: '#03C9D7' }}>
                                        <PlusCircleOutlined onClick={handleEmailIncrease} />
                                        <MinusCircleOutlined onClick={() => { handleDecrese('email') }} />
                                    </div>
                                </Form.Item>
                            </Col>
                        </Row>

                        <h2 style={{ margin: "15px 12px", fontWeight: "400", fontSize: "24px", color: '#CCCCCC' }}>Address Details</h2>
                        <Row>
                            <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }}>

                                <Form.Item label="Address Details" name="address" rules={[{ required: true }]} labelAlign="left">
                                    <TextArea style={{ padding: '11px' }} />
                                </Form.Item>
                            </Col>
                            <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }}>
                                <Form.Item label="Country" name="country" rules={[{ required: true }]} labelAlign="left">
                                    <Select
                                        showSearch='true'
                                        value={selectedCountry}
                                        onChange={handleCountrySelect}
                                    >
                                        {Country.getAllCountries().map(country => (
                                            <Select.Option key={country.isoCode} value={country.isoCode}>
                                                {country.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }}>
                                <Form.Item label="State" name="state" rules={[{ required: true }]} labelAlign="left">
                                    <Select
                                        showSearch='true'
                                        value={selectedState}
                                        onChange={value => setSelectedState(value)}
                                    >
                                        {State.getStatesOfCountry(selectedCountry).map(state => (
                                            <Select.Option key={state.isoCode} value={state.name}>
                                                {state.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px' }}>
                                <Form.Item label="City" name="city" rules={[{ required: true }]} labelAlign="left">
                                    <Input style={{ padding: '11px' }} />
                                </Form.Item>
                            </Col>
                            <Col md={{ span: 11 }} xs={{ span: 22 }} style={{ margin: '0 14px', display:'none' }}>
                                <Form.Item label="" name="emp_id" rules={[{ required: true }]} labelAlign="left">
                                    <Input style={{ padding: '11px' }} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </Drawer>
        </div>
    )
}

export default AddEmergencyContact