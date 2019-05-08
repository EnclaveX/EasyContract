module.exports = app => {
    const { existsOrError } = app.api.validations.generalValidation

    const save = (req, res) => {
        const contractVersion = { ...req.body }

        try {
            existsOrError(contractVersion.contractId, 'O número do contrato não foi informado')
            existsOrError(contractVersion.content, 'O conteúdo do contrato não foi informado')

        } catch (msg) {
            res.status(400).send(msg)
        }

        contractVersion.createdAt = new Date

        app.db('contract_versions')
            .insert(contractVersion)
            .catch(err => {
                res.status(500).send(err)}
            )
    }

    const remove = async (req, res) => {
        try {
            const rowsDeleted = await app.db('contract_versions')
                .where({ id: req.params.id }).del()
            try {
                existsOrError(rowsDeleted, 'A versão do contrato não foi encontrado.')
            } catch (msg) {
                return res.status(400).send(msg)
            }

            res.status(204).send()
        } catch (msg) {
            res.status(500).send(msg)
        }
    }

    const getById = (req, res) => {
        app.db('contract_versions')
            .where({ id: req.params.id })
            .first()
            .then(contractVersion => {
                contractVersion.content = contractVersion.content.toString()

                return res.json(contractVersion)
            })
            .catch(err => res.status(500).send(err))
    }

    const getByContract = async (req, res) => {
        const contractId = req.params.id

        app.db('contract_versions')
            .select('id', 'content')
            .where({ contractId: contractId })
            .orderBy('createdAt', 'desc')
            .first()
            .then(contractVersions => {
                if (contractVersions) {
                    contractVersions.content = contractVersions.content.toString()

                    return res.json(contractVersions)
                } else {
                    return res.json({})
                }
            })
            .catch(err => {
                res.status(500).send(err)
            })
    }

    return { save, remove, getById, getByContract }
}