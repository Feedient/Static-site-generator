#! /usr/bin/env node
var fs = require('fs'),
	ejs = require('ejs'),
	_ = require('underscore');

// Make sure a path is specified
if (process.argv.length < 3) {
	console.log('Please provide a valid path.');
	return;
}

var path = process.argv[2];
var env = process.argv[3] || 'development';

// If the path ends with /, remove it
if (/\/$/.test(path)) {
	path = path.substr(0, path.length - 1);
}

// Make sure the path exists
if (!fs.existsSync(path)) {
	console.log('The specified path does not exist.');
	return;
}

// Make sure there is a ssg.json (Static Site Generator manifest)
if (!fs.existsSync(path + '/ssg.json')) {
	console.log('ssg.json does not exist in the specified path');
	return;
}
console.log('Environment: ' + env);
console.log('Path: ' + path);
console.log('==============================================================');

// Load the manifest
var ssgConfig = JSON.parse(fs.readFileSync(path + '/ssg.json', 'utf8'));

// Avoid errors by setting a default value
ssgConfig.config_env = ssgConfig.config_env || {};

// Merge the default config and environment specific config
var globalData = {
	config: _.extend(ssgConfig.config || {}, ssgConfig.config_env[env] || {})
};

// Loop through every view
ssgConfig.views.forEach(function(view) {
	// Load the input file
	var fileSource = fs.readFileSync(path + '/' + view.input, 'utf8');

	// Merge the config data with the view specific data
	var data = _.extend(globalData, view.data || {});
	data.filename = path + '/' + view.input;

	var template = ejs.render(fileSource, data);

	fs.writeFileSync(path + '/' + view.output, template, 'utf8');
	console.log('[SUCCESS] ' + view.input + ' => ' + view.output);
});

console.log('==============================================================');
console.log('Successfully compiled ' + ssgConfig.views.length + ' files.');