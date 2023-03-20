import React, { useState, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { GlobalContext } from '../../context/globalContext';
import { deleteCategoryById } from '../../db/database';
import { openToast } from '../../service/openToast';

const ModalDeleteCategory = (props) => {

    const {setIsUpdateCategory } = useContext(GlobalContext);

    const onClickDelete = () => {
        openToast("categoria cancellata")
        deleteCategoryById(props.category)
            .then(response => {
               setIsUpdateCategory(true);
               props.close();
            })
    }

    return (
        <>
            <Modal show={props.open} onHide={props.close}>
                <Modal.Body>
                    Are you sure to delete the category - <b>{ props.category?.name}</b>?
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

export default ModalDeleteCategory;