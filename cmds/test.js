exports.command = 'testează [wow]';
exports.desc = 'Comandă de test';

exports.handler = function (argv) {
	console.log('testez', argv.wow);
}