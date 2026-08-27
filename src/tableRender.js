export default function renderTable(
	tableElement,
	column_names,
	data,
	startRowCount,
	rowsCount,
	hiddenColumn,
	isSelectMode,
	selectedRowIndex,
	lastSearchQuery,
) {
	// empty table content
	tableElement.innerHTML = "";

	const thead = document.createElement("thead");
	const tbody = document.createElement("tbody");
	tableElement.appendChild(thead);
	tableElement.appendChild(tbody);

	renderingTableHeading(thead, column_names, hiddenColumn, isSelectMode);

	const rowsPerPage = parseInt(rowsCount.value);
	const endRowCount = Math.min(startRowCount + rowsPerPage, data.length);

	renderRowsData(
		tbody,
		startRowCount,
		endRowCount,
		data,
		hiddenColumn,
		isSelectMode,
		selectedRowIndex,
		lastSearchQuery,
	);

	// Empty state
	if (data.length === 0) {
		const emptyRow = document.createElement("tr");
		const emptyCell = document.createElement("td");
		emptyCell.colSpan = column_names.length + 1;
		emptyCell.className = "empty-state";
		emptyCell.innerHTML = `<i class="fa-solid fa-inbox"></i> No data to display`;
		emptyRow.appendChild(emptyCell);
		tbody.appendChild(emptyRow);
	}
}

export const renderingTableHeading = (
	tableElement,
	column_names,
	hiddenColumn,
	isSelectMode,
) => {
	const currentRowElement = document.createElement("tr");
	const selectionHeading = document.createElement("th");
	selectionHeading.classList.add("selection-cell");
	selectionHeading.style.display = isSelectMode ? "table-cell" : "none";
	currentRowElement.appendChild(selectionHeading);
	column_names.forEach((data) => {
		if (!hiddenColumn.includes(data)) {
			const currentColumnElement = document.createElement("th");
			currentColumnElement.dataset.column = data;
			const headingContainer = document.createElement("div");
			headingContainer.classList.add("heading-container");
			const columnNameContainer = document.createElement("div");
			columnNameContainer.textContent = data;
			headingContainer.appendChild(columnNameContainer);
			headingContainer.appendChild(sortingButton(data));
			currentColumnElement.appendChild(headingContainer);
			currentRowElement.appendChild(currentColumnElement);
		}
	});
	tableElement.appendChild(currentRowElement);
};

export const sortingButton = (columnName) => {
	const mainContainer = document.createElement("div");
	mainContainer.classList.add("sorting-button-container");
	const sortUpButton = document.createElement("i");
	const sortDownButton = document.createElement("i");
	sortDownButton.classList.add("fa-solid", "fa-sort-down");
	sortUpButton.classList.add("fa-solid", "fa-sort-up");
	sortUpButton.dataset.column = columnName;
	sortDownButton.dataset.column = columnName;
	sortUpButton.dataset.order = "ascending";
	sortDownButton.dataset.order = "descending";
	sortUpButton.title = "Sort ascending";
	sortDownButton.title = "Sort descending";
	mainContainer.appendChild(sortUpButton);
	mainContainer.appendChild(sortDownButton);
	return mainContainer;
};

export const renderRowsData = (
	tableElement,
	startRowCount,
	endRowCount,
	parseJsonData,
	hiddenColumn,
	isSelectMode,
	selectedRowIndex,
	lastSearchQuery,
) => {
	for (let idx = startRowCount; idx < endRowCount; idx++) {
		const data = parseJsonData[idx];
		const currentRowElement = document.createElement("tr");
		currentRowElement.classList.add("row-data");

		const selectionCell = document.createElement("td");
		selectionCell.classList.add("selection-cell");
		selectionCell.style.display = isSelectMode ? "table-cell" : "none";
		const selectionCheckbox = document.createElement("input");
		selectionCheckbox.type = "checkbox";
		selectionCheckbox.classList.add("selection-row");
		selectionCell.appendChild(selectionCheckbox);
		currentRowElement.appendChild(selectionCell);

		for (let key in data) {
			if (key === "id") {
				selectionCheckbox.id = data[key];
				currentRowElement.dataset.id = data[key];
				if (selectedRowIndex.includes(String(data[key])))
					selectionCheckbox.setAttribute("checked", "true");
			}
			if (!hiddenColumn.includes(key)) {
				const currentColumnElement = document.createElement("td");
				if (data[key] instanceof Date) {
					currentColumnElement.innerHTML = highlightText(
						dateFormatString(data[key]),
						lastSearchQuery,
					);
					currentRowElement.appendChild(currentColumnElement);
					continue;
				}
				currentColumnElement.innerHTML = highlightText(
					data[key],
					lastSearchQuery,
				);
				currentRowElement.appendChild(currentColumnElement);
			}
		}
		tableElement.appendChild(currentRowElement);
	}
};

export const dateFormatString = (dateObject) => {
	const formattedString = `${dateObject.getDate()}-${dateObject.getMonth() + 1}-${dateObject.getFullYear()}`;
	return formattedString;
};

export const highlightText = (text, query) => {
	if (!query) return text;

	const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const regex = new RegExp(`(${escapedQuery})`, "ig");

	const temp = text
		.toString()
		.replace(regex, (match) => `<mark>${match}</mark>`);
	return temp;
};
