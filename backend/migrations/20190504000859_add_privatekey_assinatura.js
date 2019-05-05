
exports.up = function(knex, Promise) {
    return knex.schema.alterTable('contract_signs', table => {
        table.string('privateKey')
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.alterTable('contract_signs', table => {
        table.dropColumn('privateKey')
    })
};
