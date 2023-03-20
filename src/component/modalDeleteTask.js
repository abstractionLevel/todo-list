import React, { useState, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Toast } from 'react-bootstrap';
import { removeTaskById } from '../db/database';
import { GlobalContext } from '../context/globalContext';
import { openToast } from '../service/openToast';

const ModalDeleteTask = (props) => {

    const {setIsUpdateTask } = useContext(GlobalContext);

    const onClickDelete = () => {
        openToast("task cancellato")
        removeTaskById(props.task._id)
            .then(resp => {
                props.close();
                setIsUpdateTask(true);
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