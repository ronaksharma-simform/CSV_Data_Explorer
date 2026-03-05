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
let filterButton = document.getElementById("filterSubmit");
let resetFilterButton = document.getElementById("resetFilter");
let columnSelectionButton = document.getElementById("columnSelection");
let columnsSelectionContainer = document.getElementById(
	"columnsSelectionContainer",
);
let mainData = [];
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
	parseJsonData = mainData;
	startRowCount = 0;
	renderData();
	console.log(event);
});
filterButton.addEventListener("click", (event) => {
	console.log(filterInput.value);
	parseJsonData = filterData(filterInput.value);
	startRowCount = 0;
	renderData();
	event.stopImmediatePropagation();
});
columnsSelectionContainer.addEventListener("click", (event) => {
	if (event.target.tagName === "INPUT") {
		let currentColumnName = event.target.id;
		console.log(event.target);
		if (excludeColumns.includes(currentColumnName)) {
			excludeColumns.splice(
				excludeColumns.findIndex((value) => currentColumnName),
				1,
			);
			console.log("dONE");
		} else {
			excludeColumns.push(currentColumnName);
		}
		console.log(excludeColumns);
	}
	renderData();
});
showDataTable.addEventListener("click", (event) => {
	console.log(event.target);
	console.log(event.target.dataset.column);
	sortDataColumn(event.target.dataset.column, event.target.dataset.order);
	// event.stopPropagation();
});
function compareStrings(str1, str2) {
	return str1.toLowerCase().localeCompare(str2.toLowerCase());
}
function sortDataColumn(columnName, order) {
	parseJsonData.sort((a, b) => {
		let valueA = a[columnName];
		let valueB = b[columnName];

		if (typeof valueA === "string" && typeof valueB === "string") {
			return order === "ascending"
				? valueA.localeCompare(valueB)
				: valueB.localeCompare(valueA);
		}

		return order === "ascending" ? valueA - valueB : valueB - valueA;
	});

	startRowCount = 0;
	renderData();
}
rowsCount.addEventListener("change", (event) => {
	renderData();
});
function renderData() {
	showDataTable.innerHTML = "";
	renderingTableHeading();

	let rowsPerPage = parseInt(rowsCount.value);
	let endRowCount = Math.min(
		startRowCount + rowsPerPage,
		parseJsonData.length,
	);

	renderRowsData(startRowCount, endRowCount);
}
previousPageBtn.addEventListener("click", () => {
	let rowsPerPage = parseInt(rowsCount.value);

	if (startRowCount === 0) {
		return; // already at first page
	}

	startRowCount -= rowsPerPage;

	if (startRowCount < 0) {
		startRowCount = 0;
	}

	renderData();
});
nextPageBtn.addEventListener("click", () => {
	let rowsPerPage = parseInt(rowsCount.value);

	if (startRowCount + rowsPerPage >= parseJsonData.length) {
		return; // already at last page
	}

	startRowCount += rowsPerPage;
	renderData();
});
function renderRowsData(startIdx, endIdx) {
	for (let idx = startIdx; idx < endIdx; idx++) {
		let data = parseJsonData[idx];
		let currentRowElement = document.createElement("tr");
		for (let key in data) {
			if (!excludeColumns.includes(key)) {
				let currentColumnElement = document.createElement("td");
				if (data[key] instanceof Date) {
					currentColumnElement.textContent = dateFormatString(
						data[key],
					);
					currentRowElement.appendChild(currentColumnElement);
					continue;
				}
				currentColumnElement.textContent = data[key];
				currentRowElement.appendChild(currentColumnElement);
			}
		}
		showDataTable.appendChild(currentRowElement);
	}
}
function renderingTableHeading() {
	let currentRowElement = document.createElement("tr");
	column_names.forEach((data) => {
		if (!excludeColumns.includes(data)) {
			let currentColumnElement = document.createElement("th");
			let headingContainer = document.createElement("div");
			headingContainer.classList.add("heading-container");
			const columnNameContainer = document.createElement("div");
			columnNameContainer.textContent = data;
			currentColumnElement.dataset.column = data;
			headingContainer.appendChild(columnNameContainer);
			headingContainer.appendChild(sortingButton(data));
			currentColumnElement.appendChild(headingContainer);
			currentRowElement.appendChild(currentColumnElement);
		}
	});
	showDataTable.appendChild(currentRowElement);
}
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
		let rowsOfData = rawCSVData.split("\n"); // splitting content on new line
		column_names = rowsOfData[0].split(","); // splitting the column names from the first row
		console.log(column_names);
		// parsing data into json
		for (let i = 1; i < rowsOfData.length - 1; i++) {
			let curRowData = {};
			let curColumnsData = rowsOfData[i].split(",");
			for (let i = 0; i < column_names.length; i++) {
				let currentColumnEntry = curColumnsData[i];
				// current column data is Date
				if (currentColumnEntry.match(/\d+-\d+-\d+/)) {
					currentColumnEntry = parseDate(currentColumnEntry);
				}
				// current column Data is Number
				else if (currentColumnEntry.match(/^\d+(\.\d+)?$/)) {
					currentColumnEntry = parseFloat(currentColumnEntry);
				}
				curRowData[column_names[i]] = currentColumnEntry;
			}
			parseJsonData.push(curRowData);
		}
		// JSON.stringify(parseJsonData);
		// console.log(parseJsonData);
		mainData = parseJsonData;
		createColumnSelectionCheckbox();
		renderData();
	} catch (error) {
		console.log(error.message);
	}
}
function parseDate(dataString) {
	// finding the character that is splitting year month and day from - , / , .;
	let splitingCharacter = "";
	const formats = ["-", "/", ".", " "];
	for (let sep of formats) {
		if (dataString.includes(sep)) {
			let parts = dataString.split(sep);
			if (parts.length == 3) {
				// try to detect whether date follow YYYY-MM-DD or DD-MM-YYYY
				if (parts[0].length === 4) {
					return new Date(parts[0], parts[1] - 1, parts[2]);
				} else {
					return new Date(parts[2], parts[1] - 1, parts[0]);
				}
			}
		}
	}

	throw new Error("Invalid Date Format");
}
function dateFormatString(dateObject) {
	let formattedString = `${dateObject.getDate()}-${dateObject.getMonth() + 1}-${dateObject.getFullYear()}`;
	return formattedString;
}
function sortingButton(columnName) {
	const mainContainer = document.createElement("div");
	const sortUpButton = document.createElement("i");
	const sortDownButton = document.createElement("i");
	sortDownButton.classList.add("fa-solid", "fa-sort-down");
	sortUpButton.classList.add("fa-solid", "fa-sort-up");
	sortUpButton.dataset.column = columnName;
	sortDownButton.dataset.column = columnName;
	sortUpButton.dataset.order = "ascending";
	sortDownButton.dataset.order = "descending";
	mainContainer.appendChild(sortUpButton);
	mainContainer.appendChild(sortDownButton);
	return mainContainer;
}
function filterData(query) {
	if (!query || !query.trim()) {
		return mainData;
	}

	let filteredData = [];

	const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	let Regex = new RegExp(escapedQuery, "i");

	mainData.forEach((curRowData) => {
		for (let key in curRowData) {
			if (!excludeColumns.includes(key)) {
				let value = curRowData[key];

				if (value !== null && value !== undefined) {
					if (Regex.test(value.toString())) {
						filteredData.push(curRowData);
						break;
					}
				}
			}
		}
	});
	console.log(filteredData);

	return filteredData;
}
function temp(event) {
	console.log(event);
}
function createColumnSelectionCheckbox() {
	for (let names of column_names) {
		let labelForColumn = document.createElement("label");
		let checkboxForColumn = document.createElement("input");
		labelForColumn.setAttribute("for", names);
		checkboxForColumn.setAttribute("name", "columns");
		checkboxForColumn.setAttribute("type", "checkbox");
		checkboxForColumn.setAttribute("id", names);
		checkboxForColumn.setAttribute("checked",true)
		labelForColumn.appendChild(checkboxForColumn);
		labelForColumn.innerHTML += names.toUpperCase();
		columnsSelectionContainer.appendChild(labelForColumn);
		console.log(labelForColumn);
	}
}
