import Core from '../../basic-tools/tools/core.js';

export default class Other {
	
	static Polish(json, exp, d) {
		// exp is formatted as follows [symbol, property 1, property 2]
		var v1 = json[exp[1]];
		var v2 = json[exp[2]];
		
		var v = null;
		
		if (exp[0] == "+") v = v1 + v2;
		if (exp[0] == "-") v = v1 - v2;
		if (exp[0] == "*") v = v1 * v2;
		if (exp[0] == "/") v = v1 / v2;
		
		return v.toFixed(d);
	}
	
	static HTMLize(json, fields, na) {
        var html = "";
		
		fields.forEach(function(f) {
			var label = f.label;
			var value = na;
			
			if (json.hasOwnProperty(f.id) || f.polish) {
				value = f.polish ? Other.Polish(json, f.polish, 2) : json[f.id];
				
				if (f.fixed) value = value.toFixed(f.fixed);
			}
			
            html += `<div><span>${label} : </span><span>${value}</span></div>`;
		}) 
        
		return `<div class='popup-inner'>${html}</div>`;
    }
}