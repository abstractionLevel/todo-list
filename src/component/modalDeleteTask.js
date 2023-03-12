import React, { useState, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Toast } from 'react-bootstrap';
import { removeTaskById } from '../db/database';
import { GlobalContext } from '../context/globalContext';

const ModalDeleteTask = (props) => {

    const { isToast, setIsToast } = useContext(GlobalContext);

    const onClickDelete = () => {
       
        removeTaskById(props.task._id)
            .then(resp => {
                setIsToast(true)
                props.close();
            })
    }

    return (
        <>
            <Modal show={props.open} onHide={props.close}>
                <Modal.Body>
                    Are you sure to delete the task - {props.task.description} ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={onClickDelete}>
                        Delete
                    </Button>
                    <Button variant="secondary" onClick={props.close}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalDeleteTask;