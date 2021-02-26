import array from '../src/basic-tools/tools/array.js';
import util from '../src/basic-tools/tools/util.js';
import dom from '../src/basic-tools/tools/dom.js';
import assert from 'assert';
import jsdom from 'jsdom';
const windowDom = new jsdom.JSDOM(
	`<!doctype html>
	<html>
		<head>
			<title>Test DOM</title>
		</head>
		<body>
		</body>
	</html>`
);

global.document = windowDom.window.document;

describe('Basic-Tools Tests:\n  ------------------------------', function() {
	describe('Tools Modules:', function() {

		// Tests for basic-tools/tools/array.js
		describe('Array Module:', function() {
			describe('isArray():', function() {
				it('isArray() correctly identifies an array', function() {
					assert.strictEqual(array.isArray([1,2,3,4,5]), true);
				});
			});

			describe('Clone():', function() {
				it('Clone() able to clone a 1D array [1,2,3,4]', function() {
					let original = [1,2,3,4,5];
					let clone = array.Clone(original);
					assert.deepStrictEqual(original, clone);
				});

				it('Clone() able to clone a nested array [1,2,[3,4,5],6]', function() {
					let original = [1,2,[3,4,5],6];
					let clone = array.Clone(original);
					assert.deepStrictEqual(original, clone);
				});
			});

			describe('UniqueConcat():', function() {
				it('Correctly concats [1,2,3] with [3,4,5] and returns [1,2,3,4,5]', function() {
					let arrayA = [1,2,3];
					let arrayB = [3,4,5];
					let concatArray = array.UniqueConcat(arrayA, arrayB);
					assert.deepStrictEqual(array.UniqueConcat(arrayA, arrayB), [1,2,3,4,5]);
				});
			});
		});

		// Tests for basic-tools/tools/dom.js
		describe('DOM Module:', function() {
			let body;
			describe('Node():', function() {
				it('Create a Node representing the body element', function() {
					body = dom.Node(global.document, 'body');
					assert(body != null);
				});
			});
			describe('Create():', function() {
				it('Create a button with the id foobar', function() {
					dom.Create('button',{id:'foobar'},body);
					assert(global.document.getElementById('foobar') != null);
				});
			});
		});

		// Tests for basic-tools/tools/util.js
		describe('Utils Module:', function() {
			describe('Mixin()', function() {
				it('Mixin() correctly mixes two test objects together into a combined mixin object', function() {
					let objectA = { foo: 1 };
					let objectB = { bar: 2 };
					let mixedObject = util.Mixin(objectA, objectB);
					assert.deepStrictEqual(mixedObject, { foo: 1, bar: 2 });
				});
			});

			describe('FirstProperty()', function() {
				it('FirstProperty() returns the first property value of a test object', function() {
					let objectA = { foo: 1, bar: 2 };
					let firstProp = util.FirstProperty(objectA);
					assert.strictEqual(firstProp, 1);
				});
			});
		});
	});
});
