const PouchDB = require('pouchdb-node');
const fs = require('fs-extra');
const hasha = require('hasha');
const diff = require('diff');
const baseDir = require('../index');

exports.command = ['compară <consemnare1> <consemnare2>', 'compara', 'comp', 'diff'];
exports.desc = 'Compară două consemnări la pergamente în pivnița';

exports.handler = async function (argv) {
	if (!baseDir) {
		console.error('Nu există pivniță aici');
		return 1;
	}

	const cellar = new PouchDB(baseDir + '/cellar');

	const context1 = await cellar.get(argv.consemnare1);
	const context2 = await cellar.get(argv.consemnare2);

	for (file in context1.root) {
		const blob1 = await cellar.get(context1.root[file]);
		const blob2 = await cellar.get(context2.root[file]);

		const buffer1 = new Buffer.from(blob1.content);
		const buffer2 = new Buffer.from(blob2.content);

		const d = diff.diffLines(buffer1.toString(), buffer2.toString());

		console.info('compară\t\t'.cyan, file, context1.root[file].gray, '/', context2.root[file].gray)

		for (i of d) {
			const color = i.added ? 'green' : i.removed ? 'red' : 'gray';
			process.stderr.write(i.value[color]);
		}
		console.log();
	}
}