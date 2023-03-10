import React, { useState } from "react"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { addCategory } from "../../db/database";

const FormAddCategory = (props) => {

    const [name, setName] = useState(null);


    const handleSubmit = async (e) => {
        e.preventDefault();
        addCategory({ name: name })
            .then(response => {
                setName("");
            })
    }

    // const handleChange = (event) => {
    //     setPriority(event.target.value);
    // };

    return (
        <Form>
            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Add New Category</Form.Label>
                <Form.Control type="text" placeholder="Enter Category" value={name} onChange={(event) => setName(event.target.value)} />
            </Form.Group>
            <Button variant="primary" type="submit" onClick={handleSubmit} className="mt-1">
                Save Category
            </Button>
        </Form>
    )
}

export default FormAddCategory;