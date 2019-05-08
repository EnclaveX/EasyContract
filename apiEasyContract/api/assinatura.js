module.exports = app => {
    var Web3 = require('web3')

    var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

    var MyContract = web3.eth.contract(app.config.global.abiEasyContract);
    var myContractInstance = MyContract.at('0x9A7DC170658BB4116Ef2d3Ca50e6C2a1E9F589d8');

    const insert = (req, res) => {
        const contractSign = { ...req.body }

        const easyContractHashId = req.params.easyContractHashId

        const response = myContractInstance.inserirAssinatura.
            sendTransaction(easyContractHashId,
                contractSign.userPrivateKey,
                contractSign.dateSigned,
                contractSign.userIp,
                contractSign.userName,
                contractSign.userCgc,
                {
                    from: app.config.global.ethereumAccount,
                    gas: app.config.global.gasLimit
                })

        res.json({
            status: 204,
            result: response,
            easyContractHashId
        })
    }

    const get = (req, res) => {
        const easyContractHashId = req.params.easyContractHashId

        const contract = { ...req.body }

        const response = myContractInstance.buscarAssinatura.
            call(easyContractHashId,
                contract.userPrivateKey
            );

        res.json({
            status: 204,
            result: response
        })
    }

    const remove = (req, res) => {
        const easyContractHashId = req.params.easyContractHashId

        const contract = { ...req.body }

        const response = myContractInstance.removerAssinatura.sendTransaction(
            easyContractHashId,
            contract.userPrivateKey,
            {
                from: app.config.global.ethereumAccount,
                gas: app.config.global.gasLimit
            });

        res.json({
            status: 204,
            result: response
        })
    }

    return { insert, get, remove }
}