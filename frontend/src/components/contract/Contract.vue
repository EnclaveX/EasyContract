<template>
    <div class="contract">
        <PageTitle icon="fa fa-edit" main="Contratos" sub/>

        <b-card class="contract-form">
            <b-form>
            <input id="contract-id" type="hidden" v-model="contract.id">
            <b-form-group id="contract-title-label" label="Título:" label-for="contract-title">
                <b-form-input
                id="contract-title"
                type="text"
                v-model="contract.title"
                required
                placeholder="Informe o título do contrato..."
                />
            </b-form-group>

            <b-tabs class="contract-sources" content-class="mt-3">
                <b-tab title="Participantes" active>
                <b-row class="button-line-add">
                    <b-button @click="showModalUsers" variant="success">+ Adicionar</b-button>
                </b-row>
                <b-table hover :items="usersSign" :fields="fields">
                    <template
                    slot="signed"
                    slot-scope="data"
                    >{{data.item.signed === 'SIM' ? 'Assinado' : 'Não assinado'}}</template>
                    <template slot="actions" slot-scope="data">
                    <b-button variant="danger" @click="remove(data.item, data.index)">
                        <i class="fa fa-trash"></i>
                    </b-button>
                    </template>
                </b-table>
                </b-tab>
                <b-tab title="Conteúdo">
                <b-form-group>
                    <VueEditor
                    :disabled="((contract.userRegisterId === user.id.toString()) || !contract.userRegisterId) ? false : true"
                    ref="editor"
                    v-model="contractVersion.content"
                    class="modal-editor"
                    :editorToolbar="customToolbar"
                    :placeholder="contract.userRegisterId === user.id.toString() ? 'Informe o conteúdo do Contrato...' : ''"
                    />
                </b-form-group>
                </b-tab>
            </b-tabs>
            <hr>
            <b-row class="button-line">
                <b-button @click="save" variant="primary">Salvar</b-button>
                <b-button class="ml-2" @click="returnHome">Voltar</b-button>
            </b-row>
            </b-form>
        </b-card>

        <UserModal v-if="showModalUser" @close="showModalUser = false" @selectUser="addUser"/>
    </div>
</template>

