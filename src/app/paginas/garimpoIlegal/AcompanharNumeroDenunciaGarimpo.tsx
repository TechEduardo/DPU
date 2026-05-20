import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import Head from '../../helper/Head';
import styles from './AcompanharNumeroDenunciaGarimpo.module.css';
import { Button, Card, CardContent, TextField } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import denunciaGarimpoService from './service/denunciaGarimpo.service';
import { registroDenunciaMascara } from '../../util/util';

export default function AcompanharNumeroDenunciaGarimpo() {
    const { register, handleSubmit, setValue, setError, clearErrors, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data: any) => {

        const resp = await denunciaGarimpoService.getNumeroRegistroDenunciaGarimpo(data.registroDenuncia);

        if (resp.denunciaGarimpo) {
            navigate('/garimpo-ilegal/acompanhar-denuncia/resumo/' + resp.denunciaGarimpo.registroDenuncia);
        } else if (resp.error) {
            setError(resp.error.data[0].label, { message: resp.error.data[0].erro })
            setValue(resp.error.data[0].label, '');
        } else {
            setError('registroDenuncia', { message: "Registro de denúncia inexistente!" })
            setValue('registroDenuncia', '')
        }
    }

    const handleRegistroDenuncia = (e: any) => {
        clearErrors('registroDenuncia');
        setValue('registroDenuncia', registroDenunciaMascara(e.target.value));
    }

    return (
        <section className="background-section background-initial">
            <Head title=" | Acompanhar denúncia" />
            <div className="animeRight container">
                <div className={styles.sectionTitle}>
                    <h1 className={styles.title}>Acompanhar denúncia</h1>
                    <h2 className={styles.subtitle}></h2>
                </div>
                <div className={styles.container}>
                    <Card>
                        <CardContent>
                            <span className={styles.formDescription}>
                                Informe o número do registro da denúncia
                            </span>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className={styles.row}>
                                    <TextField
                                        {...register('registroDenuncia', { required: false })}
                                        label="Numero do registro da denúncia (*)"
                                        variant="outlined"
                                        type='search'
                                        autoFocus
                                        autoComplete='off'
                                        onChange={handleRegistroDenuncia}
                                        inputProps={{ minLength: 13, maxLength: 13 }}
                                        error={errors.registroDenuncia ? true : false}
                                        helperText={errors.registroDenuncia && errors.registroDenuncia.message?.toString()}
                                    />
                                </div>
                                <div className={styles.formButton}>
                                    <Button onClick={() => navigate(-1)}>
                                        <ArrowBackIcon sx={{ fontSize: 30 }} />
                                    </Button>
                                    <Button variant="contained" type='submit'>
                                        Buscar
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}