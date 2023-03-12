import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, ListGroup, Form, Badge, Button } from 'react-bootstrap';
import Header from '../component/header';
import FormAddTask from '../component/form/formAddTask';
import { getAllTasks, getTask, modifyTask, getTasksByPriorityAndCategoryId, getAllCategories, deleteTask, deleteCategoryById } from '../db/database';
import { Trash } from 'react-bootstrap-icons';
import ModalDeleteTask from '../component/modalDeleteTask';
import { GlobalContext } from '../context/globalContext';
import { ToastContainer, toast } from 'react-toastify';
import FormAddCategory from '../component/form/formAddCategory';
import 'react-toastify/dist/ReactToastify.css';
import ModalAddTask from '../component/modal/modalAddTask';

const Home = (props) => {

    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalIsOpen] = useState(false);
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)
    const { isToast, setIsToast } = useContext(GlobalContext);
    const { isUpdateTask, setIsUpdateTask, isUpdateCategory, setIsUpdateCategory } = useContext(GlobalContext);
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState(null);
    const [taskSelected, setTaskSelected] = useState("");

    // const updateTask = (id, isDone) => {
    //     let task = null;
    //     let fetchTask = async () => {
    //         task = await getTask(id);
    //         task.isDone = !isDone
    //         modifyTask(task);
    //         window.location.reload(false);
    //     }
    //     fetchTask();
    // }

    const modifyTaskByDone = async (id, isDone) => {
        let task = await getTask(id);
        task.isDone = !isDone;
        modifyTask(task);
        await getAllTasks(task.category_id)
            .then(response => {
                if (response.length > 0) {
                    setTasks(response)
                }

            });
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
                    setIsToast(false);
                } else {
                    setTasks([])
                }
            })
    }

    useEffect(() => {
        getAllCategories()
            .then(response => {
                response.map(val => {
                    if (val.name === "Global") {
                        setCategory(val);
                        getAllTasks(val._id)
                            .then(response => {
                                if (response) {
                                    setTasks(response)
                                    setIsToast(false);
                                } else {
                                    setTasks([])
                                }
                            })
                    }
                })
                setCategories(response);
            })
    }, [])

    useEffect(() => {
        if (isToast) {
            setIsUpdateTask(true); //aggiorno i tasks
            toast('🦄 Task Deleted !!', {
                position: "bottom-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            setIsToast(false);
        }

    }, [isToast])


    useEffect(() => {
        getAllTasks(category && category._id)
            .then(response => {
                setIsUpdateTask(false);
                if (response) {
                    setTasks(response)
                } else {
                    setTasks([])
                }
            });

    }, [isUpdateTask])

    const deleteTaskOnclick = (task) => {
        setIsModalIsOpen(true);
        setTaskSelected(task);
    }

    const deleteCategory = (category) => {
        deleteCategoryById(category)
            .then(response => {
                window.location.reload(false);
            })
    }

    return (
        <Container >
            <Header title={""} />
            <Row>
                <Col md={4}>
                    <ListGroup>
                        {categories.length > 0 &&
                            categories.map((val, index) => (
                                <>
                                    <ListGroup.Item
                                        key={val._id}
                                        className="mb-3 d-flex  align-items-center justify-content-between"
                                        style={{ cursor: "pointer", borderRadius: "2px", backgroundColor: val._id === category._id ? "#efefef" : null }}
                                        onClick={() => handleCategoryClick(val)}
                                    >
                                        <span style={{ fontWeight: "bold" }}>{val.name}</span>
                                        {val.name !== "Global" &&
                                            <button onClick={() => deleteCategory(val)}>
                                                <Trash />
                                            </button>
                                        }

                                    </ListGroup.Item>
                                </>
                            ))}
                        <FormAddCategory />
                    </ListGroup>
                </Col>
                <Col>
                    {category &&
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <p>tasks for the category: <b>{category.name}</b></p>
                            <Button variant="primary" type="submit" className="mt-1" onClick={() => setIsAddTaskModalOpen(true)}>
                                Add Task
                            </Button>
                        </div>
                    }
                    <div style={{ borderBottom: "1px solid black", marginBottom: "10px", marginTop: "10px" }}>
                    </div>
                    {tasks.length > 0 ?
                        <ListGroup>
                            <Row style={{ marginLeft: "2px", marginBottom: "10px" }}>
                                <Badge
                                    bg={"success"}
                                    style={{ width: "100px" }}
                                    onClick={() => onClickPriority("low")}
                                    name="low"
                                >
                                    low
                                </Badge>
                                <Badge
                                    bg={"primary"}
                                    style={{ width: "100px", marginLeft: '2px' }}
                                    onClick={() => onClickPriority("medium")}
                                >
                                    medium
                                </Badge>
                                <Badge
                                    bg={"danger"}
                                    style={{ width: "100px", marginLeft: '2px' }}
                                    onClick={() => onClickPriority("high")}
                                >
                                    high
                                </Badge>
                                <Badge
                                    bg={"dark"}
                                    style={{ width: "100px", marginLeft: '2px' }}
                                    onClick={() => onClickAll()}
                                >
                                    all
                                </Badge>
                            </Row>
                            {tasks.map((taskVal, index) => (
                                <>
                                    <ListGroup.Item key={taskVal._id} className="mb-4 d-flex  align-items-center justify-content-between"
                                        style={{
                                            textDecoration: taskVal.isDone ? "line-through" : "none",
                                            borderRadius: 0,
                                            backgroundColor: taskVal.priority === "low" ? "rgba(0, 128, 0, 0.1)" : taskVal.priority === "medium" ? "rgba(0, 0, 255, 0.1)" : "rgba(255, 0, 0, 0.1)",
                                        }}>
                                        {taskVal.description}
                                        <div>
                                            <Form.Check
                                                inline
                                                type="checkbox"
                                                checked={taskVal.isDone}
                                                onChange={() => modifyTaskByDone(taskVal._id, taskVal.isDone)}

                                            />
                                            <button onClick={() => deleteTaskOnclick(taskVal)}>
                                                <Trash />
                                            </button>
                                        </div>

                                    </ListGroup.Item>
                                </>
                            ))}
                            <ToastContainer
                            />
                        </ListGroup>
                        : <div>No taks</div>}
                    <ModalAddTask close={() => setIsAddTaskModalOpen(false)} open={isAddTaskModalOpen} category={category} />
                    <ModalDeleteTask close={() => setIsModalIsOpen(false)} open={isModalOpen} task={taskSelected} />

                </Col>
            </Row>

        </Container >
    )
}

export default Home;