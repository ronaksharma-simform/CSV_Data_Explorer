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
	renderingTableHeading(tableElement, column_names, hiddenColumn);
	const rowsPerPage = parseInt(rowsCount.value);
	const endRowCount = Math.min(startRowCount + rowsPerPage, data.length);

	renderRowsData(
		tableElement,
		startRowCount,
		endRowCount,
		data,
		hiddenColumn,
		isSelectMode,
		selectedRowIndex,
		lastSearchQuery,
	);
}

export const renderingTableHeading = (
	tableElement,
	column_names,
	hiddenColumn,
) => {
	const currentRowElement = document.createElement("tr");
	column_names.forEach((data) => {
		if (!hiddenColumn.includes(data)) {
			const currentColumnElement = document.createElement("th");
			const headingContainer = document.createElement("div");
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
	tableElement.appendChild(currentRowElement);
};
export const sortingButton = (columnName) => {
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
		let data = parseJsonData[idx];
		let currentRowElement = document.createElement("tr");
		currentRowElement.classList.add("row-data");
		let selectionCheckbox = document.createElement("input");
		selectionCheckbox.type = "checkbox";

		selectionCheckbox.style.display =
			isSelectMode === true ? "block" : "none";
		selectionCheckbox.classList.add("selection-row");
		currentRowElement.appendChild(selectionCheckbox);
		for (let key in data) {
			if (key === "id") {
				selectionCheckbox.id = data[key];
				currentRowElement.dataset.id = data[key];
				if (selectedRowIndex.includes(String(data[key])))
					selectionCheckbox.setAttribute("checked", "true");
			}
			if (!hiddenColumn.includes(key)) {
				let currentColumnElement = document.createElement("td");
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
	let formattedString = `${dateObject.getDate()}-${dateObject.getMonth() + 1}-${dateObject.getFullYear()}`;
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
