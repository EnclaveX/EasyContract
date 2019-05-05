<template>
    <div :class="[!contract.id ? 'empty-card' : '' , 'contract-card']">
        <div class="card-title" v-if="contract.id">
            {{contract.title}}
        </div>

        <div class="card-title" v-else>
            <p>Clique aqui para inserir um novo contrato</p>
        </div>

        <div v-if="contract.createdAt" key="createdAt" class="card-subtitle">
            {{`Criado em: ${contract.createdAt}`}}
        </div>

        <div v-else key="createdAt" class="card-subtitle"/>

        <div class="situation-bar" v-bind:style="bgc"/>

        <b-progress class="bar-progress" v-if="contract.id" :max="Number(contract.userSignsCount)">
            <b-progress-bar :value="Number(contract.userSignedsCount)">{{contract.userSignedsCount}}/{{contract.userSignsCount}}</b-progress-bar>
        </b-progress>

        <div class='type-contract' v-if="contract.type === 'toSign'" key="actionCard">{{'Assine o contrato'}}</div>
        <div class='type-contract' v-else key="actionCard">{{`${contract.id?'Edite o contrato':''}`}}</div>
    </div>
</template>

<script>
import { situationColor } from '../contract/contracts'
import { mask } from 'vue-the-mask'

export default {
    name: 'ContractHomeCard',
    props: ['contract'],
    directives: { mask },
    data: function(){
            return {
                bgc: {
                   backgroundColor: '#A1A2A3',
                   display: 'block'
                }
            }
    },
    created(){
        this.bgc.backgroundColor = situationColor(this.contract.situation)
           
        if (this.contract.createdAt) {
            this.contract.createdAt = new Date(this.contract.createdAt).toLocaleDateString('pt-BR')
        }
    }
}
</script>

<style>
    .contract-card {
        background-color: #FFF;
        color: #000;
        box-shadow: 2px 2px 4px -1px rgba(0,0,0,0.21);
        border-radius: 2px;

        width: 250px;
        height: 150px;
        padding: 10px;
        margin: 10px;

        display: grid;
        grid-template-columns: 15px 1fr;
        grid-template-rows: 70px 30px 15px 1fr;
        grid-template-areas: 
            "situation-bar title"
            "situation-bar createdat"
            "situation-bar progress-bar"
            "situation-bar type-contract";

        overflow: hidden;
    }

    .contract-card:hover{
        width: 260px;
        height: 160px;
        margin: 5px;
        cursor: pointer;
        box-shadow: 10px 10px 11px -4px rgba(0,0,0,0.21);
    }

    .situation-bar {
        grid-area: situation-bar;
        width: 10px;
        height: 90%;
        border-radius: 2px;
        align-self: flex-start;
        justify-self: center;
    }

    .card-title{
        grid-area: title;
        margin-bottom: 5px;
        font-size: 1.2rem;
        overflow: hidden;
    }

    .card-subtitle{
        font-size: 1.0rem;
        color: #A1A1AA;
        grid-area: createdat;
    }

    .card-subtitle hr{
        margin-top: 3px;
        margin-bottom: 0px;
        width: 100%;
    }

    .user-signs {
        grid-area: users-signs;
        color: gray;
        align-self: center;
        justify-self: center;
        margin-left: 5px;
    }

    .empty-card {
        background-color: aquamarine;
    }

    b-progress {
        grid-area: progress-bar;
        width: 100%;
    }

    .type-contract {
        grid-area: type-contract;
        justify-self: center;
    }
</style>
