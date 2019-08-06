const PouchDB = require('pouchdb-node');
const fs = require('fs');
const hasha = require('hasha');
const diff = require('diff');

exports.command = ['arhivă', 'arhiva', 'a', 'log'];
exports.desc = 'Recuperează toată lista de consemnări';

exports.handler = async function (argv) {
	if (!fs.existsSync('.țv/')) {
		console.error('Nu există pivniță aici');
		return 1;
	}

	const index = new PouchDB('.țv/index');
	const cellar = new PouchDB('.țv/cellar');

	const context = await index.get('context');
	let commit = await cellar.get(context.commit);

	while (commit._id != '0000000000000000000000000000000000000000') {
		console.log(commit._id);
		commit = await cellar.get(commit.parent);
	}

}