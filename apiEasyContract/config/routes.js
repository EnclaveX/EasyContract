module.exports = app => {
    app.route('/contrato')
        .post(app.api.contrato.insere)

    app.route('/contrato/:easyContractHashId')
        .put(app.api.contrato.alterar)
        .get(app.api.contrato.buscar)
        .delete(app.api.contrato.deletar)

    app.route('/assinatura/:easyContractHashId')
        .post(app.api.assinatura.insere)
        .get(app.api.assinatura.buscar) 
        .delete(app.api.assinatura.deletar)
}