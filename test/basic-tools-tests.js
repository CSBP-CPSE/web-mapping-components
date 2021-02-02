import array from '../src/basic-tools/tools/array.js';
import assert from 'assert';

describe('Basic-Tools Tests:\n  ------------------------------', function() {
	describe('Tools Modules:', function() {
		describe('Array Module:', function() {
			describe('isArray():', function() {
				it('isArray() correctly identifies an array', function() {
					assert.strictEqual(array.isArray([1,2,3,4,5]), true);
				});
			});
		});
	});
});
