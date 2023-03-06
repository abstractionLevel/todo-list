import React, { useState, useEffect } from 'react';
import { Container, Row, Col, ListGroup, Form, Badge } from 'react-bootstrap';
import Header from '../component/header';
import FormAddTask from '../component/task/formAddTask';
import { getAllTasks, getTask, modifyTask, getTasksByPriority } from '../db/database';

const Home = (props) => {

    const [tasks, setTasks] = useState([]);

    const updateTask = (id, isDone) => {
        let task = null;
        let fetchTask = async () => {
            task = await getTask(id);
            task.isDone = !isDone
            modifyTask(task);
            window.location.reload(false);
        }
        fetchTask();
    }

    const onClickPriority = (value) => {
        getTasksByPriority(value)
            .then(response => {
                setTasks(response);
            })
    }

    const onClickAll = async () => {
        await getAllTasks()
            .then(response => {
                setTasks(response)
            });
    }

    useEffect(() => {
        const fetchTasks = async () => {
            const allTasks = await getAllTasks();
            if (allTasks) {
                setTasks(allTasks)
            }
        };
        fetchTasks();
    }, [])



    return (
        <Container >
            <Header title={"to do"} />
            <Row>
                <Col md={5}>
                    <FormAddTask />
                </Col>

                <Col>
                    {tasks.length > 0 &&
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
                                    tutti
                                </Badge>
                            </Row>
                            {tasks.map((task, index) => (
                                <>
                                    <ListGroup.Item key={task._id} className="mb-4 d-flex justify-content-between align-items-center"
                                        style={{
                                            textDecoration: task.isDone ? "line-through" : "none",
                                            borderRadius: 0,
                                            backgroundColor: task.priority === "low" ? "rgba(0, 128, 0, 0.1)" : task.priority === "medium" ? "rgba(0, 0, 255, 0.1)" : "rgba(255, 0, 0, 0.1)",
                                        }}>
                                        {task.description}
                                        <Form.Check
                                            inline
                                            type="checkbox"
                                            checked={task.isDone}
                                            onChange={() => updateTask(task._id, task.isDone)}
                                        />
                                    </ListGroup.Item>
                                </>
                            ))}
                        </ListGroup>
                    }
                </Col>
            </Row>
        </Container >
    )
}

const ShowEmployee = (props) => {
    return (
        <>
            List

        </>
    )
}



export default Home;