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
			var inner = Core.Nls("Gen_Label_Field", [label, json[f.id]]);
			
            html += `<li tabIndex=0><label>${inner}</label></li>`;
		}) 
        
		return `<ul class='popup-inner'>${html}</ul>`;
    }
	
	static LookupProvince(abbr, locale) {
		abbr = abbr.trim();	// Hidden whitespace character at the end, weird.
		
		if (abbr == 'nl') return locale == "en" ? "Newfoundland and Labrador" : "Terre-Neuve-et-Labrador";
		if (abbr == 'pe') return locale == "en" ? "Prince Edward Island" : "Île-du-Prince-Édouard";
		if (abbr == 'ns') return locale == "en" ? "Nova Scotia" : "Nouvelle-Écosse";
		if (abbr == 'nb') return locale == "en" ? "New Brunswick" : "Nouveau-Brunswick";
		if (abbr == 'qc') return locale == "en" ? "Quebec" : "Québec";
		if (abbr == 'on') return locale == "en" ? "Ontario" : "Ontario";
		if (abbr == 'mb') return locale == "en" ? "Manitoba" : "Manitoba";
		if (abbr == 'sk') return locale == "en" ? "Saskatchewan" : "Saskatchewan";
		if (abbr == 'ab') return locale == "en" ? "Alberta" : "Alberta";
		if (abbr == 'bc') return locale == "en" ? "British Columbia" : "Colombie-Britannique";
		if (abbr == 'yt') return locale == "en" ? "Yukon" : "Yukon";
		if (abbr == 'nt') return locale == "en" ? "Northwest Territories" : "Territoires du Nord-Ouest";
		if (abbr == 'nu') return locale == "en" ? "Nunavut" : "Nunavut";
	}
}