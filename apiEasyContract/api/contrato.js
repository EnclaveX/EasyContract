module.exports = app => {
    var Web3 = require('web3')

    var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

    var MyContract = web3.eth.contract(app.config.global.abiEasyContract);
    var myContractInstance = MyContract.at('0x0501f764A93A0410b6f10b9609a7a0De5CCe5701');

    const insere = (req, res) => {
        const contract = { ...req.body }

        const easyContractHashId = app.utils.randomHash.randomHash(55)

        const retorno = myContractInstance.insereContrato.sendTransaction(contract.title,
            contract.content,
            contract.createdAt,
            contract.id,
            easyContractHashId,
            {
                from: app.config.global.ethereumAccount,
                gas: app.config.global.gasLimit
            })

        res.json({ status: 204, resultado: retorno, easyContractHashId })
    }

    const buscar = (req, res) => {
        const easyContractHashId = req.params.easyContractHashId

        const retorno = myContractInstance.buscarContrato.call(easyContractHashId);

        res.json({ status: 204, resultado: retorno })
    }

    const alterar = (req, res) => {
        const easyContractHashId = req.params.easyContractHashId

        const contract = { ...req.body }

        const retorno = myContractInstance.alterarContrato.sendTransaction(contract.title,
            contract.content,
            easyContractHashId,
            {
                from: app.config.global.ethereumAccount,
                gas: app.config.global.gasLimit
            });

        res.json({ status: 204, resultado: retorno })
    }

    const deletar = (req, res) => {
        const easyContractHashId = req.params.easyContractHashId

        const retorno = myContractInstance.deletarContrato.sendTransaction(
            easyContractHashId,
            {
                from: app.config.global.ethereumAccount,
                gas: app.config.global.gasLimit
            });

        res.json({ status: 204, resultado: retorno })
    }

    return { insere, buscar, alterar, deletar }
}