import React from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

import styles from './styles.module.css';

const ModalAlert = ({ isOpen, title, body, setOpenModal }: any) => {

    const navigate = useNavigate();

    function handleOutsideClick(event: any) {
        // if (event.target === event.currentTarget){
        setOpenModal(false);
        navigate('/');
        // }
    }
    
    if(isOpen) {
        return (
            <div className={styles.modalBackground} >
                <div className={styles.modalCard}>
                    <div className={styles.closeModal} onClick={() => setOpenModal(!isOpen)}>
                        <CloseIcon onClick={handleOutsideClick} style={{color: 'black'}}/>
                    </div>
                    <div className={styles.modalContent}>
                        <h1>{title}</h1>
                        <p>{body}</p>
                    </div>
                </div>
            </div>  
        )
    }  
    
    return null;
}

export default ModalAlert