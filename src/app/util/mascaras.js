export const telefoneMascara = value => {
  if(value)
    return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .replace(/(\d{4})-(\d)(\d{4})/, '$1$2-$3')
    .replace(/(-\d{4})\d+?$/, '$1');
  }
  
  export const telefoneSemMascara = value => {
  if(value)
    return value.replace('(', '').replace(')', '').replace(' ', '').replace('-','');
  }
 
  export const dataBr = (data) => {
    if(data){
      const dataUs = data.substring(0,10).split('-')
      const dataBr =  dataUs[2]+'/'+dataUs[1]+'/'+dataUs[0];
      return dataBr;
    }
  }

  export const dataUs = (data) => {
    if(data){
      const dataBr = data.substring(0,10).split('/')
      const dataUs =  dataBr[2]+'-'+dataUs[1]+'-'+dataUs[0];
      return dataBr;
    }
  }

  export const cpfMascara = value => {
    if(value)
    return value
      .replace(/\D/g, '') // substitui qualquer caracter que nao seja numero por nada
      .replace(/(\d{3})(\d)/, '$1.$2') // captura 2 grupos de numero o primeiro de 3 e o segundo de 1, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de numero
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1') // captura 2 numeros seguidos de um traço e não deixa ser digitado mais nada
  }
  
  // Retira a mascara
  export const cpfSemMascara = value => {
    if(value)
    return value.replace('.', '').replace('.', '').replace('-', '');
  }

  export const isValidCPF = (cpf) => {
    if (typeof cpf !== "string") return false
    cpf = cpf.replace(/[\s.-]*/igm, '')
    if (
        !cpf ||
        cpf.length !== 11 ||
        cpf === "00000000000" ||
        cpf === "11111111111" ||
        cpf === "22222222222" ||
        cpf === "33333333333" ||
        cpf === "44444444444" ||
        cpf === "55555555555" ||
        cpf === "66666666666" ||
        cpf === "77777777777" ||
        cpf === "88888888888" ||
        cpf === "99999999999" 
    ) {
        return false
    }
    let soma = 0
    let resto
    for (let i = 1; i <= 9; i++) 
        soma = soma + parseInt(cpf.substring(i-1, i)) * (11 - i)
    resto = (soma * 10) % 11
    if ((resto === 10) || (resto === 11))  resto = 0
    if (resto !== parseInt(cpf.substring(9, 10)) ) return false
    soma = 0
    for (let i = 1; i <= 10; i++) 
        soma = soma + parseInt(cpf.substring(i-1, i)) * (12 - i)
    resto = (soma * 10) % 11
    if ((resto === 10) || (resto === 11))  resto = 0
    if (resto !== parseInt(cpf.substring(10, 11) ) ) return false
    return true
  }