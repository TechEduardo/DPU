import React, { useState, useEffect, useContext } from 'react';
import Button from '@mui/material/Button';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { 
   FormHelperText, 
   FormControl,
   InputLabel, 
   MenuItem, 
   Select, 
   SelectChangeEvent, 
   Typography 
} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import { UserContext } from '../../contexts/UserContext';

import Head from '../../helper/Head';
import api from '../../../config/api.service';
import usuarioService from './service/usuario.service';

import styles from './CreateUsuario.module.css'

export default function CreateUsuario(props: any) {
   const { register, handleSubmit, watch, setValue, clearErrors, setError, formState: { errors } } = useForm();
   const [tipoUsuarioList, setTipoUsuarioList] = useState([] as any);
   const [tipoUsuario, setTipoUsuario] = useState('');
   const { user_role } = useContext(UserContext);
   const navigate = useNavigate();

   useEffect(() => {
      const getRoles = async () => {
         const resp = await api.get("listRoles");

         if (user_role == 1)
                  setTipoUsuarioList(resp.data);
         else
            setTipoUsuarioList([resp.data[resp.data.map((role:any) => role.role_name).indexOf('Comum')]])
      }

      getRoles();

   }, []);

   const handleChangeTipoUsuario = (event: SelectChangeEvent) => {
      clearErrors('tipoUsuario');
      setTipoUsuario(event.target.value);

      tipoUsuarioList.forEach((e: any) => {
         if (e.id === event.target.value)
            setValue('tipoUsuario', e.id);
      });
   };

   const onSubmit = async (data: any) => {
      const resp = await usuarioService.createUsuario(data);

      if (resp.user) {
         navigate('/list-usuario');

      } else if (resp.error.erro) {
         resp.error.data.forEach((e:any)=>{
               setError(e.label, { message: e.erro });
         })
      }
   }

   return (
      <section className={`animeRight container-internal ${styles.createUsuario}`}>
         <Head title=" | Criar usuário" />
         <Card>
            <CardContent>
               <div className={styles.cardContent}>
                  <h2 className="section-title">Criar Usuario</h2>
                  <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
                     <div className={`row p-2 ${styles.form}`}>
                        <TextField
                           {...register('nome', { required: false })}
                           className='mb-2 w-100'
                           label="Nome (*)"
                           variant="outlined"
                           type='text'
                           autoComplete='off'
                           error={errors.nome ? true : false}
                           helperText={errors.nome && errors.nome.message?.toString()}
                        />

                        <TextField
                           {...register('email', { required: false })}
                           className='mb-2 w-100'
                           label="Email (*)"
                           variant="outlined"
                           // type='email'
                           autoComplete='off'
                           inputProps={{ autoComplete: 'off' }}
                           error={errors.email ? true : false}
                           helperText={errors.email && errors.email.message?.toString()}
                        />

                        <TextField
                           {...register('password', { required: false })}
                           className='mb-2 w-100'
                           label="Senha (*)"
                           variant="outlined"
                           type='password'
                           autoComplete='off'
                           error={errors.password ? true : false}
                           helperText={errors.password && errors.password.message?.toString()}
                        />

                        <FormControl error={errors.tipoUsuario ? true : false} >
                           <InputLabel>Tipo usuário</InputLabel>
                           <input {...register('tipoUsuario', { required: false })} hidden />
                           <Select
                              value={tipoUsuario}
                              label='Tipo usuário'
                              onChange={handleChangeTipoUsuario}
                              MenuProps={{ PaperProps: { sx: { maxHeight: 450 } } }}
                           >
                              {!!tipoUsuarioList ?
                                 tipoUsuarioList.map((option: any, i: any) =>
                                    <MenuItem value={option.id} key={i} >{option.role_name}</MenuItem>
                                 )
                                 :
                                 <MenuItem value={0}>Nada a ser exibido</MenuItem>
                              }
                           </Select>
                           {errors.tipoUsuario &&
                              <FormHelperText>{errors.tipoUsuario?.message?.toString()}</FormHelperText>
                           }
                        </FormControl>                        
                        
                        <Button
                           variant="contained"
                           type='submit'>Cadastrar</Button>
                     </div>
                  </form>
               </div>
            </CardContent>
         </Card>
      </section>
   )
}
