// Importing functions from modules
import DataTable from "./src/DataTable.js";
import debounce from "./src/debounce.js";
import { exportDataAsCSV, exportDataAsJSON } from "./src/exportData.js";
import showDataModal from "./src/modalPanel.js";

// Selecting DOM Elements
let rawCSVData = "";
let fileInput = document.getElementById("dataset");
let submitBtn = document.getElementById("submitBtn");
let showDataTable = document.getElementById("showData");
let pageNumberContainer = document.getElementById("page-number");
let previousPageBtn = document.getElementById("previous");
let nextPageBtn = document.getElementById("next");
let rowsPerPage = document.getElementById("rowsCount");
let filterInput = document.getElementById("filter");
let deleteRowsButton = document.getElementById("deleteRows");
let resetFilterButton = document.getElementById("resetFilter");
let exportJSON = document.getElementById("exportJSON");
let exportCSV = document.getElementById("exportCSV");
let columnsSelectionContainer = document.getElementById(
	"columnsSelectionContainer",
);
let fileNameLabel = document.getElementById("fileName");
let recordCount = document.getElementById("recordCount");
let loadingOverlay = document.getElementById("loadingOverlay");
let uploadZone = document.getElementById("uploadZone");
let themeToggle = document.getElementById("themeToggle");

// ---------- Theme ----------
const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-bs-theme", savedTheme);
themeToggle.innerHTML =
	savedTheme === "dark"
		? '<i class="fa-solid fa-sun"></i>'
		: '<i class="fa-solid fa-moon"></i>';
themeToggle.addEventListener("click", () => {
	const current =
		document.documentElement.getAttribute("data-bs-theme") === "dark"
			? "light"
			: "dark";
	document.documentElement.setAttribute("data-bs-theme", current);
	themeToggle.innerHTML =
		current === "dark"
			? '<i class="fa-solid fa-sun"></i>'
			: '<i class="fa-solid fa-moon"></i>';
	localStorage.setItem("theme", current);
});

// ---------- Loading overlay ----------
const showLoading = (isLoading) => {
	loadingOverlay.classList.toggle("active", isLoading);
};

// ---------- Drag & drop upload ----------
uploadZone.addEventListener("dragover", (event) => {
	event.preventDefault();
	uploadZone.classList.add("dragover");
});
uploadZone.addEventListener("dragleave", () => {
	uploadZone.classList.remove("dragover");
});
uploadZone.addEventListener("drop", (event) => {
	event.preventDefault();
	uploadZone.classList.remove("dragover");
	const files = event.dataTransfer.files;
	if (files && files.length) {
		const dataTransfer = new DataTransfer();
		dataTransfer.items.add(files[0]);
		fileInput.files = dataTransfer.files;
		fileNameLabel.textContent = files[0].name;
	}
});
fileInput.addEventListener("change", () => {
	fileNameLabel.textContent = fileInput.files[0]
		? fileInput.files[0].name
		: "No file selected";
});

// ---------- CSV parse ----------
function parseCSVData() {
	try {
		dataTable.parseData(rawCSVData);
		createColumnSelectionCheckbox();
		renderData();
	} catch (error) {
		console.log(error.message);
	}
}

// ---------- Render data ----------
function renderData() {
	pageNumberContainer.innerHTML = "";

	const rowsPerPageValue = parseInt(rowsPerPage.value);
	const total = dataTable.filteredData.length;
	const totalPage = total === 0 ? 1 : Math.ceil(total / rowsPerPageValue);
	const currentPageNumber = Math.floor(dataTable.page / rowsPerPageValue) + 1;
	const startRow = Math.min(dataTable.page, total);
	const endRow = Math.min(dataTable.page + rowsPerPageValue, total);

	recordCount.textContent =
		total > 0
			? `Showing ${startRow + 1}–${endRow} of ${total}`
			: "0 records";

	let inputPageNumber = document.createElement("input");
	inputPageNumber.type = "number";
	inputPageNumber.value = currentPageNumber;
	inputPageNumber.min = 1;
	inputPageNumber.max = totalPage;
	inputPageNumber.id = "pageNumberInput";
	pageNumberContainer.appendChild(inputPageNumber);
	pageNumberContainer.appendChild(document.createTextNode(` / ${totalPage}`));

	previousPageBtn.disabled = dataTable.page === 0;
	nextPageBtn.disabled = dataTable.page + rowsPerPageValue >= total;

	dataTable.renderData();
}

// ---------- Column selection checkboxes ----------
function createColumnSelectionCheckbox() {
	columnsSelectionContainer.innerHTML = "";
	for (let names of dataTable.columns) {
		let labelForColumn = document.createElement("label");
		let checkboxForColumn = document.createElement("input");
		checkboxForColumn.setAttribute("name", "columns");
		checkboxForColumn.setAttribute("type", "checkbox");
		checkboxForColumn.setAttribute("id", names);
		checkboxForColumn.setAttribute("checked", true);
		const columnName = document.createElement("span");
		columnName.textContent = names.toUpperCase();
		labelForColumn.appendChild(checkboxForColumn);
		labelForColumn.appendChild(columnName);
		columnsSelectionContainer.appendChild(labelForColumn);
	}
}

