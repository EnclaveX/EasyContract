
exports.up = function (knex, Promise) {
    return knex.schema.alterTable('contracts_version', table => {
        table.renameColumn('contract_id', 'contractId')
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.alterTable('contracts_version', table => {
        table.renameColumn('contractId', 'contract_id')
    })
};
