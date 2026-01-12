// Funções utilitárias para máscaras de formatação

/**
 * Aplica máscara de CPF: 000.000.000-00
 */
export const maskCPF = (value) => {
    if (!value) return '';

    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '');

    // Limita a 11 dígitos
    const limited = numbers.slice(0, 11);

    // Aplica a máscara
    return limited
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

/**
 * Aplica máscara de Telefone: (00) 00000-0000 ou (00) 0000-0000
 */
export const maskPhone = (value) => {
    if (!value) return '';

    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '');

    // Limita a 11 dígitos
    const limited = numbers.slice(0, 11);

    // Aplica a máscara
    if (limited.length <= 10) {
        // Telefone fixo: (00) 0000-0000
        return limited
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{4})(\d)/, '$1-$2');
    } else {
        // Celular: (00) 00000-0000
        return limited
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2');
    }
};

/**
 * Aplica máscara de CEP: 00000-000
 */
export const maskCEP = (value) => {
    if (!value) return '';

    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '');

    // Limita a 8 dígitos
    const limited = numbers.slice(0, 8);

    // Aplica a máscara
    return limited.replace(/(\d{5})(\d)/, '$1-$2');
};

/**
 * Remove a máscara, deixando apenas números
 */
export const removeMask = (value) => {
    if (!value) return '';
    return value.replace(/\D/g, '');
};

/**
 * Valida CPF
 */
export const isValidCPF = (cpf) => {
    const numbers = cpf.replace(/\D/g, '');

    if (numbers.length !== 11) return false;

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(numbers)) return false;

    // Validação do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(numbers.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(numbers.charAt(9))) return false;

    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(numbers.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(numbers.charAt(10))) return false;

    return true;
};

/**
 * Valida Telefone
 */
export const isValidPhone = (phone) => {
    const numbers = phone.replace(/\D/g, '');
    return numbers.length >= 10 && numbers.length <= 11;
};

/**
 * Valida CEP
 */
export const isValidCEP = (cep) => {
    const numbers = cep.replace(/\D/g, '');
    return numbers.length === 8;
};
