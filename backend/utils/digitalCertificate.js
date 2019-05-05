const cmd = require('node-cmd');
const fs = require('fs');

module.exports = app => {
    const createPrivateKey = async (req, res) => {
        const repositoryCertificateUrl  = app.config.global.repositoryCertificateUrl
        const certName      = req.user.id + req.user.name.replace(/ /g, '')
        const publicCert    = repositoryCertificateUrl + '/server_easycontract.pem'
        const publicCertKey = repositoryCertificateUrl + '/server_easycontract_key.pem'
        const serial        = '01'
        const days          = 365
        
        const privateKey = app.utils.randomHash.randomHash(55)

        const commandCreateUserPem = `openssl req -newkey rsa:4096 -keyout ${repositoryCertificateUrl}/${certName}_key.pem -out ${repositoryCertificateUrl}/${certName}_csr.pem -nodes -days 365 -subj "/CN=${certName}/O=${req.user.cgc}/OU=${privateKey}"`
        const commandCreateCertUser  = `openssl x509 -req -in ${repositoryCertificateUrl}/${certName}_csr.pem -CA ${publicCert} -CAkey ${publicCertKey} -out ${repositoryCertificateUrl}/${certName}_cert.pem -set_serial ${serial} -days ${days}`
        const commandCreateP12Install  = `openssl pkcs12 -export -clcerts -in ${repositoryCertificateUrl}/${certName}_cert.pem -inkey ${repositoryCertificateUrl}/${certName}_key.pem -out ${repositoryCertificateUrl}/${certName}.p12 -passout pass:`
                                  
        await cmd.get(commandCreateUserPem, () => 
            cmd.get(commandCreateCertUser, () => 
            cmd.get(commandCreateP12Install, () => {
                res.sendFile(`${repositoryCertificateUrl}/${certName}.p12`)
            })))
    }

    return { createPrivateKey }
}