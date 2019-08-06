const PouchDB = require('pouchdb-node');
const fs = require('fs-extra');
const hasha = require('hasha');
const diff = require('diff');
const baseDir = require('../index');

exports.command = ['consemnează <mesaj>', 'consemneaza', 'c', 'commit'];
exports.desc = 'Consemnează un set de schimbări la pergamente în pivniță';

exports.handler = async function (argv) {
	if (!baseDir) {
		console.error('Nu există pivniță aici');
		return 1;
	}

	const index = new PouchDB(baseDir + '/index');
	const cellar = new PouchDB(baseDir + '/cellar');
	const list = await index.allDocs({ include_docs: true, descending: true });
	const config = await index.get('config');

	const staged = [];

	for ({ doc } of list.rows) {
		if (!doc.hash) continue;

		if (fs.statSync(doc._id).mtime.toISOString() !== doc.mtime && await hasha.fromFile(doc._id, { algorithm: 'sha1' }) !== doc.hash) continue;
		if (!doc.commited) staged.push(doc);
	}

	if (!staged) {
		console.error('Nu există modificări pregătite pentru consemnare');
		return 1;
	}

	const context = await index.get('context');
	const previous = await cellar.get(context.commit);
	const root = previous.root;
	let commit = '';

	for (i of staged) {
		root[i.path] = i.hash;
		commit += i.hash;
		await index.put({
			...i,
			commited: true
		});
	}

	commit = hasha(commit, { algorithm: 'sha1' })

	await cellar.put({
		_id: commit,
		root,
		parent: context.commit,
		author: config.name,
		email: config.email,
		message: argv.mesaj,
		date: new Date().toDateString
	});

	await index.put({
		...context,
		commit
	});
}