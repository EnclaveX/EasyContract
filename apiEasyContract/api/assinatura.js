module.exports = app => {
    var Web3 = require('web3')

    var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

    var MyContract = web3.eth.contract(app.config.global.abiEasyContract);
    var myContractInstance = MyContract.at('0xE128f498683E85da03906525935C295DC42b1937');

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