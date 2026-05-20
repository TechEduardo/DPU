export const qtdObj = (obj) => {
    let tamanho = 0;
    for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
            tamanho++;
        }
    }
    return tamanho;
}

export const somenteNumero = value => {
    if (value)
        return value.replace(/\D/g, '');
}

export const registroDenunciaMascara = value => {
    if(value)
    return value
    .replace(/\D/g, '')
    .replace(/(\d{8})(\d)/, '$1/$2');
  }

export function objVazio(obj) {
    for (let prop in obj)
      if (obj.hasOwnProperty(prop)) return false;
    return true;
  }