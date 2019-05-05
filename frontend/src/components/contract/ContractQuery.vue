<template>
    <div>
        Filtro:
        <b-card class="filters">
            <b-form>
                <b-form-group id="contract-title-label" label="Título:" label-for="contract-title">
                    <b-form-input id="contract-title" type="text" v-model="filter.title" 
                        required placeholder="Informe o título do contrato..." />
                </b-form-group>
            </b-form>
        </b-card>
        Resultado:
        <b-card class="query">
            <b-table hover :items="contracts" :fields="fields">
                <template slot="actions" slot-scope="data">
                    <b-button variant="danger" @click="remove(data.item, data.index)">
                        <i class="fa fa-trash"></i>
                    </b-button>
                </template>
            </b-table>
        </b-card>
    </div>
</template>

<script>
export default {
    name: 'ContractQuery',
    data: function() {
        return {
            filter: {},
            contracts: [],
            fields: {}
        }
    }
}
</script>

<style>
    .filters{
        background-color: white;
    }
</style>
