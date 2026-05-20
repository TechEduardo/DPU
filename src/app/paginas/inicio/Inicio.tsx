import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Head from '../../helper/Head';

import styles from './inicio.module.css';

export default function Inicio() {
   return (
      <section className="background-section background-initial">
         <Head title="" description="Página inicial do Sistema Geral de Denúncias" />
         <div className="">
            <div className="animeRight">
               <div className={styles.sectionTitle}>
               </div>
               <div className={styles.options}>
                  <Link to="/garimpo-ilegal/realizar-denuncia">Realizar denúncia</Link>
                  <Link to="/garimpo-ilegal/acompanhar-denuncia">Acompanhar denúncia</Link>
               </div>
            </div>
         </div>
         <img className={styles.logo} src="assets/imagens/dpu-logo.png" alt="DPU Logo" />
      </section>
   )
}
