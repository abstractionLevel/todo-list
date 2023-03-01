import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Header from '../component/header';


const Home = (props) => {

    return (
        <Container >
            <Header title={"to do"}/>
            <Row>
                <Col md={3}>
                    scrivi task
                </Col>

                <Col md={9}>
                    secondo task
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