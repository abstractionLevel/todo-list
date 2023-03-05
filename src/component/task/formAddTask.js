import React, { useEffect, useState } from "react"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { addTask } from "../../db/database";

const FormAddTask = (props) => {

    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const task = {
            "description": description,
            "isDone": 0,
        }
        await addTask(task);
        setDescription("");
    }

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    }

  

    return (
        <Form>
            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Control type="text" placeholder="scrivi il task" value={description} onChange={handleDescriptionChange} />
            </Form.Group>
            <Button variant="primary" type="submit" onClick={handleSubmit}>
                Submit
            </Button>
        </Form>
    )
}

export default FormAddTask;