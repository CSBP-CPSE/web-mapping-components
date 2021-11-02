/**
 * Util class, containing various utility methods for processing
 * data in different formats.
 * @class
 */
export default class Util {
	
	/**
	* Merges an object into another object. 
	*
	* @param {object} a - the object that will receive the properties 
	* @param {object} b - the object to merge into object A
	* @returns the modified Object
	*/
	static Mixin(a, b) {				
		for (var key in b) {
			if (b.hasOwnProperty(key)) a[key] = b[key];
		}

		// TODO : Why did I use arguments[0] instead of a?
		return arguments[0];
	}
	
	/**
	* Debounces a function. The function will be executed after a timeout 
	* unless the function is called again in which case, the timeout will
	* reset
	*
	* @param {function} delegate - the Function to debounce
	* @param {integer} threshold - the timeout length, in milliseconds
	* @returns {function} the debounced function
	*/
	static Debounce(delegate, threshold) {
		var timeout;
	
		return function debounced () {
			
			function delayed () {
				delegate.apply(this, arguments);
				
				timeout = null; 
			}
	 
			if (timeout) clearTimeout(timeout);
	 
			timeout = setTimeout(delayed.bind(this), threshold || 100); 
		};
	}
	
	/**
	* Formats a String using substitute strings
	*
	* Example: 
	* Input: Format("Hello world! My name is {0} {1}", ["Foo", "Bar"])
	* Output: "Hello world! My name is Foo Bar"
	*
	* @param {string} str - String, the String to format
	* @param {array} subs - Array(String), An array of Strings to substitute into the String
	* @returns {string} the formatted String
	*/
	static Format(str, subs) {
		if (!subs || subs.length == 0) return str;
		
		var s = str;

		for (var i = 0; i < subs.length; i++) {
			var reg = new RegExp("\\{" + i + "\\}", "gm");
			s = s.replace(reg, subs[i]);
		}

		return s;
	}
	
	/**
	 * Gets the value of the first property of a provided object
	 * 
	 * @param {object} obj - object to get first property from
	 * @returns the value of the first object
	 */
	static FirstProperty(obj) {
		var firstPropVal;
		var props = Object.getOwnPropertyNames(obj);
		
		if (props.length) {
			firstPropVal = obj[props[0]];
		}

		return firstPropVal;
	}

	/**
	 * ParseCsv takes a string containing csv data, and parses it to generate an array
	 * containing each row of the csv.
	 * 
	 * Example:
	 * 
	 * Util.ParseCsv("name,age\nfoo,22\nbar,24") -> [["name","age"],["foo","22"],["bar","24"]]
	 * 
	 * @param {string} csv - string containing csv data
	 * @returns {array} a list containing each row of csv data
	 */
	static ParseCsv(csv) {		
		var s = 0;
		var i = 0;
		
		var lines = [[]];

		// Replace CRLF line breaks with LF if they exist
		// This ensures that CR are not included in the array output
		let CRLFRegex = new RegExp("\r\n", "g");
		csv = csv.replace(CRLFRegex, "\n");

		while (s < csv.length) {
			if (csv[s] == '"') {
				s++;
				
				var e = csv.indexOf('"', s);
				
				lines[i].push(csv.substr(s, e - s));
				
				e++;
			}
			else {
				var e1 = csv.indexOf(',', s);
				var e2 = csv.indexOf('\n', s);
								
				var e = (e1 > -1 && e1 < e2) ? e1 : e2;							
								
				lines[i].push(csv.substr(s, e - s));
					
				if (e == e2) {					
					lines.push([]);
					
					i++;
				}
			}
				
			s = e + 1;
		}
		
		return lines;
	}
	
	/**
	 * Sets the disabled property to true or false for a provided selection
	 * of nodes if they are of a focusable type.
	 * 
	 * @param {array} nodes - A list of DOM selections.
	 * @param {boolean} disabled - true or false.
	 */
	static DisableFocusable(nodes, disabled) {
		var focusable = ["button", "fieldset", "input", "optgroup", "option", "select", "textarea"];
		
		nodes.forEach(n => {
			var selection = n.querySelectorAll(focusable);
			
			if (selection.length == 0) return;
			
			for (var i = 0; i < selection.length; i++) selection[i].disabled = disabled;
		});
	}
}