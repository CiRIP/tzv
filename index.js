const ro = require('./romana');
const colors = require('colors');
const fs = require('fs');
const { resolve } = require("path");

let baseDir = resolve('.țv/');
while (!fs.existsSync(baseDir) && baseDir !== '/.țv' && baseDir !== 'C:\\.țv') {
	baseDir = resolve(baseDir, '../', '../', '.țv/');
}

if (fs.existsSync(baseDir)) module.exports = baseDir;
else module.exports = null;

require('yargs')
	.scriptName('țv')
	.updateStrings(ro)
	.commandDir('cmds')
	.demandCommand()
	.help()
	.argv