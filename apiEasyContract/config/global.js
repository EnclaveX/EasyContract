module.exports = app => {
    const ethereumAccount = '0xf456794b787755e524a589accaec93ae11ea0679'
    const gasLimit  = 3000000
    const abiEasyContract = [
      {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor",
        "signature": "constructor"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_titulo",
            "type": "string"
          },
          {
            "name": "_conteudo",
            "type": "bytes32"
          },
          {
            "name": "_dataCriacao",
            "type": "uint256"
          },
          {
            "name": "_contratoId",
            "type": "uint256"
          },
          {
            "name": "_easyContractHashId",
            "type": "string"
          }
        ],
        "name": "insereContrato",
        "outputs": [
          {
            "name": "retorno",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0x8f463826"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_novotitulo",
            "type": "string"
          },
          {
            "name": "_novoConteudo",
            "type": "bytes32"
          },
          {
            "name": "_easyContractHashId",
            "type": "string"
          }
        ],
        "name": "alterarContrato",
        "outputs": [
          {
            "name": "retorno",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0x8eee43ca"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_easyContractHashId",
            "type": "string"
          }
        ],
        "name": "deletarContrato",
        "outputs": [
          {
            "name": "retorno",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0x0be01c03"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_easyContractHashId",
            "type": "string"
          },
          {
            "name": "_privateKeyParticipante",
            "type": "string"
          },
          {
            "name": "_dataAssiantura",
            "type": "uint256"
          },
          {
            "name": "_ipParticipante",
            "type": "string"
          },
          {
            "name": "_nomeParticipante",
            "type": "string"
          },
          {
            "name": "_cgcParticipante",
            "type": "string"
          }
        ],
        "name": "inserirAssinatura",
        "outputs": [
          {
            "name": "retorno",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0x64e8511b"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_easyContractHashId",
            "type": "string"
          },
          {
            "name": "_privateKeyParticipante",
            "type": "string"
          }
        ],
        "name": "removerAssinatura",
        "outputs": [
          {
            "name": "retorno",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0xa65f386a"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_easyContractHashId",
            "type": "string"
          }
        ],
        "name": "buscarContrato",
        "outputs": [
          {
            "name": "titulo",
            "type": "string"
          },
          {
            "name": "conteudo",
            "type": "bytes32"
          },
          {
            "name": "dataCriacao",
            "type": "uint256"
          },
          {
            "name": "criador",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0xdeefd404"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_easyContractHashId",
            "type": "string"
          },
          {
            "name": "_privateKeyParticipante",
            "type": "string"
          }
        ],
        "name": "buscarAssinatura",
        "outputs": [
          {
            "name": "retorno",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0x42010945"
      }
    ]

    return { ethereumAccount, gasLimit, abiEasyContract }
}