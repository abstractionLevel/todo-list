import React, { useEffect, useState } from "react"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { addTask ,addCategory} from "../../db/database";

const FormAddTask = (props) => {

    const [description, setDescription] = useState(null);
    const [priority, setPriority] = useState('low');
    const [createNewCategory, setCreateNewCategory] = useState(null);
    const [category, setCategory] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("category ", category);
        addCategory({name:"prima categoria"})
            .then(response=>{
                console.log(response.id)
            })
        // if (description) {
        //     const task = {
        //         "description": description,
        //         "isDone": 0,
        //         "priority": priority,
        //     }
        //     await addTask(task);
        //     setDescription("");
        //     window.location.reload(false);
        // }

    }

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    }

    const handleChange = (event) => {
        setPriority(event.target.value);
    };

    const handleCreateNewCategoryCheckboxChange = (event) => {
        setCategory(null);
        setCreateNewCategory(event.target.checked);
    }

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    }

  

    return (
        <Form>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Control as="textarea" rows={3} placeholder="scrivi il task" value={description} onChange={handleDescriptionChange} />
                </Form.Group>
                <Form.Select name="priority" onChange={handleChange} className="mt-3">
                    <option default value="low">chose the priority</option>
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