const { db } = require('./.env')

// Update with your config settings.
module.exports = {
	client: 'postgresql',
	connection: db,
	pool: {
		min: 0,
		max: 50
	},
	migrations: {
		tableName: 'knex_migrations'
	} 
};