exports.up = function (knex, Promise) {
    return knex.schema.alterTable('contract_signs', table => {
        table.integer('contract_id').references('id')
            .inTable('contracts').notNull()
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.alterTable('users', table => {
        table.dropColumn('contract_id')
    })
};
