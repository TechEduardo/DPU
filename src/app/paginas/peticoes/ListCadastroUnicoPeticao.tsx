import React, { useEffect, useState } from 'react';
// import clienteService from './cliente.service';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardContent, Typography } from '@mui/material';
import estilos from './ListCadastroUnicoPeticao.module.css';
import cadastroUnicoPeticaoService from './service/cadastroUnicoPeticao.service';
import { telefoneMascara, telefoneSemMascara, dataBr } from '../../util/mascaras';
import VisibilityIcon from '@mui/icons-material/Visibility';

// import styles from './ListDenuncia.module.css';

export default function ListCadastroUnicoPeticao() {
   const navigate = useNavigate();
   const [listCadastroUnicoPeticaoData, setListCadastroUnicoPeticaoData] = useState([] as any);

   useEffect(() => {
      listCadastroUnicoPeticao();
   }, []);

   const listCadastroUnicoPeticao = async () => {
      const resp = await cadastroUnicoPeticaoService.listCadastroUnicoPeticao();
      setListCadastroUnicoPeticaoData(resp)
   };

   return (
      <div className={estilos.cadastroUnicoPeticao}>
         <Card sx={{ maxWidth: '90%' }}>
            <CardContent>

               <Typography className='text-center' gutterBottom variant='h5' component='h2'>Lista de denuncias do formulario de Cadastro unico de petição</Typography>

               <table className="table table-bordered " border={1}>
                  <thead>
                     <tr>
                        <th scope="col">Numero do registro da denuncia</th>
                        <th scope="col">Nome</th>
                        <th scope="col">CPF</th>
                        <th scope="col">Apelido</th>
                        <th scope="col">Sexo</th>
                        <th scope="col">Telefone</th>
                        <th scope="col">Email</th>
                        <th scope="col">Estado</th>
                        <th scope="col">Cidade</th>
                        <th scope="col">Endereco</th>
                        <th scope="col">Data do Evento</th>
                        <th scope="col">Fato</th>
                        <th scope="col">Pedido</th>
                        <th scope="col">Estado Ocorrencia</th>
                        <th scope="col">Cidade Ocorrencia</th>
                        <th scope="col">Ver</th>
                     </tr>
                  </thead>
                  <tbody>
                     {listCadastroUnicoPeticaoData.length > 0 && listCadastroUnicoPeticaoData.map((e: any, i: any) =>
                        <tr key={i}>
                           <td>{e.idCadastroUnicoPeticao}</td>
                           <td>{e.nome}</td>
                           <td>{e.cpf}</td>
                           <td>{e.apelido}</td>
                           <td>{e.sexo}</td>
                           <td>{e.telefone}</td>
                           <td>{e.email}</td>
                           <td>{e.estado}</td>
                           <td>{e.cidade}</td>
                           <td>{e.endereco}</td>
                           <td>{e.dataEvento}</td>
                           <td>{e.fato}</td>
                           <td>{e.pedido}</td>
                           <td>{e.estadoOcorrencia}</td>
                           <td>{e.cidadeOcorrencia}</td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </CardContent>
         </Card>
      </div>
   )
}
