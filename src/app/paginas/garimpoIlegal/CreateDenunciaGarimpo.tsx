import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styles from './CreateDenunciaGarimpo.module.css';
import ModalAlert from '../../components/ModalAlert/ModalAlert';
import {
   Button,
   Card,
   CardContent,
   Checkbox,
   FormControl,
   FormControlLabel,
   FormHelperText,
   FormLabel,
   IconButton,
   InputLabel,
   MenuItem,
   Radio,
   RadioGroup,
   Select,
   SelectChangeEvent,
   TextField,
   Tooltip,
   Typography,
} from '@mui/material/';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { telefoneMascara, telefoneSemMascara } from '../../util/mascaras';
import denunciaGarimpoService from './service/denunciaGarimpo.service';
import Head from '../../helper/Head';
import copy from "copy-to-clipboard";
import Toast from '../../components/Toast/Toast';
import { ClipboardText } from "@phosphor-icons/react";
import { env } from '../../../env/env';

const urlBack: string = (env.baseURL as string);

export default function CreateDenunciaGarimpo() {

   const { register, handleSubmit, watch, setValue, clearErrors, setError, formState: { errors } } = useForm();
   const [openModal, setOpenModal] = useState(false);
   const [estadosList, setEstadosList] = useState([] as any);
   const [estado, setEstado] = useState('');
   const [cidadesList, setCidadesList] = useState([] as any);
   const [cidade, setCidade] = useState('');
   const [selectedImages, setSelectedImages] = useState<any[]>([]);
   const [registroDenuncia, setRegistroDenuncia] = useState('');
   const [errorMsg, setErrorMsg] = useState(false);
   const [isToast, setIsToast] = useState(false);
   const [toastMessage, setToastMessage] = useState('');
   const [toastIcon, setToastIcon] = useState('');
   const [isDisabled, setIsDisabled] = useState(false);
   const [atividadeGarimpoList, setAtividadeGarimpoList] = useState([] as any);
   const [atividadeGarimpoOutros, setAtividadeGarimpoOutros] = useState(false);
   const [anonimo, setAnonimo] = useState(1);

   const anoAtual = new Date().getFullYear();

   const navigate = useNavigate();

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
   }, [estado]);

   useEffect(() => {
      const images = selectedImages;

      images.map(file => {
         if (file.sizeInMb > 5) {
            setErrorMsg(true);
         }
         else {
            setErrorMsg(false);
         }
      });

      if (!images.length) {
         setErrorMsg(false);
      }
      else if (images.length === 5) {
         setIsDisabled(true);
      }
      else if (images.length > 5) {
         setSelectedImages([]);
         setToastMessage('O número máximo de arquivos é 5!');
         setToastIcon('error');
         setIsToast(true);
         setTimeout(() => {
            setIsToast(false);
         }, 100)
      }
      else {
         setIsDisabled(false);
      }
   }, [selectedImages]);

   const handleChangeEstado = (event: SelectChangeEvent) => {
      clearErrors('estado');

      setEstado(event.target.value);

      estadosList.forEach((e: any) => {
         if (e.id === event.target.value)
            setValue('estado', e.nome);
      });
   };

   const handleChangeCidade = (event: SelectChangeEvent) => {
      clearErrors('cidade');

      setCidade(event.target.value);
      cidadesList.forEach((e: any) => {
         if (e.id === event.target.value)
            setValue('cidade', e.nome);
      });
   };

   const onSubmit = async (data: any) => {

      if (!data.atividadeGarimpo) data.atividadeGarimpo = [];

      if (errorMsg)
         return;

      data.telefoneDenunciante = telefoneSemMascara(data.telefoneDenunciante);

      const resp = await denunciaGarimpoService.createDenunciaGarimpo(data);

      if (resp.registroDenuncia) {
         setRegistroDenuncia(resp.registroDenuncia);

         const formData = new FormData();
         formData.append('pathFotosDenuncia', resp.registroDenuncia.replace('/', '-'));

         for (let i = 0; i < selectedImages.length; i++) {
            formData.append(`image[${i}]`, selectedImages[i]);
         }

         const res = await fetch(urlBack + `uploadFiles`, {
            method: "POST",
            body: formData,
         });

         setOpenModal(true);
      }
      else if (resp.error.erro) {
         resp.error.data.forEach((e: any) => {
            setError(e.label, { message: e.erro });
         });
      }
   }

   const handleTelefoneMascara = (e: any) => {
      setValue(e.target.name, telefoneMascara(e.target.value));
   }

   const copyToClipboard = (e: any) => {
      copy(registroDenuncia);
      setToastMessage('Numero do registro da denuncia copiado!');
      setToastIcon('success');
      setIsToast(true)

      setTimeout(() => {
         setIsToast(false)
      }, 3000)
   }


   function saveSelectedImages(e: any) {
      const files = e.target.files;
      const filesValidate = [...files];

      filesValidate.map(file => {
         file.sizeInMb = file.size / 1000000;
      });

      setSelectedImages([...selectedImages, ...files]);
   }

   function removeSelectedImage(index: any) {
      const arrayImages = selectedImages;

      arrayImages.splice(index, 1);
      setSelectedImages([...arrayImages]);
   }

   useEffect(() => {
      (async () => {
         const data = await denunciaGarimpoService.getAtividadeGarimpo();
         setAtividadeGarimpoList(data);
      })()
   }, []);

   const handleCheckBox = (e: any) => {
      const nome = e.target.value.split(',');

      if (nome[1] === 'Outros' && e.target.checked) {
         setAtividadeGarimpoOutros(true)
      }
      else if (nome[1] === 'Outros' && !e.target.checked) {
         setAtividadeGarimpoOutros(false)
         setValue('atividadeGarimpoOutros', '');
      }
      clearErrors('atividadeGarimpo');
   }

   const handleAnonimo = (e:any) => {
      setAnonimo(parseInt(e.target.value));
      setValue('anonimo', e.target.value);
   }

   const handleVerificaData = (e: any) =>{
      const dataAnoInserida = e.target.value.split('-')[0];

      if(dataAnoInserida < anoAtual){
          setError('dataOcorrencia', { message: 'Insira uma data deste ano!' });
          setValue('dataOcorrencia', '');
      }else{
        clearErrors('dataOcorrencia')
      }
   }

   const textoAjuda = `
   Reúna o maior número de informações relevantes que puder, registrando;<br/>
   &#8226; Se a área explorada está sendo desmatada;<br/>
   &#8226; Se há despejo de rejeitos da exploração garimpeira em cursos d’água (rio, igarapé, lagoa, etc.);<br/>
   &#8226; Se há uso de maquinário (escavadeiras, bomba de sucção, barcas e/ou dragas, etc.);<br/>
   &#8226; Qual a infraestrutura próxima aos garimpos (barracões, maquinário, pista de pouso, etc.);<br/>
   &#8226; Se há conivência dos órgãos fiscalizadores, número de pessoas envolvidas na atividade, etc.);<br/>
   &#8226; Se foi/foram realizada/s denúncia/s a outros órgãos de fiscalização (Ministério Público Federal; Polícia Federal,
           IBAMA, ICMBio, Agência Nacional de Mineração, Secretaria de Meio Ambiente, etc.);<br/>
   &#8226; Número aproximado de pessoas envolvidas na garimpo denunciado; etc.<br/>
      `;

   const textoRegistroDenuncia = `
      Anote o registro da denúncia para poder fazer o acompanhamento: <b>${registroDenuncia}</b> 
   `;

   return (
      <section className="background-section background-full">
         <Toast open={isToast} icon={toastIcon} mensagem={toastMessage} timer={3000} />

         <Head title=" | Realizar denúncia" />
         <div className={`animeRight container`}>
            <div className={styles.sectionTitle}>
               <h1 className={styles.title}>Realizar denúncia</h1>
               <h2 className={styles.subtitle}></h2>
            </div>
            <div className={styles.formContainer}>
               <Card>
                  <CardContent>
                     <Typography>
                        <span className={styles.formDescription}>
                           Formulário de preenchimento de denúncia de Garimpo
                        </span>
                     </Typography>
                     <form onSubmit={handleSubmit(onSubmit)} className={styles.form} encType='multipart/form-data'>
                        <div>
                           <TextField
                              {...register('objetoDenuncia', { required: false })}
                              className='mb-2 w-100'
                              label="Objeto da denúncia (*)"
                              variant="outlined"
                              type='text'
                              autoComplete='off'
                              error={errors.objetoDenuncia ? true : false}
                              helperText={errors.objetoDenuncia && errors.objetoDenuncia.message?.toString()}
                           />
                        </div>
                        <div className={styles.grid}>
                           <FormControl error={errors.estado ? true : false} >
                              <InputLabel>Estado</InputLabel>
                              <input {...register('estado', { required: false })} hidden />
                              <Select
                                 value={estado}
                                 label='Estado (*)'
                                 onChange={handleChangeEstado}
                                 MenuProps={{ PaperProps: { sx: { maxHeight: 450 } } }}
                              >
                                 {!!estadosList ?
                                    estadosList.map((option: any, i: any) =>
                                       <MenuItem value={option.id} key={i} >{option.nome}</MenuItem>
                                    )
                                    :
                                    <MenuItem value={0}>Nada a ser exibido</MenuItem>
                                 }
                              </Select>
                              {errors.estado &&
                                 <FormHelperText>{errors.estado.message?.toString()}</FormHelperText>
                              }
                           </FormControl>
                           <FormControl error={errors.cidade ? true : false}>
                              <InputLabel>Cidade</InputLabel>
                              <input {...register('cidade', { required: false })} hidden />
                              <Select
                                 value={cidade}
                                 label='Cidade (*)'
                                 onChange={handleChangeCidade}
                                 MenuProps={{ PaperProps: { sx: { maxHeight: 450 } } }}
                              >
                                 {!!cidadesList ?
                                    cidadesList.map((option: any, i: any) =>
                                       <MenuItem value={option.id} key={i}>{option.nome}</MenuItem>
                                    )
                                    :
                                    <MenuItem value={0}>Nada a ser exibido</MenuItem>
                                 }
                              </Select>
                              {errors.cidade &&
                                 <FormHelperText>{errors.cidade.message?.toString()}</FormHelperText>
                              }
                           </FormControl>
                        </div>
                        <div>
                           <TextField
                              className='mb-2 w-50'
                              {...register('dataOcorrencia', { required: false })}
                              label="Data da ocorrência (*)"
                              type="date"
                              onBlur={handleVerificaData}
                              InputLabelProps={{ shrink: true }}
                              inputProps={{min: `${anoAtual}-01-01`, max: '9999-12-31'}}
                              error={errors.dataOcorrencia ? true : false}
                              helperText={errors.dataOcorrencia && errors.dataOcorrencia.message?.toString()}
                           />
                        </div>
                        <div>
                           <FormControl error={errors.atividadeGarimpo ? true : false}>
                              <FormLabel>
                                 Atividade de garimpo ilegal denunciada está ocorrendo no interior ou próximo a (*):
                              </FormLabel>

                              <div className='col'>
                                 {atividadeGarimpoList.length > 0 &&
                                    <>
                                       {atividadeGarimpoList.map((e: any, i: any) => (
                                          <div key={i}>
                                             <FormControlLabel
                                                {...register(`atividadeGarimpo`, { required: false })}
                                                control={<Checkbox
                                                   style={{ color: errors.atividadeGarimpo ? 'red' : '' }}
                                                   value={[e.idAtividadeGarimpo, e.atividade]}
                                                   onChange={handleCheckBox}
                                                />}
                                                label={''}
                                             />
                                             {<span style={{ color: errors.atividadeGarimpo ? 'red' : '' }}>
                                                {e.atividade}
                                             </span>
                                             }
                                          </div>
                                       ))}

                                       {(atividadeGarimpoOutros) &&
                                          <TextField
                                             {...register('atividadeGarimpoOutros', { required: true })}
                                             label="Outros (*)"
                                             variant="outlined"
                                             type='text'
                                             error={errors.atividadeGarimpoOutros ? true : false}
                                             helperText={errors.atividadeGarimpoOutros && "Campo de outros esta vazio!"}
                                          />
                                       }
                                       {errors.atividadeGarimpo &&
                                          <FormHelperText>{errors.atividadeGarimpo.message?.toString()}</FormHelperText>
                                       }
                                    </>
                                 }
                              </div>
                           </FormControl>

                        </div>

                        <div>
                           <div>
                              Descreva a situação  (*)
                              <Tooltip title={<> <span dangerouslySetInnerHTML={{ __html: textoAjuda }}></span> </>} placement="top">
                                 <IconButton>
                                    <HelpOutlineIcon />
                                 </IconButton>
                              </Tooltip>
                           </div>

                           <TextField
                              {...register('situacaoDescrita', { required: false })}
                              label="Descreva a situação detalhadamente"
                              variant="outlined"
                              type='text'
                              autoComplete='off'
                              multiline rows={10}
                              error={errors.situacaoDescrita ? true : false}
                              helperText={errors.situacaoDescrita && errors.situacaoDescrita.message?.toString()}
                           />

                        </div>
                        <div>
                           <TextField
                              {...register('coordenadas', { required: false })}
                              label="Coordenadas geográficas ou link de localização"
                              variant="outlined"
                              type='text'
                              autoComplete='off'
                              error={errors.coordenadas ? true : false}
                           />
                        </div>
                        <div>
                           <TextField
                              {...register('contatoEnvolvido', { required: false })}
                              label="Nome(s) e Contato(s) da(s) pessoa(s) ou empresa(s) envolvida(s)"
                              variant="outlined"
                              type='text'
                              autoComplete='off'
                              error={errors.contatoEnvolvido ? true : false}
                           />
                        </div>
                        <div>
                           <FormControl error={errors.atividadeDenunciada ? true : false}>
                              <FormLabel >
                                 Deseja se indentificar?
                              </FormLabel>
                              <input {...register('anonimo', { required: false})} hidden defaultValue={anonimo} />
                              <RadioGroup
                                 value={anonimo}
                                 onChange={handleAnonimo}
                              >
                                 <FormControlLabel value={0} control={<Radio />} label="Sim" />
                                 <FormControlLabel value={1} control={<Radio />} label="Não" />
                              </RadioGroup>
                           </FormControl>
                        </div>
                        {anonimo === 0  &&
                           <>
                              <div className={styles.grid}>
                                 <TextField
                                    {...register('nomeDenunciante', { required: false })}
                                    label="Nome"
                                    variant="outlined"
                                    type='text'
                                    autoComplete='off'
                                    error={errors.nomeDenunciante ? true : false}
                                 />
                                 <TextField
                                    {...register('telefoneDenunciante', { required: false })}
                                    label="Telefone"
                                    variant="outlined"
                                    type='text'
                                    autoComplete='off'
                                    onChange={handleTelefoneMascara}
                                    error={errors.telefoneDenunciante ? true : false}
                                 />
                              </div>
                              <div>
                                 <TextField
                                    {...register('emailDenunciante', { required: false })}
                                    label="Email"
                                    variant="outlined"
                                    type='email'
                                    autoComplete='off'
                                    error={errors.emailDenunciante ? true : false}
                                 />
                              </div>
                           </>
                        }

                        <label htmlFor="imagensDenuncia" className={`${styles.selectImagesButton} ${isDisabled && styles.isDisabled}`} onChange={saveSelectedImages}>
                           Anexar arquivos
                           <input
                              name="imagensDenuncia"
                              id="imagensDenuncia"
                              type="file"
                              multiple
                              hidden

                           />
                        </label>

                        <div className={styles.selectedImagesContainer}>
                           <h3>Imagens selecionadas</h3>
                           <div className={styles.selectedImages}>
                              {selectedImages && selectedImages.map((image, index) => (
                                 <div key={index} className={styles.selectedImage}>
                                    <div>{image.name}</div>
                                    <div>
                                       {
                                          image.sizeInMb > 5 ?
                                             <span className={styles.sizeError}>{image.sizeInMb.toFixed(3)}mb (máx 5mb)</span>
                                             :
                                             <span>{image.sizeInMb.toFixed(3)}mb (máx 5mb)</span>
                                       }
                                       <span className={styles.buttonRemoveImage} onClick={() => removeSelectedImage(index)} title="Remover imagem">
                                          <RemoveCircleOutlineIcon sx={{ fontSize: 30 }} />
                                       </span>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                        {errorMsg && <p className={styles.sizeError}>Uma ou mais imagens excedem a capacidade limite permitida!</p>}

                        <hr />

                        <div className={styles.formButton}>
                           <Button onClick={() => navigate(-1)}>
                              <ArrowBackIcon sx={{ fontSize: 30 }} />
                           </Button>
                           <Button variant="contained" type='submit'>
                              Realizar denúncia
                           </Button>
                        </div>
                     </form>
                  </CardContent>
               </Card>
            </div>
         </div>

         <ModalAlert isOpen={openModal} setOpenModal={setOpenModal} title="Denúncia registrada!"
            body={<span>
               <span dangerouslySetInnerHTML={{ __html: textoRegistroDenuncia }}></span>
               <Tooltip title="Copiar texto do registro da denúncia" placement="bottom">
                  <ClipboardText size={28} color="#030303" weight="duotone" onClick={copyToClipboard} />
               </Tooltip>
            </span>}
         />

      </section>
   )
}
