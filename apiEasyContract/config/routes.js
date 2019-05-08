module.exports = app => {
    app.route('/contrato')
        .post(app.api.contrato.insert)

    app.route('/contrato/:easyContractHashId')
        .put(app.api.contrato.edit)
        .get(app.api.contrato.get)
        .delete(app.api.contrato.remove)

    app.route('/assinatura/:easyContractHashId')
        .post(app.api.assinatura.insert)
        .get(app.api.assinatura.get) 
        .delete(app.api.assinatura.remove)
}