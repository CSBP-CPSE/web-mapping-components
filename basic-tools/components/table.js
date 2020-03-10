import Templated from './templated.js';
import Core from '../tools/core.js';
import Dom from '../tools/dom.js';
import Net from "../tools/net.js";

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






  UpdateTable(id){

    var csvData
    var currId = id
    var currFileName


    var genFileName = function(ev){
      var summery = ev.result
      console.log(summery)
      var id_str = currId.toString()
      console.log("id_str: " + id_str)
      var num = summery[id_str]
      console.log("number is " + num)
      var name =  id_str + "_" + num
      //console.log("file name is " + name)
      return name
    }


    var p1 = Net.JSON(`http://localhost:82/lode-viewer/data/summary.json`);
    //var p = Net.Request(`http://localhost:82/lode-viewer/data/6205033_1.csv`)


    var success = function(ev) {
      console.log(csvData)
      return ev.result
    }  


    var populateTable = function(csvArray){
      let tableRef = document.getElementById('myTable');
      //console.log("num of col " + csvArray.length)
      var columnCount = csvArray[0].length;
      //Add the header row.
          var row = tableRef.insertRow(-1);
          for (var i = 0; i < columnCount; i++) {
              var headerCell = document.createElement("TH");
              headerCell.innerHTML = csvArray[0][i];
              row.appendChild(headerCell);
          }
        //Add the data rows.
        for (var i = 1; i < csvArray.length; i++) {
          row = tableRef.insertRow(-1);
          for (var j = 0; j < columnCount; j++) {
            var cell = row.insertCell(-1);
            cell.innerHTML = csvArray[i][j];
          }
        }
      }


      var processData = function(csv) {
        var allTextLines = csv.split(/\r\n|\n/);
        var lines = [];
        for (var i=0; i<allTextLines.length; i++) {
          var data = allTextLines[i].split(',');
          var tarr = [];
          for (var j=0; j<data.length; j++) {
            tarr.push(data[j]);
          }
          lines.push(tarr);
        }
        //console.log(lines);
        return lines
      }


      var failure = function(ev) {
        console.log("error!");
      }


      var p2 = function(fileName) {
        console.log("fileName is" + fileName)
        debugger  
        var url = `http://localhost:82/lode-viewer/data/`
        url = url + fileName + `.csv`
        var p3 =  Net.Request(url)

        p3.then(success, failure).then(processData).then(populateTable); 
      } 


      p1.then(genFileName, failure).then(p2)
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