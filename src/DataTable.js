import parseCSVData, { parseDate } from "./csvParser.js";
import filterData from "./filterData.js";
import sortDataColumn from "./sortData.js";
import renderTable, {
	dateFormatString,
	renderingTableHeading,
	renderRowsData,
	sortingButton,
} from "./tableRender.js";

class DataTable {
	constructor(tableElement, rowsPerPage, previousState) {
		this.tableElement = tableElement;
		this.filteredData = previousState.filteredData || [];
		this.parseJsonData = previousState.parseJsonData || [];
		this.columns = previousState.columns || [];
		this.page = previousState.page || 0;
		this.rowsPerPage = rowsPerPage;
		this.hiddenColumn = [];
		this.lastSortColumnData = {};
		this.selectedRowIndex = [];
		this.isSelectMode = false;
		this.curPage = 1;
		this.totalPage = 0;
		this.lastSearchQuery = previousState.lastSearchQuery || "";
	}
	parseData(rawCSVData) {
		const result = parseCSVData(rawCSVData);
		this.columns = result.column_names;
		this.parseJsonData = result.parseJsonData;
		this.filteredData = this.parseJsonData;
	}
	renderData() {
		renderTable(
			this.tableElement,
			this.columns,
			this.filteredData,
			this.page,
			this.rowsPerPage,
			this.hiddenColumn,
			this.isSelectMode,
			this.selectedRowIndex,
		);
		this.storeDataLocally();
	}
	sortColumnData(columnName, order) {
		this.parseJsonData = sortDataColumn(
			this.filteredData,
			columnName,
			order,
		);
		this.lastSortColumnData.columnName = columnName;
		this.lastSortColumnData.order = order;
		console.log(this.parseJsonData);
	}
	filterColumnData(query) {
		this.lastSearchQuery = query;
		this.filteredData = filterData(
			query,
			this.parseJsonData,
			this.hiddenColumn,
		);
		if (this.lastSortColumnData.columnName) {
			this.sortColumnData(
				this.lastSortColumnData.columnName,
				this.lastSortColumnData.order,
			);
		}
		this.page = 0;
	}
	removeMultipleRows() {
		this.parseJsonData = this.parseJsonData.filter(
			(data) => !this.selectedRowIndex.includes(String(data.id)),
		);
		this.selectedRowIndex = [];
		this.filteredData = this.parseJsonData;
		this.page = 0;
		this.isSelectMode = false;
		// this.renderData();
	}
	storeDataLocally() {
		// storing data to local storage
		const currentState = {};
		currentState.parseJsonData = this.parseJsonData;
		currentState.page = this.page;
		currentState.filteredData = this.filteredData;
		currentState.columns = this.columns;
		currentState.lastSearchQuery = this.lastSearchQuery;
		localStorage.setItem("state", JSON.stringify(currentState));
	}
}

export default DataTable;
