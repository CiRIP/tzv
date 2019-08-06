const ro = require('./romana');
const colors = require('colors');

require('yargs')
	.scriptName('țv')
	.updateStrings(ro)
	.commandDir('cmds')
	.demandCommand()
	.help()
	.argv