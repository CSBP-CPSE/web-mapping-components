import other from '../src/mapbox-tools/tools/other.js';
import assert from 'assert';

describe('Mapbox-Tools Tests:\n  ------------------------------', function() {
	describe('Tools Modules:', function() {
		describe('Other Module:', function() {
			describe('LookupProvince():', function() {
				it('LookupProvince("ns","en") should return Nova Scotia ', function() {
					assert.strictEqual(other.LookupProvince('ns','en'), 'Nova Scotia');
				});
			});
		});
	});
});
