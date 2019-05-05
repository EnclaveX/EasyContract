
exports.up = function(knex, Promise) {
    return knex.schema.renameTable('contracts_signs', 'contract_signs')
};

exports.down = function(knex, Promise) {
    return knex.schema.renameTable('contract_signs', 'contracts_signs')
  };
