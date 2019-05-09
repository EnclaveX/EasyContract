<template>
    <div :class="[!contract.id ? 'empty-card' : '' , 'contract-card']">
        <div class="content-card">
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

            <b-progress class="bar-progress" v-if="contract.id" :max="Number(contract.userSignsCount)">
                <b-progress-bar :value="Number(contract.userSignedsCount)">{{contract.userSignedsCount}}/{{contract.userSignsCount}}</b-progress-bar>
            </b-progress>

            <div class='type-contract' v-if="contract.type === 'toSign'" key="actionCard">{{'Assine o contrato'}}</div>
            <div class='type-contract' v-else key="actionCard">{{`${contract.id?'Edite o contrato':''}`}}</div>
        </div>

        <div class="situation-bar" v-bind:style="bgc"/>

    </div>
</template>

<script>
import { situationColor } from '../contract/contractFunctions'
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
        border-radius: 10px;
        width: 250px;
        height: 150px;
        padding: 0px 0px 0px 0px;
        margin: 10px;
        display: grid;
        grid-template-columns: 7px 1fr;
        grid-template-rows: 1fr;
        grid-template-areas: 
            "situation-bar card";

        overflow: hidden;
        transition: 
            width 0.3s, 
            height 0.3s, 
            margin 0.3s, 
            box-shadow 0.3s;
    }

    .contract-card:hover{
        width: 260px;
        height: 160px;
        margin: 5px;
        cursor: pointer;
        box-shadow: 10px 10px 11px -4px rgba(0,0,0,0.21);
        transition: 
            width 0.4s, 
            height 0.4s, 
            margin 0.4s, 
            box-shadow 0.4s;
    }

    .situation-bar {
        grid-area: situation-bar;
        width: 8px;
        height: 100%;
        border-radius: 20px 0px 0px 20px;
        align-self: flex-start;
        justify-self: center;
    }

    .content-card {
        grid-area: card;
        display: grid;
        padding: 5px;
        width: 100%;
        font-family: Roboto, sans-serif;
        font-weight: 300;
        grid-template-columns: 1fr;
        grid-template-rows: 70px 30px 15px 1fr;
        grid-template-areas: 
            "title"
            "createdat"
            "progress-bar"
            "type-contract";
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
