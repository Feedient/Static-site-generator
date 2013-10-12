Static Site Generator ("SSG")
=====================

Simple command line utility that compiles dynamic EJS view files into static HTML, based on a manifest file in the target directory. See example for reference.



### Installation

To install SSG, simply run

	npm install ssg -g

The command syntax is:

	ssg {path} {environment}
	
The environment argument is optional and defaults to "development".

To compile the current folder as development environment, just run:

	ssg .
	
### Environments, what?
In case you need to change certain things when you publish your website (such as URLs and API tokens), you can provide that in the `config_env` object of your `ssg.json`. The properties in the environment object will be merged with the normal `config` object. If any collisions are found, the `config` value will be overriden by the `config_env` one when sent to the view.

Let's imagine my `ssg.json` contains the following config data:


	"config": {
		"url": "http://127.0.0.1/"
	},

	"config_env": {
		"production": {
			"url": "http://mysite.com/"
		}
	}
	
If I now run `ssg . production`, `<%= url %>` will equal `http://mysite.com/` but if I run `ssg .` it will equal `http://127.0.0.1/`