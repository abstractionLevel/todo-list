import React, { useState, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { addTask } from "../../db/database";


const ModalAddTask = (props) => {

    const [description, setDescription] = useState(null);
    const [priority, setPriority] = useState('low');


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (description) {
            const task = {
                "description": description,
                "isDone": 0,
                "priority": priority,
                "categoryId": props.category && props.category._id
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
        <>
            <Modal show={props.open} onHide={props.close}>
                <Modal.Body>
                <p>Add Task for category: <b>{props.category && props.category.name}</b></p> 
                    <Form>
                        <Form.Group className="mb-3 mt-3" controlId="formBasicPassword">
                            <Form.Control as="textarea" rows={3} placeholder="scrivi il task" value={description} onChange={handleDescriptionChange} />
                        </Form.Group>
                        <Form.Select name="priority" onChange={handleChange} className="mt-3">
                            <option default value="low">chose the priority</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </Form.Select>
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
                            <Button variant="primary" type="submit" style={{ marginRight: "10px" }} onClick={handleSubmit}>
                                Salva
                            </Button>
                            <Button variant="secondary" onClick={props.close}>
                                Close
                            </Button>
                        </div>

                    </Form>

                </Modal.Body>
            </Modal>
        </>
    );
}

export default ModalAddTask;