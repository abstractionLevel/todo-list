import React, { useState, useEffect } from 'react';
import { Container, Row, Col, ListGroup, Form } from 'react-bootstrap';
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
                setTasks(allTasks);
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
                                <ListGroup.Item key={task._id} className="mb-4 d-flex justify-content-between align-items-center"
                                    style={{
                                        textDecoration: task.isDone ? "line-through" : "none",
                                    }}>
                                    {task.description}
                                    <Form.Check
                                        inline
                                        type="checkbox"
                                        checked={task.isDone}
                                        onChange={() => updateTask(task._id, task.isDone)}
                                    />
                                </ListGroup.Item>
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