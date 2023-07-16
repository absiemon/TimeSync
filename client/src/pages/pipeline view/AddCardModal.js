import React, { useEffect, useState } from 'react'
// import Rodal from 'rodal';
import { Row, Col, Card, Button, Form, Input, DatePicker, message, InputNumber, Radio, Select, Drawer } from "antd";

// include styles
// import 'rodal/lib/rodal.css';
import TextArea from 'antd/lib/input/TextArea';
import axios from 'axios';

import './card.css'
import user from '../../assets/images/user.png'
import moment from 'moment';
import '../../assets/styles/home.css'


function AddCardModal({ visible, setVisible, clickedCol, setColumns, setCards, fetchAgain, setFetchAgain, cardId }) {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false)
  const [leadType, setLeadType] = useState();

  const [leadTypeValue, setLeadTypeValue] = useState([]);
  const [pipelines, setPipelines] = useState([]);
  const [selectedPipeline, setSelectedPipeline] = useState()

  const [stages, setStages] = useState([]);
  const [selectedStage, setSelectedStage] = useState()

  const [intialDealVal, setInitialDealVal] = useState();

  const [activitySelected, setActivitySelected] = useState("call")


  useEffect(() => {
    console.log(cardId)
    if (cardId) {
      const fetchData = async () => {
        await axios.get(`http://localhost:8000/api/deal/get/${cardId}`).then((res) => {
          console.log(res.data);
          const data = res.data[0];

          // setSelectedPipeline("sales")
          setLeadType(data?.lead_type);
          setSelectedStage(data?.stage_id);
          setInitialDealVal(data?.deal_value)

          form.setFieldsValue({
            title: data?.title,
            description: data?.description,
            lead_type: data?.lead_type,
            lead_type_value: data?.lead_type_value,
            deal_value: data?.deal_value,
            closing_date: moment(data?.closing_date),
            owner: data?.owner,
            pipeline_id: data?.pipeline_id,
            pipeline_name: data?.pipeline_name,
            stage_id: data?.stage_id
          })

        })
      }
      fetchData();
    }
    else{
      console.log("here")
      form.resetFields();
    }
  }, [form, cardId])

  useEffect(() => {
    form.setFieldsValue({
      activity: activitySelected
    })
  }, [activitySelected])

  useEffect(() => {
    if (leadType) {
      const fetchData = async () => {
        const res = await axios.get(`http://localhost:8000/api/${leadType}/get`);
        setLeadTypeValue(res.data)
      }
      fetchData();
    }
  }, [leadType])

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`http://localhost:8000/api/pipeline/get`);
      setPipelines(res.data)
    }
    fetchData();
  }, [])

  useEffect(() => {
    if (selectedPipeline) {
      const pipeline_id = form.getFieldValue('pipeline_id')
      const fetchData = async () => {
        const res = await axios.get(`http://localhost:8000/api/pipeline/get-stages/${pipeline_id}`);
        setStages(res.data)
      }
      fetchData();
    }

  }, [selectedPipeline])

  // useEffect(() => {
  //   setStages([])
  //   form.resetFields();
  // }, [visible])

  const handlePipelineSelect = (value) => {

    setSelectedPipeline(value)
    form.setFieldsValue({
      pipeline_name: value
    })
    pipelines.map((pipeline) => {
      if (pipeline.name === value) {
        form.setFieldsValue({
          pipeline_id: pipeline.id
        })
      }
    })
  }

  const handleStageSelect = (stage_id) => {
    console.log(stage_id)
    setSelectedStage(stage_id)

    form.setFieldsValue({
      stage_id: stage_id
    })
  }

  const handleFinish = async (values) => {
    console.log(values)

    setLoading(true);
    const newCardId = `card${Date.now()}`;
    const newCard = {
      id: newCardId, content:
        <div className="card-content">
          <div className='card-header'>
            <div className='avatar'>BK</div>    {/* person/organization name ka avatar*/}
            <div>
              <div className=''>{selectedPipeline}</div>  {/* pipeline name */}
              <div className=''>{values?.title}</div>
            </div>
          </div>
          <div className='card-header'>
            <img src={user} alt='icon' className='user-icon' />
            <div className=''>{values?.lead_type_value}</div>   {/* person/organization name */}
          </div>
          <div className='card-header' style={{ justifyContent: 'space-between' }}>
            <div className=''>Deal value</div>    {/* description */}
            <div className=''>$ {values?.deal_value}</div>  {/* sales value */}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div className='footer'>Created at: {moment().format('MMM DD, YYYY')}</div>  {/* created at */}
          </div>
        </div>
    };


    if (clickedCol) {
      setCards((prevCards) => {
        const newObj = { ...prevCards }
        newObj[newCardId] = newCard;
        console.log(newObj)
        return newObj
      });

      console.log(values.stage_id)
      setColumns((prev) => {
        let arr = [...prev];
        arr = arr.map((obj) => {
          if (obj.id === values.stage_id.toString()) {
            let newCardIds = [...obj.cardIds];
            newCardIds.push(newCardId);
            return { ...obj, cardIds: newCardIds };
          }
          return obj; // Keep other objects unchanged
        });
        console.log(arr)
        return arr;
      })

    }

    console.log(cardId)
    console.log(values)
    let diff;
    if (intialDealVal) {
      diff = parseInt(values.deal_value) - parseInt(intialDealVal);

    }

    try {
      if (cardId) {
        const obj = {
          values: values,
          deal_value_diff: diff
        }
        await axios.put(`http://localhost:8000/api/deal/update/${cardId}`, obj);
        setFetchAgain(!fetchAgain)
        setLoading(false);
        setVisible(false)
        message.success('Deal Updated successfully');
        form.resetFields();
      }
      else {
        await axios.post(`http://localhost:8000/api/deal/create`, values);
        setFetchAgain(!fetchAgain)
        setLoading(false);
        setVisible(false)
        message.success('Deal created successfully');
        form.resetFields();
      }

    } catch (err) {
      setLoading(false);
      message.error('Error submitting form');
    }
  };

  const handleClose = () => {
    setVisible(false)
  }
  return (
    <div>
      <Drawer
        placement="top"
        mask={false}
        onClose={() => setVisible(false)}
        visible={visible}
        width={100}
        height={600}
        rootClassName='attandance-drawer'
        title="Add Card"
      >
        <div>
          <Form
            onFinish={handleFinish}
            //   onFinishFailed={onFinishFailed}
            layout="vertical"
            className="row-col"
            form={form}
          >
            <Form.Item
              className="username"
              label="Title"
              name="title"
              rules={[
                {
                  required: true,
                  message: "Please input the title!",
                },
              ]}
            >
              <Input placeholder="Enter the deal title" />
            </Form.Item>

            <Form.Item
              className="username"
              label="Activity"
              name="activity"
              rules={[
                {
                  required: true,
                  message: "Please select activity!",
                },
              ]}
            >
              <div style={{ width: '100%', display: 'flex', gap: '5px', flexWrap: 'wrap', color:'#CCCCCC' }}>
                <div style={{ border: '1px solid #dedede', padding: '6px 17px', cursor: 'pointer', borderRadius: '5px', backgroundColor: `${activitySelected === 'call' ? '#1890ff' : '#20242C'}` }} role="button" onClick={() => setActivitySelected('call')}>Call</div>

                <div style={{ border: '1px solid #dedede', padding: '6px 17px', cursor: 'pointer', borderRadius: '5px', backgroundColor: `${activitySelected === 'meeting' ? '#1890ff' : '#20242C'}` }} role="button" onClick={() => setActivitySelected('meeting')}>Meeting</div>

                <div style={{ border: '1px solid #dedede', padding: '6px 17px', cursor: 'pointer', borderRadius: '5px', backgroundColor: `${activitySelected === 'email' ? '#1890ff' : '#20242C'}` }} role="button" onClick={() => setActivitySelected('email')}>Email</div>

                <div style={{ border: '1px solid #dedede', padding: '6px 17px', cursor: 'pointer', borderRadius: '5px', backgroundColor: `${activitySelected === 'to do' ? '#1890ff' : '#20242C'}` }} role="button" onClick={() => setActivitySelected('to do')}>To Do</div>

                {/* <div style={{ border: '1px solid #dedede', padding: '6px 17px', cursor: 'pointer', borderRadius: '5px', backgroundColor: `${activitySelected === 'deadline' ? '#1890ff' : ''}` }} role="button" onClick={() => setActivitySelected('deadline')}>Deadline</div> */}

                <div style={{ border: '1px solid #dedede', padding: '6px 17px', cursor: 'pointer', borderRadius: '5px', backgroundColor: `${activitySelected === 'others' ? '#1890ff' : '#20242C'}` }} role="button" onClick={() => setActivitySelected('others')}>Others</div>
              </div>
            </Form.Item>

            <Form.Item
              className="username"
              label="Description"
              name="description"
              rules={[
                {
                  required: true,
                  message: "Please input the description!",
                },
              ]}
            >
              <TextArea placeholder="" />
            </Form.Item>
            <Form.Item
              className="username"
              label="Lead type"
              name="lead_type"
              rules={[
                {
                  required: true,
                  message: "Please select lead type!",
                },
              ]}
            >
              {/*   */}
              <Radio.Group size="large" onChange={(e) => { setLeadType(e.target.value) }}>
                <Radio value="persons" >Person</Radio>
                <Radio value="organization">Organization</Radio>

              </Radio.Group>
            </Form.Item>

            <Form.Item
              className="username"
              label="Person"
              name="lead_type_value"
              rules={[
                {
                  required: true,
                  message: "Please select a person!",
                },
              ]}
            >
              <Select
                // defaultValue={leadClass}
                styles={{
                  height: '40px',
                  borderRadius: "6px"
                }}
                // onChange={(value) => { setLeadClass(value) }}
                options={
                  leadTypeValue.map((val) => {
                    return (
                      {
                        value: val.name,
                        label: val.name,
                      }
                    )
                  })
                }
              />

            </Form.Item>
            <Form.Item
              className="username"
              label="Deal value"
              name="deal_value"
              rules={[
                {
                  required: true,
                  message: "Please input the deal value!",
                },
              ]}
            >
              <Input placeholder="Enter the deal value" />
            </Form.Item>

            <Form.Item
              className="username"
              label="Pipelines"
              name="pipeline_name"
              rules={[
                {
                  required: true,
                  message: "Please select a pipeline!",
                },
              ]}
            >
              <Select
                // defaultValue={leadClass}
                styles={{
                  height: '40px',
                  borderRadius: "6px"
                }}
                onChange={handlePipelineSelect}
                options={
                  pipelines.map((val) => {
                    return (
                      {
                        value: val.name,
                        label: val.name,
                      }
                    )
                  })
                }
              />

            </Form.Item>

            <Form.Item
              className="username"
              label=""
              name="pipeline_id"
              style={{ display: 'none' }}
              rules={[
                {
                  required: true,
                  message: "Please input the owner name!",
                },
              ]}
            >
              <Input placeholder="Enter the owner name" />
            </Form.Item>

            <Form.Item
              className="username"
              label="Stages"
              name="stage_id"
              style={{ display: 'flex', gap: '10px' }}
              rules={[
                {
                  required: true,
                  message: "Please select a stage!",
                },
              ]}
            >
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }} role='button'>
                {stages.map((stage) => {
                  return (
                    <div
                      className='stage'
                      style={{ backgroundColor: `${selectedStage === stage.id ? '#40a9ff' : '#20242C'}`, color:'#CCCCCC' }}
                      role='button'
                      onClick={() => handleStageSelect(stage.id)}>
                      {stage.stage_name.length > 10 ? stage.stage_name.slice(0, 12) + '...' : stage.stage_name}
                    </div>
                  )
                })}
              </div>
            </Form.Item>

            <Form.Item
              className="username"
              label="Closing date"
              name="closing_date"
              rules={[
                {
                  required: true,
                  message: "Please select a closing date!",
                },
              ]}
            >
              <DatePicker className='datepicker' placeholder="choose a date" />
            </Form.Item>
            <Form.Item
              className="username"
              label="Owner"
              name="owner"
              rules={[
                {
                  required: true,
                  message: "Please input the owner name!",
                },
              ]}
            >
              <Input placeholder="Enter the owner name" />
            </Form.Item>

            <div className="form-buttons" style={{ display: "flex", justifyContent: "center" }}>
              <Form.Item
                label=" "
                name=" "
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Button type="primary" htmlType="submit" className="punch" style={{ margin: "0px 10px", backgroundColor: "rgb(3, 201, 215)" }} loading={loading} >
                  Submit
                </Button>

                <Button type="default" className='punch bg-white' onClick={() => setVisible(false)}>
                  Cancel
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </Drawer>
    </div>
  )
}

export default AddCardModal