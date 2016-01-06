var Writable = require('stream').Writable;
var domain = require('domain');
var util = require('util');
var Logsene = require('logsene-js');

var levels = {
	10: 'trace',
	20: 'debug',
	30: 'info',
	40: 'warn',
	50: 'error',
	60: 'fatal'
};

function LogseneStream(options) {
	options = options || {};
	this._client = options.client ||
		new Logsene(options.token,
			options.type || 'bunyan_logsene',
			options.url);

	Writable.call(this, options);
}

util.inherits(LogseneStream, Writable);

LogseneStream.prototype._write = function(entry, encoding, callback) {

	var client = this._client;

	var d = domain.create();
	d.on('error', function(err) {
		console.log('Logsene Error', err.stack);
	});
	d.run(function() {
		entry = JSON.parse(entry.toString('utf8'));

		// Reassign these fields so them match what Logsene expects
		// expects to see.
		entry['@timestamp'] = entry.time;
		entry.level = levels[entry.level];
		entry.message = entry.msg;
		entry.host = entry.hostname;

		// remove duplicate fields
		delete entry.time;
		delete entry.msg;
		delete entry.hostname;

		client.log(entry.level, entry.message, entry, callback);
	});
};

module.exports = LogseneStream;
