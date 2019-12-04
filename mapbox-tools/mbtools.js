// Static tools
import Factory from './tools/factory.js';
import Utils from './tools/utils.js';
import Map from './tools/map.js';

import Core from '../basic-tools/tools/core.js';
import Dom from '../basic-tools/tools/dom.js';
import Popup from '../basic-tools/components/popup.js';
import Tooltip from '../basic-tools/components/tooltip.js';

export default class MBT {
	
    static get Nls() { return Core.nls; }
	
    static set Nls(value) { Core.nls = value; }
	
    static get Locale() { return Core.locale; }
	
    static set Locale(value) { Core.locale = value; }
	
	static set Token(value) { Map.Token = value; }
	
	static get Token() { return Map.Token; }
	
	static get Factory() { return Factory; }
	
	static get Utils() { return Utils; }
	
	static get Dom() { return Dom; }
	
	static get Map() { return Map; }
	
	static get Components() {
		return {
			Popup : Popup,
			Tooltip : Tooltip
		}
	}
}