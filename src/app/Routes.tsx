import React, { useEffect, useState, useContext } from 'react';
import { Route, Routes, useNavigate, } from 'react-router-dom';

import loginService from './paginas/login/service/login.service';

import Cabecalho from './layout/cabecalho/Cabecalho';
import Inicio from '../app/paginas/inicio/Inicio';
import Login from '../app/paginas/login/Login';

import PaginaInicial from '../app/paginas/paginaInicial/PaginaInicial';

import CreateUsuario from '../app/paginas/usuario/CreateUsuario';
import EditUsuario from '../app/paginas/usuario/EditUsuario';
import ListUsuarios from '../app/paginas/usuario/ListUsuarios';

import DenunciaGarimpo from './paginas/garimpoIlegal/DenunciaGarimpo';
import CreateDenunciaGarimpo from './paginas/garimpoIlegal/CreateDenunciaGarimpo';
import ListDenunciaGarimpo from './paginas/garimpoIlegal/ListDenunciaGarimpo';
import AcompanharNumeroDenunciaGarimpo from './paginas/garimpoIlegal/AcompanharNumeroDenunciaGarimpo';
import ResumoDenunciaGarimpo from './paginas/garimpoIlegal/ResumoDenunciaGarimpo';
import VerDenunciaGarimpo from './paginas/garimpoIlegal/VerDenunciaGarimpo';

import CadastroUnicoPeticao from './paginas/peticoes/CadastroUnicoPeticao';
import CreateCadastroUnicoPeticao from './paginas/peticoes/CreateCadastroUnicoPeticao';
import ListCadastroUnicoPeticao from './paginas/peticoes/ListCadastroUnicoPeticao';

import { UserContext } from './contexts/UserContext';

const Routs = () => {

    const [isToken, setIsToken] = useState(false);
    const [userRole, setUserRole] = useState(false);
    const { user_role } = useContext(UserContext);
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
        loginService.observable.setToken(loginService.getToken());

    }, []);

    useEffect(() => {        
        if (user_role) {
            setUserRole(true);            
            if (user_role != 1 && user_role != 2) {                
                setUserRole(false);
                navigate('/pagina-inicial');
            }
        }
    }, [user_role]);

    return (
        <div >
            <Cabecalho />
            <div>
                <Routes>
                    <Route path='/' element={<Inicio />} />
                    <Route path='/login' element={<Login />} />

                    <Route path='/garimpo-ilegal' element={<DenunciaGarimpo />} />
                    <Route path='/garimpo-ilegal/realizar-denuncia' element={<CreateDenunciaGarimpo />} />
                    <Route path='/garimpo-ilegal/acompanhar-denuncia' element={<AcompanharNumeroDenunciaGarimpo />} />
                    <Route path='/garimpo-ilegal/acompanhar-denuncia/resumo/*' element={<ResumoDenunciaGarimpo />} />

                    <Route path='/cadastro-unico' element={<CadastroUnicoPeticao />} />
                    <Route path='/cadastro-unico/realizar-cadastro' element={<CreateCadastroUnicoPeticao />} />

                    {isToken &&
                        <>
                            {userRole && 
                                <>
                                    <Route path='/create-usuario' element={<CreateUsuario />} />
                                    <Route path='/list-usuario' element={<ListUsuarios />} />
                                    <Route path='/edit-usuario/*' element={<EditUsuario />} />
                                </>
                            }

                            <Route path='/pagina-inicial' element={<PaginaInicial />} />                                

                            <Route path='/list-denuncia-garimpo' element={<ListDenunciaGarimpo />} />
                            <Route path='/ver-denuncia-garimpo/*' element={<VerDenunciaGarimpo />} />
                            
                            <Route path='/list-cadastro-unico-peticao' element={<ListCadastroUnicoPeticao />} />

                        </>
                    }
                </Routes>
            </div>
        </div>
    )
}
export default Routs;
