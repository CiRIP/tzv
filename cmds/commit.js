const PouchDB = require('pouchdb-node');
const fs = require('fs');
const hasha = require('hasha');
const diff = require('diff');

exports.command = ['consemnează', 'consemneaza', 'c', 'commit'];
exports.desc = 'Consemnează un set de schimbări la pergamente în pivnița';

exports.handler = async function (argv) {
	if (!fs.existsSync('.țv/')) {
		console.error('Nu există pivniță aici');
		return 1;
	}

	const index = new PouchDB('.țv/index');
	const cellar = new PouchDB('.țv/cellar');
	const list = await index.allDocs({ include_docs: true, descending: true });
	const config = await index.get('config');

	const staged = [];

	for ({ doc } of list.rows) {
		if (!doc.hash) continue;

		if (fs.statSync(doc._id).mtime.toISOString() !== doc.mtime && await hasha.fromFile(doc._id, { algorithm: 'sha1' }) !== doc.hash) continue;
		if (!doc.commited) staged.push(doc);
	}

	const context = await index.get('context');
	const previous = await cellar.get(context.commit);
	const root = previous.root;
	let commit = '';

	for (i of staged) {
		root[i._id] = i.hash;
		commit += i.hash;
	}

	commit = hasha(commit, { algorithm: 'sha1' })

	await cellar.put({
		_id: commit,
		root,
		parent: context.commit,
		author: config.name,
		email: config.email
	});

	await index.put({
		...context,
		commit
	});
}