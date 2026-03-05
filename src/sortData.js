const sortDataColumn = (parseJsonData,columnName, order) => {
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
    return parseJsonData;
};    
export default sortDataColumn;
