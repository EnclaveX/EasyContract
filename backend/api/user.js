const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validations.generalValidation
    const { validateCgc } = app.api.validations.cgcValidation

    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    const save = async (req, res) => {
        const user = { ...req.body }

        if(req.params.id) user.id = req.params.id
        
        try {
            existsOrError(user.name, 'O nome não foi informado')
            existsOrError(user.cgc, 'O CPF/CNPJ não foi informado')
            validateCgc(user.cgc, 'CPF/CNPJ inválido')
            existsOrError(user.email, 'O e-mail não foi informado')
            existsOrError(user.password, 'A senha não foi informada')
            existsOrError(user.confirmPassword, 'A confirmação da senha não foi informada')
            equalsOrError(user.password, user.confirmPassword,
                'As senhas informadas não conferem')          

            const userFromDB = await app.db('users')
                .where({ email: user.email })
                .orWhere({cgc: user.cgc}).first()

            if(!user.id) {
                notExistsOrError(userFromDB, 'O usuário já está cadastrado')
            }
        } catch(msg) {
            return res.status(400).send(msg)
        }

        user.password = encryptPassword(user.password)
        
        delete user.confirmPassword

        if(user.id) {
            app.db('users')
                .update(user)
                .where({ id: user.id })
                .whereNull('deletedAt')
                .then(_ => {
                    res.status(204).send()
                })
                .catch(err => res.status(500).send(err))
        } else {
            app.db('users')
                .insert(user)
                .then(_ => {
                    res.status(204).send()
                })
                .catch(err => res.status(500).send(err))
        }
    }

    const get = (req, res) => {
        app.db('users')
            .select('id', 'name', 'email', 'cgc')
            .whereNull('deletedAt')
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))
    }

    const searchUser = (req, res) => {
        let search = req.params.search

        if (search) {
            search  = `%${search}%`
        } else {
            search  = '%'
        }

        app.db('users')
            .select('id', 'name', 'email', 'cgc')
            .whereNull('deletedAt')
            .where(function() {
                this.where('name', 'like', search)
                    .orWhere('cgc', 'like', search)
                    .orWhere('email', 'like', search)
            })
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('users')
            .select('id', 'name', 'email', 'cgc')
            .where({ id: req.params.id })
            .whereNull('deletedAt')
            .first()
            .then(user => res.json(user))
            .catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => {
        try {
            const rowsUpdated = await app.db('users')
                .update({deletedAt: new Date()})
                .where({ id: req.params.id })
            existsOrError(rowsUpdated, 'O usuário não foi encontrado.')

            res.status(204).send()
        } catch(msg) {
            res.status(400).send(msg)
        }
    }

    return { save, get, getById, remove, searchUser }
}