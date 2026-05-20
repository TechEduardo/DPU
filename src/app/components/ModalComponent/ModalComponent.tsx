import React from 'react'
import { useNavigate } from 'react-router';

import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';

import styles from './styles.module.css';

const ModalComponent = ({title, children, closeModal}: any) => {
    const navigate = useNavigate();

    function handleOutsideClick(event: any) {
        if (event.target === event.currentTarget)
            closeModal(false);
    }

    return (
        <div className={styles.modal} onClick={handleOutsideClick}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h4 className={styles.modalTitle}>{title}</h4>
                </div>
                <div className={styles.modalBody}>
                    {children}
                </div>
                <div className={styles.modalFooter}>
                    <Button onClick={() => closeModal(false)} variant="outlined" size="large" startIcon={<ClearIcon />}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="contained" size="large" endIcon={<SaveIcon />}>
                        Salvar
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ModalComponent