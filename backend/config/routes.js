module.exports = app => {
    app.post('/signup', app.api.user.save)
    app.post('/signin', app.api.auth.signin)
    app.post('/validateToken', app.api.auth.validateToken)

    app.route('/users')
        .all(app.config.passport.authenticate())
        .get(app.api.user.get)

    app.route('/users/:id')
        .all(app.config.passport.authenticate())
        .put(app.api.user.save)
        .get(app.api.user.getById) 
        .delete(app.api.user.remove)
    
    app.route('/searchUsers/:search')
        .all(app.config.passport.authenticate())
        .get(app.api.user.searchUser)

    app.route('/searchUsers')
        .all(app.config.passport.authenticate())
        .get(app.api.user.searchUser)

    app.route('/contracts')
        .all(app.config.passport.authenticate())
        .get(app.api.contract.get)
        .post(app.api.contract.save)

    app.route('/users/:id/contracts')
        .all(app.config.passport.authenticate())
        .get(app.api.contract.getByUser)

    app.route('/users/:id/contractsToSign')
        .all(app.config.passport.authenticate())
        .get(app.api.contract.getContractsToSign)

    app.route('/contracts/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.contract.getById)
        .put(app.api.contract.save)
        .delete(app.api.contract.remove)

    app.route('/contracts/:id/contractSigns')
        .all(app.config.passport.authenticate())
        .get(app.api.contractSign.get)
        .post(app.api.contractSign.save)
        .delete(app.api.contractSign.remove)

    app.route('/contracts/:contractId/signIn/:userId')
        .all(app.config.passport.authenticate())
        .post(app.api.contractSign.signIn)

    app.route('/contracts/:contractId/closeContract')
        .all(app.config.passport.authenticate())
        .post(app.api.contract.closeContract)

    app.route('/contracts/:id/contractVersions')
        .all(app.config.passport.authenticate())
        .get(app.api.contractVersion.getByContract)
        .post(app.api.contractVersion.save)
        .delete(app.api.contractVersion.remove)

    app.route('/contractSigns/:id/leftSigns')
        .all(app.config.passport.authenticate())
        .get(app.api.contractSign.getLeftSigns)

    app.route('/digitalCertificate/createPrivateKey')
        .all(app.config.passport.authenticate())
        .get(app.utils.digitalCertificate.createPrivateKey)
}