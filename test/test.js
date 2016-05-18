'use strict';

let BunyanLogsene = require('../lib/bunyan_logsene'),
	bunyan = require('bunyan'),
	sinon = require('sinon'),
	expect = require('chai').expect;

describe('bunyan-logsene', function() {

	let token = 'logsene-token';
	let app = 'test-app';
	let level = 'error';

	describe('constructor', function() {

		it('should fail without a token', function() {
			expect(function() {
				new BunyanLogsene({});
			}).to.throw(/Logsene token not specified/);

		});

	});

	describe('formatter', function() {

		it('should not throw circular reference error', function() {

			let bunyanlogsene = new BunyanLogsene({
				token
			});

			let log = bunyan.createLogger({
				name: app,
				streams: [{
					stream: bunyanlogsene,
					type: 'raw',
					level: level
				}]
			});

			expect(function() {
				function Foo() {
					this.abc = 'Hello';
					this.circular = this;
				}

				let foo = new Foo();

				log.error({err: foo});
			}).to.not.throw();
		});

		it('should call Logsene correctly', function() {
			let bunyanlogsene = new BunyanLogsene({
				token
			});

			let sandbox = sinon.sandbox.create();

			sandbox.stub(bunyanlogsene._client, 'log');

			let log = bunyan.createLogger({
				name: app,
				streams: [{
					stream: bunyanlogsene,
					type: 'raw',
					level: level
				}]
			});

			let expectedResponse = {
				level: 'error',
				message: 'hello bunyan logsene'
			};

			log.error('hello bunyan logsene');

			sinon.assert.calledWith(bunyanlogsene._client.log, 'error', 'hello bunyan logsene');
			sandbox.restore();
		});

		// TODO: Validation record object is manipulated correctly
	});

});
