
exports.up = function (knex, Promise) {
    return knex.schema.createTable('contracts_version', table => {
        table.increments('id').primary().notNull()
        table.integer('contract_id').references('id')
            .inTable('contracts').notNull()
        table.binary('content').notNull()
        table.timestamp('createdAt').defaultTo(knex.fn.now())
    })
};

exports.down = function (knex, Promise) {
    knex.schema.dropTable('contracts_version')
};