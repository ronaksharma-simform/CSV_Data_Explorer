import DataTable from "./src/DataTable.js";

let fileInput = document.getElementById("dataset");
let submitBtn = document.getElementById("submitBtn");
let showDataTable = document.getElementById("showData");
let rawCSVData = "";
let parseJsonData = [];
let previousPageBtn = document.getElementById("previous");
let nextPageBtn = document.getElementById("next");
let column_names = [];
let excludeColumns = [];
let startRowCount = 0;
let rowsPerPage = document.getElementById("rowsCount");
let filterInput = document.getElementById("filter");
let deleteRowsButton = document.getElementById("deleteRows");
let filterButton = document.getElementById("filterSubmit");
let resetFilterButton = document.getElementById("resetFilter");
let columnSelectionButton = document.getElementById("columnSelection");

let columnsSelectionContainer = document.getElementById(
	"columnsSelectionContainer",
);
deleteRowsButton.addEventListener("click",(event)=>{
	dataTable.removeMultipleRows()
})
let mainData = [];
const dataTable = new DataTable(showDataTable, rowsPerPage);
showDataTable.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});
columnSelectionButton.addEventListener("click", (event) => {
	let isHidden =
		columnsSelectionContainer.style.display === "none" ||
		columnsSelectionContainer.style.display === "";
	console.log(columnsSelectionContainer.style.display);
	if (isHidden) {
		columnsSelectionContainer.style.display = "block";
	} else {
		columnsSelectionContainer.style.display = "none";
	}
});
resetFilterButton.addEventListener("click", (event) => {
	dataTable.filteredData = dataTable.parseJsonData;
	dataTable.page = 0;
	dataTable.renderData();
});
filterButton.addEventListener("click", (event) => {
	console.log(filterInput.value);
	dataTable.filterColumnData(filterInput.value);
	event.stopImmediatePropagation();
});
columnsSelectionContainer.addEventListener("click", (event) => {
	if (event.target.tagName === "INPUT") {
		let currentColumnName = event.target.id;
		console.log(event.target);
		if (dataTable.hiddenColumn.includes(currentColumnName)) {
			dataTable.hiddenColumn.splice(
				dataTable.hiddenColumn.findIndex((value) => currentColumnName),
				1,
			);
			console.log("dONE");
		} else {
			dataTable.hiddenColumn.push(currentColumnName);
		}
		console.log(dataTable.hiddenColumn);
	}
	dataTable.renderData();
});

showDataTable.addEventListener("click", (event) => {
	console.log(event.target);
	if(event.target.tagName==="INPUT"){
		if(event.target.checked === true){
			dataTable.selectedRowIndex.push(event.target.id)
		}
		else{
			let findIndex=dataTable.selectedRowIndex.findIndex((x)=>event.target.id)
			if(findIndex!==-1){
				dataTable.selectedRowIndex.splice(findIndex,1);
			}
		}
		console.log(dataTable.selectedRowIndex)
	}
	let clickedRow = event.target.closest(".row-data");
	if (event.target.dataset.column) {
		dataTable.sortColumnData(
			event.target.dataset.column,
			event.target.dataset.order,
		);
		dataTable.page = 0;
		dataTable.renderData();
		// sortDataColumn(event.target.dataset.column, event.target.dataset.order);
		return;
	}
	if (clickedRow) {
		console.log(dataTable.parseJsonData[clickedRow.dataset.id]);
		console.log("Yes");
	}
	// event.stopPropagation();
});
showDataTable.addEventListener("mouseup", (event) => {
	switch (event.button) {
		case 0:
			console.log("Left button clicked.");
			break;
		case 1:
			console.log("Middle button clicked.");
			break;
		case 2:
			dataTable.selectedRowIndex=[]
			console.log("Right button clicked.");
			dataTable.isSelectMode= dataTable.isSelectMode===false?true:false
			dataTable.renderData()
			deleteRowsButton.style.display = deleteRowsButton.style.display === "none" ||
						deleteRowsButton.style.display === ""
							? "inline-block"
							: "none";
			
			break;
	}
});
rowsCount.addEventListener("change", (event) => {
	renderData();
	console.log(dataTable.rowsPerPage);
});
function renderData() {
	dataTable.renderData();
}
previousPageBtn.addEventListener("click", () => {
	let rowsPerPage = parseInt(rowsCount.value);

	if (dataTable.page === 0) {
		return; // already at first page
	}

	dataTable.page -= rowsPerPage;

	if (dataTable.page < 0) {
		dataTable.page = 0;
	}

	renderData();
});
nextPageBtn.addEventListener("click", () => {
	let rowsPerPage = parseInt(rowsCount.value);

	if (dataTable.page + rowsPerPage >= dataTable.parseJsonData.length) {
		return; // already at last page
	}

	dataTable.page += rowsPerPage;
	renderData();
});

submitBtn.addEventListener("click", (event) => {
	let curFileInput = fileInput.files[0];
	console.log(curFileInput);
	if (!curFileInput) {
		throw new Error("File doesnt exist");
	}
	const reader = new FileReader();
	reader.onload = () => {
		// showDataDiv.textContent = reader.result;
		rawCSVData = reader.result;
		parseCSVData();
	};
	reader.onerror = () => {
		throw new Error("Error reading file please try again");
	};
	reader.readAsText(curFileInput);
});
function parseCSVData() {
	try {
		dataTable.parseData(rawCSVData);
		createColumnSelectionCheckbox();
		dataTable.renderData();
	} catch (error) {
		console.log(error.message);
	}
}

function createColumnSelectionCheckbox() {
	for (let names of dataTable.columns) {
		let labelForColumn = document.createElement("label");
		let checkboxForColumn = document.createElement("input");
		labelForColumn.setAttribute("for", names);
		checkboxForColumn.setAttribute("name", "columns");
		checkboxForColumn.setAttribute("type", "checkbox");
		checkboxForColumn.setAttribute("id", names);
		checkboxForColumn.setAttribute("checked", true);
		labelForColumn.appendChild(checkboxForColumn);
		labelForColumn.innerHTML += names.toUpperCase();
		columnsSelectionContainer.appendChild(labelForColumn);
		console.log(labelForColumn);
	}
}
