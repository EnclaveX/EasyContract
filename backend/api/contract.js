const https = require('https');

module.exports = app => {
    const { existsOrError } = app.api.validations.generalValidation

    const closeContract = (req, res) => {
        const contractId = req.params.contractId

        app.db('contracts')
            .update({
                situation: 'ASSINADO'
            })
            .where({
                id: contractId
            })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
    }

    const save = (req, res) => {
        const contract = { ...req.body }

        if (req.params.id && !contract.id) contract.id = req.params.id

        try {
            existsOrError(contract.title, 'O título não foi informado')
            existsOrError(contract.userRegisterId, 'O usuário não foi informado')
        } catch (msg) {
            res.status(400).send(msg)
        }

        if (contract.id) {
            app.db('contracts')
                .update(contract)
                .where({ id: contract.id })
                .then(_ => {
                    res.status(204).send()
                })
                .catch(err => {
                    res.status(500).send(err)
                })
        } else {
            contract.createdAt = new Date().toLocaleString('pt-BR')

            app.db('contracts')
                .insert(contract)
                .returning('id')
                .then((id) => {
                    res.json({ status: 204, id })
                })
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try {
            const rowsDeleted = await app.db('contracts')
                .where({ id: req.params.id }).del()
            try {
                existsOrError(rowsDeleted, 'O contrato não foi encontrado.')
            } catch (msg) {
                return res.status(400).send(msg)
            }

            res.status(204).send()
        } catch (msg) {
            res.status(500).send(msg)
        }
    }

    const limitPagination = 9

    const get = async (req, res) => {
        const page = req.query.page || 1
        const result = await app.db('contracts').count('id').first()
        const count = parseInt(result.count)

        app.db('contracts')
            .select('id', 'title', 'userRegisterId')
            .limit(limitPagination)
            .offset(page * limitPagination - limitPagination)
            .then(contracts => res.json({
                data: contracts,
                count,
                limitPagination
            }))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        let count = 0

        count = app.db('contracts')
            .count('*')
            .where({ id: req.params.id })
            .then(e => {
                return e[0].count
            })

        if (count === 0) {
            return res.json({
                id: null,
                title: 'Contrato não encontrado',
                content: 'Este contrato não existe em nossa base de dados.'
            })
        }

        app.db('contracts')
            .where({ id: req.params.id })
            .first()
            .then(contract => {
                if (contract.userRegisterId == req.user.id) {
                    return res.json(contract)
                } else {
                    app.db('contract_signs')
                        .where({
                            contract_id: contract.id,
                            user_id: req.user.id
                        })
                        .then(_ => {
                            if (_.length === 0) {
                                return res.json({
                                    id: null,
                                    title: 'Vizualização não autorizada',
                                    content: 'Você não possui permissão para ler este contrato.'
                                })
                            } else {
                                return res.json(contract)
                            }
                        })
                        .catch(err => res.status(500).send(err))
                }
            })
            .catch(err => res.status(500).send(err))
    }

    const getByUser = async (req, res) => {
        const userId = req.params.id
        const page = req.query.page || 1

        const contractsIdColumnIdentifier = app.db.raw('??', ['contracts.id']);

        const subqueryUserSigns = app.db('contract_signs').count('*')
            .where('contract_id', contractsIdColumnIdentifier)
            .as('userSignsCount');

        const subqueryUserSigneds = app.db('contract_signs').count('*')
            .where('contract_id', contractsIdColumnIdentifier)
            .andWhere('signed', 'SIM')
            .as('userSignedsCount');

        app.db.select('id', 'title', 'situation', 'createdAt', subqueryUserSigns, subqueryUserSigneds)
            .from('contracts')
            .limit(limitPagination).offset(page * limitPagination - limitPagination)
            .where({ userRegisterId: userId })
            .then(contracts => res.json(contracts))
            .catch(err => { res.status(500).send(err) })
    }

    const getContractsToSign = async (req, res) => {
        const userId = req.params.id
        const page = req.query.page || 1

        const contractsIdColumnIdentifier = app.db.raw('??', ['contracts.id']);

        const subqueryUserSigns = app.db('contract_signs').count('*')
            .where('contract_id', contractsIdColumnIdentifier)
            .as('userSignsCount');

        const subqueryUserSigneds = app.db('contract_signs').count('*')
            .where('contract_id', contractsIdColumnIdentifier)
            .andWhere('signed', 'SIM')
            .as('userSignedsCount');

        app.db.select('contracts.id', 'title', 'situation', 'createdAt', subqueryUserSigns, subqueryUserSigneds)
            .from('contracts')
            .innerJoin('contract_signs', 'contract_signs.contract_id', 'contracts.id')
            .limit(limitPagination).offset(page * limitPagination - limitPagination)
            .whereRaw('contract_signs.user_id = ?', userId)
            .whereNotIn('contracts.situation', ['ASSINADO', 'CANCELADO'])
            .then(contracts => res.json(contracts))
            .catch(err => {
                res.status(500).send(err)
            })
    }

    return { save, remove, get, getById, getByUser, getContractsToSign, closeContract }
}