const fs = require('fs');
const PouchDB = require('pouchdb-node');
const hasha = require('hasha');

exports.command = ['bagă <fișiere...>', 'baga'];
exports.desc = 'Bagă pergamente în pivniță';

exports.handler = async function (argv) {
	if (!fs.existsSync('.țv/')) {
		console.error('Nu există pivniță aici');
		return 1;
	}

	const index = new PouchDB('.țv/index');

	for (i of argv.fișiere) {
		if (!fs.existsSync(i)) {
			console.error(`Fișierul ${i} nu există în directorul curent`);
			return 1;
		}

		const hash = await hasha.fromFile(i, { algorithm: 'sha1' });
		const mtime = fs.statSync(i).mtime;

		await index.put({
			_id: i,
			hash,
			mtime: mtime.toISOString()
		})
			.then(() => console.info(`bagă ${i} - ${mtime.toISOString()}/${hash}`))
			.catch(() => { });
	}
}