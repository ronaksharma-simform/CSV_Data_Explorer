import DataTable from "./src/DataTable.js";
import {exportDataAsCSV,exportDataAsJSON} from "./src/exportData.js";
import showDataModal from "./src/modalPanel.js";

let fileInput = document.getElementById("dataset");
let submitBtn = document.getElementById("submitBtn");
let showDataTable = document.getElementById("showData");
let pageNumberContainer = document.getElementById("page-number");
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
let exportJSON=document.getElementById("exportJSON")
let exportCSV=document.getElementById("exportCSV")

let columnsSelectionContainer = document.getElementById(
	"columnsSelectionContainer",
);
deleteRowsButton.addEventListener("click", (event) => {
	dataTable.removeMultipleRows();
});
exportCSV.addEventListener("click",(event)=>{
	exportDataAsCSV(dataTable.columns,dataTable.filteredData)
})
exportJSON.addEventListener("click",(event)=>{
	exportDataAsJSON(dataTable.filteredData)
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
	renderData();
});
filterButton.addEventListener("click", (event) => {
	console.log(filterInput.value);
	dataTable.filterColumnData(filterInput.value);
	renderData();
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
	renderData();
});

showDataTable.addEventListener("click", (event) => {
	console.log(event.target);
	if (event.target.tagName === "INPUT") {
		if (event.target.checked === true) {
			dataTable.selectedRowIndex.push(event.target.id);
		} else {
			let findIndex = dataTable.selectedRowIndex.findIndex(
				(x) => event.target.id,
			);
			if (findIndex !== -1) {
				dataTable.selectedRowIndex.splice(findIndex, 1);
			}
		}
		console.log(dataTable.selectedRowIndex);
	}
	let clickedRow = event.target.closest(".row-data");
	if (event.target.dataset.column) {
		dataTable.sortColumnData(
			event.target.dataset.column,
			event.target.dataset.order,
		);
		dataTable.page = 0;
		renderData();
		// sortDataColumn(event.target.dataset.column, event.target.dataset.order);
		return;
	}
	if (clickedRow) {
		console.log(dataTable.parseJsonData[clickedRow.dataset.id]);
		showDataModal(dataTable.parseJsonData[clickedRow.dataset.id-1])
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
			dataTable.selectedRowIndex = [];
			console.log("Right button clicked.");
			dataTable.isSelectMode =
				dataTable.isSelectMode === false ? true : false;
			renderData();
			deleteRowsButton.style.display =
				deleteRowsButton.style.display === "none" ||
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
	pageNumberContainer.innerHTML = "";
	let inputPageNumber = document.createElement("input");
	let currentPageNumber =
			Math.floor(dataTable.page / dataTable.rowsPerPage.value) + 1,
		totalPage = Math.ceil(
			dataTable.filteredData.length / dataTable.rowsPerPage.value,
		);
	inputPageNumber.type = "number";
	inputPageNumber.value = currentPageNumber;
		inputPageNumber.min=1;
		inputPageNumber.max=totalPage
	inputPageNumber.id = "pageNumberInput";
	const text1 = document.createTextNode(` / ${totalPage}`);
	pageNumberContainer.appendChild(inputPageNumber);
	pageNumberContainer.appendChild(text1);
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

	if (dataTable.page + rowsPerPage >= dataTable.filteredData.length) {
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
		renderData();
	} catch (error) {
		console.log(error.message);
	}
}
document.getElementById("closeModal").addEventListener("click",()=>{
  document.getElementById("dataModal").style.display="none";
});

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
document.getElementById("page-number").addEventListener("change", (e) => {
	if (e.target.id === "pageNumberInput") {
		let page = Number(e.target.value);
		const totalPage = Math.ceil(
			dataTable.filteredData.length / dataTable.rowsPerPage.value,
		);
		if(page<1)page=1
		if(page>totalPage)page=totalPage
		e.target.value=page
		dataTable.page = (page - 1) * rowsPerPage.value;
		renderData();
	}
	e.preventDefault();
});
