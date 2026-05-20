import React, { useEffect, useState, useContext } from 'react';
import Button from '@mui/material/Button';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
   Card, 
   CardContent, 
   FormControl, 
   FormHelperText,
   InputLabel,
   MenuItem,
   TextField, 
   Select,
   SelectChangeEvent,
   Typography 
} from '@mui/material';
import { UserContext } from '../../contexts/UserContext';
import Cookies from 'universal-cookie';

import Head from '../../helper/Head';
import api from '../../../config/api.service';
import usuarioService from './service/usuario.service';
import loginService from '../../paginas/login/service/login.service';

import styles from './EditUsuario.module.css';

export default function EditUsuario(props: any) {
   const location = useLocation();
   const [idUsuario, setIdUsuario] = useState('');
   const [tipoUsuarioList, setTipoUsuarioList] = useState([] as any);
   const [tipoUsuario, setTipoUsuario] = useState('');
   const { user_role } = useContext(UserContext);
   const cookies = new Cookies();

   const { register, handleSubmit, setValue, clearErrors, setError, formState: { errors } } = useForm();
   const navigate = useNavigate();

   const onSubmit = async (data: any) => {
      const resp = await usuarioService.updateUsuario(data);
      
      const loggedUser = cookies.get('user');
      const editedUser = resp;
      
      if (loggedUser.usuario.idUser === editedUser.usuario.idUser) {
         loginService.logout();
      }
      else {
         if (resp.user) {
            navigate('/list-usuario');
   
         } else if (resp.error.erro) {
            resp.error.data.forEach((e: any) => {
               setError(e.label, { message: e.erro });
            })
         }
      }        
   }

   const handleChangeTipoUsuario = (event: SelectChangeEvent) => {
      clearErrors('tipoUsuario');
      setTipoUsuario(event.target.value);

      tipoUsuarioList.forEach((e: any) => {
         if (e.id == event.target.value)
            setValue('tipoUsuario', e.id);
      });
   };

   useEffect(() => {
      const getRoles = async () => {
         const resp = await api.get("listRoles");

         if (user_role == 1)
            setTipoUsuarioList(resp.data);
      }

      getRoles();

   }, []);

   useEffect(() => {
      const id = location.pathname.split('/')[2];
      setIdUsuario(id);

      if (id !== '') {
         (async () => {
            const resp = await usuarioService.getUsuarioById(id);
            if (!!resp.usuario) {
               setValue('id', resp.usuario.users.id);
               setValue('email', resp.usuario.users.email);
               setValue('nome', resp.usuario.nome);
               setValue('tipoUsuario', resp.usuario.role_id);
               setTipoUsuario(resp.usuario.role_id);
            }
         })()
      }

   }, [])

   return (
      <div className={`animeRight container-internal ${styles.editUsuario}`}>
         <Head title=" | Editar usuário" />
         <Card>
            <CardContent>
            <div className={styles.cardContent}>
               <h2 className="section-title">Editar Usuário</h2>

               <form onSubmit={handleSubmit(onSubmit)}>
                  <div className={`row p-2 ${styles.form}`}>
                     <input {...register('id', { required: true })} placeholder='id' hidden /> {errors.id && 'Id'}
                     <TextField
                        {...register('nome', { required: false })}
                        className='mb-2 w-100'
                        label="Nome (*)"
                        variant="outlined"
                        autoComplete='off'
                        InputLabelProps={{ shrink: true }}
                        error={errors.nome ? true : false}
                        helperText={errors.nome && errors.nome.message?.toString()}
                     />

                     <TextField
                        {...register('email', { required: false })}
                        className='mb-2 w-100'
                        label="Email (*)"
                        variant="outlined"
                        type='email'
                        autoComplete='off'
                        InputLabelProps={{ shrink: true }}
                        error={errors.email ? true : false}
                        helperText={errors.email && errors.email.message?.toString()}
                     />

                     {user_role === 1 && 
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
                     }

                     <Button
                        variant="contained"
                        type='submit'>Alterar</Button>
                  </div>
               </form>
            </div>
            </CardContent>
         </Card >
      </div>
   )
}
