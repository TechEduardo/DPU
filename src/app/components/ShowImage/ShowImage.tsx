import React from 'react'
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import styles from './styles.module.css';

const ShowImage = ({ image, showingImage, setShowImage }: any) => {

    function handleOutsideClick(event: any) {
        if (event.target === event.currentTarget)
            setShowImage(false);
    }

    if (showingImage) {
        return (
            <>
                <div className={styles.modalBackground} onClick={handleOutsideClick}>
                    <img src={image.src} />
                    <span title='Fechar'>
                        <HighlightOffIcon  style={{ fontSize: '50', color: '#ffffff', marginTop:'-650px'}} onClick={() => setShowImage(false)} />
                    </span>
                </div>
            </>
        )
    }
    return null;
}

export default ShowImage