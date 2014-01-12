var fs = require('fs');
var ejs = require('ejs');
var _ = require('underscore');

/**
 * Run the SSG compilation
 * @param String path
 * @param Object options
 * @param Function logMethod(message)
 */
module.exports = function(path, options, logMethod) {
	if (!logMethod) var logMethod = console.log;

	// If the path ends with /, remove it
	if (/\/$/.test(path)) {
		path = path.substr(0, path.length - 1);
	}

	// Make sure the path exists
	if (!fs.existsSync(path)) {
		return path + ' does not exist.';
	}
	
	var globalData = {
		config: options.config
	};

	// Loop through every view
	options.views.forEach(function(view) {
		// Load the input file
		var fileSource = fs.readFileSync(path + '/' + view.input, 'utf8');

		// Merge the config data with the view specific data
		var data = _.extend(globalData, view.data || {});
		data.filename = path + '/' + view.input;

		// Render the EJS template
		var template = ejs.render(fileSource, data);

		// Save the output
		fs.writeFileSync(path + '/' + view.output, template, 'utf8');

		logMethod('Successfully compiled ' + view.input + ' => ' + view.output);
	});
};