import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./style.css";
// import Card from './Card.js';
import { Button, Select, Spin, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import AddCardModal from "./AddCardModal";
import axios from "axios";
import user from '../../assets/images/user.png'
import edit from '../../assets/images/edit.png'
import Delete from '../../assets/images/delete.png'

import moment from "moment";
import NothingToShow from "./NothingToShow";
import AddColModal from "./AddColModal";
import ThreeDotSelect from "./ThreeDotSelect";
import Swal from "sweetalert2";


const initialCards = {
  // "5": { id: "5", content: <Card /> },
  // "6": { id: '6', content: <Card /> },

  // Add more cards here
};

const Sales_pipelines = () => {

  const [loading, setLoading] = useState(false)
  const [columns, setColumns] = useState([]);
  const [cards, setCards] = useState(initialCards);
  const [visible, setVisible] = useState(false);
  const [visibleColModal, setVisibleColModal] = useState(false);

  const [clickedCol, setClickedCol] = useState();

  const [pipelines, setPipelines] = useState([]);
  const [selectedPipelineId, setSelectedPipelineId] = useState(3);
  const [selectedPipelineName, setSelectedPipelineName] = useState("Sales");

  const [fetchAgain, setFetchAgain] = useState(false)

  const [cardId, setCardId] = useState()

  const [stageId, setStageId] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`http://localhost:8000/api/pipeline/get`);
      setPipelines(res.data)
    }
    fetchData();
  }, [])

  const handleEdit = (cardId) => {
    console.log(cardId)
    setCardId(cardId)
    setVisible(true);
  }
  const handleDelete = (cardId) => {
    console.log(cardId)
  }

  const handleEditStage = (columnId)=>{
    setStageId(columnId)
    setVisibleColModal(true)
  }
  
  const handleDeleteDeal = (deal_id)=>{
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
        axios.delete(`http://localhost:8000/api/deal/delete/${deal_id}`);
        setFetchAgain(!fetchAgain)
      }
    })
  }

  useEffect(() => {
    if (selectedPipelineId) {
      const fetchData = async () => {
        setLoading(true)
        await axios.get(`http://localhost:8000/api/pipeline/get-pipeline-view/${selectedPipelineId}`).then((res) => {
          setColumns(res.data)
          let ic = {};
          const data = res.data;
          data.map((d) => {
            const ids = d.cardIds;
            const details = d.cardDeatils;

            ids.map((id, index) => {
              ic[id] = {
                id: id, content:
                  <div className="">
                    <div className='card-header'>
                      <div className='avatar'>{details[index]?.lead_type_value.charAt(0)}</div>    {/* person/organization name ka avatar*/}
                      <div style={{paddingRight:'80px'}}>
                        <div className=''>{selectedPipelineName}</div>  {/* pipeline name */}
                        <div style={{color:'#38abb3'}}>{details[index]?.title}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', marginLeft: '14.5rem', position:'absolute' }}>
                        <img src={edit} alt="icon" className='user-icon' role="button" onClick={() => handleEdit(id)} />
                        <img src={Delete} alt="icon" className='user-icon' role="button" onClick={() => handleDeleteDeal(id)} />
                        {/* <ThreeDotSelect/> */}
                      </div>
                    </div>
                    <div className='card-header'>
                      <img src={user} alt='icon' className='user-icon' />
                      <div style={{color:'#38abb3'}}>{details[index]?.lead_type_value}</div>   {/* person/organization name */}
                    </div>
                    <div className='card-header' style={{ justifyContent: 'space-between' }}>
                      <div className=''>Activity</div>    {/* description */}
                      <div className='activity'>{details[index]?.activity}</div>  {/* sales value */}
                    </div>
                    <div className='card-header' style={{ justifyContent: 'space-between' }}>
                      <div className=''>Deal value</div>    {/* description */}
                      <div style={{color:'#38abb3'}}>$ {details[index]?.deal_value}</div>  {/* sales value */}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <div className='footer'>Created at: {moment(details[index]?.time_stamp).format('MMM DD, YYYY')}</div>
                    </div>
                  </div>
              }
            })
          })
          setCards(ic)
          setLoading(false)

        }).catch((err) => {
          setLoading(false)
          message.error("Error in fetching pipeline data")
        })

      }
      fetchData();
    }

  }, [selectedPipelineId, fetchAgain])

  const handlePipelineSelect = (value) => {
    setSelectedPipelineName(value)
    pipelines.map((pipeline) => {
      if (pipeline.name === value) {
        setSelectedPipelineId(pipeline.id)
      }
    })
  }

  const handleCreateCard = (columnId) => {
    setClickedCol(columnId)
    setVisible(true)
  };

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    // console.log(result)
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const sourceColumn = columns.find((col) => col.id === source.droppableId);
    // console.log(sourceColumn.id)
    const destinationColumn = columns.find((col) => col.id === destination.droppableId);
    // console.log(destinationColumn.id)


    if (sourceColumn.id === destinationColumn.id) {
      const newCardIds = Array.from(sourceColumn.cardIds);
      newCardIds.splice(source.index, 1);
      newCardIds.splice(destination.index, 0, result.draggableId);

      setColumns((prev) => {
        let arr = [...prev];
        arr.map((obj) => {
          if (obj.id === sourceColumn.id) {
            return { ...obj, cardIds: newCardIds };
          }
          return obj; // Keep other objects unchanged
        });
        return arr;
      })

    }
    else {
      const sourceCardIds = Array.from(sourceColumn.cardIds);
      sourceCardIds.splice(source.index, 1);

      const destinationCardIds = Array.from(destinationColumn.cardIds);
      destinationCardIds.splice(destination.index, 0, result.draggableId);

      setColumns((prev) => {
        return prev.map((obj) => {
          if (obj.id === sourceColumn.id) {
            return { ...obj, cardIds: sourceCardIds };
          }
          if (obj.id === destinationColumn.id) {
            return { ...obj, cardIds: destinationCardIds };
          }
          return obj; // Keep other objects unchanged
        });
      });

      const values = {
        stage_id: destinationColumn.id
      }
      try {
        await axios.put(`http://localhost:8000/api/deal/update_stageid/${draggableId}`, values);
        setFetchAgain(!fetchAgain)
      } catch (err) {
        message.error('Error in updating deals');
      }

    }
  };

  return (
    <>
      <AddCardModal
        visible={visible}
        setVisible={setVisible}
        clickedCol={clickedCol}
        columns={columns}
        setColumns={setColumns}
        cards={cards}
        setCards={setCards}
        fetchAgain={fetchAgain}
        setFetchAgain={setFetchAgain}
        cardId={cardId}
      />

      <AddColModal
        visible={visibleColModal}
        setVisible={setVisibleColModal}
        selectedPipelineId={selectedPipelineId}
        fetchAgain={fetchAgain}
        setFetchAgain={setFetchAgain}
        stageId={stageId}
      />

      <div className="p-8">
        <Select
          style={{
            width: 150,
            marginBottom: '10px'
          }}
          defaultValue="Sales"
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

      {selectedPipelineId ? 
      <DragDropContext onDragEnd={handleDragEnd}>
        {!loading ? <div className="board">
          {columns.map((column) => (
            <div className="column" key={column.id}>

              <div className="column-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div >
                  <h2>{column.title.stageName}</h2>
                  <ul className="column-header-list text-sm">
                    <li>₹ {column.title.price}</li>
                    <li style={{ marginLeft: '20px' }}>• {column.cardIds.length} Deal</li>
                  </ul>
                </div>

                <div style={{ display: 'flex', marginTop:'10px', gap:'10px' }}>
                  <img src={edit} alt="icon" className='user-icon' role="button" onClick={() => handleEditStage(column.id)} />
                  {/* <img src={Delete} alt="icon" className='user-icon' role="button" onClick={() => handleDeleteStage(column.id)} /> */}
                </div>
              </div>

              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    className="card-list"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {column.cardIds.length > 0 && column.cardIds.map((cardId, index) => {
                      const card = cards[cardId];
                      return (
                        <Draggable
                          key={card?.id}
                          draggableId={card?.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              className="card"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              {card?.content}
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <div className="add-card">

                <Button  onClick={() => handleCreateCard(column.id)} className="add-card-button punch" >
                  <PlusOutlined />Add Card
                </Button>
              </div>
            </div>
          ))}
          <div role="button" className="add-column" onClick={() => setVisibleColModal(true)}> <PlusOutlined /> Add column</div>
        </div>
          :
          <Spin style={{ width: '100%' }} />
        }
      </DragDropContext>
        :
        <NothingToShow />
      }
      
      </div>
    </>
  );
};

export default Sales_pipelines;
