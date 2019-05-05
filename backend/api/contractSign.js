module.exports = app => {
    const { existsOrError } = app.api.validations.generalValidation
  
    const save = (req, res) => {
        const contractSign = req.body

        app.db('contract_signs')
            .insert(contractSign)
            .then(_ => res.status(204).send())
            .catch(err => {
                res.status(500).send(err)})
    }

    const getLeftSigns = (req, res) => {
        app.db('contract_signs')
            .count('id')
            .where({signed: 'NÃO',
                    id: req.params.id})
            .first()
            .then(count => res.json(count))
            .catch(err => {
                res.status(500).send(err)
            })           
    }

    const signIn = (req, res) => {
        const userId = req.params.userId
        const contractId = req.params.contractId      
        const contract = { ...req.body }

        console.log(contract.privateKey)

        app.db('contract_signs')
            .update({
                signed:'SIM',
                privateKey: contract.privateKey
            })
            .where({
                contract_id: contractId,
                user_id: userId
            })
            .then(_ => res.status(204).send())
            .catch(err => {
                res.status(500).send(err)})
    }

    const remove = async (req, res) => {
        try {
            const rowsDeleted = await app.db('contract_signs')
                .where({ id: req.body.id }).del()
            
            try {
                existsOrError(rowsDeleted, 'O usuário do contrato não foi encontrado.')
            } catch(msg) {
                return res.status(400).send(msg)    
            }

            res.status(204).send()
        } catch(msg) {
            res.status(500).send(msg)
        }
    }

    const limitPagination = 99999

    const get = async (req, res) => {
        const page = req.query.page || 1

        const result = await app.db('contract_signs')
            .where({contract_id: req.params.id})
            .count('id').first()

        const count = parseInt(result.count)

        app.db({c: 'contract_signs', u: 'users'})
            .select('c.id', 'c.user_id', 'u.name', 'u.cgc', 'u.email', 'c.signed', 'c.contract_id')
            .limit(limitPagination).offset(page * limitPagination - limitPagination)
            .whereRaw('?? = ??', ['u.id', 'c.user_id'])
            .where({contract_id: req.params.id})
            .then(contractSigns => res.json({ data: contractSigns, count, limitPagination }))
            .catch(err => {res.status(500).send(err)})
    }

    return { save, remove, get, signIn, getLeftSigns }
}