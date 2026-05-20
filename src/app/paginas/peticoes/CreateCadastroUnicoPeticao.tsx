import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import ModalAlert from '../../components/ModalAlert/ModalAlert';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField'
import FormLabel from '@mui/material/FormLabel';
import { Card, CardContent, IconButton, Typography } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Link, useNavigate } from 'react-router-dom';
import styles from './CreateCadastroUnicoPeticao.module.css';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { styled } from '@mui/material/styles';
import {telefoneMascara, telefoneSemMascara, cpfMascara, cpfSemMascara} from '../../util/mascaras';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Head from '../../helper/Head';
import cadastroUnicoPeticao from './service/cadastroUnicoPeticao.service';

export default function CreateCadastroUnicoPeticao() {
   const { register, handleSubmit, watch, setValue, clearErrors, setError, formState: { errors } } = useForm();

   const [openModal, setOpenModal] = useState(false);
   const [estadoList, setEstadoList] = useState([] as any);
   const [estado, setEstado] = useState('');
   const [cidadeList, setCidadeList] = useState([] as any);
   const [cidade, setCidade] = useState('');

   const [estadoOcorrenciaList, setEstadoOcorrenciaList] = useState([] as any);
   const [estadoOcorrencia, setEstadoOcorrencia] = useState('');
   const [cidadeOcorrenciaList, setCidadeOcorrenciaList] = useState([] as any);
   const [cidadeOcorrencia, setCidadeOcorrencia] = useState('');

   const navigate = useNavigate();
   
   useEffect(() => {
      fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then((response) => response.json())
      .then((data) => setEstadoList(data));
   }, []);
   
   useEffect(() => {
      if (!!estado){
         fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios?orderBy=nome`)
         .then((response) => response.json())
         .then((data) => setCidadeList(data));
      }
   }, [estado]);
   
   useEffect(() => {
      fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then((response) => response.json())
      .then((data) => setEstadoOcorrenciaList(data));
   }, []);
   
   useEffect(() => {
      if (!!estadoOcorrencia){
         fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoOcorrencia}/municipios?orderBy=nome`)
         .then((response) => response.json())
         .then((data) => setCidadeOcorrenciaList(data));
      }
   }, [estadoOcorrencia]);

   const handleChangeEstado = (event: SelectChangeEvent) => {
      clearErrors('estado');
      setEstado(event.target.value);
      
      estadoList.forEach((e: any) => {
         if (e.id === event.target.value)
         setValue('estado', e.nome);
      });
   };
   
   const handleChangeCidade = (event: SelectChangeEvent) => {
      clearErrors('cidade');
      setCidade(event.target.value);
      
      cidadeList.forEach((e: any) => {
         if (e.id === event.target.value)
         setValue('cidade', e.nome);
      });
   };
   
   const handleChangeEstadoOcorrencia = (event: SelectChangeEvent) => {
      clearErrors('estadoOcorrencia');
      setEstadoOcorrencia(event.target.value);
      
      estadoOcorrenciaList.forEach((e: any) => {
         if (e.id === event.target.value)
         setValue('estadoOcorrencia', e.nome);
      });
   };
   
   const handleChangeCidadeOcorrencia = (event: SelectChangeEvent) => {
      clearErrors('cidadeOcorrencia');
      setCidadeOcorrencia(event.target.value);
      
      cidadeOcorrenciaList.forEach((e: any) => {
         if (e.id === event.target.value)
         setValue('cidadeOcorrencia', e.nome);
      });
   };

   const handleCpfMascara = (e: any) => {
      setValue('cpf', cpfMascara(e.target.value))
     
   }
   
   const onSubmit = async (data: any) => {
      data.telefone = telefoneSemMascara(data.telefone)
      data.cpf = cpfSemMascara(data.cpf)

      const resp = await cadastroUnicoPeticao.createCadastroUnicoPeticao(data);
      if(!!resp){
         setOpenModal(true)
      }

      
   }

   const handleTelefoneMascara = (e: any) => {
      setValue(e.target.name, telefoneMascara(e.target.value));
   }
   
   return (
      <section className="background-section background-full">
         <Head title=" | Abrir petição" />
         <div className={`animeRight container ${styles.denunciaGarimpo}`}>
            <div className={styles.sectionTitle}>
               <h1 className={styles.title}>Realizar Cadastro Único de Petições</h1>
               <h2 className={styles.subtitle}></h2>
            </div>
            <div className={styles.formContainer}>
            <Card>
               <CardContent>
                  <Typography>
                     <span className={styles.formDescription}>
                        Informações básicas do requerente
                     </span>
                  </Typography>
                  <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                     <div className={styles.grid}>
                     <TextField
                        {...register('nome', { required: false })}
                        label="Nome Completo"
                        variant="outlined"
                        type='text'
                        error={errors.nome ? true : false}
                        //helperText={errors.nomeRequerente && 'Campo Nome esta vazio!'}
                     />
                     <TextField
                        {...register('cpf', { required: false })}
                        label="CPF"
                        variant="outlined"
                        type='text'
                        // value={cpf}
                        onChange={handleCpfMascara}
                        // onChange={(e: any) => setValue('cpf', cpfMascara(e.target.value))}
                        error={errors.cpf ? true : false}
                        //helperText={errors.cpf && 'Campo CPF esta vazio!'}
                     />
                     </div>

                     <div className={styles.grid}>
                     <TextField
                        {...register('apelido', { required: false })}
                        label="Apelido"
                        variant="outlined"
                        type='text'
                        error={errors.apelido ? true : false}
                        //helperText={errors.telefoneRequerente && 'Campo Telefone está vazio!'}
                     />
                     <FormControl >
                        <InputLabel>Sexo</InputLabel>
                        <input {...register('sexo', { required: false })} hidden />
                        <Select
                           // value={sexo}
                           label='Sexo'
                           // onChange={handleSexo}
                           // onChange={(e: any) => setSexo(e.target.value), (e: any) => setValue('sexo', e.target.value)}
                           onChange={(e: any) => setValue('sexo', e.target.value)}
                           MenuProps={{ PaperProps: { sx: { maxHeight: 450 } } }}
                        >
                           <MenuItem value="Homem">Homem</MenuItem>
                           <MenuItem value="Mulher">Mulher</MenuItem>
                           <MenuItem value="Outros">Outros</MenuItem>
                        </Select>
                        </FormControl>
                     </div>

                     <div className={styles.grid}>
                     <TextField
                        {...register('telefone', { required: false })}
                        label="Telefone"
                        variant="outlined"
                        type='text'
                        onChange={handleTelefoneMascara}
                        error={errors.telefone ? true : false}
                        //helperText={errors.telefoneRequerente && 'Campo Telefone está vazio!'}
                     />
                     <TextField
                        {...register('email', { required: false })}
                        label="E-mail"
                        variant="outlined"
                        type='text'
                        error={errors.email ? true : false}
                        //helperText={errors.emailRequerente && 'Campo E-mail esta vazio!'}
                     />
                     </div>

                     <div className={styles.grid}>
                     <FormControl error={errors.estado ? true : false}>
                              <InputLabel>Estado</InputLabel>
                              <input {...register('estado', { required: false })} hidden />
                              <Select
                                 value={estado}
                                 label='Estado'
                                 onChange={handleChangeEstado}
                                 MenuProps={{ PaperProps: { sx: { maxHeight: 450 } } }}
                              >
                                 {!!estadoList ?
                                    estadoList.map((option: any, i: any) =>
                                       <MenuItem value={option.id} key={i} >{option.nome}</MenuItem>
                                    )
                                    :
                                    <MenuItem value={0}>Nada a ser exibido</MenuItem>
                                 }
                              </Select>
                              {/* {errors.estado &&
                                 <FormHelperText>{errors.estado.message?.toString()}</FormHelperText>
                              } */}
                           </FormControl>
                        <FormControl>
                              <InputLabel>Cidade</InputLabel>
                              <input {...register('cidade', { required: false })} hidden />
                              <Select
                              value={cidade}
                              label='Cidade'
                              onChange={handleChangeCidade}
                              MenuProps={{ PaperProps: { sx: { maxHeight: 450 } } }}
                              >
                                 {!!cidadeList ?
                                    cidadeList.map((option: any, i: any) =>
                                       <MenuItem value={option.id} key={i}>{option.nome}</MenuItem>
                                    )
                                    :
                                    <MenuItem value={0}>Nada a ser exibido</MenuItem>
                                 }
                              </Select>
                        </FormControl>
                     </div>

                     <div className={styles.grid}>
                     <TextField
                        {...register('endereco', { required: false })}
                        label="Endereço"
                        variant="outlined"
                        type='text'
                        error={errors.endereco ? true : false}
                        //helperText={errors.cepRequerente && 'Campo Endereço está vazio!'}
                     />                     
                     </div>
                     <Typography>
                     <span className={styles.formDescription}>
                        Descrição dos fatos e aplicação do seu pedido
                     </span>
                     </Typography>

                     <div className={styles.grid}>
                        <TextField
                           {...register('dataEvento', { required: false })}
                           label="Data dos eventos"
                           type="date"
                           InputLabelProps={{ shrink: true }}
                           error={errors.dataEvento ? true : false}
                           //helperText={errors.dataEvento && 'Campo de Data dos eventos está vazio!'}
                        />
                     </div>
                     <div>
                        <TextField
                           {...register('fato', { required: false })}
                           label="Descreva resumidamente os fatos"
                           placeholder="O texto deve ser claro e curto. Se requerer a designação de defensor público, deverá indicar o arquivamento do processo (CUI ou SPOA) composto por 21 a 23 dígitos, o nome do arguido ou arguido. Não insira aspas duplas ou simples."
                           variant="outlined"
                           type='text'
                           multiline rows={7}
                           error={errors.fato ? true : false}
                           //helperText={errors.situacaoDescrita && 'Campo de Descreva resumidamente os fatos está vazio!'}
                        />
                     </div>
                     <div>
                        <TextField
                           {...register('pedido', { required: false })}
                           label="Descreva resumidamente o que você está solicitando."
                           placeholder="O texto deve ser claro e curto. Não insira aspas duplas ou simples."
                           variant="outlined"
                           type='text'
                           multiline rows={7}
                           error={errors.pedido ? true : false}
                           //helperText={errors.solicitacaoDescrita && 'Campo de Descreva resumidamente o que você está solicitando está vazio!'}
                        />
                     </div>
                     <div className={styles.grid}>
                        <FormControl >
                              <InputLabel>Estado da ocorrencia</InputLabel>
                              <input {...register('estadoOcorrencia', { required: false })} hidden />
                              <Select
                                 value={estadoOcorrencia}
                                 label='Estado da ocorrencia'
                                 onChange={handleChangeEstadoOcorrencia}
                                 MenuProps={{ PaperProps: { sx: { maxHeight: 450 } } }}
                              >
                                 {!!estadoOcorrenciaList ?
                                    estadoOcorrenciaList.map((option: any, i: any) =>
                                       <MenuItem value={option.id} key={i} >{option.nome}</MenuItem>
                                    )
                                    :
                                    <MenuItem value={0}>Nada a ser exibido</MenuItem>
                                 }
                              </Select>
                        </FormControl>
                        <FormControl>
                              <InputLabel>Cidade da ocorrencia</InputLabel>
                              <input {...register('cidadeOcorrencia', { required: false })} hidden />
                              <Select
                              value={cidadeOcorrencia}
                              label='Cidade da ocorrencia'
                              onChange={handleChangeCidadeOcorrencia}
                              MenuProps={{ PaperProps: { sx: { maxHeight: 450 } } }}
                              >
                                 {!!cidadeOcorrenciaList ?
                                    cidadeOcorrenciaList.map((option: any, i: any) =>
                                       <MenuItem value={option.id} key={i}>{option.nome}</MenuItem>
                                    )
                                    :
                                    <MenuItem value={0}>Nada a ser exibido</MenuItem>
                                 }
                              </Select>
                        </FormControl>
                     </div>

                     <div className={styles.formButton}>
                        <Button onClick={() => navigate(-1)}>
                           <ArrowBackIcon sx={{ fontSize: 30 }} />
                        </Button>
                        <Button variant="contained" type='submit'>
                           Abrir petição
                        </Button>
                     </div>
                     
                  </form>
               </CardContent>
            </Card>
            </div>         
         </div>
         <ModalAlert isOpen={openModal} setOpenModal={setOpenModal} title="Denúncia registrada!" /* body="Acompanhe pelo protocolo: 123456" */ />
      </section>
   )  
}
