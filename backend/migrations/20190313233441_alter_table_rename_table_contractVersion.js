
exports.up = function(knex, Promise) {
    return knex.schema.renameTable('contracts_version', 'contract_versions')
};

exports.down = function(knex, Promise) {
    return knex.schema.renameTable('contract_versions', 'contracts_version')
  };
