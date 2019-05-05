module.exports = app => {
    function validateCgc(cgc, msg) {
        if (cgc.length === 14) {    
            if (!validateCnpj(cgc)) throw msg
        } else {
            if (!validateCpf(cgc)) throw msg
        }           
    }

    function validateCnpj(cnpj) {
        const code = cnpj.substr(0, 12)
        const verifierDigit = cnpj.substr(12, 2)

        let calc = 0

        for (let i = 0; i < 12; i++) {
            calc += code.charAt(11 - i) * (2 + (i % 8))
        }

        if (calc == 0) return false

        calc = 11 - (calc % 11)

        if (calc > 9) calc = 0

        if (verifierDigit.charAt(0) != calc) return false

        calc *= 2

        for (i = 0; i < 12; i++) {
            calc += code.charAt(11 - i) * (2 + ((i + 1) % 8))
        }

        calc = 11 - (calc % 11)

        if (calc > 9) calc = 0

        if (verifierDigit.charAt(1) != calc) return false

        return true
    }

    function validateCpf(cgc) {
        const code = cgc.substr(0, 9)
        const verifierDigit = cgc.substr(9, 2)

        let calc = 0

        for (i = 0; i < 9; i++) {
            calc += code.charAt(i) * (10 - i)
        }

        if (calc == 0) return false

        calc = 11 - (calc % 11)

        if (calc > 9) calc = 0

        if (verifierDigit.charAt(0) != calc) return false

        calc *= 2

        for (i = 0; i < 9; i++) {
            calc += code.charAt(i) * (11 - i)
        }

        calc = 11 - (calc % 11)

        if (calc > 9) calc = 0

        if (verifierDigit.charAt(1) != calc) return false

        return true
    }

    return { validateCnpj, validateCpf, validateCgc }
}