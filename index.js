const ro = require('./romana');
const Test = require('./test');

require('yargs')
	.scriptName('țv')
	.updateStrings(ro)
	.command('testează', 'command test', {}, Test)
	.demandCommand()
	.help()
	.argv