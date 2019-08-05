const fs = require('fs');
const PouchDB = require('pouchdb-node');
const hasha = require('hasha');
const colors = require('colors');

exports.command = ['pivniță', 'pivnita', 'p', 'status'];
exports.desc = 'Vezi ce este în pivniță';

exports.handler = async function (argv) {
	if (!fs.existsSync('.țv/')) {
		console.error('Nu există pivniță aici');
		return 1;
	}

	const index = new PouchDB('.țv/index');
	const list = await index.allDocs({ include_docs: true, descending: true });

	console.info(`Pergamente modificate față de pivniță:`);
	console.info('  (folosește "țv bagă" pentru a băga în pivniță pergamente)'.gray, '\n');

	let modified = 0;

	for ({ doc } of list.rows) {
		if (!doc.hash) continue;

		if (fs.statSync(doc._id).mtime.toISOString() === doc.mtime && await hasha.fromFile(doc._id, { algorithm: 'sha1' }) === doc.hash) continue;
		console.info('\t' + doc._id.red);
		modified++;
	}

	console.info(`\n  (dă-i "țv consemnează --mesaj <mesaj>" pentru a consemna schimbările la pergamente)`.gray);

	return modified;
}