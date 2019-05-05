exports.up = function (knex, Promise) {
    return knex.schema.alterTable('users', table => {
        table.string('cgc')
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.alterTable('users', table => {
        table.dropColumn('cgc')
    })
};
