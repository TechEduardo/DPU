import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { Button, Card, CardContent, SelectChangeEvent } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Head from '../../helper/Head';
import { dataBr } from '../../util/mascaras';
import Loading from '../../components/Loading/Loading';
import ModalAlert from '../../components/ModalAlert/ModalAlert';
import denunciaGarimpoService from './service/denunciaGarimpo.service';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import styles from './ListDenunciaGarimpo.module.css';
import { useForm } from 'react-hook-form';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const theme = createTheme({
   palette: {
      secondary: {
         main: '#053616',
      },
   },
});

const ITEM_HEIGHT = 80;

export default function ListDenunciaGarimpo() {
   const { register, handleSubmit, watch, setValue, clearErrors, setError, formState: { errors } } = useForm();
   const navigate = useNavigate();
   const [loading, setLoading] = useState(false);
   const [height, setHeight] = useState<Number>();
   const [openModal, setOpenModal] = useState(false);
   const [filterStatus, setFilterStatus] = useState(1);
   const [statusDenuncia, setStatusDenuncia] = useState([] as any);
   const [listDenunciaGarimpo, setListDenunciaGarimpo] = useState([] as any);

   const [estadosList, setEstadosList] = useState([] as any);
   const [estado, setEstado] = useState('');
   const [cidadesList, setCidadesList] = useState([] as any);
   const [cidade, setCidade] = useState('');

   const [estadoEscolhido, setEstadoEscolhido] = useState('');
   const [cidadeEscolhida, setCidadeEscolhida] = useState('');

   const [listTodosStatusDenuncia, setListTodosStatusDenuncia] = useState([] as any);

   const [anchorElEstado, setAnchorElEstado] = React.useState<null | HTMLElement>(null);
   const openEstado = Boolean(anchorElEstado);
   const handleClickEstado = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorElEstado(event.currentTarget);
   };

   const handleCloseEstado = () => {
      setAnchorElEstado(null);
   };

   const [anchorElCidade, setAnchorElCidade] = React.useState<null | HTMLElement>(null);
   const openCidade = Boolean(anchorElCidade);
   const handleClickCidade = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorElCidade(event.currentTarget);
   };

   const handleCloseCidade = () => {
      setAnchorElCidade(null);
   };

   const [anchorElStatus, setAnchorElStatus] = React.useState<null | HTMLElement>(null);
   const openStatus = Boolean(anchorElStatus);
   const handleClickStatus = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorElStatus(event.currentTarget);
   };

   const handleCloseStatus = () => {
      setAnchorElStatus(null);
   };

   useEffect(() => {
      listStatusDenuncia();
      listTodosStatusDenuncias();
   }, []);

   useEffect(() => {
      setLoading(true);
      listDenunciaGarimpos(filterStatus);
   }, [filterStatus]);

   useEffect(() => {
      fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
         .then((response) => response.json())
         .then((data) => setEstadosList(data));
   }, []);

   useEffect(() => {
      if (!!estado)
         fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios?orderBy=nome`)
            .then((response) => response.json())
            .then((data) => setCidadesList(data));

   }, [estado, listDenunciaGarimpo]);

   const listStatusDenuncia = async () => {
      const resp = await denunciaGarimpoService.listStatusDenuncia();
      setStatusDenuncia(resp);
   }

   const listTodosStatusDenuncias = async () => {
      const resp = await denunciaGarimpoService.listTodosStatusDenuncias();
      setListTodosStatusDenuncia(resp);
   }

   const listDenunciaGarimpos = async (idStatus: any) => {
      const resp = await denunciaGarimpoService.listDenunciaGarimpo(idStatus);
      setTimeout(() => {
         setListDenunciaGarimpo(resp);
         setLoading(false);
      }, 700)
   };

   const handleStatusChange = (event: React.SyntheticEvent, status: number) => {
      setFilterStatus(status);
   };

   const handleChangeEstado = async (event: SelectChangeEvent) => {
      handleCloseEstado();
      setLoading(true);

      let estado = '';

      setEstado(event.target.value);

      estadosList.forEach((e: any) => {
         if (e.id === event.target.value) {
            estado = e.nome;
            setEstadoEscolhido(e.nome);
         }
      });

      const resp = await denunciaGarimpoService.filtroEstadoCidade(filterStatus, estado, '');
      setListDenunciaGarimpo(resp);
      setLoading(false);
   };

   const handleChangeCidade = async (event: SelectChangeEvent) => {
      handleCloseCidade();
      setLoading(true);

      let cidade = ''

      setCidade(event.target.value);
      cidadesList.forEach((e: any) => {
         if (e.id === event.target.value) {
            cidade = e.nome
            setCidadeEscolhida(e.nome);
         }
      });

      const resp = await denunciaGarimpoService.filtroEstadoCidade(filterStatus, estadoEscolhido, cidade);
      setListDenunciaGarimpo(resp);
      setLoading(false);

   };

   const handleLimpaFiltroEstadoCidade = async () => {
      handleCloseEstado();
      setLoading(true);
      setEstado('');
      setCidadesList([])

      const resp = await denunciaGarimpoService.listDenunciaGarimpo(filterStatus);
      setListDenunciaGarimpo(resp);

      setLoading(false);
   }
   const handleLimpaStatus = async() =>{
      handleCloseStatus();
      setLoading(true);

      const resp = await denunciaGarimpoService.listDenunciaGarimpo(filterStatus);
      setListDenunciaGarimpo(resp);

      setLoading(false);
   }

   const handleChangeStatus = async (event: SelectChangeEvent) => {
      handleCloseStatus();
      setLoading(true);
      
      
      console.log("event:", event.target.value);
      const resp = await denunciaGarimpoService.getStatusDenunciaById(filterStatus, event.target.value);
      console.log("resp:", resp);
      setListDenunciaGarimpo(resp);
      setLoading(false);

   }

   const Estados = () => {
      return (
         <Menu
            id="long-menu"
            MenuListProps={{
               'aria-labelledby': 'long-button',
            }}
            anchorEl={anchorElEstado}
            open={openEstado}
            onClose={handleCloseEstado}
            PaperProps={{
               style: {
                  maxHeight: ITEM_HEIGHT * 4.5,
                  width: '20ch',
               },
            }}
         >
            <MenuItem value={0} onClick={handleLimpaFiltroEstadoCidade}>Todos</MenuItem>
            {(!!estadosList) ?
               estadosList.map((option: any, i: any) => (
                  <MenuItem value={option.id} key={i} onClick={(e: any) => handleChangeEstado(e)}>{option.nome}</MenuItem>
               )) : <MenuItem value={0}>Nada a ser exibido</MenuItem>
            }
         </Menu>
      )
   }

   const Cidades = () => {
      return (
         <Menu
            id="long-menu"
            MenuListProps={{
               'aria-labelledby': 'long-button',
            }}
            anchorEl={anchorElCidade}
            open={openCidade}
            onClose={handleCloseCidade}
            PaperProps={{
               style: {
                  maxHeight: ITEM_HEIGHT * 4.5,
                  width: '20ch',
               },
            }}
         >
            {(!!cidadesList && cidadesList.length > 0) ?
               cidadesList.map((option: any, i: any) => (
                  <MenuItem value={option.id} key={i} onClick={(e: any) => handleChangeCidade(e)}>{option.nome}</MenuItem>
               )) : <MenuItem value={0} onClick={handleCloseCidade}>Escolha um estado</MenuItem>
            }
         </Menu>
      )
   }

   const Status = () => {
      return (
         <Menu
            id="long-menu"
            MenuListProps={{
               'aria-labelledby': 'long-button',
            }}
            anchorEl={anchorElStatus}
            open={openStatus}
            onClose={handleCloseStatus}
            PaperProps={{
               style: {
                  maxHeight: ITEM_HEIGHT * 4.5,
                  width: '40ch',
               },
            }}
         >
            <MenuItem value={0} onClick={handleLimpaStatus}>Todos</MenuItem>
            {(!!listTodosStatusDenuncia && listTodosStatusDenuncia.length > 0) &&
               listTodosStatusDenuncia.map((option: any, i: any) => (
                  <MenuItem value={option.id} key={i} onClick={(e: any) => handleChangeStatus(e)}>{option.name}</MenuItem>
               ))
            }
         </Menu>
      )
   }

   return (
      <section className={`animeRight container-internal ${styles.listDenunciaSection}`}>
         <Head title=" | Listagem Denúncias" />
         <Card>
            <CardContent>
               <div className={styles.cardContent}>
                  <h3 className="section-title">Listagem Denúncias de Garimpo Ilegal</h3>

                  <div className={styles.tab}>
                     <ThemeProvider theme={theme}>
                        <Box sx={{ width: '100%' }}>
                           <Tabs
                              value={filterStatus}
                              onChange={handleStatusChange}
                              textColor="secondary"
                              indicatorColor="secondary"
                              aria-label="secondary tabs example"
                           >
                              {statusDenuncia.length > 0 &&
                                 statusDenuncia.map((status: any, index: any) => (
                                    <Tab key={index} value={status.id} label={status.name} />
                                 ))
                              }
                           </Tabs>
                        </Box>
                     </ThemeProvider>
                  </div>

                  <table className={`table table-bordered ${styles.tableDenuncias}`} border={1}>
                     <thead>
                        <tr>
                           <th scope="col">N° Registro</th>
                           <th scope="col">Objeto da denúncia</th>
                           <th scope="col">
                              Estado
                              <IconButton onClick={handleClickEstado}>
                                 <FilterAltIcon />
                              </IconButton>
                              <Estados />
                           </th>
                           <th scope="col">Cidade
                              <IconButton onClick={handleClickCidade}>
                                 <FilterAltIcon />
                              </IconButton>
                              <Cidades />
                           </th>
                           <th scope="col">Data da ocorrência</th>
                           <th scope="col">Status
                              <IconButton onClick={handleClickStatus}>
                                 <FilterAltIcon />
                              </IconButton>
                              <Status />
                           </th>
                           <th scope="col">Visualizar</th>
                        </tr>
                     </thead>
                     <tbody>
                        {loading ?
                           <tr>
                              <td colSpan={6} className={styles.noResults}>
                                 <Loading isLoading={loading} />
                              </td>
                              <td style={{ display: 'none' }}>
                              </td>
                           </tr>
                           :
                           (listDenunciaGarimpo.length > 0 ?
                              listDenunciaGarimpo.map((e: any, i: any) =>
                              (
                                 (e.status.status_denuncia_id == filterStatus || filterStatus == 4) &&
                                 <tr key={i}>
                                    <td>{e.registroDenuncia}</td>
                                    <td>{e.objetoDenuncia}</td>
                                    <td>{e.estado}</td>
                                    <td>{e.cidade}</td>
                                    <td>{dataBr(e.dataOcorrencia)}</td>
                                    <td>{e.status.status_acompanhamento_name}</td>
                                    <td>
                                       <span title="Visualizar denúncia">
                                          <Button onClick={() => navigate('/ver-denuncia-garimpo/' + e.idDenunciaGarimpo)}><VisibilityIcon /></Button>
                                       </span>
                                    </td>
                                 </tr>
                              )
                              )
                              :
                              <tr>
                                 <td colSpan={6} className={styles.noResults}>
                                    <p>Não há denúncias registradas nos sistema.</p>
                                 </td>
                                 <td style={{ display: 'none' }}>
                                 </td>
                              </tr>
                           )
                        }
                     </tbody>
                  </table>
               </div>
            </CardContent>
         </Card>

         <ModalAlert
            isOpen={openModal}
            setOpenModal={setOpenModal}
            title="Alterar status denúncia"
            body={<span>
               Status: Em análise
            </span>}
         />
      </section>
   )
}
