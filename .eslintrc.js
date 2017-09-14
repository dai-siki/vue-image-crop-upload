module.exports = {
	"parser": "babel-eslint",
	"parserOptions": {
		"sourceType": "module",
		"allowImportExportEverywhere": false,
		"codeFrame": false
	},
	"env": {
		"browser": true,
		"commonjs": true,
		"es6": true
	},
	"extends": "eslint:recommended",
	"rules": {
		"indent": [
			"error",
			"tab"
		],
		"linebreak-style": [
			"error",
			"windows"
		],
		"quotes": [
			"error",
			"single"
		],
		"semi": [
			"error",
			"always"
		]
	}

};
