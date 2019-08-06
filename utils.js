const fs = require('fs');

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
	}
}