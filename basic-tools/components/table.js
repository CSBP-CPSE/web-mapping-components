import Templated from './templated.js';
import Core from '../tools/core.js';
import Dom from '../tools/dom.js';

export default Core.Templatable("Basic.Components.Table", class Table extends Templated {
	
    set caption(value) { this.Node('caption').innerHMTL = value; }

	constructor(container, options) {	
		super(container, options);
	}
	
	Template() {

		let a = [1, 2, 3, 4, 5];

		//return "<table id= 'myTable'> <tr> <th>Name</th> <th>Favorite Color</th> </tr> <tr> <td>Bob</td> <td>Yellow</td> </tr> <tr> <td>Michelle</td> <td>Purple</td> </tr> </table>"

		//return "<div> <table id ='myTable'> <thead> <tr> <th>Id</th><th>Name</th><th>Mark</th> </tr> </thead> </table> </div>"
    return "<div> <table id ='myTable'>   </table> </div>"
	}


  addOneRow(table){

  	 	const FIELDS = ["id", "name", "mark"];
  	 	const values  = ["aaa","aaa","aaa"];


       let tableRef = document.getElementById('myTable');
       let row = tableRef.insertRow();
       for (const value of values) {
       	row.insertCell().textContent = value;
              
      }
  }


    addOneRow2(table){
    	let tableRef = document.getElementById('myTable');
      // Insert a row at the end of the table
      let newRow = tableRef.insertRow(-1);
      // Insert a cell in the row at index 0
      let newCell = newRow.insertCell(0);
      // Append a text node to the cell
      let newText = document.createTextNode('New bottom row');
      newCell.appendChild(newText);
    }


})