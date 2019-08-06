const Utils = require('../utils');
const PouchDB = require('pouchdb-node');


exports.command = 'testează [wow]';
exports.desc = 'Comandă de test';

exports.handler = function (argv) {
	console.log(Utils.getRoot('.'));
}