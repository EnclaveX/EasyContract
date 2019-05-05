var Web3 = require('web3');
// create an instance of web3 using the HTTP provider.
// NOTE in mist web3 is already available, so check first if it's available before instantiating
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

// web3.eth.defaultAccount = '0xf456794b787755e524a589accaec93ae11ea0679';

// var accounts = web3.eth.accounts;
// console.log(accounts); // ["0x407d73d8a49eeb85d32cf465507dd71d507100c1"] 

// var number = web3.eth.blockNumber;
// console.log(number); // 2744

// var balance = web3.eth.getBalance(web3.eth.accounts[0]);
// console.log(balance); // instanceof BigNumber
// console.log(balance.toString(10)); // '1000000000000'
// console.log(balance.toNumber()); // 1000000000000

// var info = web3.eth.getBlock(19);
// console.log(info);

// var transaction = web3.eth.getTransaction('0x78b8c836a084adcac59ba715879f0532112d6d818ca70b3559c58e94964fcfd1');
// console.log(transaction);

var MyContract = web3.eth.contract([
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
        }
      ],
      "name": "insereContrato",
      "outputs": [
        {
          "name": "retorno",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x327c5efd"
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
          "name": "_contratoHashEasyContract",
          "type": "uint256"
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
      "signature": "0x159a50ff"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_contratoHashEasyContract",
          "type": "uint256"
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
      "signature": "0xe913f754"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_contratoHashEasyContract",
          "type": "uint256"
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
      "signature": "0x93e8c0cc"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_contratoHashEasyContract",
          "type": "uint256"
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
      "signature": "0xd741a420"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_contratoHashEasyContract",
          "type": "uint256"
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
      "signature": "0xb51365b0"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_contratoHashEasyContract",
          "type": "uint256"
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
      "signature": "0xb5bf3d58"
    }
  ]);


var myContractInstance = MyContract.at('0x9A7DC170658BB4116Ef2d3Ca50e6C2a1E9F589d8');

console.log(myContractInstance.insereContrato.sendTransaction('contract.title',
    '0x42',
    12321,
    87687668,
    {
        from: '0xf456794b787755e524a589accaec93ae11ea0679',
        gas: 3000000
    }))

    // console.log(web3.eth.getTransactionReceipt('0x3580af46785137f249a0e0003281e5deda9ff0b1f425122dc7bff9116aa36b2f'))

    var state = web3.eth.getStorageAt("0x3580af46785137f249a0e0003281e5deda9ff0b1f425122dc7bff9116aa36b2f", 0);
console.log(state); 