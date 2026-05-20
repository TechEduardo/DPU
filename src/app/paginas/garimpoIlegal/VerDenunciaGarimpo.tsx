import { Button, Card, CardContent, Link as LinkFile, FormControl, FormControlLabel, FormLabel, IconButton, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField, Tooltip, Typography, FormHelperText, SelectChangeEvent, Checkbox  } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import denunciaGarimpoService from './service/denunciaGarimpo.service';
import styles from './VerDenunciaGarimpo.module.css';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { telefoneMascara, dataBr } from '../../util/mascaras';
import Head from '../../helper/Head';
import ShowImage from '../../components/ShowImage/ShowImage';
import Toast from '../../components/Toast/Toast';
import { FileText } from '@phosphor-icons/react';
import { objVazio } from '../../util/util';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import { UserContext } from '../../contexts/UserContext';
import Dialogo from '../../components/Dialogo/Dialogo'

export default function VerDenunciaGarimpo() {

    const location = useLocation();
    const navigate = useNavigate();

    const { user_role } = useContext(UserContext);
    const [registroDenuncia, setRegistroDenuncia] = useState('');
    const [isToast, setIsToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastIcon, setToastIcon] = useState('');
    const [fotosDenuncia, setFotosDenuncia] = useState([] as any);
    const [selectedImage, setSelectedImage] = useState();
    const [showImage, setShowImage] = useState(false);
    const [atividadeGarimpoList, setAtividadeGarimpoList] = useState([] as any);
    const [atividadeGarimpoOutros, setAtividadeGarimpoOutros] = useState(false);
    const [anonimo, setAnonimo] = useState(1);
    const [openModal, setOpenModal] = useState(false);
    const [statusDenunciaList, setStatusDenunciaList] = useState([] as any);
    const [statusDenuncia, setStatusDenuncia] = useState('');
    const [statusAcompanhamentoList, setStatusAcompanhamentoList] = useState([] as any);
    const [statusAcompanhamento, setStatusAcompanhamento] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [idDenunciaGarimpo, setIdDenunciaGarimpo] = useState('');
    const [botaoSEI, setbotaoSEI] = useState(true);

    const { register, handleSubmit, watch, setValue, clearErrors, formState: { errors } } = useForm();

    useEffect(() => {
        
        const id = location.pathname.split('/')[2];

        if (id !== '') {
            (async () => {
                const resp = await denunciaGarimpoService.listStatusDenuncia();
                if (resp) {
                    resp.pop();
                    setStatusDenunciaList(resp);
                }
            })();

            (async () => {
                const resp = await denunciaGarimpoService.listStatusAcompanhamento();
                if (resp)
                    setStatusAcompanhamentoList(resp);
            })();

            (async () => {
                const resp = await denunciaGarimpoService.getDenunciaGarimpoById(id);

                if (!!resp.denunciaGarimpo) {

                    const arquivos: any[] = [];
                    const statusDenuncia = resp.denunciaGarimpo.last_status.status_denuncia_id;
                    const statusAcompanhamento = resp.denunciaGarimpo.last_status.status_acompanhamento_id;
                    const comentarios = resp.denunciaGarimpo.last_status.comentarios;

                    if (resp.denunciaGarimpo.srcFotosDenuncia) {
                        resp.denunciaGarimpo.srcFotosDenuncia.forEach((e: any) => {

                            arquivos.push({
                                arquivo: e,
                                docOuPdf: e.includes('.pdf') || e.includes('.doc') ? true : false
                            })
                        })

                    }
                    setFotosDenuncia(arquivos);
                    setRegistroDenuncia(resp.denunciaGarimpo.registroDenuncia);
                    setStatusDenuncia(statusDenuncia);
                    setValue('statusDenuncia', statusDenuncia);
                    setStatusAcompanhamento(statusAcompanhamento);
                    setValue('statusAcompanhamento', statusAcompanhamento);

                    setValue('comentarios', comentarios);
                    setValue('idDenunciaGarimpo', resp.denunciaGarimpo.idDenunciaGarimpo);
                    setValue('registroDenuncia', resp.denunciaGarimpo.registroDenuncia);
                    setValue('objetoDenuncia', resp.denunciaGarimpo.objetoDenuncia);
                    setValue('estado', resp.denunciaGarimpo.estado);
                    setValue('cidade', resp.denunciaGarimpo.cidade);
                    setValue('dataOcorrencia', dataBr(resp.denunciaGarimpo.dataOcorrencia));
                    setValue('situacaoDescrita', resp.denunciaGarimpo.situacaoDescrita);
                    setValue('coordenadas', resp.denunciaGarimpo.coordenadas);
                    setValue('contatoEnvolvido', resp.denunciaGarimpo.contatoEnvolvido);
                    setValue('nomeDenunciante', resp.denunciaGarimpo.nomeDenunciante);
                    setValue('telefoneDenunciante', telefoneMascara(resp.denunciaGarimpo.telefoneDenunciante));
                    setValue('emailDenunciante', resp.denunciaGarimpo.emailDenunciante);
                    setValue('atividadeGarimpoOutros', resp.denunciaGarimpo.emailDenunciante);
                    setAnonimo(parseInt(resp.denunciaGarimpo.anonimo));

                    setIdDenunciaGarimpo(resp.denunciaGarimpo.idDenunciaGarimpo);

                    if(resp.denunciaGarimpo.last_status.status_denuncia_id == 2 || resp.denunciaGarimpo.last_status.status_denuncia_id == 3){
                        setbotaoSEI(false)
                    }else{
                        setbotaoSEI(true)
                    }
                   
                    const data = await denunciaGarimpoService.getAtividadeGarimpo();

                    const atividadesGarimpos: any[] = []

                    data.forEach((e: any, i: any) => {
                        let atividadeGarimpo = {};
                        resp.denunciaGarimpo.atividade_garimpo.forEach((e1: any) => {
                            if (parseInt(e.idAtividadeGarimpo) === parseInt(e1.idAtividadeGarimpo)) {
                                atividadeGarimpo = {
                                    idAtividadeGarimpo: e.idAtividadeGarimpo,
                                    atividade: e.atividade,
                                    checked: true
                                };

                                if (e1.outros !== null) {
                                    setAtividadeGarimpoOutros(true);
                                    setValue('atividadeGarimpoOutros', e1.outros);
                                }

                            }
                        });

                        if (!objVazio(atividadeGarimpo)) {
                            atividadesGarimpos.push(atividadeGarimpo)
                        } else {
                            atividadesGarimpos.push({
                                idAtividadeGarimpo: e.idAtividadeGarimpo,
                                atividade: e.atividade,
                                checked: false
                            });
                        }
                    });
                    setAtividadeGarimpoList(atividadesGarimpos);
                    // })()
                }
            })()
        }
    }, [botaoSEI,setbotaoSEI]);

    const onSubmit = async (data: any) => {
        let alteracaoStatus = {
            'idDenuncia': data.idDenunciaGarimpo,
            'statusDenuncia': data.statusDenuncia,
            'statusAcompanhamento': data.statusAcompanhamento,
            'comentarios': data.comentarios
        };

        if(data.statusDenuncia == 2 || data.statusDenuncia == 3){
            setbotaoSEI(false)
        }else{
            setbotaoSEI(true)
        }

        const resp = await denunciaGarimpoService.updateStatusDenunciaGarimpo(alteracaoStatus);
        if (resp.response) {
            setOpenModal(false);
            setToastMessage('Status alterado com sucesso!');
            setToastIcon('success');
        }
        else {
            setOpenModal(false);
            setToastMessage('Erro ao alterar status!');
            setToastIcon('error');
        }

        setIsToast(true);

        setTimeout(() => {
            setIsToast(false);
            setOpenModal(false);
        }, 100)
    }

    function handleOpenPhotoFullWidth(e: any) {
        setSelectedImage(e.target);
        setShowImage(true);
    }

    const handleStatusDenuncia = (event: SelectChangeEvent) => {
        clearErrors('statusDenuncia');
        setStatusDenuncia(event.target.value);

        statusDenunciaList.forEach((e: any) => {
            if (e.id === event.target.value)
                setValue('statusDenuncia', e.id);
        });
    };

    const handleStatusAcompanhamento = (event: SelectChangeEvent) => {
        clearErrors('statusAcompanhamento');
        setStatusAcompanhamento(event.target.value);

        statusAcompanhamentoList.forEach((e: any) => {
            if (e.id === event.target.value)
                setValue('statusAcompanhamento', e.id);
        });
    };

    const handleDialogSubmit = async () => {
        const resp = await denunciaGarimpoService.createProcessoSEI(idDenunciaGarimpo);
        console.log("resp:", resp);
        setOpenDialog(false);
    }

    return (
        <section className={`container-internal ${styles.verDenunciaSection}`}>
            <div className="animeRight">
                <Toast open={isToast} icon={toastIcon} mensagem={toastMessage} timer={3000} />
                <Head title=" | Visualizar Denúncia" />
                <Card>
                    <CardContent>
                        <div className={styles.cardContent}>
                            <div className={styles.headCard}>
                                <h3 className="section-title">Denúncia Registro N°: {registroDenuncia}</h3>
                                <div className='row'>
                                    <div className='col'>
                                        <span className={styles.tst}>
                                            {/* <img src="../assets/imagens/sei.png" style={{ height: '40px', width: '70px' }} /> */}
                                            <Button variant="contained" onClick={() => setOpenDialog(true)} disabled={botaoSEI} >
                                                <span>Gerar Processo SEI</span>
                                            </Button>
                                        </span>
                                    </div>
                                    <div className='col'>
                                        <div className={styles.button}>
                                            <Button onClick={() => setOpenModal(true)}>
                                                <SaveIcon sx={{ fontSize: 25 }} />
                                                <span>Alterar status</span>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <input {...register('idDenunciaGarimpo', { required: true })} placeholder='idDenunciaGarimpo' hidden /> {errors.idDenunciaGarimpo && 'idDenunciaGarimpo'}

                                <div className={styles.gridTop}>
                                    <TextField
                                        {...register('registroDenuncia', { required: false })}
                                        className='mb-2 w-100'
                                        label="Numero do registro da denúncia"
                                        variant="outlined"
                                        type='text'
                                        inputProps={{ readOnly: true }}
                                        InputLabelProps={{ shrink: true }}
                                        error={errors.registroDenuncia ? true : false}
                                        helperText={errors.registroDenuncia && 'Campo de numero do registro da denuncia esta vazio!'}
                                    />
                                    <TextField
                                        {...register('objetoDenuncia', { required: false })}
                                        className='mb-2 w-100'
                                        label="Objeto da denúncia"
                                        variant="outlined"
                                        type='text'
                                        inputProps={{ readOnly: true }}
                                        InputLabelProps={{ shrink: true }}
                                        error={errors.objetoDenuncia ? true : false}
                                        helperText={errors.objetoDenuncia && 'Campo de Objeto da denúncia esta vazio!'}
                                    />
                                    <TextField
                                        {...register('estado', { required: false })}
                                        className='mb-2 w-100'
                                        label="Estado"
                                        variant="outlined"
                                        type='text'
                                        inputProps={{ readOnly: true }}
                                        InputLabelProps={{ shrink: true }}
                                        error={errors.estado ? true : false}
                                        helperText={errors.estado && 'Campo de estado esta vazio!'}
                                    />
                                    <TextField
                                        {...register('cidade', { required: false })}
                                        className='mb-2 w-100'
                                        label="Cidade"
                                        variant="outlined"
                                        type='text'
                                        inputProps={{ readOnly: true }}
                                        InputLabelProps={{ shrink: true }}
                                        error={errors.cidade ? true : false}
                                        helperText={errors.cidade && 'Campo de cidade esta vazio!'}
                                    />
                                    <TextField
                                        className='mb-2 w-100'
                                        {...register('dataOcorrencia', { required: false })}
                                        label="Data da ocorrência"
                                        inputProps={{ readOnly: true }}
                                        InputLabelProps={{ shrink: true }}
                                        error={errors.dataOcorrencia ? true : false}
                                        helperText={errors.dataOcorrencia && 'Campo de Data da ocorrência esta vazio!'}
                                    />
                                </div>

                                <div className={styles.grid}>
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
                                                                    disabled
                                                                    checked={e.checked}
                                                                    style={{ color: errors.atividadeGarimpo ? 'red' : '' }}
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
                                                            className='mb-3 w-100'
                                                            variant="outlined"
                                                            type='text'
                                                            InputLabelProps={{ shrink: true }}
                                                            inputProps={{ readOnly: true }}
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
                                    <TextField
                                        {...register('situacaoDescrita', { required: false })}
                                        className='mb-2 w-100'
                                        label="Situação descrita"
                                        variant="outlined"
                                        type='text'
                                        inputProps={{ readOnly: true }}
                                        InputLabelProps={{ shrink: true }}
                                        multiline rows={10}
                                        error={errors.situacaoDescrita ? true : false}
                                        helperText={errors.situacaoDescrita && 'Campo de Descreva a situação esta vazio!'}
                                    />
                                </div>

                                <div className={styles.gridBottom}>
                                    <TextField
                                        {...register('coordenadas', { required: false })}
                                        className='mb-2 w-100'
                                        label="Coordenadas geográficas ou link de localização"
                                        variant="outlined"
                                        type='text'
                                        inputProps={{ readOnly: true }}
                                        InputLabelProps={{ shrink: true }}
                                        error={errors.coordenadas ? true : false}
                                        helperText={errors.coordenadas && 'Campo de Coordenadas esta vazio!'}
                                    />

                                    <TextField
                                        {...register('contatoEnvolvido', { required: false })}
                                        className='mb-2 w-100'
                                        label="Nome(s) e Contato(s) da(s) pessoa(s) ou empresa(s) envolvida(s)"
                                        variant="outlined"
                                        type='text'
                                        inputProps={{ readOnly: true }}
                                        InputLabelProps={{ shrink: true }}
                                        error={errors.contatoEnvolvido ? true : false}
                                        helperText={errors.contatoEnvolvido && 'Campo de Contato esta vazio!'}
                                    />

                                </div>

                                <div>
                                    <FormControl error={errors.atividadeDenunciada ? true : false}>
                                        <FormLabel >
                                            Deseja se indentificar?
                                        </FormLabel>
                                        <RadioGroup
                                            value={anonimo}
                                        >
                                            <FormControlLabel disabled value={0} control={<Radio />} label="Sim" />
                                            <FormControlLabel disabled value={1} control={<Radio />} label="Não" />
                                        </RadioGroup>
                                    </FormControl>
                                </div>

                                {anonimo === 0 &&
                                    <div className={styles.gridBottom}>
                                        <TextField
                                            {...register('nomeDenunciante', { required: false })}
                                            label="Nome"
                                            variant="outlined"
                                            type='text'
                                            inputProps={{ readOnly: true }}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                        <TextField
                                            {...register('telefoneDenunciante', { required: false })}
                                            label="Telefone"
                                            variant="outlined"
                                            type='text'
                                            inputProps={{ readOnly: true }}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                        <TextField
                                            {...register('emailDenunciante', { required: false })}
                                            label="Email"
                                            variant="outlined"
                                            type='text'
                                            inputProps={{ readOnly: true }}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </div>
                                }

                                <div className={styles.anexo}>
                                    <div className={styles.anexoHead}>
                                        <span className={styles.anexoTitle}>Arquivos anexados</span>
                                    </div>
                                    {fotosDenuncia.length > 0 ?
                                        <div className={styles.fotoAnexadas}>
                                            {
                                                fotosDenuncia.map((foto: any, index: number) => (
                                                    <span key={index}>
                                                        {foto.docOuPdf ?
                                                            <LinkFile target='_blank' href={foto.arquivo}>
                                                                <FileText size={28} color="#030303" weight="duotone" />
                                                                Arquivo {index + 1}
                                                            </LinkFile>
                                                            :
                                                            <img key={index} onClick={handleOpenPhotoFullWidth} src={foto.arquivo} title="Arquivo" alt="Arquivo" />
                                                        }

                                                    </span>
                                                ))
                                            }
                                        </div>
                                        :
                                        <p className={styles.semArquivos}>Não há arquivos anexados</p>
                                    }
                                </div>

                                <div className={styles.buttonVoltar}>
                                    <Link to='/list-denuncia-garimpo'>
                                        <Button>
                                            <ArrowBackIcon sx={{ fontSize: 30 }} />
                                            <span>Voltar</span>
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {openModal &&
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ModalComponent
                        title="Alterar status denúncia"
                        closeModal={setOpenModal}
                    >
                        <div style={{ padding: '1rem' }}>
                            <FormControl error={errors.statusDenuncia ? true : false}>
                                <InputLabel>Status denúncia (*)</InputLabel>
                                <input {...register('statusDenuncia', { required: false })} hidden />
                                <Select
                                    value={statusDenuncia}
                                    label="Status denúncia (*)"
                                    onChange={handleStatusDenuncia}
                                    disabled={user_role != 1 && user_role != 2 ? true : false}
                                    MenuProps={{ PaperProps: { sx: { maxHeight: 450 } } }}
                                >
                                    {!!statusDenunciaList ?
                                        statusDenunciaList.map((option: any, i: any) =>
                                            <MenuItem value={option.id} key={i}>{option.name}</MenuItem>
                                        )
                                        :
                                        <MenuItem value={0}>Nada a ser exibido</MenuItem>
                                    }
                                </Select>
                                {errors.statusDenuncia &&
                                    <FormHelperText>{errors.statusDenuncia.message?.toString()}</FormHelperText>
                                }
                            </FormControl>
                        </div>
                        <div style={{ padding: '1rem' }}>
                            <FormControl error={errors.statusAcompanhamento ? true : false}>
                                <InputLabel>Status acompanhamento (*)</InputLabel>
                                <input {...register('statusAcompanhamento', { required: false })} hidden />
                                <Select
                                    value={statusAcompanhamento}
                                    label="Status acompanhamento (*)"
                                    onChange={handleStatusAcompanhamento}
                                    MenuProps={{ PaperProps: { sx: { maxHeight: 450 } } }}
                                >
                                    {!!statusAcompanhamentoList ?
                                        statusAcompanhamentoList.map((option: any, i: any) =>
                                            <MenuItem value={option.id} key={i}>{option.name}</MenuItem>
                                        )
                                        :
                                        <MenuItem value={0}>Nada a ser exibido</MenuItem>
                                    }
                                </Select>
                                {errors.statusAcompanhamento &&
                                    <FormHelperText>{errors.statusAcompanhamento.message?.toString()}</FormHelperText>
                                }
                            </FormControl>
                        </div>
                        <div style={{ padding: '1rem' }}>
                            <TextField
                                {...register('comentarios', { required: false, maxLength: 255 })}
                                label="Comentário(s)"
                                variant="outlined"
                                type='text'
                                autoComplete='off'
                                multiline rows={7}
                                InputLabelProps={{ shrink: true }}
                                error={errors.comentarios ? true : false}
                                helperText={errors.comentarios && errors.comentarios.message?.toString()}
                            />
                        </div>
                    </ModalComponent>
                </form>
            }

            <ShowImage
                showingImage={showImage}
                setShowImage={setShowImage}
                image={selectedImage}
            />

                <Dialogo
                    openDialog={openDialog}
                    setOpenDialog={setOpenDialog}
                    handleDialogSubmit={handleDialogSubmit}
                    titulo={'Deseja realmente abrir um processo no sistema do SEI?'}
                    conteudo={'Após concordar com esta ação o processo devera ser acompanhado no sistema SEI.'}
                />
        </section>

    )
}