const PouchDB = require('pouchdb-node');
const fs = require('fs-extra');
const hasha = require('hasha');
const diff = require('diff');
const baseDir = require('../index');

exports.command = ['coboară <catacombă>', 'coboara', 'pull', 'clone'];
exports.desc = 'Coboară conținutul pivniței dintr-o catacombă centrală';

exports.handler = async function (argv) {
	if (!baseDir) {
		console.error('Nu există pivniță aici');
		return 1;
	}

	const cellar = new PouchDB(baseDir + '/cellar');

	await cellar.replicate.from(argv.catacombă);
}