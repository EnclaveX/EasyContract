module.exports = app => {
    var Web3 = require('web3')

    var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

    var MyContract = web3.eth.contract(app.config.global.abiEasyContract);
    var myContractInstance = MyContract.at('0x9A7DC170658BB4116Ef2d3Ca50e6C2a1E9F589d8');

    const insere = (req, res) => {
        const assinatura = { ...req.body }

        const easyContractHashId = req.params.easyContractHashId

        const retorno = myContractInstance.inserirAssinatura.sendTransaction(easyContractHashId,
            assinatura.userPrivateKey,
            assinatura.dateSigned,
            assinatura.userIp,
            assinatura.userName,
            assinatura.userCgc,
            {
                from: app.config.global.ethereumAccount,
                gas: app.config.global.gasLimit
            })

        res.json({ status: 204, resultado: retorno, easyContractHashId })
    } 

    const buscar = (req, res) => {
        const easyContractHashId = req.params.easyContractHashId

        const contract = { ...req.body }

        const retorno = myContractInstance.buscarAssinatura.call(easyContractHashId,
            contract.userPrivateKey
            );

        res.json({ status: 204, resultado: retorno })
    }

    const deletar = (req, res) => {
        const easyContractHashId = req.params.easyContractHashId

        const contract = { ...req.body }

        const retorno = myContractInstance.removerAssinatura.sendTransaction(
            easyContractHashId,
            contract.userPrivateKey,
            {
                from: app.config.global.ethereumAccount,
                gas: app.config.global.gasLimit
            });

        res.json({ status: 204, resultado: retorno })
    }

    return { insere, buscar, deletar }
}