import { DeleteOutlined } from '@ant-design/icons'
import { Button, Col, Form, Input } from 'antd'
import React from 'react'

function StageForm({ stage,handleStageNameChange, handleStageProbabilityChange, handleDecrese}) {
    return (
        <Col
            md={{ span: 11 }}
            xs={{ span: 22 }}
            style={{
                margin: '0 14px',
                backgroundColor: '#eeeeee',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '5px',
            }}
        >
            <div
                style={{
                    backgroundColor: 'white',
                    width: '90%',
                    height: '90%',
                    padding: '10px 12px',
                }}
            >
                {/* <Form.Item
                    className="username"
                    label="Name"
                    name="stage_name"
                    rules={[
                        {
                            required: true,
                            message: "Please input the stage name!",
                        },
                    ]}
                > */}
                    <Input placeholder="Enter the stage name" value={stage.stage_name} onChange={handleStageNameChange} style={{marginBottom:'10px'}}/>
                {/* </Form.Item> */}

                {/* <Form.Item
                    className="username"
                    label="Probability"
                    name="probability"
                    rules={[
                        {
                            required: true,
                            message: "Please input the probability!",
                        },
                    ]}
                > */}
                    <Input placeholder="Enter the probability" value={stage.probability} onChange={handleStageProbabilityChange} style={{marginBottom:'20px'}}/>
                {/* </Form.Item> */}

                <Form.Item
                    className="username"
                    name="probability"
                >
                    <Button onClick={handleDecrese} style={{ width: '100%', }}><DeleteOutlined /> Delete stage </Button>
                </Form.Item>

            </div>
        </Col>
    )
}

export default StageForm