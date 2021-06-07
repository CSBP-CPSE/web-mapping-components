import Popup from './popup.js';
import Core from '../tools/core.js';

/**
 * Splash class - Creates a splash window component
 * @class
 */
export default class Splash extends Popup { 
	
	constructor() {
		super();
		
		this.Node("continue").addEventListener("click", function(ev) {
			this.onBtnClose_Click(ev);			
		}.bind(this));
	}
		
	Show() {		
		super.Show();
		
		this.d = Core.Defer();
		
		return this.d.promise;
	}
	
	Hide() {
		super.Hide();
		
		this.d.Resolve();
	}
	
	Template() {
		return "<div handle='root' class='popup modal fixed'>" +
				  "<div class='popup-container'>" +
					  "<button class='close' handle='close' title='nls(Splash_CloseContinue)'>×</button>" +
					  "<div class='popup-body' handle='body'>" + 
						  "<h1>nls(Splash_LODE_Title)</h1>" + 
						  "<hr>" + 
						  "<p class='warning'>nls(Splash_Warning)</p>" + 
						  "<hr>" + 
						  "<p>nls(Splash_LODE_1)</p>" + 
						  "<div class='logo-container'>" + 
						    `<img class='logo' src='${Core.root}assets/lode-logo.png' />` +
						  "</div>" +
						  "<p>nls(Splash_LODE_2)</p>" + 
						  "<p>nls(Splash_LODE_3)</p>" + 
						"<hr>" + 
						"<div class='wip-container'>" +
							`<div><img src='${Core.root}assets/warning.png' /></div>` +
							"<div>nls(Splash_WIP)</div>" + 
						"</div>" +
						"<div class='continue-container'>" + 
					      "<button class='continue' handle='continue' title='nls(Splash_CloseContinue)'>nls(Splash_Continue)</button>" +
					    "</div>" +
					  "</div>" +
				  "</div>" +
			  "</div>";
	}
}