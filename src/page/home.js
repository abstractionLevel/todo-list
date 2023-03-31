import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, ListGroup, Form, Badge, Button } from 'react-bootstrap';
import Header from '../component/header';
import { getAllTasks, getTask, modifyTask, getTasksByPriorityAndCategoryId, getAllCategories, deleteTask, deleteCategoryById, getAllCategoriesWidthTask, addTask, modifyCategory, getCategory } from '../db/database';
import { Trash } from 'react-bootstrap-icons';
import ModalDeleteTask from '../component/modalDeleteTask';
import { GlobalContext } from '../context/globalContext';
import FormAddCategory from '../component/form/formAddCategory';
import ModalAddTask from '../component/modal/modalAddTask';
import ModalDeleteCategory from '../component/modal/modalDeleteCategory';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import moment from 'moment';


const Home = (props) => {

    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalIsOpen] = useState(false);
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)
    const { isUpdateTask, setIsUpdateTask, isUpdateCategory, setIsUpdateCategory } = useContext(GlobalContext);
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState(null);
    const [taskSelected, setTaskSelected] = useState("");
    const [isModalDeleteCategoryOpen, setIsModalDeleteCategoryOpen] = useState(false);
    const [lastPositionTask, setLastPositionTask] = useState(1);
    const [lastPositionCategory, setLastPositionCategory] = useState(1);


    const modifyTaskByDone = async (id, isDone) => {
        let task = await getTask(id);
        task.isDone = !isDone;
        modifyTask(task);
        getAllCategoriesWidthTask()
            .then(response => {
                response.map(result => {
                    if (result.category.name === category.name) {
                        setTasks(result.task)
                    }
                })
                setCategories(response);
            })
    }

    const onClickPriority = (value) => {
        getTasksByPriorityAndCategoryId(value, category._id)
            .then(response => {
                if (response.length > 0) {
                    setTasks(response);
                }
            })
    }

    const onClickAll = async () => {
        await getAllTasks(category._id)
            .then(response => {
                if (response.length > 0) {
                    setTasks(response)
                }

            });
    }

    const handleCategoryClick = (category) => {
        setCategory(category)
        getAllTasks(category._id)
            .then(response => {
                if (response) {
                    setTasks(response)
                } else {
                    setTasks([])
                }
            })
    }

    useEffect(() => {
        getAllCategoriesWidthTask()
            .then(response => {
                response.map(result => {
                    setLastPositionTask(result.maxPositionTask);
                    setLastPositionCategory(result.maxPositionCategory);
                    if (result.category.name === "Global") {
                        setTasks(result.task);
                        setCategory(result.category);
                    }
                })
                setCategories(response);
            })
    }, [])

    useEffect(() => {
        if (isUpdateCategory) {
            getAllCategoriesWidthTask()
                .then(response => {
                    response.map(result => {
                        if (result.category.name === "Global") {
                            setTasks(result.task)
                        }
                    })
                    setCategories(response);
                })
        }
        setIsUpdateCategory(false);

    }, [isUpdateCategory])

    useEffect(() => {
        if (isUpdateTask) {
            getAllCategoriesWidthTask()
                .then(response => {
                    response.map(result => {
                        if (result.category.name === category.name) {
                            setTasks(result.task)
                        }
                    })
                    setCategories(response);
                    setIsUpdateTask(false)
                })
        }
    }, [isUpdateTask])

    const deleteTaskOnclick = (task) => {
        setIsModalIsOpen(true);
        setTaskSelected(task);
    }

    const deleteCategory = (category) => {
        setIsModalDeleteCategoryOpen(true);
        setCategory(category);
    }

    const handleDragEnd = (result) => {
        // Controllo se l'elemento è stato trascinato in un'altra posizione valida
        if (!result.destination) {
            return;
        }
        // Copio la lista degli elementi
        const items = Array.from(tasks);
        //Rimuovo l'elemento dalla sua posizione precedente
        const [removed] = items.splice(result.source.index, 1);
        // Inserisco l'elemento nella nuova posizione
        items.splice(result.destination.index, 0, removed);
        // // Aggiorno la lista degli elementi
        setTasks(items);
        let position = 1;
        items.forEach(element => {//aggiorno i task nel db perposizione
            element.position = position;
            position = position + 1;
            saveTask(element);
        })

    };

    const handleDragEndCategory = (result) => {
        // Controllo se l'elemento è stato trascinato in un'altra posizione valida
        if (!result.destination) {
            return;
        }
        // Copio la lista degli elementi
        const items = Array.from(categories);
        //Rimuovo l'elemento dalla sua posizione precedente
        const [removed] = items.splice(result.source.index, 1);
        // Inserisco l'elemento nella nuova posizione
        items.splice(result.destination.index, 0, removed);
        // // Aggiorno la lista degli elementi
        setCategories(items);
        let position = 1;
        items.forEach(element => {//aggiorno le category nel db per posizione
            element.position = position;
            position = position + 1;
            saveCategory(element);
        })
    };

    const saveTask = async (task) => {
        let taskFetched = await getTask(task._id);
        taskFetched.position = task.position
        await modifyTask(taskFetched);
    }

    const saveCategory = async (category) => {
        let categoryFetched = await getCategory(category.category._id);
        categoryFetched.position = category.position
        await modifyCategory(categoryFetched);
    }

    return (
        <Container >
            <Header title={""} />
            <Row>
                <Col sm={4} xs={4}>
                    <DragDropContext onDragEnd={handleDragEndCategory}>
                        <Droppable droppableId="categories">
                            {(provided) => (
                                <ListGroup {...provided.droppableProps} ref={provided.innerRef}>
                                    {categories.length > 0 &&
                                        categories.map((result, index) => (
                                            <Draggable key={result.category._id} draggableId={result.category._id} index={index} style={{ backgroundColor: "red" }}>
                                                {(provided) => (
                                                    <ListGroup.Item
                                                        key={result.category._id}
                                                        className="mb-3"
                                                        style={{ cursor: "pointer", borderRadius: "2px", backgroundColor: result.category._id === (category && category._id) ? "#efefef" : null }}
                                                        onClick={() => handleCategoryClick(result.category)}
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <Row >
                                                            <Col sm={9} xs={9}>
                                                                <div style={{ wordWrap: "break-word" }}> <span style={{ fontWeight: "bold" }}>{result.category.name}</span></div>
                                                            </Col>

                                                            <Col sm={3} xs={3} className="d-flex justify-content-end align-items-center">
                                                                <div>
                                                                    {result.completed + "/" + result.totalTask}
                                                                </div>
                                                            </Col>

                                                        </Row>
                                                    </ListGroup.Item>
                                                )}
                                            </Draggable>
                                        ))}
                                    <FormAddCategory position={lastPositionCategory} />
                                </ListGroup>
                            )}
                        </Droppable>
                    </DragDropContext>
                </Col>
                <Col sm={8} xs={8}>
                    {category &&
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <p>tasks for the category: <b>{category.name}</b></p>
                            <div>
                                {category.name !== "Globals" &&
                                    <Button variant="secondary" type="submit" className="mt-1 " style={{ marginRight: 20 }} size="sm" onClick={() => deleteCategory(category)}>
                                        Delete Category
                                    </Button>
                                }

                                <Button variant="primary" type="submit" className="mt-1" onClick={() => setIsAddTaskModalOpen(true)} size="sm">
                                    Add Task
                                </Button>
                            </div>
                        </div>
                    }
                    <div style={{ borderBottom: "1px solid black", marginBottom: "10px", marginTop: "10px" }}>
                    </div>
                    {tasks.length > 0 ?
                        <ListGroup>
                            <Row style={{ marginLeft: "2px", marginBottom: "10px" }}>
                                <Badge
                                    bg={"success"}
                                    style={{ width: "100px", cursor: 'pointer' }}
                                    onClick={() => onClickPriority("low")}
                                    name="low"
                                >
                                    low
                                </Badge>
                                <Badge
                                    bg={"primary"}
                                    style={{ width: "100px", marginLeft: '2px', cursor: 'pointer' }}
                                    onClick={() => onClickPriority("medium")}
                                >
                                    medium
                                </Badge>
                                <Badge
                                    bg={"danger"}
                                    style={{ width: "100px", marginLeft: '2px', cursor: 'pointer' }}
                                    onClick={() => onClickPriority("high")}
                                >
                                    high
                                </Badge>
                                <Badge
                                    bg={"dark"}
                                    style={{ width: "100px", marginLeft: '2px', cursor: 'pointer' }}
                                    onClick={() => onClickAll()}
                                >
                                    all
                                </Badge>
                            </Row>
                            <>
                                <DragDropContext onDragEnd={handleDragEnd}>
                                    <Droppable droppableId="tasks">
                                        {(provided) => (
                                            <ListGroup {...provided.droppableProps} ref={provided.innerRef}>
                                                {tasks.map((taskVal, index) => (
                                                    <Draggable key={taskVal._id} draggableId={taskVal._id} index={index} >
                                                        {(provided) => (
                                                            <ListGroup.Item key={taskVal._id} className="mb-4"
                                                                style={{
                                                                    textDecoration: taskVal.isDone ? "line-through" : "none",
                                                                    borderRadius: 0,
                                                                    important: true,
                                                                    ...provided.draggableProps.style,
                                                                }}
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}>
                                                                <Row >
                                                                    <Col sm={9} xs={9} style={{ display: 'flex', alignItems: 'center' }}>
                                                                        <p style={{
                                                                            wordWrap: "break-word",
                                                                        }}>
                                                                            {taskVal.description}
                                                                        </p>

                                                                    </Col>
                                                                    <Col sm={3} xs={3} className="d-flex justify-content-end align-items-center">

                                                                        <Form.Check
                                                                            inline
                                                                            type="checkbox"
                                                                            checked={taskVal.isDone}
                                                                            onChange={() => modifyTaskByDone(taskVal._id, taskVal.isDone)}

                                                                        />
                                                                        <Trash onClick={() => deleteTaskOnclick(taskVal)} />

                                                                    </Col>
                                                                    <Col sm={9} xs={9} className="d-flex">
                                                                        <p style={{
                                                                            wordWrap: "break-word",
                                                                            fontSize: "80%",
                                                                            opacity: 0.7,
                                                                            margin: 0
                                                                        }}>{moment(taskVal._id).format('DD/MM/YYYY')}
                                                                        </p>

                                                                    </Col>
                                                                    <Col sm={3} xs={3} className="d-flex justify-content-end">
                                                                        <div style={{
                                                                            backgroundColor: taskVal.priority === "low" ? "green" : taskVal.priority === "medium" ? "blue" : "red",
                                                                            textAlign: 'center',
                                                                            display: 'inline-block',
                                                                            whiteSpace: 'nowrap',
                                                                            color: 'white',
                                                                            fontWeight: 'bold',
                                                                            borderRadius: '5px',
                                                                            padding: 4,
                                                                            fontSize: 12,
                                                                        }}>
                                                                            priority:{taskVal.priority}
                                                                        </div>
                                                                    </Col>

                                                                </Row>
                                                            </ListGroup.Item>
                                                        )}
                                                    </Draggable>
                                                ))}
                                            </ListGroup>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            </>
                        </ListGroup>
                        : <div>No task</div>}
                    <ModalAddTask close={() => setIsAddTaskModalOpen(false)} open={isAddTaskModalOpen} category={category} position={lastPositionTask} />
                    <ModalDeleteTask close={() => setIsModalIsOpen(false)} open={isModalOpen} task={taskSelected} />
                    <ModalDeleteCategory close={() => setIsModalDeleteCategoryOpen(false)} open={isModalDeleteCategoryOpen} category={category} />
                </Col>
            </Row>

        </Container >
    )
}

export default Home;