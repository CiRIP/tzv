const ro = require('./romana');

require('yargs')
	.scriptName('țv')
	.updateStrings(ro)
	.commandDir('cmds')
	.demandCommand()
	.help()
	.argv