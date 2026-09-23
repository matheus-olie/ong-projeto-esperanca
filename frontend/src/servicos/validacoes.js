// REMOVE TUDO QUE NÃO FOR NÚMERO
function somenteNumeros(valor) {
    return valor.replace(/\D/g, '');
}

//FORMATAR CPF PARA EXIBIÇÃO
function formatarCPF(cpf) {
    cpf = somenteNumeros(cpf);

    if (cpf.length > 11) {
        cpf= cpf.substring(0,11);
    }

    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    return cpf;
}

// FORMATAR TELEFONE PARA EXIBIÇÃO
function formatarTelefone(telefone) {
    telefone = somenteNumeros(telefone);

    if (telefone.length > 11) {
        telefone = telefone.substring(0, 11);
    }

    if (telefone.length <= 10) {
        telefone = telefone.replace(
            /(\d{2})(\d{4})(\d{1,4})/,
            '($1) $2-$3'
        );
    } else {
        telefone = telefone.replace(
            /(\d{2})(\d{5})(\d{1,4})/,
            '($1) $2-$3'
        );
    }

    return telefone;
}

// VALIDA CPF
function validarCPF(cpf) {

    cpf = somenteNumeros(cpf);

    // CPF precisa ter 11 dígitos
    if (cpf.length !== 11) {
        return false;
    }

    // Impede CPFs como 11111111111
    if (/^(\d)\1{10}$/.test(cpf)) {
        return false;
    }

    // PRIMEIRO DÍGITO VERIFICADOR
    let soma = 0;

    for (let i = 0; i < 9; i++) {
        soma += Number(cpf[i]) * (10 - i);
    }

    let resto = soma % 11;

    let primeiroDigito = resto < 2
        ? 0
        : 11 - resto;

    if (Number(cpf[9]) !== primeiroDigito) {
        return false;
    }


    // SEGUNDO DÍGITO VERIFICADOR
    soma = 0;

    for (let i = 0; i < 10; i++) {
        soma += Number(cpf[i]) * (11 - i);
    }

    resto = soma % 11;

    let segundoDigito = resto < 2
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

    // Brasil:
    // 10 dígitos = telefone fixo
    // 11 dígitos = celular
    if (telefone.length !== 10 && telefone.length !== 11) {
        return false;
    }

    // DDD precisa estar entre 11 e 99
    const ddd = Number(telefone.substring(0, 2));

    if (ddd < 11 || ddd > 99) {
        return false;
    }

    // Para celular, o primeiro dígito depois do DDD
    // deve ser 9
    if (telefone.length === 11) {

        if (telefone[2] !== '9') {
            return false;
        }
    }

    return true;
}


// VALIDA E-MAIL
function validarEmail(email) {

    const formatoEmail =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return formatoEmail.test(email);
}


export {
    somenteNumeros,
    formatarCPF,
    formatarTelefone,
    validarCPF,
    validarTelefone,
    validarEmail
};