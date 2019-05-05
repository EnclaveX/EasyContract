
exports.up = function(knex, Promise) {
    return knex.schema.createTable('contracts_signs', table => {
        table.increments('id').primary().notNull()
        table.integer('user_id')
        table.string('email', 200)
        table.string('digital_certificate')
        table.enu('signed', ['SIM', 'NÃO']).notNull().defaultTo('NÃO')
    })
};

exports.down = function(knex, Promise) {
    knex.schema.dropTable('contracts_signs')
};