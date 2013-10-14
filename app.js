#! /usr/bin/env node
var fs = require('fs'),
	ejs = require('ejs'),
	_ = require('underscore'),
	colors = require('colors');

// Make sure a path is specified
if (process.argv.length < 3) {
	console.log('Please provide a valid path.');
	return;
}

// Listen for -v
if (process.argv[2] == '-v') {
	console.log('Version: 1.0.2');
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
console.log('\nEnvironment: '.cyan + env.white);
console.log('Path: '.cyan + path.white + '\n');

// Load the manifest
var ssgConfig = JSON.parse(fs.readFileSync(path + '/ssg.json', 'utf8'));

// Avoid errors by setting a default value
ssgConfig.config_env = ssgConfig.config_env || {};

if (!ssgConfig.config_env[env] && _.size(ssgConfig.config_env) && env != 'development') {
	console.log('[NOTICE] '.red + env.red + ' has no environment config data'.red + '\n');
}

// Merge the default config and environment specific config
var globalData = {
	config: _.extend(ssgConfig.config || {}, ssgConfig.config_env[env] || {})
};

// Pass the environment to the view
globalData.config.env = env;

// Loop through every view
ssgConfig.views.forEach(function(view) {
	// Load the input file
	var fileSource = fs.readFileSync(path + '/' + view.input, 'utf8');

	// Merge the config data with the view specific data
	var data = _.extend(globalData, view.data || {});
	data.filename = path + '/' + view.input;

	var template = ejs.render(fileSource, data);

	fs.writeFileSync(path + '/' + view.output, template, 'utf8');
	console.log('[SUCCESS] '.green + view.input.white + ' => '.cyan + view.output.white);
});

console.log('\nSuccessfully compiled '.green + ssgConfig.views.length + ' files.'.green + '\n');