const PouchDB = require('pouchdb-node');
const fs = require('fs-extra');
const hasha = require('hasha');
const diff = require('diff');
const baseDir = require('../index');

exports.command = ['urcă <catacombă>', 'urca', 'u', 'push'];
exports.desc = 'Urcă conținutul pivniței într-o catacombă centrală';

exports.handler = async function (argv) {
	if (!baseDir) {
		console.error('Nu există pivniță aici');
		return 1;
	}

	const cellar = new PouchDB(baseDir + '/cellar');

	cellar.replicate.to(argv.catacombă);
}