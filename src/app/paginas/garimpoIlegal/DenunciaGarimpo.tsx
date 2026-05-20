import React from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '@mui/material/Button';

import styles from './DenunciaGarimpo.module.css';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import Head from '../../helper/Head';

const DenunciaGarimpo = () => {
  const navigate = useNavigate();

  return (
    <section className="background-section background-initial">
      <Head title=" | Garimpo ilegal" />
      <div className="">
            <div className={styles.sectionTitle}>
            </div>
            <div className={styles.options}>
               <Link to="realizar-denuncia">Realizar denúncia</Link>
               <Link to="acompanhar-denuncia">Acompanhar denúncia</Link>
            </div>
            <div className={styles.back}>
              <Button onClick={() => navigate(-1)}>
                 <ArrowBackIcon sx={{ fontSize: 30 }} />
              </Button>
            </div>
      </div>
      <img className={styles.logo} src="assets/imagens/dpu-logo.png" alt="DPU Logo" /> 
    </section>
  )
}

export default DenunciaGarimpo