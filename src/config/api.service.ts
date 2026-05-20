import axios from 'axios';
import Login from '../app/paginas/login/service/login.service';
import {env} from '../env/env';

const configValue: string = (env.baseURL as string);

const api = axios.create({
    baseURL: configValue
});

api.interceptors.request.use(async config => {
    const token = Login.getToken();
    if (token) {
        config.headers = {
            Accept: 'application/json',
            ContentType: 'application/json',
            Authorization: `Bearer ${token}`,
        }
    }
    return config;
});

export default api;