<script>
    import axios from "axios";

    import { VueEditor } from "vue2-editor";
    import { baseApiUrl, showError, baseApiUrlEasyContract } from "@/global";

    import PageTitle from "../template/PageTitle";
    import { copyToClipboard } from "../utils/functions.js";
    import { mapState } from "vuex";
    import UserModal from "../utils/UserModal";

    export default {
        name: "Contract",
        computed: mapState(["user"]),
        components: { VueEditor, PageTitle, UserModal },
        data: function() {
            return {
                contract: {},
                showModalUser: false,
                contractVersion: {},
                userSign: {
                    id: null,
                    user_id: null,
                    name: null,
                    cgc: null,
                    signed: null,
                    email: null
            },
            usersSign: [],
            modeUser: "none",
            customToolbar: [
                ["bold", "italic", "underline", "strike"], // toggled buttons
                ["blockquote"],
                [{ list: "ordered" }, { list: "bullet" }],
                [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
                [{ size: ["small", false, "large", "huge"] }], // custom dropdown
                [{ color: [] }, { background: [] }], // dropdown with defaults from theme
                [{ font: [] }],
                [{ align: [] }]
            ],
            fields: [
                { key: "user_id", label: "Código", sortable: true },
                { key: "name", label: "Nome", sortable: true },
                { key: "cgc", label: "CPF/CNPJ", sortable: true },
                { key: "email", label: "E-Mail", sortable: true },
                { key: "signed", label: "Assinado?", sortable: true },
                { key: "actions", label: "Ações" }
            ]
            };
        },
        methods: {
            async loadContract() {
                if (this.$route.params.id !== "new") {
                    const url = `${baseApiUrl}/contracts/${this.$route.params.id}`;

                    axios.get(url)
                        .then(res => {
                            this.contract = res.data;
                        })
                        .catch(showError);

                    this.loadContractSign();
                    this.loadContractContent();
                }
            },
            loadContractSign() {
                const url = `${baseApiUrl}/contracts/${
                    this.$route.params.id
                }/contractSigns`;

                axios.get(url).then(res => {
                    const returned = res.data;

                    if (returned.data.length > 0) {
                        this.usersSign = [];

                        returned.data.forEach(item => {
                            let userReturned = {};

                            userReturned.id = item.id;
                            userReturned.name = item.name;
                            userReturned.cgc = item.cgc;
                            userReturned.user_id = item.user_id;
                            userReturned.email = item.email;
                            userReturned.signed = item.signed;
                            userReturned.contract_id = item.contract_id;

                            this.usersSign.push(userReturned);
                        });
                    }
                });
            },
            loadContractContent() {
                const url = `${baseApiUrl}/contracts/${
                    this.$route.params.id
                }/contractVersions`;

                axios.get(url).then(res => {
                    if (res.data.content) {
                        this.contractVersion.content = res.data.content;
                    }
                });
            },
            showModalUsers() {
                this.showModalUser = true;
            },
            returnHome() {
                this.$router.push({ path: `/` });
            },
            addUser(payload) {
                this.userSign = { ...payload.user };

                let insert = true;

                this.usersSign.forEach(item => {
                    if (item.user_id === this.userSign.id) {
                    insert = false;
                    }
                });

                if (insert) {
                    this.userSign.signed = "NÃO";
                    this.userSign.user_id = this.userSign.id;
                    this.userSign.id = null;

                    this.usersSign.push(this.userSign);
                }
            },
            remove(item, index) {
                const id = `/${this.contract.id}`;
                const url = `${baseApiUrl}/contracts${id}/contractSigns`;

                if (item.id) {
                    axios
                        .delete(url, { data: { id: item.id } })
                        .then(() => {
                            this.$toasted.global.defaultSuccess();
                        })
                        .catch(showError);
                }

                this.usersSign.splice(index, 1);
            },
            saveContractSign() {
                let returnValue = true;

                const url = `${baseApiUrl}/contracts/${this.contract.id}/contractSigns`;

                this.usersSign.forEach(item => {
                    let userSign = {};

                    if (!item.id) {
                    userSign.user_id = item.user_id;
                    userSign.email = item.email;
                    userSign.digital_certificate = null;
                    userSign.signed = "NÃO";
                    userSign.contract_id = this.contract.id;

                    axios["post"](url, userSign)
                        .then(_ => {
                        returnValue = true;
                        })
                        .catch(e => {
                        returnValue = false;
                        });
                    }
                });

                return returnValue;
            },
            saveContractContent() {
                let returnValue = true;

                const url = `${baseApiUrl}/contracts/${
                    this.contract.id
                }/contractVersions`;

                this.contractVersion.content = this.contractVersion.content
                    ? this.contractVersion.content
                    : "";

                const contractContent = {
                    content: this.contractVersion.content,
                    contractId: this.contract.id
                };

                axios
                    .post(url, contractContent)
                    .then(_ => {
                        returnValue = true;
                    })
                    .catch(e => {
                        returnValue = false;
                    });

                return returnValue;
            },
            async save() {
                let url = "";
                const method = this.contract.id ? "put" : "post";
                const id = this.contract.id ? `${this.contract.id}` : "";

                url = `${baseApiUrl}/contracts/${id}`;

                if (!id) {
                    this.contract.userRegisterId = this.user.id;
                    this.contract.createdAt = new Date().toLocaleString("pt-BR");
                }

                await axios[method](url, this.contract)
                    .then(response => {
                        if (!this.contract.id) {
                            this.contract.id = response.data.id[0];
                        }
                    })
                    .catch(showError);

                if (this.contract.id) {
                    const returnContractSign = await this.saveContractSign();
                    const returnContractContent = await this.saveContractContent();

                    if (returnContractSign && returnContractContent) {
                        const contract = {
                            content: this.contractVersion.content,
                            id: this.contract.id,
                            createdAt: new Date().getTime() / 1000,
                            title: this.contract.title
                        };

                        const easyContractHashId = this.contract.easyContractHashId ? `${this.contract.easyContractHashId}` : "";

                        url = `${baseApiUrlEasyContract}/contrato/${easyContractHashId}`;

                        await axios[method](url, contract)
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

                        const newId = this.contract.id ? `${this.contract.id}` : "";

                        url = `${baseApiUrl}/contracts/${newId}`;
                        
                        await axios['put'](url, this.contract)
                            .then(response => {
                                if (!this.contract.id) {
                                    this.contract.id = response.data.id[0];
                                }
                            })
                            .catch(showError);

                        this.$toasted.global.defaultSuccess();
                        this.$router.push({ path: `/` });
                    }
                }
            }
        },
        created() {
            this.loadContract();
        },
        mounted() {
            this.loadContract();
        }
    };
</script>

    <style>
.contract {
  display: flex;
  flex-direction: column;
}

.contract-form {
  margin: 0 20px 20px 20px;
}

.contract-sources {
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
}

.button-line {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
  margin-right: 5px;
}

.quillWrapper {
  height: inherit;
}

.button-line {
  display: flex;
  justify-content: flex-start;
  margin-left: 10px;
}

.button-line-add {
  display: flex;
  justify-content: flex-end;
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>
