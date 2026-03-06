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
	constructor(tableElement, rowsPerPage) {
		this.tableElement = tableElement;
		this.filteredData = [];
		this.parseJsonData = [];
		this.columns = [];
		this.page = 0;
		this.rowsPerPage = rowsPerPage;
		this.hiddenColumn = [];
		this.lastSortColumnData = {};
		this.selectedRowIndex = [];
		this.isSelectMode = false;
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
			this.selectedRowIndex
		);
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
		this.renderData();
	}
	removeMultipleRows() {

		this.parseJsonData = this.parseJsonData.filter(
			(data) => !this.selectedRowIndex.includes(String(data.id)),
		);
		this.selectedRowIndex=[]
		this.filteredData = this.parseJsonData;
		this.page = 0;
		this.renderData();
	}
}

export default DataTable;
