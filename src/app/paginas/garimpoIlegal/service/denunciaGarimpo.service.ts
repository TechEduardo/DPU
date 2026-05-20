import api from '../../../../config/api.service';
import Cookies from 'universal-cookie';

class DenunciaGarimpo {

    protected cookies = new Cookies();

    async createDenunciaGarimpo(data: any) {
        const resp = await api.post('createDenunciaGarimpo', data)
            .then((resp) => resp.data)
            .catch((err) => {
                return err.response.data.message
            });

        return resp;
    };

    async listDenunciaGarimpo(idStatus: any) {
        const resp = await api.get('listDenunciaGarimpo', { params: { idStatus } })
            .then((resp) => resp.data)
            .catch((err) => {
                return err.response.data.message
            });

        return resp;
    };

    async getDenunciaGarimpoById(idDenunciaGarimpo: any) {
        const resp = await api.get("getDenunciaGarimpoById", { params: { idDenunciaGarimpo } })
            .then((resp) => resp.data)
            .catch((err) => err.response.data.message);

        return resp;
    }

    async getNumeroRegistroDenunciaGarimpo(registroDenuncia: any) {
        const resp = await api.get("getNumeroRegistroDenunciaGarimpo", { params: { registroDenuncia } })
            .then((resp) => resp.data)
            .catch((err) => err.response.data.message);

        return resp;
    }

    async updateStatusDenunciaGarimpo(alteracaoStatus: any) {
        const resp = await api.put('updateStatusDenunciaGarimpo', alteracaoStatus)
            .then((resp) => resp.data)
            .catch((err) => err.response.data.message);

        return resp;
    }

    async getAtividadeGarimpo() {
        const resp = await api.get('getAtividadeGarimpo')
            .then((resp) => resp.data)
            .catch((err) => {
                return err.response.data.message
            });

        return resp;
    };
    async listStatusDenuncia() {
        const resp = await api.get('listStatusDenuncia')
            .then((resp) => resp.data)
            .catch((err) => err.response.data.message);

        return resp;
    }

    async listStatusAcompanhamento() {
        const resp = await api.get('listStatusAcompanhamento')
            .then((resp) => resp.data)
            .catch((err) => err.response.data.message);

        return resp;
    }

    async filtroEstadoCidade(idStatus: any, estado: any, cidade: any) {
        const resp = await api.get('filtroEstadoCidade', { params: { idStatus, estado, cidade } })
            .then((resp) => resp.data)
            .catch((err) => err.response.data.message);

        return resp;
    }

    async listTodosStatusDenuncias() {
        const resp = await api.get('listTodosStatusDenuncias')
            .then((resp) => resp.data)
            .catch((err) => err.response.data.message);

        return resp;
    }

    async getStatusDenunciaById(idStatus1: any, idStatus2: any) {
        const resp = await api.get('getStatusDenunciaById', { params: { idStatus1, idStatus2 } })
            .then((resp) => resp.data)
            .catch((err) => err.response.data.message);

        return resp;
    }

    async createProcessoSEI(idDenunciaGarimpo: any) {
        const resp = await api.post('createProcessoSEI', {idDenunciaGarimpo})
            .then((resp) => resp.data)
            .catch((err) => err.response.data.message);

        return resp;
    }
}

export default new DenunciaGarimpo();


