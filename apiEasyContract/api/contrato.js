module.exports = app => {
    var Web3 = require('web3')

    var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

    var MyContract = web3.eth.contract(app.config.global.abiEasyContract);
    var myContractInstance = MyContract.at('0x0501f764A93A0410b6f10b9609a7a0De5CCe5701');

    const insert = (req, res) => {
        const contract = { ...req.body }

        const easyContractHashId = app.utils.randomHash.randomHash(55)

        const response = myContractInstance.insereContrato.
            sendTransaction(contract.title,
                contract.content,
                contract.createdAt,
                contract.id,
                easyContractHashId,
                {
                    from: app.config.global.ethereumAccount,
                    gas: app.config.global.gasLimit
                })

        res.json({
            status: 204,
            resultado: response,
            easyContractHashId
        })
    }

    const get = (req, res) => {
        const easyContractHashId = req.params.easyContractHashId

        const response = myContractInstance.buscarContrato.
            call(easyContractHashId);

            console.log(response)
            console.log(easyContractHashId)

        res.json({
            status: 204,
            resultado: response
        })
    }

    const edit = (req, res) => {
        const easyContractHashId = req.params.easyContractHashId

        const contract = { ...req.body }

        const response = myContractInstance.alterarContrato.
            sendTransaction(contract.title,
                contract.content,
                easyContractHashId,
                {
                    from: app.config.global.ethereumAccount,
                    gas: app.config.global.gasLimit
                });

        res.json({
            status: 204,
            resultado: response
        })
    }

    const remove = (req, res) => {
        const easyContractHashId = req.params.easyContractHashId

        const response = myContractInstance.deletarContrato.
            sendTransaction(
                easyContractHashId,
                {
                    from: app.config.global.ethereumAccount,
                    gas: app.config.global.gasLimit
                });

        res.json({
            status: 204,
            resultado: response
        })
    }

    return { insert, get, edit, remove }
}