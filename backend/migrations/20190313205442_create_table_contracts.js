
exports.up = function (knex, Promise) {
    return knex.schema.createTable('contracts', table => {
        table.increments('id').primary()
        table.string('title').notNull()
        table.string('user_register_id').notNull()
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('contracts')
};