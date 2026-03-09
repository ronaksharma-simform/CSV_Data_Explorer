const sortDataColumn = (parseJsonData,columnName, order) => {
	const newSortedData=parseJsonData.toSorted((a, b) => {
		const valueA = a[columnName];
		const valueB = b[columnName];

		if (typeof valueA === "string" && typeof valueB === "string") {
			return order === "ascending"
				? valueA.localeCompare(valueB)
				: valueB.localeCompare(valueA);
		}

		return order === "ascending" ? valueA - valueB : valueB - valueA;
	});
    return newSortedData;
};    
export default sortDataColumn;
