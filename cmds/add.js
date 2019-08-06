const fs = require('fs');
const PouchDB = require('pouchdb-node');
const hasha = require('hasha');

exports.command = ['bagă <fișiere...>', 'baga', 'b', 'add'];
exports.desc = 'Bagă pergamente în pivniță';

exports.handler = async function (argv) {
	if (!fs.existsSync('.țv/')) {
		console.error('Nu există pivniță aici');
		return 1;
	}

	const index = new PouchDB('.țv/index');
	const cellar = new PouchDB('.țv/cellar');

	for (i of argv.fișiere) {
		if (!fs.existsSync(i)) {
			console.error(`Fișierul ${i} nu există în directorul curent`);
			return 1;
		}
		const content = fs.readFileSync(i);

		const hash = hasha(content, { algorithm: 'sha1' });
		const mtime = fs.statSync(i).mtime;

		let file = await index.get(i).catch(() => { });
		let info = 'cataloghează\t';

		if (file && !file.commited) {
			const blob = await cellar.get(file.hash).then(cellar.remove);

			file.hash = hash;
			file.mtime = mtime.toISOString;

			info = info.gray;
		} else {
			file = {
				_id: i,
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