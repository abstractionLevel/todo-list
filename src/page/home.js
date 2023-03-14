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
import ModalDeleteCategory from '../component/modal/modalDeleteCategory';

const Home = (props) => {

    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalIsOpen] = useState(false);
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)
    const { isToast, setIsToast } = useContext(GlobalContext);
    const { isUpdateTask, setIsUpdateTask, isUpdateCategory, setIsUpdateCategory } = useContext(GlobalContext);
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState(null);
    const [taskSelected, setTaskSelected] = useState("");
    const [isModalDeleteCategoryOpen, setIsModalDeleteCategoryOpen] = useState(false);
    const [categorySelected, setCategorySelected] = useState();


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
                    if (val.name === "Global") {//prendo i tasks di Global per farli vedere a schermo come category di default
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
            toast('🦄 Task cancellato !!', {
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

    useEffect(() => {
        if (isUpdateCategory) {
            toast('🦄 Categoria cancellata !!', {
                position: "bottom-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
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
            setIsUpdateCategory(false);
            setIsModalDeleteCategoryOpen(false);
        }

    }, [isUpdateCategory])

    const deleteTaskOnclick = (task) => {
        setIsModalIsOpen(true);
        setTaskSelected(task);
    }

    const deleteCategory = (category) => {
        setIsModalDeleteCategoryOpen(true);
        setCategory(category);
    }

    return (
        <Container >
            <Header title={""} />
            <Row>
                <Col sm={4} xs={4}>
                    <ListGroup>
                        {categories.length > 0 &&
                            categories.map((val, index) => (
                                <>
                                    <ListGroup.Item
                                        key={val._id}
                                        className="mb-3"
                                        style={{ cursor: "pointer", borderRadius: "2px", backgroundColor: val._id === category._id ? "#efefef" : null }}
                                        onClick={() => handleCategoryClick(val)}
                                    >
                                        <Row >
                                            <Col sm={10} xs={10}>
                                                <div style={{ wordWrap: "break-word" }}> <span style={{ fontWeight: "bold" }}>{val.name}</span></div>
                                            </Col>
                                            <Col sm={2} xs={2} className="d-flex justify-content-end align-items-center">
                                                {val.name !== "Global" &&
                                                    <button onClick={() => deleteCategory(val)}>
                                                        <Trash />
                                                    </button>
                                                }
                                            </Col>
                                        </Row>
                                    </ListGroup.Item> 
                                </>
                            ))}
                        <FormAddCategory />
                    </ListGroup>
                </Col>
                <Col sm={8} xs={8}>
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
                                    <ListGroup.Item key={taskVal._id} className="mb-4"
                                        style={{
                                            textDecoration: taskVal.isDone ? "line-through" : "none",
                                            borderRadius: 0,
                                            backgroundColor: taskVal.priority === "low" ? "rgba(0, 128, 0, 0.1)" : taskVal.priority === "medium" ? "rgba(0, 0, 255, 0.1)" : "rgba(255, 0, 0, 0.1)",
                                        }}>
                                        <Row >
                                            <Col sm={9} xs={9}>
                                                <div style={{ wordWrap: "break-word" }}>{taskVal.description}</div>
                                            </Col>
                                            <Col sm={3} xs={3} className="d-flex justify-content-end align-items-center">
                                                <Form.Check
                                                    inline
                                                    type="checkbox"
                                                    checked={taskVal.isDone}
                                                    onChange={() => modifyTaskByDone(taskVal._id, taskVal.isDone)}

                                                />
                                                <button onClick={() => deleteTaskOnclick(taskVal)}>
                                                    <Trash />
                                                </button>
                                            </Col>

                                        </Row>
                                    </ListGroup.Item>
                                </>
                            ))}
                            <ToastContainer
                            />
                        </ListGroup>
                        : <div>No task</div>}
                    <ModalAddTask close={() => setIsAddTaskModalOpen(false)} open={isAddTaskModalOpen} category={category} />
                    <ModalDeleteTask close={() => setIsModalIsOpen(false)} open={isModalOpen} task={taskSelected} />
                    <ModalDeleteCategory close={() => setIsModalDeleteCategoryOpen(false)} open={isModalDeleteCategoryOpen} category={category} />
                </Col>
            </Row>

        </Container >
    )
}

export default Home;