const PouchDB = require('pouchdb-node');
const fs = require('fs-extra');
const baseDir = require('../index');
const utils = require('../utils');

exports.command = ['comută <consemnare|încăpere>', 'comuta', 'checkout'];
exports.desc = 'Comută contextul curent la o consemnare sau o încăpere diferită';

exports.handler = async function (argv) {
	if (!baseDir) {
		console.error('Nu există pivniță aici');
		return 1;
	}

	let commit = argv.consemnare;

	const cellar = new PouchDB(baseDir + '/cellar');
	const index = new PouchDB(baseDir + '/index');
	const context = await index.get('context');

	if (commit === 'ultim') {
		commit = context.commit;
	}

	await utils.populateRoot(cellar, commit, context.commit);
}