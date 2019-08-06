const Utils = require('../utils');
const PouchDB = require('pouchdb-node');


exports.command = 'testează [wow]';
exports.desc = 'Comandă de test';

exports.handler = function (argv) {
	const index = new PouchDB('.țv/index');
	const cellar = new PouchDB('.țv/cellar');
	Utils.populateRoot(index, cellar).then(console.log)
}