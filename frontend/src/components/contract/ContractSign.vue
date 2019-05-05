<template>
    <div class="contract-sign-in">
        <h3>{{contract.title}}</h3>

        <p class="contract-content" v-html="contract.content" :key="contractContentKey"/>

        <b-button v-if="contract.id" variant="primary" @click="signIn">Assinar</b-button>
        <b-button class="ml-2" @click="returnHome">Voltar</b-button>
    </div>
</template>

<script>
import axios from "axios";
import {
        baseApiUrl,
        userKey,
        showError,
        baseApiUrlEasyContract,
        baseCertificadoUrl
    } from "@/global";
import { mask } from "vue-the-mask";

export default {
    name: "ContractSign",
    directives: { mask },
    data: function() {
        return {
            contract: {},
            contractContentKey: 0
        };
    },
    methods: {
        async loadContract() {
            if (this.$route.params.id !== "new") {
                const url = `${baseApiUrl}/contracts/${this.$route.params.id}`;

                this.contract = await axios.get(url).then(res => {
                    return { ...res.data };
                });

                await this.loadContractContent(this.contract);

                this.reRender();
            }
        },
        async loadContractContent(contract) {
            const url = `${baseApiUrl}/contracts/${
                this.$route.params.id
            }/contractVersions`;

            await axios.get(url).then(res => {
                if (res.data.content) {
                    contract.content = res.data.content;
                    return contract;
                } else {
                    return {};
                }
            });
        },
        getLeftSigns() {
            const url = `${baseApiUrl}/contractSigns/${this.contract.id}/leftSigns`;

            let leftSigns = 0;

            axios["get"](url).then(e => {
                leftSigns = e;
            });

            return leftSigns;
        },
        closeContract() {
            const url = `${baseApiUrl}/contracts/${this.contract.id}/closeContract`;

            return axios["post"](url)
                .then(_ => true)
                .catch(err => false);
        },
        async getPrivateKey(){
            const json = localStorage.getItem(userKey)
            const userData = JSON.parse(json) 

            return await axios.get(`${baseCertificadoUrl}/authenticate`)
                .then(res => {
                        return res.data.OU
                    })
        },
        async signIn() {
            const json = localStorage.getItem(userKey);
            const userData = JSON.parse(json);

            let url = `${baseApiUrl}/contracts/${this.contract.id}/signIn/${userData.id}`;

            this.contract.privateKey = await this.getPrivateKey()

            if (!this.contract.privateKey) {
                this.$toasted.show(
                    'Chave privada inválida em seu certificado',
                    {
                        duration: 2000,
                        type : 'error', 
                        icon : 'times'
                    }
                )

                return
            }

            axios["post"](url)
                .then(() => {
                    const leftSigns = this.getLeftSigns();

                    if (leftSigns === 0) {
                            this.closeContract();
                    }
                })
                .catch(showError);

            axios['post'](url, this.contract);    
                
            const easyContractHashId = this.contract.easyContractHashId ? `${this.contract.easyContractHashId}` : "";

            url = `${baseApiUrlEasyContract}/assinatura/${easyContractHashId}`;

            let contractSign = {
                userPrivateKey: this.contract.privateKey,
                dateSigned: new Date().getTime() / 1000,
                userIp: '17.1.1.1', //Será fixo enquanto o sistema não estiver pronto
                userName: 'Aladi',
                userCgc: '08113754989'
            }

            await axios['post'](url, contractSign)
                .then(response => {
                    this.contract.easyContractHashId  = response.data.easyContractHashId

                    this.$toasted.show(
                        `Número de protocolo EasyContract: ${
                            response.data.easyContractHashId
                        }`,
                        {
                            duration: 5000,
                            action: {
                                text: "Copiar",
                                onClick: (e, toastObject) => {
                                copyToClipboard(response.data.easyContractHashId);
                                toastObject.goAway(0);
                                }
                            }
                        }
                    );
                })
                .catch(showError);

            this.$toasted.global.defaultSuccess();
        },
        returnHome() {
            this.$router.push({ path: `/` });
        },
        reRender() {
            this.contractContentKey += 1;
        }
    },
    created() {
        this.loadContract();
    }
};
</script>

<style>
    .contract-content {
        height: 85%;
        background-color: white;
        padding: 20px;
        border: solid 1px gray;
        border-radius: 5px;
    }

    .contract-sign-in {
        padding: 10px;
    }
</style>
