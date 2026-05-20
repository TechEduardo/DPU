import React from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '@mui/material/Button';

import styles from './CadastroUnico.module.css';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import Head from '../../helper/Head';

const CadastroUnicoPeticao = () => {
  const navigate = useNavigate();

  return (
    <section className="background-section background-initial">
      <Head title=" | Petições" />
      <div className="">
            <div className={styles.sectionTitle}>
               <h1 className={styles.title}>Cadastro Único de Petições</h1>
               <h2 className={styles.subtitle}></h2>
            </div>
            <div className={styles.options}>
               <Link to="realizar-cadastro">Realizar cadastro</Link>
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

export default CadastroUnicoPeticao