import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import Head from '../../helper/Head';
import ShowImage from '../../components/ShowImage/ShowImage';
import { telefoneMascara, dataBr } from '../../util/mascaras';
import denunciaGarimpoService from './service/denunciaGarimpo.service';
import styles from './ResumoDenunciaGarimpo.module.css';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircle from '@mui/icons-material/CheckCircle';
import { Button, Card, CardContent, Checkbox, FormControl, FormControlLabel, FormHelperText, FormLabel, Link, Radio, RadioGroup, TextField } from '@mui/material';
import { FileText } from '@phosphor-icons/react';
import { objVazio } from '../../util/util';

const ResumoDenunciaGarimpo = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [registroDenuncia, setRegistroDenuncia] = useState('');
    const [fotosDenuncia, setFotosDenuncia] = useState([] as any);
    const [selectedImage, setSelectedImage] = useState();
    const [showImage, setShowImage] = useState(false);
    const [atividadeGarimpoList, setAtividadeGarimpoList] = useState([] as any);
    const [atividadeGarimpoOutros, setAtividadeGarimpoOutros] = useState(false);
    const [anonimo, setAnonimo] = useState(0);

    const [logStatus, setLogStatus] = useState([] as any);
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        const registroDenuncia = (location.pathname.split('/')[4] + "/" + location.pathname.split('/')[5]) ?? '';

        if (registroDenuncia !== '/undefined') {
            (async () => {
                const resp = await denunciaGarimpoService.getNumeroRegistroDenunciaGarimpo(registroDenuncia);

                if (!!resp.denunciaGarimpo) {
                    const arquivos: any[] = [];
                    if (resp.denunciaGarimpo.srcFotosDenuncia) {
                        resp.denunciaGarimpo.srcFotosDenuncia.forEach((e: any) => {

                            arquivos.push({
                                arquivo: e,
                                docOuPdf: e.includes('.pdf') || e.includes('.doc') ? true : false
                            })
                        })
                    }

                    setFotosDenuncia(arquivos);
                    setLogStatus(resp.denunciaGarimpo.all_status);
                    setRegistroDenuncia(resp.denunciaGarimpo.registroDenuncia);
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
                    setAnonimo(parseInt(resp.denunciaGarimpo.anonimo));

                    const data = await denunciaGarimpoService.getAtividadeGarimpo();
                    const atividadesGarimpos: any[] = [];
                    
                    data?.forEach((e: any, i: any) => {
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
                }

            })()
        }
    }, [])

    function handleOpenPhotoFullWidth(e: any) {
        setSelectedImage(e.target);
        setShowImage(true);
    }

    return (
        <section className="background-section background-full">
            <Head title=" | Resumo denúncia" />
            <div className={`animeRight ${styles.container}`}>
                <div className={styles.formContainer}>
                    <Card>
                        <CardContent>
                            <span className={styles.formDescription}>
                                Numero do registro da denuncia: {registroDenuncia}
                            </span>
                            <div>
                                <div className={styles.grid}>
                                    <TextField
                                        {...register('objetoDenuncia', { required: false })}
                                        label="Objeto da denúncia"
                                        variant="outlined"
                                        type='text'
                                        inputProps={{ readOnly: true }}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                    <TextField
                                        {...register('estado', { required: false })}
                                        label="Estado da denúncia"
                                        variant="outlined"
                                        type='text'
                                        inputProps={{ readOnly: true }}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                    <TextField
                                        {...register('cidade', { required: false })}
                                        label="Cidade da denúncia"
                                        variant="outlined"
                                        type='text'
                                        inputProps={{ readOnly: true }}
                                        InputLabelProps={{ shrink: true }}
                                    />

                                </div>

                                <div className={styles.row}>
                                    <TextField
                                        {...register('dataOcorrencia', { required: false })}
                                        label="Data da ocorrência"
                                        variant="outlined"
                                        type='text'
                                        inputProps={{ readOnly: true }}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </div>

                                <div className={styles.grid1}>
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

                                <div className={styles.row}>
                                    <TextField
                                        {...register('situacaoDescrita', { required: false })}
                                        className='mb-2 w-20'
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

                                <div className={styles.row}>
                                    <TextField
                                        {...register('coordenadas', { required: false })}
                                        label="Coordenadas geográficas ou link de localização"
                                        variant="outlined"
                                        type='text'
                                        inputProps={{ readOnly: true }}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                    <TextField
                                        {...register('contatoEnvolvido', { required: false })}
                                        label="Nome(s) e Contato(s) da(s) pessoa(s) ou empresa(s) envolvida(s)"
                                        variant="outlined"
                                        type='text'
                                        inputProps={{ readOnly: true }}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </div>

                                <div className={styles.row}>
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
                                    <div className={styles.row}>
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

                            </div>

                            <div className={styles.anexo}>
                                <div className={styles.anexoHead}>
                                    <span className={styles.anexoTitle}>Arquivos anexados</span>
                                </div>
                                {fotosDenuncia.length > 0 ?
                                    <div className={styles.fotoAnexadas}>
                                        {
                                            fotosDenuncia.map((foto: any, index: any) => (
                                                <div key={index}>
                                                    {foto.docOuPdf ?
                                                        <Link target='_blank' href={foto.arquivo}>
                                                            <FileText size={28} color="#030303" weight="duotone" />
                                                            Arquivo {index + 1}
                                                        </Link>
                                                        :
                                                        <img key={index} onClick={handleOpenPhotoFullWidth} src={foto.arquivo} title="Arquivo" alt="Arquivo" />
                                                    }

                                                </div>
                                            ))
                                        }
                                    </div>
                                    :
                                    <p className={styles.semArquivos}>Não há arquivos anexados</p>
                                }
                            </div>


                            <div className={styles.status}>
                                <div className={styles.statusHead}>
                                    <div>
                                        <span className={styles.statusTitle}>Status da denúncia</span>
                                    </div>
                                    <div>
                                        <span>Etapa</span>
                                        <span>Iniciado em</span>
                                        <span>Comentários</span>
                                    </div>
                                </div>
                                <div className={styles.statusList}>
                                    {
                                        logStatus.map((item : any, index : any) => (
                                            <div key={index} className={styles.statusItem}>
                                                <div>
                                                    <CheckCircle sx={{ fontSize: 25, color: 'green' }} />
                                                    {item.status_denuncia_name + ' - ' + item.status_acompanhamento_name}
                                                </div>
                                                <div>{item.criado_em}</div>
                                                <div>{item.comentarios}</div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>

                            <div className={styles.formButton}>
                                <Button onClick={() => navigate(-1)}>
                                    <ArrowBackIcon sx={{ fontSize: 30 }} />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <ShowImage
                showingImage={showImage}
                setShowImage={setShowImage}
                image={selectedImage}
            />
        </section>
    )
}

export default ResumoDenunciaGarimpo