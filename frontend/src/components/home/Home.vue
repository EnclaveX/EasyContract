<template>
    <div class="home">
        <div v-if="certificadoDigitalValid" class="contracts">
            <h3>Contratos para serem assinados por mim</h3>
            <div class="toSign">
                <div :class="contract.id ? 'contract' : 'new-contract'" v-for="contract in contractsToSign" :key="contract.id"
                    @click="showContracts(contract, 'toSign')">
                    <ContractHomeCard :contract="contract" class="contract-field"/>
                </div>
            </div>

            <h3>Contratos recentemente digitados por mim</h3>
            <div class="writed">
                <div :class="contract.id ? 'contract' : 'new-contract'" v-for="contract in contracts" :key="contract.id"
                    @click="showContracts(contract, 'toWrite')">
                    <ContractHomeCard :contract="contract" class="contract-field"/>
                </div>
            </div>
            <div class="linkContractQuery" @click="showContractsQuery">Ver todos os contratos</div>
        </div>
        <div v-else-if="pageReady" class="warning">
            <h4>Você não possúi um certificado válido instalado nesta máquina</h4>
            <h5>Clique no botão abaixo para fazer o download do seu certificado.</h5>
            <b-button @click="createPrivateKey" variant="primary">Download do certificado</b-button>
            <p>Após o download do certificado instale o mesmo, feche todos os seus navegadores e acesse novamente.</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { baseApiUrl, userKey, baseCertificadoUrl } from '@/global'
import ContractHomeCard from './ContractHomeCard'

export default {
    name: 'Home',
    components: { ContractHomeCard },
    data: function(){
        return {
            contracts: [],
            contractsToSign: [],
            contract: {
                id: null,
                title: null,
                situation: null,
                createdAt: null,
                userSignedsCount: 0,
                userSignsCount: 0
            },
            showContractSign: false,
            certificadoDigitalValid: false,
            pageReady: false
        }
    },
    methods: {
        forceFileDownload(response){
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', 'cert.p12') //or any other extension
            document.body.appendChild(link)
            link.click()
        },
        async createPrivateKey(){
            axios({
                    url: `${baseApiUrl}/digitalCertificate/createPrivateKey`,
                    method: 'GET',
                    responseType: 'blob'
                })
                .then(res => {
                    this.forceFileDownload(res)
                })
        },
        async showContractsQuery(){
            this.$router.push({ path: `/contracts` })
        },
       verifyPrivateKey(){
            const json = localStorage.getItem(userKey)
            const userData = JSON.parse(json) 

            return axios['get'](`${baseCertificadoUrl}/authenticate`)
                .then(e => {
                    if (e.data.O === userData.cgc){
                        this.certificadoDigitalValid = true
                    } else {
                        this.certificadoDigitalValid = false
                    }
                })
                .then(e => this.certificadoDigitalValid)
        },
        async showContracts(contract, type){
            if (type === 'toSign'){
                this.$router.push({ path: `/contractSign/${contract.id}` })
            } else {
                this.$router.push({ path: `/contract/${contract.id ? contract.id : 'new'}` })
            }
        },
        async loadContracts() {
            const json = localStorage.getItem(userKey)
            const userData = JSON.parse(json)          
            const res = await axios.get(`${baseApiUrl}/users/${userData.id}/contracts`)
            this.contracts = res.data

            this.contracts  = this.contracts.map((item) => {
                if (item.title.length > 40) {
                    item.title = item.title.substring(0,40) + '...'
                }

                item.type   = 'toWrite'

                return item
            })

            this.contracts.push(this.contract)
        },
        async loadContractsToSign() {
            const json = localStorage.getItem(userKey)
            const userData = JSON.parse(json)          
            const res = await axios.get(`${baseApiUrl}/users/${userData.id}/contractsToSign`)
            this.contractsToSign = res.data

            this.contractsToSign  = this.contractsToSign.map((item) => {
                if (item.title.length > 40) {
                    item.title = item.title.substring(0,40) + '...'
                }

                item.type   = 'toSign'

                return item
            })
        }
    },
    created(){
        this.verifyPrivateKey()
    },
    mounted() {
        this.loadContracts()
        this.loadContractsToSign()

        this.pageReady = true
    },
    updated(){
    }
}
</script>

<style>
    .home {
        display: flex;
        flex-direction: column;
    }

    .contracts {
        display: block;
        flex-direction: column;
        width: 100%;
    }

    .writed {
        display: flex;
        width: 100%;
        flex-direction: row;
        flex-wrap: wrap;
    }

    .toSign {
        display: flex;
        flex-direction: row;
    }
</style>
