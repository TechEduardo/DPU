import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";

import { Button, Tooltip } from '@mui/material';
import { makeStyles } from '@mui/styles'
import AccountCircle from '@mui/icons-material/AccountCircle';
import ArrowDown from '@mui/icons-material/KeyboardArrowDown';
import LogoutIcon from '@mui/icons-material/Logout';
import { AppBar, Toolbar, CssBaseline, Typography } from "@mui/material";

import styles from './cabecalho.module.css';
import Toast from '../../components/Toast/Toast';

import loginService from '../../paginas/login/service/login.service';
import { UserContext } from '../../contexts/UserContext';


const useStyles = makeStyles((theme: any) => ({
    header: {
        background: '#053616',
        height: '10vh',
    },
    navlinks: {
        display: "flex",
        textDecoration: "none",
        marginRight: 5,
    },
    logo: {
        flexGrow: "2",
        cursor: "pointer",
    },
}));


export default function Cabecalho() {
    const classes = useStyles();
    const [isToast, setIsToast] = useState(false);
    const [user, setUser] = useState('');
    const { user_role } = useContext(UserContext);

    const sair = () => {
        setIsToast(true);
        setUser('');

        setTimeout(() => {
            const resp = loginService.logout()
            setIsToast(false);
        }, 100)
    }

    const [isToken, setIsToken] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loginService.observable.onToken().subscribe((token: any) => {
            if (token) {
                setIsToken(true);
            }
            if (token === null) {
                setIsToken(false);
                navigate('/');
            }
        });
        loginService.observable.setToken(loginService.getToken())

    }, []);
 
    return (
        <div className={styles.cabecalho}>
            <Toast open={isToast} mensagem={'Ate logo!'} timer={3000} />

            <AppBar position="static">
                <CssBaseline />
                <Toolbar className={styles.header}>
                    <Typography>
                        <span>
                            <div className={styles.grid}>
                                    <Link to='/' className={styles.logo}>
                                        <img src="../assets/imagens/logoOGES.png" style={{ height: '70px' }} />
                                    </Link>
                            </div>
                        </span>
                    </Typography>
                    <div className={classes.navlinks}>
                        {isToken ?
                            <>
                                <div className={styles.menuContainer}>
                                    <div className={styles.menuGrid}>
                                        <div className={styles.itemsGrid}>
                                            <div className={styles.menuItem}>
                                                <div className={styles.dropdown}>
                                                    <button className={styles.dropdownBtn}>
                                                        Garimpo
                                                        <ArrowDown />
                                                    </button>
                                                    <div className={styles.dropdownContent}>
                                                        <Link to="list-denuncia-garimpo">
                                                            <span>Listar formulários</span>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                            {(user_role == 1 || user_role == 2) &&

                                                <div className={styles.menuItem}>
                                                    <div className={styles.dropdown}>
                                                        <button className={styles.dropdownBtn}>
                                                            Usuários
                                                            <ArrowDown />
                                                        </button>
                                                        <div className={styles.dropdownContent}>
                                                            <Link to="list-usuario">
                                                                <span>Listar usuários</span>
                                                            </Link>
                                                            <Link to="create-usuario">
                                                                <span>Criar usuário</span>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                        
                                        <Link to="pagina-inicial" className={styles.link} onClick={sair} title='Sair'>
                                            <LogoutIcon sx={{ fontSize: 35 }} />
                                        </Link>
                                    </div>
                                </div>
                            </>
                            :
                            <Link to="login" className={styles.link} title='Entrar'>
                                <AccountCircle sx={{ fontSize: 35 }} />
                            </Link>
                        }
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    )
}