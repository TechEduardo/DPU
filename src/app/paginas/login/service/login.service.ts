import api from '../../../../config/api.service';
import Cookies from 'universal-cookie';
import moment from 'moment';
import { Subject } from 'rxjs';

class Login {

    protected subject = new Subject();
    protected cookies = new Cookies();
    
    async login(data: any) {
      const resp = await api.post("login", data)
            .then((resp) => {
                if (resp.data.token) {
                    this.cookies.set('user', JSON.stringify(resp.data.user), { path: '/', expires: moment().add(8, 'hour').toDate() });
                    this.cookies.set('token', JSON.stringify(resp.data.token), { path: '/', expires: moment().add(8, 'hour').toDate() });
                    this.observable.setToken(resp.data.token);
                }
                return resp.data;
            }).catch((err) => err.response.data.message);

        return resp;
    }

    logout(){
        this.cookies.remove('user');
        this.cookies.remove('token');
        this.observable.clearToken();
        
        return true;
    }

    getToken(){
        const token = this.cookies.get('token');
        if(token !== undefined)
            return token;
        return null;
    }
    
    observable = {
        setToken: (token: any) => this.subject.next(token),
        clearToken: () => this.subject.next(null),
        onToken: () => this.subject.asObservable(),
    }
}

export default new Login();