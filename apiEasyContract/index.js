const app = require('express')()
const consign = require('consign')

consign()
    .include('./config/global.js')
    .then('./config/middlewares.js')
    .then('./api')
    .then('./config/routes.js')
    .then('./utils')
    .into(app)

app.listen(3004, () => {
    console.log('api executando.')
})