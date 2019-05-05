<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">
                    <div class="modal-header">
                        <h1>{{'Consulta de usuários'}}</h1>
                    </div>

                    <b-form>
                        <b-row>
                            <b-col sm="12">
                                <b-form-group label="Buscar:" label-for="search-input">
                                    <b-form-input v-model="searchText" @input="loadUsers" @change="loadUsers" id="search-input" type="text"
                                         required
                                        placeholder="Busque por nome, e-mail ou cpf do usuário..." />
                                </b-form-group>
                            </b-col>
                        </b-row>

                        <div class="modal-body">
                            <div class="user-table">
                                <b-table 
                                    selectable
                                    select-mode='single'
                                    hover
                                    :items="users" :fields="fields"
                                    @row-selected="rowSelected"
                                    @row-dblclicked="selectUser">
                                </b-table>
                            </div>
                        </div>
                    </b-form>

                    <b-button variant="primary" @click="selectUser">Selecionar</b-button>
                    <b-button class="ml-2" @click="$emit('close')">Cancelar</b-button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import axios from 'axios'
import { baseApiUrl } from '@/global'
import { VueEditor } from "vue2-editor"
import { mask } from 'vue-the-mask'

export default {
    name: 'UserModal',
    components: { VueEditor },
    directives: { mask },
    data: function() {
        return {
            searchText: '',
            users: [],
            fields: [
                { key: 'id', label: 'Código', sortable: true },
                { key: 'name', label: 'Nome', sortable: true },
                { key: 'cgc', label: 'CPF/CNPJ', sortable: true },
                { key: 'email', label: 'E-Mail', sortable: true }
            ]
        }
    },
    methods: {
        loadUsers(){
            let url = ''
            if (!this.searchText){
                url = `${baseApiUrl}/searchUsers`
            } else {
                url = `${baseApiUrl}/searchUsers/${this.searchText}`
            }

            axios.get(url).then(res => this.users = res.data)
        },
        rowSelected(item){
            this.user = item[0]         
        },
        selectUser(item) {
            if (!this.user){
                this.user = item
            }
            
            this.$emit('selectUser', {user: this.user})
            this.$emit('close')
        }
    },
    created() {
        this.loadUsers()
    }
}
</script>

<style>
    .modal-mask {
        position: fixed;
        z-index: 9998;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
        display: table;
        transition: opacity .3s ease;
    }

    .modal-wrapper {
        display: table-cell;
        vertical-align: middle;
    }

    .modal-container {
        width: 90%;
        height: 600px;
        margin: 0px auto;
        padding: 20px 30px;
        background-color: #fff;
        border-radius: 2px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
        transition: all .3s ease;
        font-family: 'Helvetica', Arial, sans-serif;
    }

    .modal-header {
        display: flex;
        justify-content: center;
        padding: 0px;
    }

    .modal-header h1{
        margin-top: 0;
    }

    .modal-body {
        height: 370px;
        margin-bottom: 10px;
        padding: 0px;
    }

    .userTable {
        max-height: 200px;
        overflow-y: auto;
    }

    .quillWrapper {
        flex-wrap: nowrap;
        height: 220px;
    }

    .modal-default-button {
        float: right;
    }

    .modal-enter {
        opacity: 0;
    }

    .modal-leave-active {
        opacity: 0;
    }

    .modal-enter .modal-container,
    .modal-leave-active .modal-container {
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
    }

    .invite-user-line {
        display: flex;
        align-content: center;
    }

    .row{
        display: flex;
        justify-content: flex-end;
    }

    .add-button {
        margin:0 2px 10px 0 ;
    }

    .tab-content {
        margin-top: 10px !important; /*Bootstrap pede*/
    }

    .user-table {
        position: absolute;
        max-height: 360px;
        width: 100%;
        overflow-y: scroll;
    }
</style>