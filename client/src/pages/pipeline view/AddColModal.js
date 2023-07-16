import React, { useEffect, useState } from 'react'
import { Button, Drawer, Form, Input, message } from "antd";

// import Rodal from 'rodal';
// import 'rodal/lib/rodal.css';
import axios from 'axios';


function AddColModal({ visible, setVisible, fetchAgain, setFetchAgain, selectedPipelineId, stageId }) {
    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (stageId) {
            const fetchData = async () => {
                await axios.get(`http://localhost:8000/api/pipeline/get-stage/${stageId}`).then((res) => {
                    console.log(res.data);
                    const data = res.data[0];
                    form.setFieldsValue({
                        stage_name: data?.stage_name,
                        pipeline_id: selectedPipelineId
                    })

                })
            }
            fetchData();
        }
        else {
            form.setFieldsValue({
                pipeline_id: selectedPipelineId
            })

        }
    }, [form, stageId])

    const handleClose = () => {
        setVisible(false)
    }

    const handleFinish = async () => {
        try {
            const values = form.getFieldValue();
            if (stageId) {
                await axios.put(`http://localhost:8000/api/pipeline/update-stage/${stageId}`, values);
                setFetchAgain(!fetchAgain)
                setLoading(false);
                setVisible(false)
                message.success('Stage Updated successfully');
                form.resetFields();
            }
            else {
                await axios.post(`http://localhost:8000/api/pipeline/create-stage/${selectedPipelineId}`, values);
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
                height={300}
                rootClassName='attandance-drawer'
                bodyStyle={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                title="Add Stage"
                footer={
                    <div className="form-buttons" style={{ display: "flex", justifyContent: "center", padding:'6px' }}>
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
                        // onFinish={handleFinish}
                        //   onFinishFailed={onFinishFailed}
                        layout="vertical"
                        className="row-col"
                        form={form}
                    >
                        <Form.Item
                            className="username"
                            label="Name"
                            name="stage_name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input the column name!",
                                },
                            ]}
                        >
                            <Input placeholder="Enter the column name" />
                        </Form.Item>

                        <Form.Item
                            className="username"
                            label=""
                            name="pipeline_id"
                            style={{ display: 'none' }}

                        >
                            <Input placeholder="Enter the deal value" />
                        </Form.Item>


                    </Form>
                </div>
            </Drawer>
        </div>
    )
}

export default AddColModal