export default function renderTable(
	tableElement,
	column_names,
	data,
	startRowCount,
	rowsCount,
	hiddenColumn,
) {
	// empty table content
	tableElement.innerHTML = "";
	renderingTableHeading(tableElement, column_names,hiddenColumn);
	const rowsPerPage = parseInt(rowsCount.value);
	const endRowCount = Math.min(startRowCount + rowsPerPage, data.length);

	renderRowsData(tableElement, startRowCount, endRowCount, data,hiddenColumn);
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
) => {
	for (let idx = startRowCount; idx < endRowCount; idx++) {
		let data = parseJsonData[idx];
		let currentRowElement = document.createElement("tr");
		currentRowElement.classList.add("row-data");
		for (let key in data) {
			if (key === "id") {
				currentRowElement.dataset.id = data[key];
			}
			if (!hiddenColumn.includes(key)) {
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
		tableElement.appendChild(currentRowElement);
	}
};
export const dateFormatString = (dateObject) => {
	let formattedString = `${dateObject.getDate()}-${dateObject.getMonth() + 1}-${dateObject.getFullYear()}`;
	return formattedString;
};
