
exports.up = function (knex, Promise) {
    return knex.schema.alterTable('contracts', table => {
        table.string('easyContractHashId')
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.alterTable('contracts', table => {
        table.dropColumn('easyContractHashId')
    })
};
