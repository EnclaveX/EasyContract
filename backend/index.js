const app = require('express')()
const consign = require('consign')
const db = require('./config/db')

app.db = db

consign()
    .include('./config/passport.js')
    .then('./utils')    
    .then('./config/middlewares.js')
    .then('./api/validations')
    .then('./api')
    .then('./config/routes.js')
    .then('./config/global.js')
    .into(app)

app.listen(3001, () => {
    console.log('Backend executando.')
})