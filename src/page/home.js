import React, { useState, useEffect } from 'react';
import { Container, Row, Col,ListGroup  } from 'react-bootstrap';
import Header from '../component/header';
import FormAddTask from '../component/task/formAddTask';
import { getAllTasks } from '../db/database';

const Home = (props) => {

    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            const allTasks = await getAllTasks();
            if (allTasks) {
                setTasks(allTasks);
            }
        };
        console.log("")
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
                                <ListGroup.Item key={task._id} className="mb-4">
                                    {task.description}
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