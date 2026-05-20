import api from '../../../../config/api.service';
import Cookies from 'universal-cookie';

class CadastroUnicoPeticao {

    protected cookies = new Cookies();

    async listCadastroUnicoPeticao() {
        const resp = await api.get('listCadastroUnicoPeticao')
        .then((resp) => resp.data)
        .catch((err) => {
        return err.response.data.message
        });
        
        return resp;
    };

    async createCadastroUnicoPeticao(data: any) {

        const resp =  await api.post("createCadastroUnicoPeticao", data)
              .then((resp) => resp.data)
              .catch((err) => err.response.data.message);
  
              return resp;
      }
      // async getUsuarioById(id: any) {

      //   const resp = await api.get("getUsuarioById", {params: {id}})
      //         .then((resp) => resp.data)
      //         .catch((err) => err.response.data.message);
  
      //         return resp;
      // }

      // async updateUsuario(data: any) {

      //   const resp = await api.put("updateUsuario", data)
      //         .then((resp) => resp.data)
      //         .catch((err) => err.response.data.message);
  
      //         return resp;
      // }

      // async deleteUsuarioById(id: any) {

      //   const resp = await api.delete("deleteUsuarioById", {params: {id}})
      //         .then((resp) => resp.data)
      //         .catch((err) => err.response.data.message);
  
      //         return resp;
      // }

}

export default new CadastroUnicoPeticao();