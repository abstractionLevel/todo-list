import React from "react"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const FormAddTask = (props) => {


    return (
        <Form>
            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Control type="text" placeholder="scrivi il task" />
            </Form.Group>
            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    )
}

export default FormAddTask;