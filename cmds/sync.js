const PouchDB = require('pouchdb-node');
const fs = require('fs-extra');
const hasha = require('hasha');
const diff = require('diff');
const baseDir = require('../index');

exports.command = ['sincronizează <catacombă>', 'sincronizeaza', 'sync'];
exports.desc = 'Sincrinozează în timp real conținutul pivniței dintr-o catacombă centrală';

exports.handler = function (argv) {
	if (!baseDir) {
		console.error('Nu există pivniță aici');
		return 1;
	}

	const cellar = new PouchDB(baseDir + '/cellar');

	const opts = { live: true, retry: true };

	cellar.replicate.from(argv.catacombă).on('complete', info => {
		console.log('info'.cyan, 'start sync...');
		// then two-way, continuous, retriable sync
		cellar.sync(argv.catacombă, opts)
			.on('change', console.info)
			.on('paused', console.info)
			.on('error', console.error);
	}).on('error', console.error);
}