const PouchDB = require('pouchdb-node');
const fs = require('fs');

exports.command = ['inițializează', 'initializeaza', 'i', 'iniț', 'init'];
exports.desc = 'Inițializează o pivniță';

exports.handler = async function (argv) {
	if (fs.existsSync('.țv/')) {
		console.error('Pivnița deja există');
		return 1;
	}

	fs.mkdirSync('.țv/');

	require('events').EventEmitter.defaultMaxListeners = 100;
	const cellar = new PouchDB('.țv/cellar');
	const index = new PouchDB('.țv/index');
	await index.put({
		_id: 'config',
		name: 'Test Name',
		email: 'test@example.com'
	});
	await index.put({
		_id: 'context',
		commit: '0000000000000000000000000000000000000000'
	});
	await cellar.put({
		_id: '0000000000000000000000000000000000000000',
		type: 'commit',
		root: {}
	})
	console.info('Am inițializat o noua pivniță în directorul actual');
}