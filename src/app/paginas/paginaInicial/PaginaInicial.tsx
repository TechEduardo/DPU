import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import styles from './PaginaInicial.module.css';

export default function PaginaInicial() {
   const { user_role, user_name } = useContext(UserContext);

   return (
      <section className={styles.section}>
          <Card>
            <CardContent>
               <div className={styles.welcome}>
                  <p className={styles.headerText}>Bem vindo <b>{user_name}</b>, ao</p>
                  <p className={styles.mainText}>Observatório Nacional da DPU Sobre Garimpo e Efeitos Socioambientais</p>
               </div>
         </CardContent>
         </Card>
      </section>
   )
}
