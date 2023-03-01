import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Header from '../component/header';
import FormAddTask from '../component/task/formAddTask';


const Home = (props) => {

    return (
        <Container >
            <Header title={"to do"}/>
            <Row>
                <Col md={5}>
                    <FormAddTask/>
                </Col>

                <Col>
                    lista dei tasks
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