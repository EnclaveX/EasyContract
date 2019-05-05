pragma solidity ^0.5.0; 

contract EasyContract {
    address criadorContratoInteligente;
    uint    sequencialContratos;
    uint    nonce;
    
    struct assinatura {
        string privateKeyParticipante;
        uint256 dataAssinatura;
        string ipParticipante;
        string nomeParticipante;
        string cgcParticipante;
        bool assinado;
    }
    
    struct contrato {
        string titulo;
        bytes32 conteudo;
        uint256 dataCriacao;
        address criador;
        uint contratoId;
        string _easyContractHashId;
        uint numeroAssinaturas;
        mapping (string => assinatura) assinaturas;
    }
    
    mapping (string => contrato) contratos;

    constructor () public {
		criadorContratoInteligente  = msg.sender;
        nonce                       = 0;
        sequencialContratos         = 0;
	}

	function insereContrato(string memory _titulo,
	                        bytes32 _conteudo,
	                        uint _dataCriacao,
                            uint _contratoId,
                            string memory _easyContractHashId) public returns(bool retorno){
                                
        contrato memory _contrato;

        _contrato.titulo                    = _titulo;
        _contrato.conteudo                  = _conteudo;
        _contrato.dataCriacao               = _dataCriacao;
        _contrato.criador                   = msg.sender;
        _contrato.contratoId                = _contratoId;
        _contrato._easyContractHashId       = _easyContractHashId;
        
        sequencialContratos++;

        contratos[_easyContractHashId] = _contrato;

        return true;
    }

    function alterarContrato(string memory _novotitulo,
                             bytes32 _novoConteudo,
                             string memory _easyContractHashId) public returns(bool retorno){
        contratos[_easyContractHashId].titulo = _novotitulo;
        contratos[_easyContractHashId].conteudo = _novoConteudo;

        return true;
    }

    function deletarContrato(string memory _easyContractHashId) public returns (bool retorno){
        delete contratos[_easyContractHashId];

        return true;
    }

    function inserirAssinatura(string memory _easyContractHashId,
                               string memory _privateKeyParticipante,
                               uint256 _dataAssiantura,
                               string memory _ipParticipante,
                               string memory _nomeParticipante,
                               string memory _cgcParticipante) public returns (bool retorno){
        assinatura memory novaAssinatura;

        novaAssinatura.privateKeyParticipante   = _privateKeyParticipante;
        novaAssinatura.dataAssinatura           = _dataAssiantura;
        novaAssinatura.ipParticipante           = _ipParticipante;
        novaAssinatura.nomeParticipante         = _nomeParticipante;
        novaAssinatura.cgcParticipante          = _cgcParticipante;
        novaAssinatura.assinado                 = true;

        contratos[_easyContractHashId].numeroAssinaturas ++;
        contratos[_easyContractHashId].assinaturas[_privateKeyParticipante] = novaAssinatura;

        return true; 
    }

    function removerAssinatura(string memory _easyContractHashId,
                               string memory _privateKeyParticipante) public returns (bool retorno){
        contratos[_easyContractHashId].assinaturas[_privateKeyParticipante].assinado = false;
        
        return true;
    }
    
    function buscarContrato(string memory _easyContractHashId) public view returns (string memory titulo, 
                                                                                    bytes32 conteudo, 
                                                                                    uint256 dataCriacao,
                                                                                    address criador) {
        return (
            contratos[_easyContractHashId].titulo,
            contratos[_easyContractHashId].conteudo,
            contratos[_easyContractHashId].dataCriacao,
            contratos[_easyContractHashId].criador
        );
    }
    
    function buscarAssinatura(string memory _easyContractHashId,
                              string memory _privateKeyParticipante) public view returns (bool retorno){
        return contratos[_easyContractHashId].assinaturas[_privateKeyParticipante].assinado;
    }   
}