const fs = require('fs-extra');
const PouchDB = require('pouchdb-node');
const hasha = require('hasha');
const baseDir = require('../index');
const Utils = require('../utils');
const parser = require('gitignore-parser')

exports.command = ['bagă <fișiere...>', 'baga', 'b', 'add'];
exports.desc = 'Bagă pergamente în pivniță';

exports.handler = async function (argv) {
	if (!baseDir) {
		console.error('Nu există pivniță aici');
		return 1;
	}

	const index = new PouchDB(baseDir + '/index');
	const cellar = new PouchDB(baseDir + '/cellar');

	let files = argv.fișiere;
	if (argv.fișiere[0] === '.') {
		const gitignore = parser.compile(fs.readFileSync('.gitignore', 'utf8'));
		files = Utils.getRoot('.');
		files = files.filter(gitignore.accepts);
	}

	for (i of files) {
		if (!fs.existsSync(i)) {
			console.error(`Fișierul ${i} nu există în directorul curent`);
			return 1;
		}
		const content = fs.readFileSync(i);

		const hash = hasha(content, { algorithm: 'sha1' });
		const mtime = fs.statSync(i).mtime;

		let file = await index.get(i).catch(() => { });
		let info = 'cataloghează\t';

		if (file) {
			if (file.hash === hash) {
				console.error(`Fișierul ${i} este deja consemnat`);
				return 1;
			}
			if (!file.commited) cellar.get(file.hash).then(cellar.remove);

			file.hash = hash;
			file.mtime = mtime.toISOString;
			file.commited = false;

			info = info.gray;
		} else {
			file = {
				_id: i,
				path: i,
				hash,
				commited: false,
				mtime: mtime.toISOString()
			}

			info = info.cyan;
		}

		await index.put(file)
			.then(() => console.info(info, i, mtime.toISOString().gray, '/', hash.gray))
		//.catch(() => { });

		await cellar.put({
			_id: hash,
			type: 'blob',
			content
		})
			.then(() => console.info('bagă\t\t'.green, i, hash.gray))
			.catch(() => { });
	}
}