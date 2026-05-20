import React, { useEffect, useState, useContext } from 'react';
import Button from '@mui/material/Button';
import usuarioService from './service/usuario.service';
import { useNavigate } from 'react-router-dom';
import styles from './ListUsuarios.module.css'
import { Card, CardContent, Typography } from '@mui/material';
import Head from '../../helper/Head';
import { UserContext } from '../../contexts/UserContext';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteForever';


export default function ListUsuarios() {
   const navigate = useNavigate();
   const [listUsuario, setListUsuario] = useState([] as any);
   const { user_role } = useContext(UserContext);

   useEffect(() => {
      listUsuarios();
   }, []);

   const listUsuarios = async () => {
      const resp = await usuarioService.listUsuario();
      setListUsuario(resp);
   };

   const deleteUsuarioById = async (id: any) => {
      const alertConfirm = window.confirm('Deseja mesmo remover este usuário?');
      
      if(alertConfirm) {
         const resp = await usuarioService.deleteUsuarioById(id);
         
         if (!!resp) {
            listUsuarios();
            navigate('/list-usuario');
         }
      }
   }

   return (
      <section className={`animeRight container-internal ${styles.listUsuarios}`}>
         <Head title=" | Listagem Usuários" />
         <Card>
               <CardContent>
                  <div className={styles.cardContent}>
                     <h3 className="section-title">Listagem de Usuários</h3>
                     
                     <table className={`table table-bordered ${styles.tableUsuarios}`} border={1}>
                        <thead>
                           <tr>
                              <th scope="col">Id</th>
                              <th scope="col">Nome</th>
                              <th scope="col">Email</th>
                              <th scope="col">Tipo</th>
                              <th scope="col">Ações</th>
                           </tr>
                        </thead>
                        <tbody>
                           {listUsuario.length > 0 ? 
                              listUsuario.map((e: any, i: any) =>
                                 <tr key={i}>
                                    <td>{e.users.id}</td>
                                    <td>{e.nome}</td>
                                    <td>{e.users.email}</td>                                    
                                    <td>{parseInt(e.role_id) === 1 ? 'Admin' : parseInt(e.role_id) === 2 ? 'Moderador' : 'Comum'}</td>  
                                    <td className={styles.actionsList}>                                  
                                    { user_role === 1 ? 
                                          <>
                                             <Button onClick={() => navigate('/edit-usuario/' + e.users.id)}><EditIcon /></Button>
                                             <Button onClick={() => deleteUsuarioById(e.users.id)}><DeleteIcon/></Button>
                                          </>
                                          
                                       : 
                                          <Button onClick={() => navigate('/edit-usuario/' + e.users.id)}><EditIcon/></Button>
                                       }
                                    </td> 
                                 </tr>
                              )
                              :
                              <tr>
                                 <td colSpan={5} className={styles.noResults}>
                                    <p>Não há usuários cadastrados nos sistema.</p>
                                 </td>
                                 <td style={{ display: 'none' }}>
                                 </td>
                              </tr>
                           }
                        </tbody>
                     </table>
                  </div>
               </CardContent>
         </Card>
      </section>
   )
}
