import React, { useState, useEffect } from 'react';
import { Container, Row, Col, ListGroup, Form, Badge } from 'react-bootstrap';
import Header from '../component/header';
import FormAddTask from '../component/task/formAddTask';
import { getAllTasks, getTask, modifyTask } from '../db/database';

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
                            {tasks.map((task, index) => (
                                <>
                                    <Badge
                                        bg={ task.priority === 'low' ? 'success' : task.priority === 'medium' ? 'primary': 'danger'}
                                        style={{width: '100px',marginLeft: "auto",marginBottom:"10px"}}
                                    >
                                        {task.priority}
                                    </Badge>
                                    <ListGroup.Item key={task._id} className="mb-4 d-flex justify-content-between align-items-center"
                                        style={{
                                            textDecoration: task.isDone ? "line-through" : "none",
                                            // border: task.priority === "low" ? "1px solid green" : task.priority === "medium" ? "1px solid blue" : "1px solid red",
                                            borderRadius: 0,
                                            backgroundColor: task.priority === "low" ? "rgba(0, 128, 0, 0.1)"  : task.priority === "medium" ? "rgba(0, 0, 255, 0.1)" : "rgba(255, 0, 0, 0.1)",
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