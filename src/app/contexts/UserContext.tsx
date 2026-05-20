import React, { createContext, useEffect, useState } from 'react';
import Cookies from 'universal-cookie';

interface UserProps {
    user_role: number;
    user_name: string;
    setUserRole(data: number): void;
}

export const UserContext = createContext<UserProps>({} as any);

export const UserRole = ({ children }: any) => {
    const [userRoleId, setUserRoleId] = useState(0);
    const [userName, setUserName] = useState('');
    const cookies = new Cookies();

    function setUserRole(user: any){
        setUserRoleId(user.role_id);
        setUserName(user.nome);
    }

    useEffect(() => {
        let user = cookies.get('user');
        
        if (user) {
            setUserRoleId(user.usuario.role_id);
            setUserName(user.usuario.nome)
        }        
    }, []);

    return <UserContext.Provider value={{ user_role: userRoleId, user_name: userName, setUserRole }}>{children}</UserContext.Provider>
}