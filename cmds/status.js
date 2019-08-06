const fs = require('fs');
const PouchDB = require('pouchdb-node');
const hasha = require('hasha');

exports.command = ['pivniță', 'pivnita', 'p', 'status'];
exports.desc = 'Vezi ce este în pivniță';

exports.handler = async function (argv) {
	if (!fs.existsSync('.țv/')) {
		console.error('Nu există pivniță aici');
		return 1;
	}

	const index = new PouchDB('.țv/index');
	const list = await index.allDocs({ include_docs: true, descending: true });

	const staged = [];
	const modified = [];

	for ({ doc } of list.rows) {
		if (!doc.hash) continue;

		if (fs.statSync(doc._id).mtime.toISOString() !== doc.mtime && await hasha.fromFile(doc._id, { algorithm: 'sha1' }) !== doc.hash) {
			modified.push(doc);
			continue;
		}
		if (!doc.commited) staged.push(doc);
	}

	console.info('Pergamente gata pentru consemnare:')
	console.info('  (folosește "țv consemnează --mesaj <mesaj>" pentru a consemna schimbările la pergamente)'.gray, '\n');

	for (i of staged) console.info('\t' + i._id.green);

	console.info('\n');

	console.info('Pergamente modificate față de pivniță:');
	console.info('  (folosește "țv bagă" pentru a pregăti pergamentele pentru consemnare)'.gray, '\n');

	for (i of modified) console.info('\t' + i._id.red);

	return modified;
}