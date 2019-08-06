const fs = require('fs-extra');

module.exports = {
	getRoot(path, list) {
		if (path === './.țv') return [];

		currentDir = fs.readdirSync(path);
		list = list || [];

		for (i of currentDir) {
			const child = path + '/' + i;
			if (fs.statSync(child).isDirectory()) list = this.getRoot(child, list);
			else list.push(child);
		}

		return list;
	},
	async populateRoot(cellar, commit, previousCommit) {
		const workingContext = await cellar.get(commit);
		const previousContext = await cellar.get(previousCommit);

		for (file in previousContext) {
			fs.removeSync(file);
		}

		for (file in workingContext.root) {
			console.info('comută\t\t'.green, file, workingContext.root[file].gray);
			const blob = await cellar.get(workingContext.root[file]);
			const content = new Buffer.from(blob.content);
			fs.outputFileSync(file, content);
		}
	}
}