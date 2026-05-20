import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Toast from '../../components/Toast/Toast';

import styles from './login.module.css';

import { Button, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';

import loginService from './service/login.service';
import Head from '../../helper/Head';

export default function Login(props: any) {

  const navigate = useNavigate();
  const [isToast, setIsToast] = useState(false);
  const { setUserRole } = useContext(UserContext);
  const { register, handleSubmit, setError, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    
    const resp = await loginService.login(data);

    if (resp.token) {   
      setUserRole(resp.user.usuario);
      navigate('/pagina-inicial');

    } else if (resp.error) {
      setError('email', {});
      setError('password', {});
    }
  }
  return (
    <section className="background-section background-initial">
      <Head title=" | Login" description="Página de login" />
      <div className="container animeRight">
        <div className={styles.login}>          
          <Typography>
            <span className={styles.formDescription}>
                Sistema Geral de Denúncias
            </span>
          </Typography>
          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <div style={{ marginTop: '2rem'}}>
              <TextField
                {...register('email', { required: true })}
                label="Email"
                variant="outlined"
                type='text'
                autoComplete='off'
                error={errors.email ? true : false}
                helperText={errors.email && 'Campo de email invalido!'}
              />
            </div>

            <div style={{ marginTop: '2rem'}}>
              <TextField
                {...register('password', { required: true })}
                label="Senha"
                variant="outlined"
                type='password'
                autoComplete='off'
                error={errors.password ? true : false}
                helperText={errors.password && 'Campo de senha invalido!'}
              />
            </div>

            <div className={styles.entranceOptions}>
                <Button variant="contained" type='submit'>
                    Login
                </Button>

                <p>Não está conseguindo acessar o sistema? <span>Contate um administrador</span></p>
            </div>
            <img className={styles.logo} src="assets/imagens/dpu-logo-degrade.png" alt="DPU Logo" /> 
          </form>
        </div>
      </div>
    </section>
  )
}