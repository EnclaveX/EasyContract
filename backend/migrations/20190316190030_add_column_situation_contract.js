exports.up = function (knex, Promise) {
    return knex.schema.alterTable('contracts', table => {
        table.enu('situation', ['NORMAL', 'DISPUTA', 'CANCELADO', 'ASSINADO']).notNull().defaultTo('NORMAL'),
        table.timestamp('createdAt')
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.alterTable('contracts', table => {
        table.dropColumn('situation')
        table.dropColumn('createdAt')
    })
};
