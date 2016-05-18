'use strict';

let EventEmitter = require('events').EventEmitter;
let util = require('util');
let Logsene = require('logsene-js');

let levels = {
	10: 'trace',
	20: 'debug',
	30: 'info',
	40: 'warn',
	50: 'error',
	60: 'fatal'
};

class LogseneStream extends EventEmitter {

	constructor(options) {
		super();

		options = options || {};

		this._client = options.client ||
			new Logsene(options.token,
				options.type || 'bunyan_logsene',
				options.url);
		// if (options.client || options.token) {
		// } else {
		// 	throw new Error('No client or token specified');
		// }

	}

	write(record) {

		let client = this._client;

		let level = levels[record.level];
		let message = record.msg;

		// Reassign these fields so them match what Logsene expects
		// expects to see.
		record['@timestamp'] = record.time;
		record.host = record.hostname;

		// remove duplicate fields
		delete record.level;
		delete record.msg;
		delete record.time;
		delete record.hostname;

		try {
			client.log(level, message, record);
		} catch(err) {
			this.emit('error', err);
		}

	};
}

module.exports = LogseneStream;
