import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, ListGroup, Form, Badge, Button } from 'react-bootstrap';
import Header from '../component/header';
import { getAllTasks, getTask, modifyTask, getTasksByPriorityAndCategoryId, getAllCategories, deleteTask, deleteCategoryById, getAllCategoriesWidthTask } from '../db/database';
import { Trash } from 'react-bootstrap-icons';
import ModalDeleteTask from '../component/modalDeleteTask';
import { GlobalContext } from '../context/globalContext';
import FormAddCategory from '../component/form/formAddCategory';
import ModalAddTask from '../component/modal/modalAddTask';
import ModalDeleteCategory from '../component/modal/modalDeleteCategory';

const Home = (props) => {

    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalIsOpen] = useState(false);
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)
    const { isUpdateTask, setIsUpdateTask, isUpdateCategory, setIsUpdateCategory } = useContext(GlobalContext);
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState(null);
    const [taskSelected, setTaskSelected] = useState("");
    const [isModalDeleteCategoryOpen, setIsModalDeleteCategoryOpen] = useState(false);


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
                    if (result.category.name === "Global") {
                        setTasks(result.task);
                        setCategory(result.category);
                    }
                })
                setCategories(response);
            })
    }, [])

    useEffect(() => {
        if(isUpdateCategory) {
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
        if(isUpdateTask) {
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

    // useEffect(() => {
    //     getAllTasks(category && category._id)
    //         .then(response => {
    //             setIsUpdateTask(false);
    //             if (response) {
    //                 setTasks(response)

    //             } else {
    //                 setTasks([])
    //             }
    //         });
    // }, [])



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
                            categories.map((result, index) => (
                                <>
                                    <ListGroup.Item
                                        key={result.category._id}
                                        className="mb-3"
                                        style={{ cursor: "pointer", borderRadius: "2px", backgroundColor: result.category._id === (category && category._id) ? "#efefef" : null }}
                                        onClick={() => handleCategoryClick(result.category)}
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
                                </>
                            ))}
                        <FormAddCategory />
                    </ListGroup>
                </Col>
                <Col sm={8} xs={8}>
                    {category &&
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <p>tasks for the category: <b>{category.name}</b></p>
                            <div>
                                {category.name !== "Global" &&
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
                                                <Trash onClick={() => deleteTaskOnclick(taskVal)} />
                                            </Col>

                                        </Row>
                                    </ListGroup.Item>
                                </>
                            ))}
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