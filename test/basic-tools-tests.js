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

		// Tests for basic-tools/tools/dom.js
		describe('DOM Module:', function() {
			let body, testDiv;
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

			describe('Place():', function() {
				it('Append a new element to body with Place()', function() {
					body = global.document.querySelector('body');
					// Create a test div element
					testDiv = global.document.createElement('div');
					testDiv.setAttribute('id', 'testdiv');

					// Append test div to body
					dom.Place(testDiv, body);
					// Confirm test div is appended to document
					assert(global.document.getElementById('testdiv') != null);
				});
			});

			describe('GetAttribute():', function() {
				it('Get id attribute from div with GetAttribute()', function() {
					// Confirm test div 
					assert.strictEqual(dom.GetAttribute(testDiv,'id'), 'testdiv');
				});
			});

			describe('SetAttribute():', function() {
				it('Set title attribute of div to "test div" with SetAttribute()', function() {
					// Set the div of the testDiv element
					dom.SetAttribute(testDiv,'title','test div');
					// Confirm div has the new set id value
					assert.strictEqual(dom.GetAttribute(testDiv,'title'), 'test div');
				});
			});

			describe('Siblings():', function() {
				it('Get siblings of an element', function() {
					// Add two buttons to test div
					dom.Create('button',{id:'abtn'},testDiv);
					dom.Create('button',{id:'bbtn'},testDiv);
					let siblings = dom.Siblings(global.document.getElementById('abtn'));

					// Confirm abtn has bbtn as a sibling
					assert.deepStrictEqual(siblings, [ global.document.getElementById('bbtn') ]);
				});
			});


			describe('Empty():', function() {
				body = global.document.getElementsByTagName('body');
				it('Empty a DOM element', function() {
					dom.Empty(body);
					assert.strictEqual(body.childElementCount, 0);
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

			describe('Format()', function() {
				it('Format("{0} + {1} = {2}",["2","3","5"]) should format string to "2 + 3 = 5"', function() {
					let testString = util.Format("{0} + {1} = {2}",["2", "3", "5"]);
					assert.strictEqual(testString, "2 + 3 = 5");
				});
			});

			describe('FirstProperty()', function() {
				it('FirstProperty() returns the first property value of a test object', function() {
					let objectA = { foo: 1, bar: 2 };
					let firstProp = util.FirstProperty(objectA);
					assert.strictEqual(firstProp, 1);
				});
			});

			describe('ParseCsv()', function() {
				it('ParseCsv() return an array representing the csv data provided as a string', function() {
					let testArray = "name,age\nfoo,29\nbar,88\n";
					let parsedCsvList = util.ParseCsv(testArray);
					assert.deepStrictEqual(parsedCsvList,[["name","age"],["foo","29"],["bar","88"],[]]);
				});
			});

			describe('DisableFocusable()', function() {
				it('DisableFocusable([body], true) disables all focusable items in the body of the DOM', function() {
					let domBody = global.document.querySelector('body');

					// Add button to the DOM with disable set to false.
					let newBtn = global.document.createElement("button");
					newBtn.setAttribute('id','new-btn');
					domBody.appendChild(newBtn);

					if (newBtn.disabled) {
						newBtn.setAttribute('disabled', false);
					}

					// Set disable to true for new button in DOM body
					util.DisableFocusable([domBody], true);
				
					// Test that button has an attibute of disable set to true
					assert.strictEqual(newBtn.disabled, true);
				});
			});
		});
	});
});
