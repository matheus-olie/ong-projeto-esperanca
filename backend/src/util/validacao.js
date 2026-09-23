// REMOVE TUDO QUE NÃO FOR NÚMERO
function somenteNumeros(valor) {
    return String(valor).replace(/\D/g, '');
}


// VALIDA CPF
function validarCPF(cpf) {

    cpf = somenteNumeros(cpf);

    if (cpf.length !== 11) {
        return false;
    }

    // Rejeita números repetidos
    if (/^(\d)\1{10}$/.test(cpf)) {
        return false;
    }

    let soma = 0;

    // Primeiro dígito verificador
    for (let i = 0; i < 9; i++) {
        soma += Number(cpf[i]) * (10 - i);
    }

    let resto = soma % 11;

    const primeiroDigito = resto < 2
        ? 0
        : 11 - resto;

    if (Number(cpf[9]) !== primeiroDigito) {
        return false;
    }

    soma = 0;

    // Segundo dígito verificador
    for (let i = 0; i < 10; i++) {
        soma += Number(cpf[i]) * (11 - i);
    }

    resto = soma % 11;

    const segundoDigito = resto < 2
        ? 0
        : 11 - resto;

    if (Number(cpf[10]) !== segundoDigito) {
        return false;
    }

    return true;
}


// VALIDA TELEFONE BRASILEIRO
function validarTelefone(telefone) {

    telefone = somenteNumeros(telefone);

    // Aceita telefone fixo ou celular
    if (telefone.length !== 10 && telefone.length !== 11) {
        return false;
    }

    const ddd = Number(telefone.substring(0, 2));

    // Validação básica do DDD
    if (ddd < 11 || ddd > 99) {
        return false;
    }

    // Celular deve começar com 9
    if (telefone.length === 11 && telefone[2] !== '9') {
        return false;
    }

    return true;
}

// VALIDA E-MAIL
function validarEmail(email) {
    const formatoEmail =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return formatoEmail.test(email);
}

module.exports = {
    somenteNumeros,
    validarCPF,
    validarTelefone,
    validarEmail
};