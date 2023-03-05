import React, { useEffect, useState } from "react"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { addTask } from "../../db/database";

const FormAddTask = (props) => {

    const [description, setDescription] = useState(null);
    const [priority,setPriority] = useState('low');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(description) {
            const task = {
                "description": description,
                "isDone": 0,
                "priority":priority,
            }
            await addTask(task);
            setDescription("");
            window.location.reload(false);
        }
        
    }

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    }

    const handleChange = (event) => {
        setPriority(event.target.value);
      };

    return (
        <Form>
            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Control type="text" placeholder="scrivi il task" value={description} onChange={handleDescriptionChange} />
            </Form.Group>
            <Form.Select name="priority" onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </Form.Select>
            <Button variant="primary" type="submit" onClick={handleSubmit} className="mt-4">
                Salva
            </Button>
        </Form>
    )
}

export default FormAddTask;