// Debouncing for filter search query
const filteredDataFunction = (event) => {
	dataTable.filterColumnData(filterInput.value);
	renderData();
	event.stopImmediatePropagation();
};
const debounceFilter = debounce(filteredDataFunction, 300);

// Getting data from local storage if exists
const previousState = localStorage.getItem("state") || "{}";
// Initializing the datatable class
const dataTable = new DataTable(
	showDataTable,
	rowsPerPage,
	JSON.parse(previousState),
);

// Initial rendering for local storage data
filterInput.value = dataTable.lastSearchQuery;
renderData();
createColumnSelectionCheckbox();
deleteRowsButton.style.display = "none";

// Delete row event listener
deleteRowsButton.addEventListener("click", (event) => {
	dataTable.removeMultipleRows();
	deleteRowsButton.style.display = "none";
	renderData();
});

// Export data event listeners
exportCSV.addEventListener("click", (event) => {
	exportDataAsCSV(dataTable.columns, dataTable.filteredData);
});
exportJSON.addEventListener("click", (event) => {
	exportDataAsJSON(dataTable.filteredData);
});

// Prevent opening context menu on right click on whole data table container
showDataTable.addEventListener("contextmenu", function (e) {
	e.preventDefault();
});

// Reset button event listener
resetFilterButton.addEventListener("click", (event) => {
	dataTable.filteredData = dataTable.parseJsonData;
	dataTable.lastSearchQuery = "";
	filterInput.value = "";
	dataTable.page = 0;
	renderData();
});

// Filter input listener
filterInput.addEventListener("input", debounceFilter);

// Column selection container event listener
columnsSelectionContainer.addEventListener("click", (event) => {
	if (event.target.tagName === "INPUT") {
		let currentColumnName = event.target.id;
		if (dataTable.hiddenColumn.includes(currentColumnName)) {
			dataTable.hiddenColumn.splice(
				dataTable.hiddenColumn.findIndex(
					(value) => value === currentColumnName,
				),
				1,
			);
		} else {
			dataTable.hiddenColumn.push(currentColumnName);
		}
	}
	renderData();
});

showDataTable.addEventListener("mouseup", (event) => {
	event.stopPropagation();
	let clickedRow = event.target.closest(".row-data");
	switch (event.button) {
		// LEFT CLICK
		case 0:
			if (event.target.tagName === "INPUT") {
				if (!event.target.checked) {
					dataTable.selectedRowIndex.push(event.target.id);
				} else {
					let findIndex = dataTable.selectedRowIndex.findIndex(
						(x) => x === event.target.id,
					);
					if (findIndex !== -1) {
						dataTable.selectedRowIndex.splice(findIndex, 1);
					}
				}
				return;
			}

			// Sorting
			if (event.target.dataset.column) {
				dataTable.sortColumnData(
					event.target.dataset.column,
					event.target.dataset.order,
				);
				dataTable.page = 0;
				renderData();
				return;
			}

			// Row click -> open modal popup
			if (clickedRow) {
				showDataModal(
					dataTable.parseJsonData[clickedRow.dataset.id - 1],
				);
			}
			break;

		// MIDDLE CLICK
		case 1:
			break;

		// RIGHT CLICK
		case 2:
			dataTable.selectedRowIndex = [];
			dataTable.isSelectMode = !dataTable.isSelectMode;

			deleteRowsButton.style.display =
				deleteRowsButton.style.display === "none" ||
				deleteRowsButton.style.display === ""
					? "inline-block"
					: "none";

			renderData();
			break;
	}
});

// Render data on rows per page change
rowsCount.addEventListener("change", (event) => {
	renderData();
});

// Previous page and next button event listeners
previousPageBtn.addEventListener("click", () => {
	let rowsPerPageValue = parseInt(rowsCount.value);

	if (dataTable.page === 0) {
		return; // already at first page
	}
	dataTable.page -= rowsPerPageValue;
	if (dataTable.page < 0) {
		dataTable.page = 0;
	}

	renderData();
});
nextPageBtn.addEventListener("click", () => {
	let rowsPerPageValue = parseInt(rowsCount.value);

	if (dataTable.page + rowsPerPageValue >= dataTable.filteredData.length) {
		return; // already at last page
	}

	dataTable.page += rowsPerPageValue;

	renderData();
});

// File submit event listener
submitBtn.addEventListener("click", (event) => {
	let curFileInput = fileInput.files[0];
	if (!curFileInput) {
		alert("Please choose a CSV file first.");
		return;
	}
	const reader = new FileReader();
	reader.onload = () => {
		rawCSVData = reader.result;
		showLoading(true);
		setTimeout(() => {
			try {
				parseCSVData();
			} finally {
				showLoading(false);
			}
		}, 50);
	};
	reader.onerror = () => {
		alert("Error reading file, please try again.");
	};
	reader.readAsText(curFileInput);
});

// Page number input event listener
document.getElementById("page-number").addEventListener("change", (e) => {
	if (e.target.id === "pageNumberInput") {
		let page = Number(e.target.value);
		const totalPage = Math.ceil(
			dataTable.filteredData.length / dataTable.rowsPerPage.value,
		);
		if (page < 1) page = 1;
		if (page > totalPage) page = totalPage;
		e.target.value = page;
		dataTable.page = (page - 1) * parseInt(rowsPerPage.value);
		renderData();
	}
	e.preventDefault();
});
