
exports.up = function (knex, Promise) {
    return knex.schema.alterTable('contracts', table => {
        table.renameColumn('user_register_id', 'userRegisterId')
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.alterTable('contracts', table => {
        table.renameColumn('userRegisterId', 'user_register_id')
    })
};
