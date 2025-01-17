const PouchDB = require('pouchdb-node');
const fs = require('fs-extra');
const hasha = require('hasha');
const diff = require('diff');
const baseDir = require('../index');

exports.command = ['arhivă', 'arhiva', 'a', 'log'];
exports.desc = 'Recuperează toată lista de consemnări';

exports.handler = async function (argv) {
	if (!baseDir) {
		console.error('Nu există pivniță aici');
		return 1;
	}

	const index = new PouchDB(baseDir + '/index');
	const cellar = new PouchDB(baseDir + '/cellar');

	const context = await index.get('context');
	let commit = await cellar.get(context.commit);

	while (commit._id != '0000000000000000000000000000000000000000') {
		console.log(commit._id.cyan);
		console.log('Autor: '.gray, commit.author, `<${commit.email}>`);
		console.log('Dată:  '.gray, commit.date);
		console.log('\n\t', commit.message, '\n');
		commit = await cellar.get(commit.parent);
	}

}