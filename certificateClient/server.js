const express = require('express')
const fs = require('fs')
const https = require('https')
const cors = require('cors')

const opts = {
    key: fs.readFileSync('C:/Users/guilh/Desktop/Guilherme/Faculdade/TCC/EasyContract/backend/certificates/server_easycontract_key.pem'),
    cert: fs.readFileSync('C:/Users/guilh/Desktop/Guilherme/Faculdade/TCC/EasyContract/backend/certificates/server_easycontract.pem'),
    requestCert: true,
    rejectUnauthorized: false,
    ca: [fs.readFileSync('C:/Users/guilh/Desktop/Guilherme/Faculdade/TCC/EasyContract/backend/certificates/server_easycontract.pem')]
}

const app = express()

app.use(cors())

app.get('/', (req, res) => {
    res.send('<a href="authenticate">Log in using client certificate</a>')
}) 

app.get('/authenticate', (req, res) => {
    const cert = req.connection.getPeerCertificate()

    console.log(cert)
    if (req.client.authorized) {
        res.send({
            authorized: req.client.authorized,
            CN: cert.subject.CN,
            O: cert.subject.O,
            OU: cert.subject.OU
        })
    } else if (cert.subject) {
        cert.subject.CN
        res.send('ERROR')
    } else {
        res.send('NO_CERTIFICATE')
    }
})

https.createServer(opts, app).listen(9999)
console.log('listening...')